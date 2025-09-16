import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import EmployerHeader from '../../../components/ui/EmployerHeader.jsx';
import Spinner from '../../../components/ui/Spinner.jsx';

const EmployerOnboardingEducation = () => {
  const navigate = useNavigate();
  const [workArrangement, setWorkArrangement] = useState(['Remote']);
  const [selectedAccessibilityFeatures, setSelectedAccessibilityFeatures] = useState([
    'Wheelchair accessible facilities',
    'Screen reader compatible systems',
    'Assistive technology support'
  ]);
  const [accessibilitySearch, setAccessibilitySearch] = useState('');
  const [showAdditionalAccessibility, setShowAdditionalAccessibility] = useState(false);
  const [additionalAccessibility, setAdditionalAccessibility] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const workArrangementOptions = [
    { key: 'remote', label: 'Remote' },
    { key: 'hybrid', label: 'Hybrid' },
    { key: 'onsite', label: 'On-site' }
  ];

  const accessibilityFeatures = [
    { name: 'Wheelchair accessible facilities', category: 'Physical' },
    { name: 'Visual impairment accommodations', category: 'Physical' },
    { name: 'Hearing impairment accommodations', category: 'Physical' },
    { name: 'Mobility assistance', category: 'Physical' },
    { name: 'Assistive technology support', category: 'Technology' },
    { name: 'Flexible work arrangements', category: 'Policy' },
    { name: 'Sign language interpretation', category: 'Policy' },
    { name: 'Wheelchair accessible facilities', category: 'Physical' },
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

  const isFeatureSelected = (featureName) => {
    return selectedAccessibilityFeatures.includes(featureName) || 
           selectedAccessibilityFeatures.includes(`${featureName} (Custom)`);
  };

  const removeAccessibilityFeature = (feature) => {
    setSelectedAccessibilityFeatures(selectedAccessibilityFeatures.filter(f => f !== feature));
  };

  const addAdditionalAccessibility = () => {
    if (additionalAccessibility.trim()) {
      const customFeature = `${additionalAccessibility.trim()} (Custom)`;
      if (!selectedAccessibilityFeatures.includes(customFeature)) {
        setSelectedAccessibilityFeatures([...selectedAccessibilityFeatures, customFeature]);
        setAdditionalAccessibility('');
        setShowAdditionalAccessibility(false);
      }
    }
  };

  const filteredAccessibilityFeatures = accessibilityFeatures.filter(feature =>
    feature.name.toLowerCase().includes(accessibilitySearch.toLowerCase())
  );

  const handleNext = async () => {
    setIsLoading(true);

    // Add minimum loading time to see spinner (remove this in production)
    const minLoadingTime = new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Try to save data (optional - will proceed even if this fails)
      const token = localStorage.getItem('authToken');
      const educationData = {
        workArrangement: workArrangement,
        accessibilityFeatures: selectedAccessibilityFeatures
      };

      if (token) {
        try {
          const response = await fetch('http://localhost:4000/onboard/emp/onboard/work-environment', {
            method: 'POST',
            headers: { 
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(educationData)
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              console.log('Education data saved successfully:', educationData);
              Swal.fire({
                icon: 'success',
                html: '<h5><b>Work Environment</b></h5>\n<h6>You may now start to fill up your Profile Completion.</h6>',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                toast: true,
                position: 'bottom-end'
              });
            }
          }
        } catch (apiError) {
          console.log('API call failed, but continuing with navigation:', apiError);
        }
      }

      // Wait for minimum loading time
      await minLoadingTime;

      // Always proceed to next step regardless of API result
      console.log('Proceeding to completion page with data:', educationData);
      navigate('/onboarding/employer/completion');
      
    } catch (error) {
      console.error('Unexpected error:', error);
      // Still proceed to next step even if there's an error
      navigate('/onboarding/employer/completion');
    } finally {
      setIsLoading(false);
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
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for accessibility infrastructure or features"
                    value={accessibilitySearch}
                    onChange={(e) => setAccessibilitySearch(e.target.value)}
                    className="w-full px-4 py-3 pl-10 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Selected Features */}
              {selectedAccessibilityFeatures.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedAccessibilityFeatures.map((feature) => {
                      const isCustom = feature.includes('(Custom)');
                      return (
                        <span
                          key={feature}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          {feature.replace(' (Custom)', '')}
                          {isCustom && <span className="ml-1 text-xs text-blue-600">(Custom)</span>}
                          <button
                            onClick={() => removeAccessibilityFeature(feature)}
                            className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Features Grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {filteredAccessibilityFeatures.map((feature, index) => {
                  const isSelected = isFeatureSelected(feature.name);
                  const isCustom = selectedAccessibilityFeatures.includes(`${feature.name} (Custom)`);
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleAccessibilityFeatureToggle(feature)}
                      className={`p-3 border-2 rounded-lg text-left transition-colors ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div>
                            <div className="font-medium text-gray-900 flex items-center">
                              {feature.name}
                              {isCustom && <span className="ml-1 text-xs text-blue-600">(Custom)</span>}
                            </div>
                            <div className="text-sm text-gray-500">
                              ({feature.category})
                            </div>
                          </div>
                        </div>
                        {isSelected ? (
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
                  );
                })}
              </div>

              {/* Additional Accessibility Input */}
              {!showAdditionalAccessibility ? (
                <button 
                  onClick={() => setShowAdditionalAccessibility(true)}
                  className="w-full mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors text-center"
                >
                  <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add additional accessibility features
                </button>
              ) : (
                <div className="mt-4 p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={additionalAccessibility}
                      onChange={(e) => setAdditionalAccessibility(e.target.value)}
                      placeholder="Enter additional accessibility feature"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && addAdditionalAccessibility()}
                    />
                    <button
                      onClick={addAdditionalAccessibility}
                      disabled={!additionalAccessibility.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowAdditionalAccessibility(false);
                        setAdditionalAccessibility("");
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Tip: Add accessibility features that are specific to your workplace and not already listed above
                  </p>
                </div>
              )}
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
                  disabled={isLoading}
                  className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Spinner size="sm" color="white" />
                      <span className="ml-2">Saving...</span>
                    </>
                  ) : (
                    <>
                      Next
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
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
