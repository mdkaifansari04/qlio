import { spawn } from "child_process";
import prisma from "@src/config/db";
import { webSocket as workerSocket } from "@src/socket/job-worker.socket";
import { Prisma } from "@prisma/client";

type OutputLog = {
  response: string;
  timestamp: string;
  success: boolean;
};
const processJob = async (jobId: string) => {
  const job = await prisma.jobs.findFirst({ where: { id: jobId } });

  if (!job) {
    console.error(`❌ Job ${jobId} not found`);
    return;
  }
  const output = job.output as Prisma.JsonArray;

  const { command } = job;
  console.log(`🚀 Starting job ${jobId}: ${command}`);

  const proc = spawn(`${command}`, { shell: true });
  const startedAt = new Date();
  await prisma.jobs.update({
    where: { id: jobId },
    data: {
      status: "RUNNING",
      startedAt,
    },
  });

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
    console.error(`❌ Job ${jobId} process failed:`, err);
  });
};

export default processJob;
