import { config } from "dotenv";
config();

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
