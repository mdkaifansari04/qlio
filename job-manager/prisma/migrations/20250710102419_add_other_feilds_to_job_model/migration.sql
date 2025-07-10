-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "cpuUsage" INTEGER,
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "memoryUsage" INTEGER,
ADD COLUMN     "workerId" TEXT;
