/*
  Warnings:

  - Added the required column `employer_id` to the `Saved_Jobs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Saved_Jobs" ADD COLUMN     "employer_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Saved_Jobs" ADD CONSTRAINT "Saved_Jobs_employer_id_fkey" FOREIGN KEY ("employer_id") REFERENCES "public"."Employer_Profile"("employer_id") ON DELETE CASCADE ON UPDATE CASCADE;
