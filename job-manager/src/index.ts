import express from "express";
import router from "./api/v1/routes";
import { config } from "dotenv";
import prisma from "./config/db";
config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get("/health", async (req, res) => {
  try {
    const dbStatus = await prisma.$queryRaw`SELECT 1`;
    const isDbHealthy = dbStatus === "pong" || dbStatus;

    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    // const allSystemsOperational = isDbHealthy && queueStatus;
    const allSystemsOperational = isDbHealthy;

    res.status(allSystemsOperational ? 200 : 500).json({
      success: allSystemsOperational,
      message: allSystemsOperational ? "STATUS: OK" : "STATUS: DEGRADED",
      uptime: `${Math.floor(uptime)}s`,
      memory: {
        rss: memoryUsage.rss,
        heapUsed: memoryUsage.heapUsed,
        heapTotal: memoryUsage.heapTotal,
      },
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

app.listen(PORT, () => {
  console.log(`Server is running on : http://localhost:${PORT}`);
});
