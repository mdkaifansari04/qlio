import prisma from "../config/db";
import processJob from "./process-job";

describe("Worker job locking", () => {
  let jobId: string;

  beforeAll(async () => {
    await prisma.job.deleteMany();
    const user = await prisma.user.create({
      data: {
        name: "Kaif",
        email: "kaif@example.com",
        password: "hashedpassword", // assuming you're hashing this
      },
    });

    const job = await prisma.job.create({
      data: {
        command: "echo 'Hello from test'",
        status: "PENDING",
        output: [],
        retries: 0,
        priority: 1,
        params: [],
        timeout: 10000,
        userId: user.id,
        updatedAt: new Date(),
        createdAt: new Date(),
        id: "1001",
      },
    });
    jobId = job.id;
  });

  it("should be processed by only one worker", async () => {
    const processedBy: string[] = [];

    const workerWrapper = async (workerName: string) => {
      try {
        const result = await processJob(jobId);
        if (result) {
          processedBy.push(workerName);
        }
      } catch (error) {
        console.log(`${workerName} skipped job`);
      }
    };

    await Promise.all([workerWrapper("worker-1"), workerWrapper("worker-2")]);

    expect(processedBy.length).toBe(1);
    console.log("Processed by:", processedBy);
  });
});
