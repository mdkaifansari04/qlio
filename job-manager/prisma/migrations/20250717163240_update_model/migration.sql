/*
  Warnings:

  - You are about to drop the column `isKilled` on the `Job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "isKilled",
ADD COLUMN     "isKillable" BOOLEAN NOT NULL DEFAULT false;
