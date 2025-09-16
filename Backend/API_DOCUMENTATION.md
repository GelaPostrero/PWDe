v# PWDe Backend API Documentation

## Overview
This document outlines all the backend APIs available in the PWDe platform, including both existing and newly created endpoints.

## Base URL
- Development: `http://localhost:4000`
- API Routes: `http://localhost:4000/api/*`

## Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## API Endpoints

### 1. Job Search & Recommendations (`/api/jobs`)

#### Get All Jobs with Filters
- **GET** `/api/jobs/jobs`
- **Query Parameters:**
  - `category` - Job category filter
  - `location` - Location filter
  - `employmentType` - Employment type filter
  - `workArrangement` - Work arrangement filter
  - `experienceLevel` - Experience level filter
  - `salaryMin`, `salaryMax` - Salary range
  - `skills` - Skills filter (array)
  - `page`, `limit` - Pagination
  - `sortBy`, `sortOrder` - Sorting options

#### Get Job Recommendations
- **GET** `/api/jobs/recommendations`
- Returns AI-powered job recommendations for PWD users

#### Get Job Categories
- **GET** `/api/jobs/categories`
- Returns all available job categories

#### Get Single Job Details
- **GET** `/api/jobs/jobs/:jobId`
- Returns detailed job information with application status

### 2. Applications Management (`/api/applications`)

#### Apply to Job
- **POST** `/api/applications/apply`
- **Body:** `{ jobId, customMessage, proposedSalary, resumeId }`

#### Get User's Applications
- **GET** `/api/applications/my-applications`
- **Query Parameters:** `status`, `page`, `limit`

#### Get Job Applications (Employers)
- **GET** `/api/applications/job/:jobId/applications`
- **Query Parameters:** `status`, `page`, `limit`

#### Update Application Status
- **PUT** `/api/applications/:applicationId/status`
- **Body:** `{ status, message }`

#### Get Application Details
- **GET** `/api/applications/:applicationId`

#### Withdraw Application
- **DELETE** `/api/applications/:applicationId/withdraw`

### 3. Saved Jobs (`/api/saved-jobs`)

#### Save Job
- **POST** `/api/saved-jobs/save`
- **Body:** `{ jobId }`

#### Unsave Job
- **DELETE** `/api/saved-jobs/unsave/:jobId`

#### Get Saved Jobs
- **GET** `/api/saved-jobs/my-saved-jobs`
- **Query Parameters:** `page`, `limit`, `sortBy`, `sortOrder`

#### Check if Job is Saved
- **GET** `/api/saved-jobs/check/:jobId`

#### Get Saved Jobs Count
- **GET** `/api/saved-jobs/count`

#### Bulk Unsave Jobs
- **DELETE** `/api/saved-jobs/bulk-unsave`
- **Body:** `{ jobIds: [] }`

### 4. Messaging System (`/api/messages`)

#### Get Chat Threads
- **GET** `/api/messages/threads`

#### Get Messages for Thread
- **GET** `/api/messages/threads/:threadId/messages`
- **Query Parameters:** `page`, `limit`

#### Send Message
- **POST** `/api/messages/threads/:threadId/messages`
- **Body:** `{ message }`

#### Mark Messages as Read
- **PUT** `/api/messages/threads/:threadId/mark-read`

#### Get Unread Count
- **GET** `/api/messages/unread-count`

#### Create Chat Thread
- **POST** `/api/messages/threads`
- **Body:** `{ applicationId }`

### 5. Resume Management (`/api/resumes`)

#### Upload Resume
- **POST** `/api/resumes/upload`
- **Content-Type:** `multipart/form-data`
- **Body:** Resume file + metadata

#### Get User's Resumes
- **GET** `/api/resumes/my-resumes`

#### Get Resume Details
- **GET** `/api/resumes/:resumeId`

#### Update Resume Details
- **PUT** `/api/resumes/:resumeId`
- **Body:** Resume metadata

#### Update Resume File
- **PUT** `/api/resumes/:resumeId/file`
- **Content-Type:** `multipart/form-data`

#### Delete Resume
- **DELETE** `/api/resumes/:resumeId`

#### Set Default Resume
- **PUT** `/api/resumes/:resumeId/set-default`

#### Get Resume Statistics
- **GET** `/api/resumes/stats`

### 6. Notifications (`/api/notifications`)

#### Get Notifications
- **GET** `/api/notifications`
- **Query Parameters:** `page`, `limit`, `unreadOnly`

#### Get Unread Count
- **GET** `/api/notifications/unread-count`

#### Mark Notification as Read
- **PUT** `/api/notifications/:notificationId/read`

#### Mark All as Read
- **PUT** `/api/notifications/mark-all-read`

#### Delete Notification
- **DELETE** `/api/notifications/:notificationId`

#### Delete All Notifications
- **DELETE** `/api/notifications/delete-all`

#### Get Notification Preferences
- **GET** `/api/notifications/preferences`

#### Update Notification Preferences
- **PUT** `/api/notifications/preferences`
- **Body:** Preference settings

#### Create Notification (Admin)
- **POST** `/api/notifications/create`
- **Body:** `{ user_id, type, title, content }`

#### Get Notification Types
- **GET** `/api/notifications/types`

### 7. Analytics (`/api/analytics`)

#### Get Dashboard Analytics
- **GET** `/api/analytics/dashboard`
- Returns comprehensive dashboard metrics for employers

#### Get Job Performance Analytics
- **GET** `/api/analytics/jobs/:jobId/performance`

#### Get Application Analytics
- **GET** `/api/analytics/applications`
- **Query Parameters:** `period`, `status`

#### Get Candidate Analytics
- **GET** `/api/analytics/candidates`

#### Get Revenue Analytics
- **GET** `/api/analytics/revenue`
- **Query Parameters:** `period`

### 8. Reviews & Ratings (`/api/reviews`)

#### Create Review
- **POST** `/api/reviews/create`
- **Body:** `{ applicationId, revieweeId, revieweeType, rating, comment, isPublic }`

#### Get User Reviews
- **GET** `/api/reviews/user/:userId`
- **Query Parameters:** `userType`, `page`, `limit`

#### Get User's Own Reviews
- **GET** `/api/reviews/my-reviews`
- **Query Parameters:** `page`, `limit`

#### Update Review
- **PUT** `/api/reviews/:reviewId`
- **Body:** `{ rating, comment, isPublic }`

#### Delete Review
- **DELETE** `/api/reviews/:reviewId`

#### Get Rating Statistics
- **GET** `/api/reviews/stats/:userId`
- **Query Parameters:** `userType`

### 9. Transactions (`/api/transactions`)

#### Get User's Transactions
- **GET** `/api/transactions/my-transactions`
- **Query Parameters:** `page`, `limit`, `status`, `type`

#### Create Transaction
- **POST** `/api/transactions/create`
- **Body:** `{ amount, transactionType, paymentMethod, applicationId, description }`

#### Update Transaction Status
- **PUT** `/api/transactions/:transactionId/status`
- **Body:** `{ status, paymentReference }`

#### Get Transaction Details
- **GET** `/api/transactions/:transactionId`

#### Get Transaction Statistics
- **GET** `/api/transactions/stats/summary`
- **Query Parameters:** `period`

#### Create Withdrawal Request
- **POST** `/api/transactions/withdrawal-request`
- **Body:** `{ amount, paymentMethod, accountDetails }`

#### Get Withdrawal Requests
- **GET** `/api/transactions/withdrawal-requests`
- **Query Parameters:** `page`, `limit`, `status`

#### Get Available Balance
- **GET** `/api/transactions/balance`

### 10. AI Matching (`/api/ai-matching`)

#### Generate AI Matches
- **POST** `/api/ai-matching/generate-matches`
- Generates AI-powered job matches for PWD users

#### Get AI Matches
- **GET** `/api/ai-matching/my-matches`
- **Query Parameters:** `page`, `limit`, `minScore`

#### Get Match Details
- **GET** `/api/ai-matching/matches/:matchId`

#### Get Match Statistics
- **GET** `/api/ai-matching/stats`

## Existing Endpoints (Legacy)

### Authentication (`/accounts`)
- **POST** `/accounts/users/register/pwd` - PWD registration
- **POST** `/accounts/users/register/employer` - Employer registration
- **POST** `/accounts/users/login` - User login
- **POST** `/accounts/users/forgot-password` - Forgot password
- **POST** `/accounts/users/reset-password` - Reset password

### User Management (`/retrieve`)
- **GET** `/retrieve/verify` - Verify token
- **GET** `/retrieve/header` - Get header data
- **GET** `/retrieve/dashboard` - Get dashboard data
- **GET** `/retrieve/profile` - Get profile data
- **PUT** `/retrieve/update/basic-information` - Update basic info

### Job Management (`/create`, `/job`)
- **POST** `/create/basic-information` - Create job basic info
- **POST** `/create/jobdetail-requirements` - Create job details
- **POST** `/create/accessibility-inclusionfeatures` - Create accessibility features
- **GET** `/create/review` - Get job review data
- **POST** `/create/publish` - Publish job
- **GET** `/job/all` - Get all jobs for employer
- **GET** `/job/:jobId/posted` - Get specific job
- **DELETE** `/job/:jobId/delete` - Delete job

### Onboarding (`/onboard`)
- **POST** `/onboard/pwd/onboard/assessment` - PWD skills assessment
- **POST** `/onboard/pwd/onboard/education` - PWD education
- **POST** `/onboard/pwd/onboard/work-experience` - PWD work experience
- **POST** `/onboard/pwd/onboard/accessibility-needs` - PWD accessibility needs
- **POST** `/onboard/pwd/onboard/job-preferences` - PWD job preferences
- **POST** `/onboard/pwd/complete-profile` - Complete PWD profile

## Response Format

All API responses follow this format:
```json
{
  "success": true|false,
  "message": "Response message",
  "data": { ... },
  "pagination": { ... } // For paginated responses
}
```

## Error Handling

- **400** - Bad Request (validation errors)
- **401** - Unauthorized (invalid/missing token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **500** - Internal Server Error

## File Uploads

File uploads are handled via `multipart/form-data`:
- Resume files: PDF, DOC, DOCX (max 5MB)
- Profile pictures: JPG, PNG (max 2MB)
- Document uploads: Various formats (max 5MB)

## Database Schema

The APIs are built on top of the ERD schema with the following main entities:
- `users` - User accounts
- `pwd_profiles` - PWD user profiles
- `employer_profiles` - Employer profiles
- `job_listings` - Job postings
- `applications` - Job applications
- `resumes` - Resume documents
- `chat_threads` & `chat_messages` - Messaging system
- `transactions` - Payment transactions
- `reviews` - User reviews and ratings
- `notifications` - System notifications
- `ai_match_results` - AI job matching results
- `saved_jobs` - Saved job listings
- `withdrawal_requests` - PWD withdrawal requests

## Rate Limiting

Currently no rate limiting is implemented, but it's recommended for production use.

## CORS

CORS is configured to allow requests from `http://localhost:5173` (frontend development server).
