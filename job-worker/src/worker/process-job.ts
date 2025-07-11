import { Prisma } from "@prisma/client";
import prisma from "@src/config/db";
import { enqueueJob } from "@src/libs/priority-queue";
import { webSocket as workerSocket } from "@src/socket/job-worker.socket";
import { constants as C } from "@src/utils/constants";
import { getBackoffDelay, killTimeout, terminateOnRaceCondition } from "@src/utils/helper";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import pidusage from "pidusage";

let usageInterval: NodeJS.Timeout;
let usageStats = {
  cpu: 0,
  memory: 0,
};

const processJob = async (jobId: string) => {
  const job = await prisma.job.findFirst({ where: { id: jobId } });

  if (!job || job.status !== "PENDING") {
    console.log("❌ Skipping job, already executed or not found");
    workerSocket.emit("job:done", {
      jobId,
      exitCode: 0,
    });
    return;
  }

  const output = job.output as Prisma.JsonArray;
  const { command } = job;
  const filePath = path.join(`/tmp`, `job-${jobId}.sh`);

  fs.writeFileSync(filePath, command, { mode: 0o755 });
  console.log(`🚀 Starting job ${jobId}: ${command}`);

  const proc = spawn("bash", [filePath]);

  // Kill timeout and race condition on job timeout
  killTimeout(proc, jobId, job, workerSocket);
  terminateOnRaceCondition(proc, jobId, workerSocket);

  //collect usage stats
  // usageInterval = setInterval(async () => {
  //   if (!proc.pid) return;
  //   pidusage(Number(proc.pid), (err, stats) => {
  //     if (err) {
  //       console.error("Error getting usage stats:", err);
  //       return;
  //     }
  //     usageStats.cpu = stats.cpu;
  //     usageStats.memory = stats.memory;
  //   });
  // }, 1000);

  const startedAt = new Date();
  await prisma.job.update({
    where: { id: jobId },
    data: {
      status: "RUNNING",
      startedAt,
    },
  });

  // Stream stdout
  proc.stdout.on("data", async (data) => {
    const timestamp = new Date().toISOString();

    console.log(`${timestamp} ==> [stdout][${jobId}]: ${data.toString()}`);
    const log = { response: data.toString(), timestamp: timestamp, success: true };
    output.push(log);
    await prisma.job.update({
      where: { id: jobId },
      data: {
        output: output,
      },
    });
    workerSocket.emit("job:stream", {
      jobId,
      output: log,
      type: "stdout",
      timestamp,
    });
  });

  // Stream stderr
  proc.stderr.on("data", async (data) => {
    const timestamp = new Date().toISOString();
    const log = { response: data.toString(), timestamp: timestamp, success: false };
    console.log(`${timestamp} ==> [stderr][${jobId}]: ${data.toString()}`);
    output.push(log);
    await prisma.job.update({
      where: { id: jobId },
      data: {
        output: output,
      },
    });
    workerSocket.emit("job:stream", {
      jobId,
      output: log,
      type: "stderr",
      timestamp,
    });
  });

  // Job done
  proc.on("close", async (exitCode) => {
    fs.unlink(filePath, () => {});
    // clearInterval(usageInterval);log

    console.log("exitCode", exitCode);

    if (exitCode !== 0) {
      const job = await prisma.job.findUnique({ where: { id: jobId } });

      if (job && job.retries < C.MAX_RETRIES) {
        // Increment retries in DB
        await prisma.job.update({
          where: { id: jobId },
          data: {
            retries: { increment: 1 },
            status: "PENDING",
            cpuUsage: usageStats.cpu,
            memoryUsage: usageStats.memory / 1024 / 1024, // converting memory Bytes to MB
          },
        });

        console.log(`[Worker] Retrying job ${jobId} (attempt ${job.retries + 1})`);

        // Delay and push to retry queue
        setTimeout(() => {
          enqueueJob(job, C.JOB_QUEUE_KEY_RETRY);
        }, getBackoffDelay(job.retries)); // exponential
      } else {
        await prisma.job.update({
          where: { id: jobId },
          data: {
            status: "FAILED",
            cpuUsage: usageStats.cpu,
            memoryUsage: usageStats.memory / 1024 / 1024,
          }, // converting memory Bytes to MB
        });
      }
    }

    const endedAt = new Date();
    const log = {
      response: exitCode?.toString() || "Unknown",
      timestamp: endedAt.toISOString(),
      success: exitCode === 0,
    };
    console.log(`✅ Job ${jobId} finished with code ${exitCode}`);
    output.push(log);
    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: exitCode === 0 ? "SUCCESS" : "FAILED",
        exitCode,
        endedAt,
        output: output,
        cpuUsage: usageStats.cpu,
        memoryUsage: usageStats.memory / 1024 / 1024, // converting memory Bytes to MB
      },
    });

    workerSocket.emit("job:done", {
      jobId,
      exitCode,
    });
  });

  proc.on("error", (err) => {
    console.error(`❌ Job ${jobId} process failed:`, err);
    fs.unlink(filePath, () => {});
  });
};

export default processJob;
