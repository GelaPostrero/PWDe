/*
  Warnings:

  - Added the required column `location` to the `Pwd_Education` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Pwd_Education" ADD COLUMN     "location" TEXT NOT NULL;
