import redisClient from "@src/libs/redis";
import { constants } from "@src/utils/constants";
import processJob from "./process-job";
import prisma from "@src/config/db";

export const startRetryLoop = () => {
  setInterval(async () => {
    const jobId = await redisClient.rpop(constants.JOB_QUEUE_KEY_RETRY);
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
      await redisClient.lpush(constants.JOB_QUEUE_KEY_RETRY, job.id);
    });
    console.log(`[Retry] Pushed ${job.length} pending jobs to retry queue`);
  }, 1000 * 60 * 30); // every 30 min
};
