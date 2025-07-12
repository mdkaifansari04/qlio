import { cancelProcess } from "@src/libs/process-action";
import { JobCancelPayload } from "@src/types";
import { constants as C } from "@src/utils/constants";

import { io } from "socket.io-client";

export const webSocket = io(process.env.JOB_MANGER_SOCKET_URL!, {
  autoConnect: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 2000,
});

webSocket.on("connect", () => {
  console.log("[worker] connected to job-manager");
  webSocket.emit("register:worker", { workerId: C.WORKER_ID });
});

webSocket.on("job:cancel", async ({ jobId, workerId }: JobCancelPayload) => {
  await cancelProcess(jobId);
  console.log("job:canceled", jobId);
  webSocket.emit("job:canceled", { jobId, workerId, success: true });
});

webSocket.on("disconnect", () => {
  console.log("[worker] disconnected from job-manager, Trying to reconnect");
});
