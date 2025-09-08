/*
  Warnings:

  - You are about to alter the column `first_name` on the `Pwd_Profile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `last_name` on the `Pwd_Profile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `middle_name` on the `Pwd_Profile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.

*/
-- AlterTable
ALTER TABLE "public"."Pwd_Profile" ALTER COLUMN "first_name" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "last_name" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "middle_name" SET DATA TYPE VARCHAR(20);
