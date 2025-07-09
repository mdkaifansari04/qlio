import express from "express";
import router from "./api/v1/routes";
import { config } from "dotenv";
import prisma from "./config/db";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { clientSocket } from "./libs/socket";
import registerJobSocket from "./sockets/job.socket";
import { startSpawn } from "./demo";

config();

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 8080;

app.use(express.json());

app.post("/demo-spawn", startSpawn);

app.get("/health", async (req, res) => {
  try {
    const dbStatus = await prisma.$queryRaw`SELECT 1`;
    const isDbHealthy = dbStatus === "pong" || dbStatus;

    const uptime = process.uptime();

    // const allSystemsOperational = isDbHealthy && queueStatus;
    const allSystemsOperational = isDbHealthy;

    res.status(allSystemsOperational ? 200 : 500).json({
      success: allSystemsOperational,
      message: allSystemsOperational ? "STATUS: OK" : "STATUS: DEGRADED",
      uptime: `${Math.floor(uptime)}s`,
      dependencies: {
        database: isDbHealthy ? "up" : "down",
        // queue: queueStatus ? "up" : "down",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "STATUS: CRITICAL FAILURE",
      error: err,
      timestamp: new Date().toISOString(),
    });
  }
});

app.use("/api/v1", router);

registerJobSocket(io);

server.listen(PORT, () => {
  console.log(`Server is running on : http://localhost:${PORT}`);
});
