import { spawn } from "child_process";
import prisma from "@src/config/db";
import { webSocket as workerSocket } from "@src/socket/job-worker.socket";
import { Prisma } from "@prisma/client";
import redisClient from "@src/libs/redis";
import { constants as C } from "@src/utils/constants";
import { getBackoffDelay } from "@src/utils/helper";
import path from "path";
import fs from "fs";

const processJob = async (jobId: string) => {
  const job = await prisma.jobs.findFirst({ where: { id: jobId } });

  if (!job) {
    console.error(`❌ Job ${jobId} not found`);
    return;
  }

  const output = job.output as Prisma.JsonArray;
  const { command } = job;
  const filePath = path.join(`/tmp`, `job-${jobId}.sh`);

  fs.writeFileSync(filePath, command, { mode: 0o755 });
  console.log(`🚀 Starting job ${jobId}: ${command}`);

  const proc = spawn("bash", [filePath]);
  const startedAt = new Date();
  await prisma.jobs.update({
    where: { id: jobId },
    data: {
      status: "RUNNING",
      startedAt,
    },
  });

  const killTimeout = setTimeout(async () => {
    if (proc.killed) return;
    proc.kill("SIGTERM");
    console.log("❌ Timed out. Killing process.");
    await prisma.jobs.update({
      where: { id: jobId },
      data: {
        status: "FAILED",
      },
    });
    workerSocket.emit("job:done", {
      jobId,
      exitCode: 1,
    });
  }, job.timeout);

  proc.stdout.on("data", async (data) => {
    const timestamp = new Date().toISOString();

    console.log(`${timestamp} ==> [stdout][${jobId}]: ${data.toString()}`);
    const log = { response: data.toString(), timestamp: timestamp, success: true };
    output.push(log);
    await prisma.jobs.update({
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

  proc.stderr.on("data", async (data) => {
    const timestamp = new Date().toISOString();
    const log = { response: data.toString(), timestamp: timestamp, success: false };
    console.log(`${timestamp} ==> [stderr][${jobId}]: ${data.toString()}`);
    output.push(log);
    await prisma.jobs.update({
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

  proc.on("close", async (exitCode) => {
    fs.unlink(filePath, () => {});
    clearTimeout(killTimeout);
    if (exitCode !== 0) {
      const job = await prisma.jobs.findUnique({ where: { id: jobId } });

      if (job && job.retries < C.MAX_RETRIES) {
        // Increment retries in DB
        await prisma.jobs.update({
          where: { id: jobId },
          data: {
            retries: { increment: 1 },
            status: "PENDING",
          },
        });

        console.log(`[Worker] Retrying job ${jobId} (attempt ${job.retries + 1})`);

        // Delay and push to retry queue
        setTimeout(() => {
          redisClient.lpush(C.JOB_QUEUE_KEY_RETRY, jobId);
        }, getBackoffDelay(job.retries)); // exponential
      } else {
        await prisma.jobs.update({
          where: { id: jobId },
          data: { status: "FAILED" },
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
    await prisma.jobs.update({
      where: { id: jobId },
      data: {
        status: exitCode === 0 ? "SUCCESS" : "FAILED",
        exitCode,
        endedAt,
        output: output,
      },
    });

    workerSocket.emit("job:done", {
      jobId,
      exitCode,
    });
  });

  proc.on("error", (err) => {
    clearTimeout(killTimeout);
    console.error(`❌ Job ${jobId} process failed:`, err);
    fs.unlink(filePath, () => {});
  });
};

export default processJob;
