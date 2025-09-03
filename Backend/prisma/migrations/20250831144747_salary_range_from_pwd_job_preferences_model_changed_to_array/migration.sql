/*
  Warnings:

  - The `salary_range` column on the `Pwd_Job_Preferences_Requirements` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Pwd_Job_Preferences_Requirements" DROP COLUMN "salary_range",
ADD COLUMN     "salary_range" TEXT[];
