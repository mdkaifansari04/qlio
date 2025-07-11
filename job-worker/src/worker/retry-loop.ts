import prisma from "@src/config/db";
import { dequeueJob, enqueueJob } from "@src/libs/priority-queue";
import { constants } from "@src/utils/constants";
import processJob from "./process-job";

export const startRetryLoop = () => {
  setInterval(async () => {
    const jobId = await dequeueJob(constants.JOB_QUEUE_KEY_RETRY);
    if (!jobId) return;

    await processJob(jobId);
  }, 1000 * 60 * 20); // Poll retry queue every 20 min
};

export const pushPendingJobToRetry = async () => {
  setInterval(async () => {
    const job = await prisma.job.findMany({
      where: { status: { in: ["PENDING", "RUNNING"] } },
      orderBy: { createdAt: "asc" },
    });
    if (job.length === 0) return;

    job.forEach(async (job) => {
      await enqueueJob(job, constants.JOB_QUEUE_KEY);
    });
    console.log(`[Retry] Pushed ${job.length} pending jobs to retry queue`);
  }, 1000 * 60 * 20); // every 20 min
};
