/*
  Warnings:

  - You are about to drop the column `code` on the `Broker` table. All the data in the column will be lost.
  - You are about to drop the column `project_id` on the `Broker` table. All the data in the column will be lost.
  - The primary key for the `InstallmentPlan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `InstallmentPlan` table. All the data in the column will be lost.
  - You are about to drop the column `due_date` on the `InstallmentPlan` table. All the data in the column will be lost.
  - You are about to drop the column `due_days` on the `InstallmentPlan` table. All the data in the column will be lost.
  - You are about to drop the column `installment_no` on the `InstallmentPlan` table. All the data in the column will be lost.
  - You are about to drop the column `lumpsum_amount` on the `InstallmentPlan` table. All the data in the column will be lost.
  - You are about to drop the column `percentage` on the `InstallmentPlan` table. All the data in the column will be lost.
  - You are about to drop the column `remarks` on the `InstallmentPlan` table. All the data in the column will be lost.
  - The primary key for the `Project` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `measuring_unit` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `project_name` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `sign_image_name` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Project` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[plan_name]` on the table `InstallmentPlan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[project_id]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `no_of_installments` to the `InstallmentPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plan_name` to the `InstallmentPlan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Broker" DROP CONSTRAINT "Broker_project_id_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_project_id_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_plan_fkey";

-- DropForeignKey
ALTER TABLE "RegistrationForm" DROP CONSTRAINT "RegistrationForm_project_id_fkey";

-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_project_id_fkey";

-- AlterTable
ALTER TABLE "Broker" DROP COLUMN "code",
DROP COLUMN "project_id";

-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "project_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "InstallmentPlan" DROP CONSTRAINT "InstallmentPlan_pkey",
DROP COLUMN "created_at",
DROP COLUMN "due_date",
DROP COLUMN "due_days",
DROP COLUMN "installment_no",
DROP COLUMN "lumpsum_amount",
DROP COLUMN "percentage",
DROP COLUMN "remarks",
ADD COLUMN     "no_of_installments" INTEGER NOT NULL,
ADD COLUMN     "plan_name" TEXT NOT NULL,
ADD CONSTRAINT "InstallmentPlan_pkey" PRIMARY KEY ("plan_name");

-- AlterTable
ALTER TABLE "Project" DROP CONSTRAINT "Project_pkey",
DROP COLUMN "created_at",
DROP COLUMN "measuring_unit",
DROP COLUMN "project_name",
DROP COLUMN "sign_image_name",
DROP COLUMN "size",
ADD COLUMN     "broker_id" INTEGER,
ALTER COLUMN "project_id" DROP DEFAULT,
ALTER COLUMN "project_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Project_pkey" PRIMARY KEY ("project_id");
DROP SEQUENCE "Project_project_id_seq";

-- AlterTable
ALTER TABLE "RegistrationForm" ALTER COLUMN "project_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Stock" ALTER COLUMN "project_id" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "InstallmentDetails" (
    "detail_id" SERIAL NOT NULL,
    "plan_name" TEXT NOT NULL,
    "installment_number" INTEGER NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "percentage" DECIMAL(65,30) NOT NULL,
    "due_after_days" INTEGER NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstallmentDetails_pkey" PRIMARY KEY ("detail_id")
);

-- CreateTable
CREATE TABLE "PropertySize" (
    "size_id" INTEGER NOT NULL,
    "size_number" INTEGER NOT NULL,
    "measuring_unit" TEXT NOT NULL,

    CONSTRAINT "PropertySize_pkey" PRIMARY KEY ("size_id")
);

-- CreateTable
CREATE TABLE "_ProjectBrokers" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectBrokers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "PropertySize_size_id_key" ON "PropertySize"("size_id");

-- CreateIndex
CREATE INDEX "_ProjectBrokers_B_index" ON "_ProjectBrokers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "InstallmentPlan_plan_name_key" ON "InstallmentPlan"("plan_name");

-- CreateIndex
CREATE UNIQUE INDEX "Project_project_id_key" ON "Project"("project_id");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallmentDetails" ADD CONSTRAINT "InstallmentDetails_plan_name_fkey" FOREIGN KEY ("plan_name") REFERENCES "InstallmentPlan"("plan_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_broker_id_fkey" FOREIGN KEY ("broker_id") REFERENCES "Broker"("broker_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_plan_fkey" FOREIGN KEY ("plan") REFERENCES "InstallmentPlan"("plan_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistrationForm" ADD CONSTRAINT "RegistrationForm_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectBrokers" ADD CONSTRAINT "_ProjectBrokers_A_fkey" FOREIGN KEY ("A") REFERENCES "Broker"("broker_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectBrokers" ADD CONSTRAINT "_ProjectBrokers_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("project_id") ON DELETE CASCADE ON UPDATE CASCADE;
