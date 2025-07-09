import redisClient from "@src/libs/redis";
import { constants } from "@src/utils/constants";
import { Socket } from "socket.io";

export const pushToQueue = async (jobId: string, socket: Socket) => {
  try {
    redisClient.lpush(constants.JOB_QUEUE_KEY, jobId);
    console.log("job pushed to the queue");
  } catch (error) {
    console.log(`Internal Server error : ${error}`);
  }
};
