import { clientSocket } from "@src/libs/socket";
import { pushToQueue } from "@src/services/job.service";
import { IStreamType } from "@src/types";
import { Server } from "socket.io";

const registerJobSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    socket.on("subscribe", (jobId: string) => {
      console.log(`Client subscribed to job ${jobId}`);
      if (clientSocket[jobId]) return;
      clientSocket[jobId] = socket;
      pushToQueue(jobId, socket);
    });

    socket.on("unsubscribe", (jobId: string) => {
      delete clientSocket[jobId];
      console.log(`Client unsubscribed from job ${jobId}`);
    });

    socket.on("job:stream", ({ jobId, line, type }: IStreamType) => {
      const userSocket = clientSocket[jobId];

      if (userSocket && userSocket.connected) {
        userSocket.emit("job:update", { jobId, line, type });
      } else {
        console.log("User is not connected");
      }
    });

    socket.on("disconnect", () => {
      Object.entries(clientSocket).forEach(([jobId, s]) => {
        if (s.id == socket.id) {
          delete clientSocket[jobId];
        }
      });
      console.log("🔴 User disconnected :", socket.id);
    });
  });
};

export default registerJobSocket;
