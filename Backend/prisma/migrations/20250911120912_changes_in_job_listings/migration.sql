/*
  Warnings:

  - You are about to drop the column `accessibility_features` on the `Job_Listings` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Job_Listings` table. All the data in the column will be lost.
  - The `skills_required` column on the `Job_Listings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `salary_min` on the `Job_Listings` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to alter the column `salary_max` on the `Job_Listings` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - Added the required column `jobtitle` to the `Job_Listings` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `employment_type` on the `Job_Listings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `work_arrangement` on the `Job_Listings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `salary_type` on the `Job_Listings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `experience_level` on the `Job_Listings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Job_Listings" DROP COLUMN "accessibility_features",
DROP COLUMN "title",
ADD COLUMN     "jobtitle" VARCHAR(255) NOT NULL,
ADD COLUMN     "workplace_accessibility_features" TEXT[],
ALTER COLUMN "description" DROP NOT NULL,
DROP COLUMN "skills_required",
ADD COLUMN     "skills_required" TEXT[],
DROP COLUMN "employment_type",
ADD COLUMN     "employment_type" VARCHAR(10) NOT NULL,
DROP COLUMN "work_arrangement",
ADD COLUMN     "work_arrangement" VARCHAR(10) NOT NULL,
ALTER COLUMN "salary_min" SET DATA TYPE INTEGER,
ALTER COLUMN "salary_max" SET DATA TYPE INTEGER,
DROP COLUMN "salary_type",
ADD COLUMN     "salary_type" VARCHAR(20) NOT NULL,
DROP COLUMN "experience_level",
ADD COLUMN     "experience_level" VARCHAR(20) NOT NULL,
ALTER COLUMN "application_deadline" DROP NOT NULL,
ALTER COLUMN "application_deadline" SET DATA TYPE TEXT;

-- DropEnum
DROP TYPE "public"."EmploymentType";

-- DropEnum
DROP TYPE "public"."ExperienceLevel";

-- DropEnum
DROP TYPE "public"."SalaryType";

-- DropEnum
DROP TYPE "public"."WorkArrangement";
