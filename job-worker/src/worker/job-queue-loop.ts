import { dequeueJob } from "@src/libs/priority-queue";
import { constants } from "@src/utils/constants";
import processJobs from "@src/worker/process-job";

const MAX_CONCURRENCY = constants.MAX_CONCURRENCY;
let runningJobs = 0;

export const startJobQueueLoop = async () => {
  while (true) {
    if (runningJobs >= MAX_CONCURRENCY) {
      await new Promise((r) => setTimeout(r, 500));
      continue;
    }
    const jobId = await dequeueJob();
    if (!jobId) {
      await new Promise((r) => setTimeout(r, 1000)); // idle wait
      continue;
    }

    runningJobs++;
    console.log("🛠️  Dequeued job:", jobId);
    processJobs(jobId)
      .catch((err) => {
        console.error("❌ Error processing job:", err);
      })
      .finally(() => {
        runningJobs--;
      });
  }
};
