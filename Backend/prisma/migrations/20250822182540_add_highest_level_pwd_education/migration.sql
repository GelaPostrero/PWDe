-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('PWD', 'Employer', 'Administrator');

-- CreateEnum
CREATE TYPE "public"."AccountStatus" AS ENUM ('Active', 'Inactive', 'Suspended', 'Deleted');

-- CreateEnum
CREATE TYPE "public"."Disability_Severity" AS ENUM ('Mild', 'Moderate', 'Severe');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('Male', 'Female', 'Other');

-- CreateEnum
CREATE TYPE "public"."EmploymentType" AS ENUM ('Full_time', 'Part_time', 'Contract', 'Freelance', 'Internship');

-- CreateEnum
CREATE TYPE "public"."WorkArrangement" AS ENUM ('On_site', 'Remote', 'Hybrid');

-- CreateEnum
CREATE TYPE "public"."SalaryType" AS ENUM ('Hourly', 'Daily', 'Monthly', 'Annually', 'Milestone_based');

-- CreateEnum
CREATE TYPE "public"."ExperienceLevel" AS ENUM ('Entry', 'Mid', 'Senior', 'Executive');

-- CreateEnum
CREATE TYPE "public"."TicketCategory" AS ENUM ('Technical', 'Account', 'Payment', 'Discrimination', 'Accessibility', 'Other');

-- CreateEnum
CREATE TYPE "public"."TicketPriority" AS ENUM ('Low', 'Medium', 'High', 'Urgent');

-- CreateEnum
CREATE TYPE "public"."TicketStatus" AS ENUM ('Open', 'In_Progress', 'Resolved', 'Closed');

-- CreateEnum
CREATE TYPE "public"."TargetAudience" AS ENUM ('PWD', 'Employer', 'All');

-- CreateEnum
CREATE TYPE "public"."WithdrawalStatus" AS ENUM ('Pending', 'Approved', 'Rejected', 'Processed');

-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('Payment', 'Withdrawal', 'Refund', 'Fee');

-- CreateEnum
CREATE TYPE "public"."TransactionStatus" AS ENUM ('Pending', 'Completed', 'Failed', 'Cancelled');

-- CreateEnum
CREATE TYPE "public"."ReviewerType" AS ENUM ('Employer', 'Job_Seeker');

-- CreateTable
CREATE TABLE "public"."Users" (
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "user_type" "public"."UserType" NOT NULL,
    "account_status" "public"."AccountStatus" NOT NULL DEFAULT 'Active',
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "user_id" SERIAL NOT NULL,
    "created_at" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."Pwd_Profile" (
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "middle_name" TEXT NOT NULL,
    "profile_picture" TEXT,
    "bio" TEXT,
    "disability_Type" TEXT,
    "disability_severity" "public"."Disability_Severity",
    "gender" "public"."Gender" NOT NULL,
    "rating" DOUBLE PRECISION DEFAULT 0.0,
    "created_at" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3),
    "pwd_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "pwd_document" TEXT[],
    "profession" TEXT,
    "skills" TEXT[],
    "portfolio_links" TEXT[],
    "professional_role" TEXT NOT NULL,
    "professional_summary" TEXT NOT NULL,
    "profile_visibility" TEXT DEFAULT 'Public',
    "resume_cv" TEXT,

    CONSTRAINT "Pwd_Profile_pkey" PRIMARY KEY ("pwd_id")
);

-- CreateTable
CREATE TABLE "public"."Pwd_Experience" (
    "id" SERIAL NOT NULL,
    "pwd_id" INTEGER NOT NULL,
    "company" TEXT NOT NULL,
    "job_title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "currently_working_on_this_role" BOOLEAN NOT NULL DEFAULT false,
    "start_date" TEXT NOT NULL,
    "end_date" TEXT NOT NULL,
    "employment_type" TEXT,
    "description" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pwd_Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pwd_Accessibility_Needs" (
    "id" SERIAL NOT NULL,
    "pwd_id" INTEGER NOT NULL,
    "visual_support" TEXT[],
    "hearing_support" TEXT[],
    "mobility_support" TEXT[],
    "cognitive_support" TEXT[],
    "additional_information" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pwd_Accessibility_Needs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pwd_Education" (
    "id" SERIAL NOT NULL,
    "pwd_id" INTEGER NOT NULL,
    "highest_level" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "field_of_study" TEXT NOT NULL,
    "graduation_details" TEXT,
    "year_graduated" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pwd_Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pwd_Job_Preferences_Requirements" (
    "id" SERIAL NOT NULL,
    "pwd_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "employment_types" TEXT[],
    "experience_level" TEXT,
    "salary_range" TEXT[],
    "work_arrangement" TEXT,

    CONSTRAINT "Pwd_Job_Preferences_Requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Employer_Profile" (
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "created_at" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "employer_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "middle_name" TEXT NOT NULL,
    "profile_picture" TEXT,
    "LinkedIn_profile" TEXT,
    "Other_Social_Media" TEXT,
    "company_website" TEXT,
    "contact_person_fullname" TEXT,
    "contact_person_job_title" TEXT,
    "contact_person_phone_number" TEXT,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "business_registration_document" TEXT[],
    "contact_person_identity_verification" TEXT,

    CONSTRAINT "Employer_Profile_pkey" PRIMARY KEY ("employer_id")
);

-- CreateTable
CREATE TABLE "public"."Resumes" (
    "resume_id" SERIAL NOT NULL,
    "pwd_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "summary" TEXT NOT NULL,
    "skills" TEXT NOT NULL,
    "work_experience" TEXT NOT NULL,
    "education" TEXT NOT NULL,
    "certifications" TEXT NOT NULL,
    "achievements" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resumes_pkey" PRIMARY KEY ("resume_id")
);

-- CreateTable
CREATE TABLE "public"."Chat_Thread" (
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "application_id" INTEGER NOT NULL,
    "employer_id" INTEGER NOT NULL,
    "pwd_id" INTEGER NOT NULL,
    "thread_id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chat_Thread_pkey" PRIMARY KEY ("thread_id")
);

-- CreateTable
CREATE TABLE "public"."Chat_Message" (
    "content" TEXT NOT NULL,
    "message_id" SERIAL NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "thread_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chat_Message_pkey" PRIMARY KEY ("message_id")
);

-- CreateTable
CREATE TABLE "public"."withdrawal_requests" (
    "withdrawal_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "payment_method" VARCHAR(50) NOT NULL,
    "status" "public"."WithdrawalStatus" NOT NULL,
    "requested_at" TIMESTAMP(3) NOT NULL,
    "processed_at" TIMESTAMP(3) NOT NULL,
    "processed_by" INTEGER NOT NULL,

    CONSTRAINT "withdrawal_requests_pkey" PRIMARY KEY ("withdrawal_id")
);

-- CreateTable
CREATE TABLE "public"."Applications" (
    "application_id" SERIAL NOT NULL,
    "job_id" INTEGER NOT NULL,
    "pwd_id" INTEGER NOT NULL,
    "resume_id" INTEGER NOT NULL,
    "custom_message" TEXT NOT NULL,
    "proposed_salary" DECIMAL(10,2) NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status_changed_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Applications_pkey" PRIMARY KEY ("application_id")
);

-- CreateTable
CREATE TABLE "public"."reviews" (
    "review_id" SERIAL NOT NULL,
    "reviewer_id" INTEGER NOT NULL,
    "reviewee_id" INTEGER NOT NULL,
    "application_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "reviewer_type" "public"."ReviewerType" NOT NULL,
    "is_public" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("review_id")
);

-- CreateTable
CREATE TABLE "public"."transactions" (
    "transaction_id" SERIAL NOT NULL,
    "payer_id" INTEGER NOT NULL,
    "payee_id" INTEGER NOT NULL,
    "application_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "payment_method" VARCHAR(50) NOT NULL,
    "transaction_type" "public"."TransactionType" NOT NULL,
    "status" "public"."TransactionStatus" NOT NULL,
    "reference_number" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "public"."Notifications" (
    "notification_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read_at" TIMESTAMP(3),

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "public"."Job_Categories" (
    "category_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Job_Categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "public"."Job_Listings" (
    "job_id" SERIAL NOT NULL,
    "employer_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "skills_required" TEXT NOT NULL,
    "employment_type" "public"."EmploymentType" NOT NULL,
    "work_arrangement" "public"."WorkArrangement" NOT NULL,
    "salary_min" DECIMAL(10,2) NOT NULL,
    "salary_max" DECIMAL(10,2) NOT NULL,
    "salary_type" "public"."SalaryType" NOT NULL,
    "location_city" VARCHAR(100) NOT NULL,
    "location_province" VARCHAR(100) NOT NULL,
    "location_country" VARCHAR(100) NOT NULL,
    "accessibility_features" TEXT NOT NULL,
    "experience_level" "public"."ExperienceLevel" NOT NULL,
    "application_deadline" DATE NOT NULL,
    "applications_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_Listings_pkey" PRIMARY KEY ("job_id")
);

-- CreateTable
CREATE TABLE "public"."support_tickets" (
    "ticket_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "subject" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "category" "public"."TicketCategory" NOT NULL,
    "priority" "public"."TicketPriority" NOT NULL,
    "status" "public"."TicketStatus" NOT NULL,
    "assigned_to" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("ticket_id")
);

-- CreateTable
CREATE TABLE "public"."resources" (
    "resource_id" SERIAL NOT NULL,
    "created_by" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "resource_type" VARCHAR(100) NOT NULL,
    "file_path" TEXT NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "target_audience" "public"."TargetAudience" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("resource_id")
);

-- CreateTable
CREATE TABLE "public"."ai_match_results" (
    "match_id" SERIAL NOT NULL,
    "job_id" INTEGER NOT NULL,
    "pwd_id" INTEGER NOT NULL,
    "overall_score" DOUBLE PRECISION NOT NULL,
    "skills_match_score" DOUBLE PRECISION NOT NULL,
    "experience_match_score" DOUBLE PRECISION NOT NULL,
    "location_match_score" DOUBLE PRECISION NOT NULL,
    "accessibility_match_score" DOUBLE PRECISION NOT NULL,
    "matched_on" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_match_results_pkey" PRIMARY KEY ("match_id")
);

-- CreateTable
CREATE TABLE "public"."chatbot_logs" (
    "log_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chatbot_logs_pkey" PRIMARY KEY ("log_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "public"."Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_phone_number_key" ON "public"."Users"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "Pwd_Profile_user_id_key" ON "public"."Pwd_Profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Pwd_Accessibility_Needs_pwd_id_key" ON "public"."Pwd_Accessibility_Needs"("pwd_id");

-- CreateIndex
CREATE UNIQUE INDEX "Pwd_Job_Preferences_Requirements_pwd_id_key" ON "public"."Pwd_Job_Preferences_Requirements"("pwd_id");

-- CreateIndex
CREATE UNIQUE INDEX "Employer_Profile_user_id_key" ON "public"."Employer_Profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Job_Categories_name_key" ON "public"."Job_Categories"("name");

-- AddForeignKey
ALTER TABLE "public"."Pwd_Profile" ADD CONSTRAINT "Pwd_Profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pwd_Experience" ADD CONSTRAINT "Pwd_Experience_pwd_id_fkey" FOREIGN KEY ("pwd_id") REFERENCES "public"."Pwd_Profile"("pwd_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pwd_Accessibility_Needs" ADD CONSTRAINT "Pwd_Accessibility_Needs_pwd_id_fkey" FOREIGN KEY ("pwd_id") REFERENCES "public"."Pwd_Profile"("pwd_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pwd_Education" ADD CONSTRAINT "Pwd_Education_pwd_id_fkey" FOREIGN KEY ("pwd_id") REFERENCES "public"."Pwd_Profile"("pwd_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pwd_Job_Preferences_Requirements" ADD CONSTRAINT "Pwd_Job_Preferences_Requirements_pwd_id_fkey" FOREIGN KEY ("pwd_id") REFERENCES "public"."Pwd_Profile"("pwd_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Employer_Profile" ADD CONSTRAINT "Employer_Profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Resumes" ADD CONSTRAINT "Resumes_pwd_id_fkey" FOREIGN KEY ("pwd_id") REFERENCES "public"."Pwd_Profile"("pwd_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Chat_Message" ADD CONSTRAINT "Chat_Message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Chat_Message" ADD CONSTRAINT "Chat_Message_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "public"."Chat_Thread"("thread_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."withdrawal_requests" ADD CONSTRAINT "withdrawal_requests_processed_by_fkey" FOREIGN KEY ("processed_by") REFERENCES "public"."Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."withdrawal_requests" ADD CONSTRAINT "withdrawal_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Applications" ADD CONSTRAINT "Applications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."Job_Listings"("job_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Applications" ADD CONSTRAINT "Applications_pwd_id_fkey" FOREIGN KEY ("pwd_id") REFERENCES "public"."Pwd_Profile"("pwd_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Applications" ADD CONSTRAINT "Applications_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "public"."Resumes"("resume_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "public"."Applications"("application_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_reviewee_id_fkey" FOREIGN KEY ("reviewee_id") REFERENCES "public"."Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "public"."Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "public"."Applications"("application_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_payee_id_fkey" FOREIGN KEY ("payee_id") REFERENCES "public"."Pwd_Profile"("pwd_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_payer_id_fkey" FOREIGN KEY ("payer_id") REFERENCES "public"."Employer_Profile"("employer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notifications" ADD CONSTRAINT "Notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Job_Listings" ADD CONSTRAINT "Job_Listings_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."Job_Categories"("category_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Job_Listings" ADD CONSTRAINT "Job_Listings_employer_id_fkey" FOREIGN KEY ("employer_id") REFERENCES "public"."Employer_Profile"("employer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."support_tickets" ADD CONSTRAINT "support_tickets_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "public"."Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."support_tickets" ADD CONSTRAINT "support_tickets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."resources" ADD CONSTRAINT "resources_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ai_match_results" ADD CONSTRAINT "ai_match_results_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."Job_Listings"("job_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ai_match_results" ADD CONSTRAINT "ai_match_results_pwd_id_fkey" FOREIGN KEY ("pwd_id") REFERENCES "public"."Pwd_Profile"("pwd_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chatbot_logs" ADD CONSTRAINT "chatbot_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
