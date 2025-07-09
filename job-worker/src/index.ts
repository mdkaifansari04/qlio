import { config } from "dotenv";
import { consume } from "./queue/queue-consumer";
config();

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception :", err.message);
});

process.on("unhandledRejection", (err) => {
  console.log("Uncaught Rejection :", err);
});

consume();
