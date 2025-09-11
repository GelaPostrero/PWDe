-- AlterTable
ALTER TABLE "public"."Pwd_Profile" ADD COLUMN     "basic_information" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "education" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "portfolio_items" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "professional_experience" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "set_accessibility_preferences" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "skills_assessment" BOOLEAN NOT NULL DEFAULT false;
