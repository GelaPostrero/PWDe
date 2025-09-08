/*
  Warnings:

  - The `workArrangement` column on the `Employer_Profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Employer_Profile" DROP COLUMN "workArrangement",
ADD COLUMN     "workArrangement" TEXT[];
