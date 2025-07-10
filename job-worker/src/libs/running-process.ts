import prisma from "@src/config/db";
import { ChildProcess } from "child_process";
export const RunningProcess: Record<string, ChildProcess> = {};

export const cancelProcess = async (jobId: string) => {
  const process = RunningProcess[jobId];
  if (process) {
    delete RunningProcess[jobId];
    await prisma.job.update({
      where: { id: jobId },
      data: { status: "CANCELED" },
    });
    process.kill("SIGTERM");
  }
};
