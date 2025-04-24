/*
  Warnings:

  - A unique constraint covering the columns `[addharCard]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "addharCard" TEXT,
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "mobile" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_addharCard_key" ON "User"("addharCard");
