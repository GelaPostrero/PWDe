import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GuestRoute from './utils/GuestRoute.jsx';
import ProtectedRoute from './utils/ProtectedRoute.jsx'

import Landing from './pages/public/Landing';
import SignIn from './pages/public/SignIn.jsx';
import ChooseUser from './pages/public/ChooseUser.jsx';
import JobseekerSignUp from './pages/public/jobseeker/JobseekerSignUp.jsx';
import EmployerSignUp from './pages/public/employer/EmployerSignUp.jsx';
import JobseekerVerification from './pages/public/jobseeker/JobseekerVerification.jsx';
import JobseekerActivation from './pages/public/jobseeker/JobseekerActivation.jsx';
import JobseekerOnboardingSkills from './pages/public/jobseeker/JobseekerOnboardingSkills.jsx';
import JobseekerOnboardingEducation from './pages/public/jobseeker/JobseekerOnboardingEducation.jsx';
import JobseekerOnboardingExperience from './pages/public/jobseeker/JobseekerOnboardingExperience.jsx';
import JobseekerOnboardingAccessibility from './pages/public/jobseeker/JobseekerOnboardingAccessibility.jsx';
import JobseekerOnboardingPreferences from './pages/public/jobseeker/JobseekerOnboardingPreferences.jsx';
import JobseekerOnboardingCompletion from './pages/public/jobseeker/JobseekerOnboardingCompletion.jsx';

// Employer verification and activation components
import EmployerVerification from './pages/public/employer/EmployerVerification.jsx';
import EmployerActivation from './pages/public/employer/EmployerActivation.jsx';

// Employer onboarding components
import EmployerOnboardingSkills from './pages/public/employer/EmployerOnboardingSkills.jsx';
import EmployerOnboardingEducation from './pages/public/employer/EmployerOnboardingEducation.jsx';
import EmployerOnboardingCompletion from './pages/public/employer/EmployerOnboardingCompletion.jsx';

// Dashboard components
import EmployerDashboard from './pages/employer/EmployerDashboard.jsx';
import EmployerJob from './pages/employer/EmployerJob.jsx';
import PostJob from './pages/employer/PostJob.jsx';
import PostedJobView from './pages/employer/PostedJobView.jsx';
import ApplicationView from './pages/employer/ApplicationView.jsx';
import Analytics from './pages/employer/Analytics.jsx';
import EmployerTransactions from './pages/employer/EmployerTransactions.jsx';
import EmployerResources from './pages/employer/EmployerResources.jsx';
import EmployerMessages from './pages/employer/EmployerMessages.jsx';
import JobseekerDashboard from './pages/jobseeker/JobseekerDashboard.jsx';
import JobDetails from './pages/jobseeker/JobDetails.jsx';
import Resume from './pages/jobseeker/Resume.jsx';
import JobRecommendations from './pages/jobseeker/JobRecommendations.jsx';
import SavedJobs from './pages/jobseeker/SavedJobs.jsx';
import AppliedJobs from './pages/jobseeker/AppliedJobs.jsx';
import Applications from './pages/jobseeker/Applications.jsx';
import SubmitApplication from './pages/jobseeker/SubmitApplication.jsx';
import Transactions from './pages/jobseeker/Transactions.jsx';
import Resources from './pages/jobseeker/Resources.jsx';
import Messages from './pages/jobseeker/Messages.jsx';
import JobseekerProfile from './pages/jobseeker/JobseekerProfile.jsx';
import JobseekerAccountSettings from './pages/jobseeker/JobseekerAccountSettings.jsx';
import ForgotPassword from './pages/public/ForgotPassword.jsx';
//import ResumeBuilder from './pages/jobseeker/ResumeBuilder.jsx';


import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/dashboard" element={<JobseekerDashboard />} />
        <Route 
          path="/signin" 
          element={
            <GuestRoute>
              <SignIn />
            </GuestRoute>
          } 
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/chooseuser" element={<ChooseUser />} />
        <Route path="/signup/jobseeker" element={<JobseekerSignUp />} />
        <Route path="/signup/employer" element={<EmployerSignUp />} />
        <Route path="/signup/jobseeker/verification" element={<JobseekerVerification />} />
        <Route path="/signup/jobseeker/activation" element={<JobseekerActivation />} />
        <Route path="/employer/verification" element={<EmployerVerification />} />
        <Route path="/employer/activation" element={<EmployerActivation />} />
        
        {
        /* Protected Routes must be inside a route with an element protected route to 
        secure pages that has expiredToken or invalidToken from users trying direct open page */
        }
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding/jobseeker/skills" element={<JobseekerOnboardingSkills />} />
          <Route path="/onboarding/jobseeker/education" element={<JobseekerOnboardingEducation />} />
          <Route path="/onboarding/jobseeker/experience" element={<JobseekerOnboardingExperience />} />
          <Route path="/onboarding/jobseeker/accessibility" element={<JobseekerOnboardingAccessibility />} />
          <Route path="/onboarding/jobseeker/preferences" element={<JobseekerOnboardingPreferences />} />
          <Route path="/onboarding/jobseeker/completion" element={<JobseekerOnboardingCompletion />} />
          
          {/* Employer onboarding routes (kept for future use) */}
          <Route path="/onboarding/employer/skills" element={<EmployerOnboardingSkills />} />
          <Route path="/onboarding/employer/education" element={<EmployerOnboardingEducation />} />
          <Route path="/onboarding/employer/completion" element={<EmployerOnboardingCompletion />} />
          
          {/* Dashboard routes */}
          <Route path="/jobseeker/dashboard" element={<JobseekerDashboard />} />
          <Route path="/jobseeker/job/:jobId" element={<JobDetails />} />
          <Route path="/find-job" element={<JobRecommendations />} />
          <Route path="/find-job/recommended" element={<JobRecommendations />} />
          <Route path="/find-job/saved" element={<SavedJobs />} />
          <Route path="/jobseeker/saved-jobs" element={<SavedJobs />} />
          <Route path="/find-job/applied" element={<Applications />} />
          <Route path="/jobseeker/applications" element={<Applications />} />
          <Route path="/jobseeker/submit-application/:jobId" element={<SubmitApplication />} />
          
          {/* Employer routes */}
          <Route path="/employer/dashboard" element={<EmployerDashboard />} />
          <Route path="/employer/jobs" element={<EmployerJob />} />
          <Route path="/employer/post-job" element={<PostJob />} />
          <Route path="/employer/job/:jobId" element={<EmployerJob />} />
          <Route path="/employer/job/:jobId/posted" element={<PostedJobView />} />
          <Route path="/employer/job/:jobId/application/:applicantId" element={<ApplicationView />} />
          <Route path="/employer/analytics" element={<Analytics />} />
          <Route path="/employer/transactions" element={<EmployerTransactions />} />
          <Route path="/employer/resources" element={<EmployerResources />} />
        <Route path="/employer/applications" element={<EmployerDashboard />} />
          <Route path="/employer/applicant/:applicantId" element={<EmployerDashboard />} />
          <Route path="/employer/candidates" element={<EmployerDashboard />} />
          <Route path="/employer/messages" element={<EmployerMessages />} />
          <Route path="/employer/profile" element={<EmployerDashboard />} />
          <Route path="/employer/transactions" element={<EmployerTransactions />} />
          
          {/* Additional jobseeker routes */}
          <Route path="/resume" element={<Resume />} />
        {/*<Route path="/resume-builder" element={<ResumeBuilder />} />*/}
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/jobseeker/profile" element={<JobseekerProfile />} />
          <Route path="/jobseeker/account-settings" element={<JobseekerAccountSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
