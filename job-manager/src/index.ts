import { config } from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import router from "./api/v1/routes";
import prisma from "./config/db";
import { startSpawn } from "./demo";
import registerJobSocket from "./sockets/job-manager-socket";
import cors from "cors";
import errorHandler from "./middleware/error";
import redisClient from "./libs/redis";
config();

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.post("/demo-spawn", startSpawn);

app.get("/health", async (req, res) => {
  try {
    const dbStatus = await prisma.$queryRaw`SELECT 1`;
    const isDbHealthy = dbStatus === "pong" || dbStatus;
    const isRedisHealthy = await redisClient.ping();
    const uptime = process.uptime();

    const allSystemsOperational = isDbHealthy && isRedisHealthy;

    res.status(allSystemsOperational ? 200 : 500).json({
      success: allSystemsOperational,
      message: allSystemsOperational ? "STATUS: OK" : "STATUS: DEGRADED",
      uptime: `${Math.floor(uptime)}s`,
      dependencies: {
        database: isDbHealthy ? "up" : "down",
        queue: isRedisHealthy ? "up" : "down",
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
app.use(errorHandler);
registerJobSocket(io);

server.listen(PORT, () => {
  console.log(`Server is running on : http://localhost:${PORT}`);
});
