/*
  Warnings:

  - Added the required column `priority` to the `Jobs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeout` to the `Jobs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Jobs" ADD COLUMN     "params" TEXT[],
ADD COLUMN     "priority" INTEGER NOT NULL,
ADD COLUMN     "timeout" INTEGER NOT NULL;
