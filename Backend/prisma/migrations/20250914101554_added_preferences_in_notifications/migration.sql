-- AlterTable
ALTER TABLE "public"."Notifications" ADD COLUMN     "application_updates" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "job_matches" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "marketing_emails" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "messages" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "profile_views" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "security_alerts" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "urgent_messages" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "weekly_digest" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."Pwd_Profile" ADD COLUMN     "allow_messages" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "show_email" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "show_location" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "show_online_status" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "show_phone_number" BOOLEAN NOT NULL DEFAULT true;
