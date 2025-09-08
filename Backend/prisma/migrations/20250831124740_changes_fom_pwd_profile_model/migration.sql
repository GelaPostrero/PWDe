/*
  Warnings:

  - You are about to drop the column `portfolio_links` on the `Pwd_Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Pwd_Profile" DROP COLUMN "portfolio_links",
ADD COLUMN     "github_url" TEXT,
ADD COLUMN     "otherPlatform" TEXT[],
ADD COLUMN     "portfolio_url" TEXT;
