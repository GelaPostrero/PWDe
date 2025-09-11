/*
  Warnings:

  - You are about to drop the column `saved_jobs` on the `Pwd_Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Pwd_Profile" DROP COLUMN "saved_jobs";

-- CreateTable
CREATE TABLE "public"."Saved_Jobs" (
    "savedJob_id" SERIAL NOT NULL,
    "job_id" INTEGER NOT NULL,
    "pwd_id" INTEGER NOT NULL,

    CONSTRAINT "Saved_Jobs_pkey" PRIMARY KEY ("savedJob_id")
);

-- AddForeignKey
ALTER TABLE "public"."Saved_Jobs" ADD CONSTRAINT "Saved_Jobs_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."Job_Listings"("job_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Saved_Jobs" ADD CONSTRAINT "Saved_Jobs_pwd_id_fkey" FOREIGN KEY ("pwd_id") REFERENCES "public"."Pwd_Profile"("pwd_id") ON DELETE CASCADE ON UPDATE CASCADE;
