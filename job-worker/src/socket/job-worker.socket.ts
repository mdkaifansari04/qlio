import { io } from "socket.io-client";

export const webSocket = io(process.env.JOB_MANGER_SOCKET_URL!, {
  autoConnect: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 2000,
});

webSocket.on("connection", (socket) => {
  console.log("[worker] connected to job-manager");
  console.log(socket);
});

webSocket.on("disconnect", () => {
  console.log("[worker] disconnected from job-manager, Trying to reconnect");
});