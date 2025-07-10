import { Socket } from "socket.io";

export const clientSocket: Record<string, Socket> = {};
export const workerSocket: Record<string, Socket> = {};
