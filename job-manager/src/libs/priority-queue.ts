import { Job } from "@prisma/client";
import redisClient from "./redis";
import { SubscribePayload } from "@src/types";

export const PRIORITY_LEVELS = [1, 2, 3];

export const PRIORITY_KEYS = Object.fromEntries(
  PRIORITY_LEVELS.map((level) => [level, `job:queue:priority:${level}`]),
);

export const enqueueJob = async ({ jobId, priority }: SubscribePayload) => {
  const key = PRIORITY_KEYS[priority as 1 | 2 | 3] || PRIORITY_KEYS[3];
  await redisClient.lpush(key, jobId);
  console.log(`📥 Enqueued job ${jobId} to ${key}`);
};

export const dequeueJob = async () => {
  for (const priority of PRIORITY_LEVELS) {
    const jobId = await redisClient.rpop(PRIORITY_KEYS[priority]);
    if (jobId) {
      console.log(`📤 Dequeued job ${jobId} from priority ${priority}`);
      return jobId;
    }
  }
  return null; // all queues are empty
};
