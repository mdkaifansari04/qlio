/*
  Warnings:

  - You are about to drop the column `stderr` on the `Jobs` table. All the data in the column will be lost.
  - You are about to drop the column `stdout` on the `Jobs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Jobs" DROP COLUMN "stderr",
DROP COLUMN "stdout",
ADD COLUMN     "output" JSONB NOT NULL DEFAULT '[]';
