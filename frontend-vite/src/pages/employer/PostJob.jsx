import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../utils/api.js';
import EmployerHeader from '../../components/ui/EmployerHeader.jsx';
import Footer from '../../components/ui/Footer.jsx';
import Chatbot from '../../components/ui/Chatbot.jsx';
import EmployerStepper from '../../components/ui/EmployerStepper.jsx';
import BasicInformation from './PostJobSteps/BasicInformation.jsx';
import JobDetails from './PostJobSteps/JobDetails.jsx';
import AccessibilityFeatures from './PostJobSteps/AccessibilityFeatures.jsx';
import ReviewPublish from './PostJobSteps/ReviewPublish.jsx';

const PostJob = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [jobData, setJobData] = useState({
    // Basic Information
    jobTitle: '',
    jobCategory: '',
    employmentType: '',
    workArrangement: '',
    city: '',
    province: '',
    country: '',
    salaryType: '',
    minimumSalary: 0,
    maximumSalary: 0,
    experienceLevel: '',
    
    // Job Details
    jobDescription: '',
    requiredSkills: [],
    applicationDeadline: '',
    
    // Accessibility Features
    accessibilityFeatures: [],
    
    // Review Data
    companyName: 'TechCorp Solutions Inc.',
    companyLocation: 'Cebu City, Cebu, Philippines'
  });

  const steps = [
    'Basic Information',
    'Job Details & Requirements',
    'Accessibility Features',
    'Review and Publish'
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDataChange = (stepData) => {
    setJobData(prev => ({ ...prev, ...stepData }));
  };

  const handlePublish = async () => {
    try {
      const response = await api.post('/create/publish');
      
      if(response.data.success) {
        const newJobId = response.data.job.job_id;
        Swal.fire({
          icon: 'success',
          title: 'New job successfully published.',
          toast: true,
          position: 'bottom-end',
          timer: 3500,
          showConfirmButton: false
        })
        // Navigate to posted job view
        navigate(`/employer/job/${newJobId}/posted`);
      }
    } catch (error) {
      console.error('Error publishing job:', error);
      alert('Failed to publish job. Please try again.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInformation
            data={jobData}
            onDataChange={handleDataChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <JobDetails
            data={jobData}
            onDataChange={handleDataChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <AccessibilityFeatures
            data={jobData}
            onDataChange={handleDataChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <ReviewPublish
            data={jobData}
            onDataChange={handleDataChange}
            onPublish={handlePublish}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <EmployerHeader disabled={false} />

      {/* Main Content */}
      <main className="flex-1 py-4 sm:py-6 lg:py-8">
        <div className="mx-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16">
          
          {/* Page Header */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Create a New Job Posting</h1>
            <p className="text-gray-600">Fill in the details below to create an accessible and inclusive job posting</p>
          </div>

          {/* Progress Stepper */}
          <EmployerStepper currentStep={currentStep} steps={steps} />

          {/* Step Content */}
          {renderStep()}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* AI Chatbot */}
      <Chatbot 
        position="right" 
        showNotification={true} 
        notificationCount={3}
      />
    </div>
  );
};

export default PostJob;
