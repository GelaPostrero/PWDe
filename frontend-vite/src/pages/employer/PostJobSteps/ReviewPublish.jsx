import React, { useState } from 'react';
import Spinner from '../../../components/ui/Spinner.jsx';

const ReviewPublish = ({ data, onDataChange, onPublish, onBack }) => {
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  const formatSalary = () => {
    if (data.minimumSalary && data.maximumSalary && data.salaryType) {
      return `$${data.minimumSalary.toLocaleString()} - $${data.maximumSalary.toLocaleString()} CAD / ${data.salaryType.toLowerCase()}`;
    }
    return 'Not specified';
  };

  const handlePublish = async () => {
    setIsLoading(true);
    
    // Add minimum loading time to see spinner (remove this in production)
    const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      await minLoadingTime;
      onPublish();
    } catch (error) {
      console.error('Error publishing job:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatLocation = () => {
    const parts = [data.city, data.province, data.country].filter(Boolean);
    return parts.join(', ') || 'Not specified';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review and Publish</h2>
        <p className="text-gray-600">Review your job posting details before publishing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Job Description */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Title and Company */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.jobTitle || 'Job Title'}</h1>
            <div className="flex items-center text-gray-600 mb-4">
              <span className="font-medium">{data.companyName}</span>
              <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{formatLocation()}</span>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
            <div className="prose max-w-none">
              {data.jobDescription ? (
                <p className="text-gray-700 leading-relaxed">{data.jobDescription}</p>
              ) : (
                <p className="text-gray-500 italic">No job description provided</p>
              )}
            </div>
          </div>

          {/* Key Responsibilities */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Responsibilities</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Develop and maintain web applications using modern technologies
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Implement accessibility features following WCAG 2.1 AA standards
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Collaborate with UX/UI designers to create inclusive user experiences
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Participate in code reviews and maintain coding standards
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Mentor junior developers and contribute to team knowledge sharing
              </li>
            </ul>
          </div>

          {/* Required Skills */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {data.requiredSkills && data.requiredSkills.length > 0 ? (
                data.requiredSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {skill.name}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 italic">No skills specified</span>
              )}
            </div>
          </div>

          {/* Accessibility Features */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Accessibility Features & Accommodations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.accessibilityFeatures && data.accessibilityFeatures.length > 0 ? (
                data.accessibilityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))
              ) : (
                <span className="text-gray-500 italic">No accessibility features specified</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Job Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Summary</h3>
            
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-600">Job Category:</span>
                <p className="text-gray-900">{data.jobCategory || 'Not specified'}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-600">Employment Type:</span>
                <p className="text-gray-900">{data.employmentType || 'Not specified'}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-600">Work Arrangement:</span>
                <p className="text-gray-900">{data.workArrangement || 'Not specified'}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-600">Location:</span>
                <p className="text-gray-900">{formatLocation()}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-600">Experience Level:</span>
                <p className="text-gray-900">{data.experienceLevel || 'Not specified'}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-600">Salary Range:</span>
                <p className="text-gray-900 font-semibold">{formatSalary()}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-600">Application Deadline:</span>
                <p className="text-red-600 font-semibold">
                  {data.applicationDeadline || 'Not specified'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          disabled={isLoading}
          className={`px-6 py-3 border border-gray-300 rounded-lg transition-colors ${
            isLoading 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          ← Back
        </button>
        <button
          onClick={handlePublish}
          disabled={isLoading}
          className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 ${
            isLoading
              ? 'bg-gray-400 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isLoading ? (
            <>
              <Spinner size="sm" color="white" />
              <span>Publishing...</span>
            </>
          ) : (
            'Publish Job →'
          )}
        </button>
      </div>
    </div>
  );
};

export default ReviewPublish;
