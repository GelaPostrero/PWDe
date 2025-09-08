-- DropForeignKey
ALTER TABLE "public"."Pwd_Accessibility_Needs" DROP CONSTRAINT "Pwd_Accessibility_Needs_pwd_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Pwd_Education" DROP CONSTRAINT "Pwd_Education_pwd_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Pwd_Experience" DROP CONSTRAINT "Pwd_Experience_pwd_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Pwd_Job_Preferences_Requirements" DROP CONSTRAINT "Pwd_Job_Preferences_Requirements_pwd_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."Pwd_Experience" ADD CONSTRAINT "Pwd_Experience_pwd_id_fkey" FOREIGN KEY ("pwd_id") REFERENCES "public"."Pwd_Profile"("pwd_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pwd_Accessibility_Needs" ADD CONSTRAINT "Pwd_Accessibility_Needs_pwd_id_fkey" FOREIGN KEY ("pwd_id") REFERENCES "public"."Pwd_Profile"("pwd_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pwd_Education" ADD CONSTRAINT "Pwd_Education_pwd_id_fkey" FOREIGN KEY ("pwd_id") REFERENCES "public"."Pwd_Profile"("pwd_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pwd_Job_Preferences_Requirements" ADD CONSTRAINT "Pwd_Job_Preferences_Requirements_pwd_id_fkey" FOREIGN KEY ("pwd_id") REFERENCES "public"."Pwd_Profile"("pwd_id") ON DELETE CASCADE ON UPDATE CASCADE;
