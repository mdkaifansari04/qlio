import prisma from "@src/config/db";
import { dequeueJob, enqueueJob } from "@src/libs/priority-queue";
import { constants } from "@src/utils/constants";
import processJob from "./process-job";

export const startRetryLoop = () => {
  setInterval(async () => {
    const jobId = await dequeueJob(constants.JOB_QUEUE_KEY_RETRY);
    if (!jobId) return;

    console.log(`[Retry] Retrying job: ${jobId}`);
    await processJob(jobId); // Same logic as main job handler
  }, 3000); // Poll retry queue every 3s
};

export const pushPendingJobToRetry = async () => {
  setInterval(async () => {
    const job = await prisma.job.findMany({ where: { status: "PENDING" } });
    if (job.length === 0) return;

    job.forEach(async (job) => {
      await enqueueJob(job, constants.JOB_QUEUE_KEY_RETRY);
    });
    console.log(`[Retry] Pushed ${job.length} pending jobs to retry queue`);
  }, 1000 * 60 * 10); // every 10 min
};
