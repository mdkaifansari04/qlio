import { Job } from "@prisma/client";
import redisClient from "./redis";
import { constants } from "@src/utils/constants";

export const PRIORITY_LEVELS = [1, 2, 3];

export const PRIORITY_KEYS = Object.fromEntries(
  PRIORITY_LEVELS.map((level) => [level, `priority:${level}`])
);

// {1: "priority:1", 2: "priority:2", 3: "priority:3"}

export const enqueueJob = async (job: Job, queueKey: string = constants.JOB_QUEUE_KEY) => {
  const key = PRIORITY_KEYS[job.priority as 1 | 2 | 3] || PRIORITY_KEYS[3];
  await redisClient.lpush(`${queueKey}:${key}`, job.id);
  console.log(`📥 Enqueued job ${job.id} to ${key}`);
};

export const dequeueJob = async (queueKey: string = constants.JOB_QUEUE_KEY) => {
  for (const priority of PRIORITY_LEVELS) {
    const jobId = await redisClient.rpop(`${queueKey}:${PRIORITY_KEYS[priority]}`);

    if (jobId) {
      console.log(`📤 Dequeued job ${jobId} from priority ${priority}`);
      return jobId;
    }
  }
  return null; // all queues are empty
};
