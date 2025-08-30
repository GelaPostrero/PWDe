/*
  Warnings:

  - You are about to drop the column `business_registration_document` on the `Employer_Profile` table. All the data in the column will be lost.
  - You are about to drop the column `contact_person_identity_verification` on the `Employer_Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Employer_Profile" DROP COLUMN "business_registration_document",
DROP COLUMN "contact_person_identity_verification",
ADD COLUMN     "businessRegistration" TEXT,
ADD COLUMN     "governmentId" TEXT,
ADD COLUMN     "taxDocuments" TEXT;
