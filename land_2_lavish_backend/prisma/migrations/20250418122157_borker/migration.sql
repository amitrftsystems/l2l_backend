/*
  Warnings:

  - Added the required column `project_id` to the `Broker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_name` to the `Broker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Broker" ADD COLUMN     "project_id" INTEGER NOT NULL,
ADD COLUMN     "project_name" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Broker" ADD CONSTRAINT "Broker_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;
