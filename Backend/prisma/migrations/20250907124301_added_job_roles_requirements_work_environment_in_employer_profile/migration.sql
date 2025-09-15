/*
  Warnings:

  - You are about to drop the column `company_website` on the `Employer_Profile` table. All the data in the column will be lost.
  - Added the required column `industryPreference` to the `Employer_Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workArrangement` to the `Employer_Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Employer_Profile" DROP COLUMN "company_website",
ADD COLUMN     "accessibilityFeatures" TEXT[],
ADD COLUMN     "company_description" TEXT,
ADD COLUMN     "company_github_profile" TEXT,
ADD COLUMN     "company_other_portfolio" TEXT[],
ADD COLUMN     "company_website_portfolio" TEXT,
ADD COLUMN     "industryPreference" TEXT NOT NULL,
ADD COLUMN     "jobRolesTypicallyHire" TEXT[],
ADD COLUMN     "requiredPreferredSkills" TEXT[],
ADD COLUMN     "workArrangement" TEXT NOT NULL;
