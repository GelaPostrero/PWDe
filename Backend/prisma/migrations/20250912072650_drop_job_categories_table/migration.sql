/*
  Warnings:

  - You are about to drop the column `applications_count` on the `Job_Listings` table. All the data in the column will be lost.
  - You are about to drop the `Job_Categories` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `jobCategory` to the `Job_Listings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Job_Listings" DROP CONSTRAINT "Job_Listings_category_id_fkey";

-- AlterTable
ALTER TABLE "public"."Job_Listings" DROP COLUMN "applications_count",
ADD COLUMN     "jobCategory" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Job_Categories";
