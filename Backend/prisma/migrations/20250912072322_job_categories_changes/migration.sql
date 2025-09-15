/*
  Warnings:

  - You are about to drop the column `description` on the `Job_Categories` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Job_Categories` table. All the data in the column will be lost.
  - Added the required column `jobCategory` to the `Job_Categories` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Job_Categories_name_key";

-- AlterTable
ALTER TABLE "public"."Job_Categories" DROP COLUMN "description",
DROP COLUMN "name",
ADD COLUMN     "jobCategory" TEXT NOT NULL,
ADD COLUMN     "jobDescription" TEXT;
