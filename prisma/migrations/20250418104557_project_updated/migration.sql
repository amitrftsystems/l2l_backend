/*
  Warnings:

  - You are about to drop the column `broker_id` on the `Project` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_broker_id_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "broker_id";
