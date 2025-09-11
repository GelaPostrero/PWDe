/*
  Warnings:

  - Added the required column `employer_id` to the `Applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interviews` to the `Employer_Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_views` to the `Employer_Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Applications" ADD COLUMN     "employer_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Employer_Profile" ADD COLUMN     "interviews" INTEGER NOT NULL,
ADD COLUMN     "profile_views" INTEGER NOT NULL,
ADD COLUMN     "set_company_profile" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "set_jobRoles_requirements" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "set_work_environment" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "public"."Applications" ADD CONSTRAINT "Applications_employer_id_fkey" FOREIGN KEY ("employer_id") REFERENCES "public"."Employer_Profile"("employer_id") ON DELETE RESTRICT ON UPDATE CASCADE;
