-- AlterTable
ALTER TABLE "public"."Employer_Profile" ALTER COLUMN "date_of_birth" DROP NOT NULL,
ALTER COLUMN "date_of_birth" SET DATA TYPE TEXT;
