import { type Job } from "@prisma/client";
import prisma from "@src/config/db";
import { constants as C } from "@src/utils/constants";
import { ChildProcess } from "child_process";
import { Socket } from "socket.io-client";

export function getBackoffDelay(retry: number): number {
  return [5000, 10000, 20000][retry] || 30000; // 5s, 10s, 20s
}

export const terminateOnRaceCondition = async (
  proc: ChildProcess,
  jobId: string,
  workerSocket: Socket
) => {
  setTimeout(async () => {
    if (proc.killed) return;

    const job = await prisma.job.findFirst({ where: { id: jobId } });
    if (job && job.status === "PENDING") {
      await prisma.job.update({
        where: { id: jobId },
        data: { status: "FAILED" },
      });
      workerSocket.emit("job:done", {
        jobId,
        exitCode: 1,
      });
    }
    console.log(`❌ Race condition detected. Killing process.`);
    proc.kill("SIGTERM");
  }, C.RACE_CONDITION_TIMEOUT); // 5 minutes
};

export const killTimeout = (proc: ChildProcess, jobId: string, job: Job, workerSocket: Socket) => {
  setTimeout(async () => {
    if (proc.killed) return;

    console.log("❌ Timed out. Killing process.");
    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: "FAILED",
      },
    });
    workerSocket.emit("job:done", {
      jobId,
      exitCode: 1,
    });
    proc.kill("SIGTERM");
  }, job.timeout);
};
