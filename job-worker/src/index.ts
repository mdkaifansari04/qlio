import { config } from "dotenv";
config();
import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 8081;

app.get("/", (req: Request, res: Response) => {
  res.send("Job Worker is running 🚀");
});

app.get("/wake-up", (req: Request, res: Response) => {
  startJobQueueLoop();
  res.status(200).json({ success: true, message: "Job Worker is running 🚀" });
});

import { startJobQueueLoop } from "./worker/job-queue-loop";
import { pushPendingJobToRetry, startRetryLoop } from "./worker/retry-loop";

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception :", err.message);
});

process.on("unhandledRejection", (err) => {
  console.log("Uncaught Rejection :", err);
});

async function bootstrap() {
  console.log("[Worker] Booting up...");

  startRetryLoop();
  startJobQueueLoop();
  pushPendingJobToRetry();
}

bootstrap();

app.listen(PORT, () => {
  console.log(`[Worker] Listening on port ${PORT}`);
});
