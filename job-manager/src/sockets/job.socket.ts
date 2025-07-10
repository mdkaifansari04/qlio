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

    // user socket connection
    socket.on("subscribe", ({ jobId, priority }: SubscribePayload) => {
      console.log(`Client subscribed to job ${jobId}`);
      if (!jobId || !priority) return;
      if (clientSocket[jobId]) return;
      clientSocket[jobId] = socket;
      enqueueJob({ jobId, priority });
    });

    socket.on("unsubscribe", (jobId: string) => {
      delete clientSocket[jobId];
      console.log(`Client unsubscribed from job ${jobId}`);
    });

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

    socket.on(
      "job:done",
      ({ jobId, exitCode }: { jobId: string; exitCode: number }) => {
        console.log("job:done", jobId, exitCode);
        const userSocket = clientSocket[jobId];
        if (userSocket && userSocket.connected) {
          userSocket.emit("job:done", { jobId, exitCode });
          userSocket.disconnect();
        }
        delete clientSocket[jobId];
      },
    );

    socket.on("register:worker", ({ workerId }: { workerId: string }) => {
      workerSocket[workerId] = socket;
    });

    socket.on("job:cancel", ({ jobId }: JobCancelPayload) => {
      workerSocket[C.WORKER_ID].emit("job:cancel", { jobId });
    });

    socket.on("job:canceled", ({ jobId, success }: JobCanceledResponse) => {
      clientSocket[jobId].emit("job:canceled", { jobId, success });
    });

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
