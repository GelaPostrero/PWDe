/*
  Warnings:

  - You are about to drop the column `profile_views_notif` on the `Pwd_Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Pwd_Profile" DROP COLUMN "profile_views_notif",
ADD COLUMN     "email_profile_views" BOOLEAN NOT NULL DEFAULT true;
