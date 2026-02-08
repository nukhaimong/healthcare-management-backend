/*
  Warnings:

  - The `isDeleted` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "deletedAt" TIMESTAMP(3),
DROP COLUMN "isDeleted",
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
