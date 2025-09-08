-- AlterTable
ALTER TABLE "public"."Pwd_Job_Preferences_Requirements" ALTER COLUMN "salary_range" DROP NOT NULL,
ALTER COLUMN "salary_range" SET DATA TYPE TEXT;
