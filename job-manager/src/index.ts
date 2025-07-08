import express from "express";

const app = express();

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "STATUS : OK" });
});

app.listen(3000, () => {
  console.log("App is running in port: 3000");
});
