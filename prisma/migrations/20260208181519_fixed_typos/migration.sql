/*
  Warnings:

  - You are about to drop the column `registration_number` on the `doctor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[registrationNumber]` on the table `doctor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `registrationNumber` to the `doctor` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "doctor_registration_number_key";

-- AlterTable
ALTER TABLE "doctor" DROP COLUMN "registration_number",
ADD COLUMN     "registrationNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "doctor_registrationNumber_key" ON "doctor"("registrationNumber");
