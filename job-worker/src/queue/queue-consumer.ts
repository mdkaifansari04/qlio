import processJobs from "@src/executor/process-job";
import redisClient from "@src/libs/redis";
import { constants } from "@src/utils/constants";

export const consume = async () => {
  while (true) {
    const jobId = await redisClient.rpop(constants.JOB_QUEUE_KEY);

    if (jobId) {
      console.log("🛠️  Dequeued job:", jobId);
      await processJobs(jobId);
    } else {
      await new Promise((r) => setTimeout(r, 1000)); // idle wait
    }
  }
};
