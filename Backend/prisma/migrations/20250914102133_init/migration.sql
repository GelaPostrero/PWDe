/*
  Warnings:

  - You are about to drop the column `application_updates` on the `Notifications` table. All the data in the column will be lost.
  - You are about to drop the column `job_matches` on the `Notifications` table. All the data in the column will be lost.
  - You are about to drop the column `marketing_emails` on the `Notifications` table. All the data in the column will be lost.
  - You are about to drop the column `messages` on the `Notifications` table. All the data in the column will be lost.
  - You are about to drop the column `profile_views` on the `Notifications` table. All the data in the column will be lost.
  - You are about to drop the column `security_alerts` on the `Notifications` table. All the data in the column will be lost.
  - You are about to drop the column `urgent_messages` on the `Notifications` table. All the data in the column will be lost.
  - You are about to drop the column `weekly_digest` on the `Notifications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Notifications" DROP COLUMN "application_updates",
DROP COLUMN "job_matches",
DROP COLUMN "marketing_emails",
DROP COLUMN "messages",
DROP COLUMN "profile_views",
DROP COLUMN "security_alerts",
DROP COLUMN "urgent_messages",
DROP COLUMN "weekly_digest";

-- AlterTable
ALTER TABLE "public"."Pwd_Profile" ADD COLUMN     "application_updates" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "job_matches" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "marketing_emails" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "messages" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "profile_views_notif" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "security_alerts" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "urgent_messages" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "weekly_digest" BOOLEAN NOT NULL DEFAULT true;
