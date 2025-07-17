import prisma from "@src/config/db";
import { ChildProcess } from "child_process";
import { enqueueJob } from "./priority-queue";
export const RunningProcess: Record<string, ChildProcess> = {};

export const cancelProcess = async (jobId: string) => {
  const process = RunningProcess[jobId];
  if (process) {
    process.kill("SIGTERM");
    await prisma.job.update({
      where: { id: jobId },
      data: { status: "CANCELED" },
    });
    delete RunningProcess[jobId];
  }
};

export const cancelAllProcesses = async () => {
  const promises: Promise<void>[] = [];

  for (const jobId in RunningProcess) {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) continue;

    if (job.isKillable) {
      const promise = cancelProcess(job.id)
        .then(() => enqueueJob(job))
        .catch((err) => {
          console.error(`Failed to cancel job ${job.id}`, err);
        });

      promises.push(promise);
    } else {
      const running = RunningProcess[jobId];
      const promise = new Promise<void>((resolve) => {
        running.on("exit", () => {
          resolve();
        });

        running.on("error", (err: any) => {
          console.error(`Non-killable job ${job.id} errored`, err);
          enqueueJob(job);
          resolve();
        });
      });

      promises.push(promise);
    }
  }

  await Promise.all(promises);

  return true;
};
