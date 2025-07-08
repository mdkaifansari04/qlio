import express from "express";
import { startSpawn } from "./demo";
import router from "./api/v1/routes";

const app = express();

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "STATUS : OK" });
});

app.use("/api/v1", router);

app.listen(3000, () => {
  console.log("App is running in port: 3000");
});
