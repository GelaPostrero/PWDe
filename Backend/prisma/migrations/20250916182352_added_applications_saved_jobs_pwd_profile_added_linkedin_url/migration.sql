-- AlterTable
ALTER TABLE "public"."Applications" ADD COLUMN     "portfolio_links" TEXT,
ADD COLUMN     "work_experience" TEXT;

-- AlterTable
ALTER TABLE "public"."Pwd_Profile" ADD COLUMN     "linkedin_url" TEXT,
ADD COLUMN     "professional_summary_completed" BOOLEAN NOT NULL DEFAULT false;
