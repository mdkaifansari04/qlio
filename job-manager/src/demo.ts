import { spawn } from "child_process";

export const startSpawn = async (script: string) => {
  try {
    const process = spawn(`${script}`);
    process.stdout.on("data", (data) => {
      const dateTime = new Date().toUTCString();
      const output = data.toString().trim();
      console.log(`${dateTime} ===>  [stdout]: ${output}`);
      // Here you can send it to WebSocket or save to DB
    });

    process.stderr.on("data", (data) => {
      const error = data.toString().trim();
      const dateTime = new Date().toUTCString();
      console.log(`${dateTime} ===> [stderr]: ${error}`);
      // Same — stream error line by line
    });

    process.on("close", (code) => {
      console.log(`Process exited with code: ${code}`);
    });

    process.on("error", (err) => {
      console.error("Failed to start process:", err);
    });
  } catch (error) {
    console.log("Internal server error :", error);
  }
};
