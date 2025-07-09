import { clientSocket } from "@src/libs/socket";
import { Server } from "socket.io";

const registerJobSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    socket.on("subscribe", (jobId: string) => {
      clientSocket[jobId] = socket;
      console.log(`Client subscribed to job ${jobId}`);
    });

    socket.on("unsubscribe", (jobId: string) => {
      delete clientSocket[jobId];
      console.log(`Client unsubscribed from job ${jobId}`);
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });
};

export default registerJobSocket;
