/*
  Warnings:

  - The primary key for the `Project` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `project_id` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `_ProjectBrokers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[project_name]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `project_id` on the `Customer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `project_name` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `project_id` on the `RegistrationForm` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `project_id` on the `Stock` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `B` on the `_ProjectBrokers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_project_id_fkey";

-- DropForeignKey
ALTER TABLE "RegistrationForm" DROP CONSTRAINT "RegistrationForm_project_id_fkey";

-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_project_id_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectBrokers" DROP CONSTRAINT "_ProjectBrokers_B_fkey";

-- DropIndex
DROP INDEX "Project_project_id_key";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "project_id",
ADD COLUMN     "project_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP CONSTRAINT "Project_pkey",
ADD COLUMN     "project_name" TEXT NOT NULL,
ADD COLUMN     "sign_img" TEXT,
DROP COLUMN "project_id",
ADD COLUMN     "project_id" SERIAL NOT NULL,
ADD CONSTRAINT "Project_pkey" PRIMARY KEY ("project_id");

-- AlterTable
ALTER TABLE "RegistrationForm" DROP COLUMN "project_id",
ADD COLUMN     "project_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "project_id",
ADD COLUMN     "project_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "_ProjectBrokers" DROP CONSTRAINT "_ProjectBrokers_AB_pkey",
DROP COLUMN "B",
ADD COLUMN     "B" INTEGER NOT NULL,
ADD CONSTRAINT "_ProjectBrokers_AB_pkey" PRIMARY KEY ("A", "B");

-- CreateIndex
CREATE INDEX "Customer_project_id_idx" ON "Customer"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "Project_project_name_key" ON "Project"("project_name");

-- CreateIndex
CREATE INDEX "_ProjectBrokers_B_index" ON "_ProjectBrokers"("B");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistrationForm" ADD CONSTRAINT "RegistrationForm_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectBrokers" ADD CONSTRAINT "_ProjectBrokers_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("project_id") ON DELETE CASCADE ON UPDATE CASCADE;
