/*
  Warnings:

  - You are about to drop the column `job_matches` on the `Pwd_Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Pwd_Profile" DROP COLUMN "job_matches",
ADD COLUMN     "email_job_matches" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "push_notif_application_updates" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "push_notif_job_matches" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "push_notif_messages" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "push_notif_profile_views" BOOLEAN NOT NULL DEFAULT true;
