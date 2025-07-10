import { config } from "dotenv";
import { startJobQueueLoop } from "./worker/job-queue-loop";
import { pushPendingJobToRetry, startRetryLoop } from "./worker/retry-loop";
config();

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

if (require.main === module) {
  bootstrap();
}
