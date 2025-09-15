/*
  Warnings:

  - Added the required column `interviews` to the `Pwd_Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_views` to the `Pwd_Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saved_jobs` to the `Pwd_Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Pwd_Profile" ADD COLUMN     "interviews" INTEGER NOT NULL,
ADD COLUMN     "profile_views" INTEGER NOT NULL,
ADD COLUMN     "saved_jobs" INTEGER NOT NULL;
