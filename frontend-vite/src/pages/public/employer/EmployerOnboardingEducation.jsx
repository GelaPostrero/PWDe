import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import EmployerHeader from '../../../components/ui/EmployerHeader.jsx';

const EmployerOnboardingEducation = () => {
  const navigate = useNavigate();
  const [workArrangement, setWorkArrangement] = useState(['Remote']);
  const [selectedAccessibilityFeatures, setSelectedAccessibilityFeatures] = useState([
    'Wheelchair accessible facilities',
    'Screen reader compatible systems',
    'Assistive technology support'
  ]);

  const workArrangementOptions = [
    { key: 'remote', label: 'Remote' },
    { key: 'hybrid', label: 'Hybrid' },
    { key: 'onsite', label: 'On-site' }
  ];

  const accessibilityFeatures = [
    { name: 'Wheelchair accessible facilities', category: 'Physical' },
    { name: 'Screen reader compatible systems', category: 'Technology' },
    { name: 'Assistive technology support', category: 'Technology' },
    { name: 'Flexible work arrangements', category: 'Policy' },
  ];

  const handleWorkArrangementToggle = (option) => {
    if (workArrangement.includes(option.label)) {
      setWorkArrangement(workArrangement.filter(arr => arr !== option.label));
    } else {
      setWorkArrangement([...workArrangement, option.label]);
    }
  };

  const handleAccessibilityFeatureToggle = (feature) => {
    if (selectedAccessibilityFeatures.includes(feature.name)) {
      setSelectedAccessibilityFeatures(selectedAccessibilityFeatures.filter(f => f !== feature.name));
    } else {
      setSelectedAccessibilityFeatures([...selectedAccessibilityFeatures, feature.name]);
    }
  };

  const removeAccessibilityFeature = (feature) => {
    setSelectedAccessibilityFeatures(selectedAccessibilityFeatures.filter(f => f !== feature));
  };

  const handleNext = async () => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    console.log(`Work Arrangement: ${workArrangement} \nAccessbility Feature: ${selectedAccessibilityFeatures}`)
    try {
      var url = "http://localhost:4000/onboard/emp/onboard/work-environment";
      var headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({workArrangement, selectedAccessibilityFeatures})
      });

      const data = await response.json();
      if(data.success) {
        Swal.fire({
          icon: 'success',
          html: '<h5><b>Work Environment</b></h5>\n<h6>You may now fillup your Company Profile.</h6>',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          toast: true,
          position: 'bottom-end'
        })
        navigate('/onboarding/employer/completion');
      }
    } catch (error) {
      console.error('Server error.', error);
    }
  };

  const handleBack = () => {
    navigate('/onboarding/employer/skills');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <EmployerHeader disabled={true} />

      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-6">
          {/* Welcome Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2">
              Welcome to PWDe: AI-Powered Job Matching Platform
            </h1>
            <p className="text-center text-gray-600 mb-4">
              Help us understand the skills and preferences you required to match our job seekers the perfect job opportunities tailored for them.
            </p>
            <div className="text-center">
              <div className="inline-block bg-blue-50 border border-blue-100 px-4 py-2 rounded-lg text-sm text-blue-700">
                Our AI analyzes your profile to match you with job seekers.
              </div>
            </div>
          </div>

          {/* Progress Stepper */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                </div>
                <span className="ml-2 text-green-600 font-medium">Job Roles & Requirements</span>
              </div>
              <div className="w-16 h-0.5 bg-green-500"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">2</div>
                <span className="ml-2 text-blue-600 font-medium">Work Environment</span>
              </div>
              <div className="w-16 h-0.5 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 font-semibold">3</div>
                <span className="ml-2 text-gray-500 font-medium">Complete Company Profile</span>
              </div>
            </div>
          </div>

          {/* Work Environment Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Work Environment</h2>
            <p className="text-gray-600 mb-8">Define Your Hiring Needs</p>

            {/* Work Arrangement */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Work Arrangement</h3>
              <p className="text-sm text-gray-600 mb-4">Define the work arrangement. Select all applicable options.</p>
              <div className="grid grid-cols-3 gap-4">
                {workArrangementOptions.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => handleWorkArrangementToggle(option)}
                    className={`p-4 border rounded-lg text-center transition-colors ${
                      workArrangement.includes(option.label)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-2">
                      {workArrangement.includes(option.label) ? (
                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      )}
                    </div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Accessibility Features */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Accessibility Features</h3>
              <p className="text-sm text-gray-600 mb-4">Select any accommodations your workplace can provide.</p>
              
              {/* Search Bar */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search for accessibility infrastructure or features"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Selected Features */}
              {selectedAccessibilityFeatures.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedAccessibilityFeatures.map((feature) => (
                      <span
                        key={feature}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {feature}
                        <button
                          onClick={() => removeAccessibilityFeature(feature)}
                          className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Features Grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {accessibilityFeatures.map((feature, index) => (
                  <button
                    key={index}
                    onClick={() => handleAccessibilityFeatureToggle(feature)}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      selectedAccessibilityFeatures.includes(feature.name)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{feature.name}</div>
                        <div className="text-sm text-gray-500">({feature.category})</div>
                      </div>
                      {selectedAccessibilityFeatures.includes(feature.name) ? (
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Additional Input */}
              <div>
                <input
                  type="text"
                  placeholder="Add additional accessibility infrastructure or features"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6">
              <button
                onClick={handleBack}
                className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <div className="flex items-center space-x-4">
                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                  Skip for now
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Next
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
            <p>© 2025 PWDe. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-700 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gray-700 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EmployerOnboardingEducation;
