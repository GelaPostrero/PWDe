/*
  Warnings:

  - A unique constraint covering the columns `[job_code]` on the table `Job_Listings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `job_code` to the `Job_Listings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Job_Listings" ADD COLUMN     "job_code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Job_Listings_job_code_key" ON "public"."Job_Listings"("job_code");
