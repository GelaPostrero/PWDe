/*
  Warnings:

  - You are about to drop the column `first_name` on the `Employer_Profile` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Employer_Profile` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `Employer_Profile` table. All the data in the column will be lost.
  - You are about to drop the column `middle_name` on the `Employer_Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[company_email]` on the table `Employer_Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `company_address` to the `Employer_Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_email` to the `Employer_Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_name` to the `Employer_Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_phone` to the `Employer_Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Employer_Profile" DROP COLUMN "first_name",
DROP COLUMN "gender",
DROP COLUMN "last_name",
DROP COLUMN "middle_name",
ADD COLUMN     "company_address" TEXT NOT NULL,
ADD COLUMN     "company_email" TEXT NOT NULL,
ADD COLUMN     "company_name" TEXT NOT NULL,
ADD COLUMN     "company_phone" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Employer_Profile_company_email_key" ON "public"."Employer_Profile"("company_email");
