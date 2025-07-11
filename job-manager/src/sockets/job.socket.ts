import { enqueueJob } from "@src/libs/priority-queue";
import { clientSocket, workerSocket } from "@src/libs/socket";
import {
  IStreamType,
  JobCanceledResponse,
  JobCancelPayload,
  SubscribePayload,
} from "@src/types";
import { constants as C } from "@src/utils/constants";
import { Server } from "socket.io";

const registerJobSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // user request connection to push job to queue
    socket.on("job:subscribe", ({ jobId, priority }: SubscribePayload) => {
      console.log(`Client subscribed to job ${jobId}`);
      if (!jobId || !priority) return;
      if (clientSocket[jobId]) return;
      clientSocket[jobId] = socket;
      enqueueJob({ jobId, priority });
    });

    socket.on("job:unsubscribe", (jobId: string) => {
      delete clientSocket[jobId];
      console.log(`Client unsubscribed from job ${jobId}`);
    });

    // job stream receiving form worker and transfer to user
    socket.on(
      "job:stream",
      ({ jobId, output, type, timestamp }: IStreamType) => {
        console.log("received the job stream : ", jobId);

        const userSocket = clientSocket[jobId];

        if (userSocket && userSocket.connected) {
          userSocket.emit("job:update", { jobId, output, type, timestamp });
          console.log("emited the response to the user", output.response);
        } else {
          console.log("User is not connected");
        }
      },
    );

    // job done : event sent from worker and transfer to user
    socket.on(
      "job:done",
      ({ jobId, exitCode }: { jobId: string; exitCode: number }) => {
        console.log("job:done", jobId, exitCode);
        const userSocket = clientSocket[jobId];
        if (userSocket && userSocket.connected) {
          userSocket.emit("job:done", { jobId, exitCode });
        }
      },
    );

    // worker request connection
    socket.on("register:worker", ({ workerId }: { workerId: string }) => {
      workerSocket[workerId] = socket;
    });

    // job cancel : event sent from user
    socket.on("job:cancel", ({ jobId }: JobCancelPayload) => {
      workerSocket[C.WORKER_ID].emit("job:cancel", { jobId });
    });

    // job canceled : event sent from worker and transfer to user
    socket.on("job:canceled", ({ jobId, success }: JobCanceledResponse) => {
      clientSocket[jobId].emit("job:canceled", { jobId, success });
    });

    // disconnect : event user or worker disconnect
    socket.on("disconnect", () => {
      Object.entries(clientSocket).forEach(([jobId, s]) => {
        if (s.id == socket.id) {
          delete clientSocket[jobId];
        }
      });

      Object.entries(workerSocket).forEach(([workerId, s]) => {
        if (s.id == socket.id) {
          delete workerSocket[workerId];
        }
      });

      console.log("🔴 User disconnected :", socket.id);
    });
  });
};

export default registerJobSocket;
