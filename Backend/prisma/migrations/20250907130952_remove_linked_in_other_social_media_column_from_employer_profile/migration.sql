/*
  Warnings:

  - You are about to drop the column `LinkedIn_profile` on the `Employer_Profile` table. All the data in the column will be lost.
  - You are about to drop the column `Other_Social_Media` on the `Employer_Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Employer_Profile" DROP COLUMN "LinkedIn_profile",
DROP COLUMN "Other_Social_Media";
