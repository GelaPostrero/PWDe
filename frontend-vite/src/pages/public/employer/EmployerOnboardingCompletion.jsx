import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployerHeader from '../../../components/ui/EmployerHeader.jsx';

const EmployerOnboardingCompletion = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyDescription: '',
    portfolioUrl: '',
    githubUrl: '',
    otherPlatform: '',
    otherUrl: ''
  });
  const [agreements, setAgreements] = useState({
    termsOfService: false,
    inclusiveHiring: false,
    compliance: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAgreementChange = (agreement) => {
    setAgreements(prev => ({ ...prev, [agreement]: !prev[agreement] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if all required agreements are accepted
    if (!agreements.termsOfService || !agreements.inclusiveHiring || !agreements.compliance) {
      alert('Please accept all required agreements to continue.');
      return;
    }

    console.log('Company profile completed:', { formData, agreements });
    navigate('/employer/dashboard');
  };

  const handleBack = () => {
    navigate('/onboarding/employer/education');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <EmployerHeader />

      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-6">
          {/* Welcome Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
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
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                </div>
                <span className="ml-2 text-green-600 font-medium">Work Environment</span>
              </div>
              <div className="w-16 h-0.5 bg-green-500"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">3</div>
                <span className="ml-2 text-blue-600 font-medium">Complete Company Profile</span>
              </div>
            </div>
          </div>

          {/* Complete Company Profile Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Company Profile</h2>
            <p className="text-gray-600 mb-8">Add final details to help us understand your company better.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Photo */}
              <div className="border rounded-xl p-6">
                <h3 className="font-medium text-gray-900 mb-3">Profile Photo (Optional)</h3>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">No photo</p>
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload
                  </button>
                  <p className="text-xs text-gray-500 mt-2">Supported formats: JPG, PNG (Max 5MB)</p>
                </div>
              </div>

              {/* Company Description */}
              <div className="border rounded-xl p-6">
                <h3 className="font-medium text-gray-900 mb-3">Company Description</h3>
                <textarea
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleChange}
                  placeholder="Briefly describe your company and work culture..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Company Portfolio */}
              <div className="border rounded-xl p-6">
                <h3 className="font-medium text-gray-900 mb-3">Company Portfolio (Optional)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Website/Portfolio URL</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </div>
                      <input
                        name="portfolioUrl"
                        type="url"
                        value={formData.portfolioUrl}
                        onChange={handleChange}
                        placeholder="https://yourportfolio.com"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">GitHub Profile</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </div>
                      <input
                        name="githubUrl"
                        type="url"
                        value={formData.githubUrl}
                        onChange={handleChange}
                        placeholder="https://github.com/yourusername"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Other Portfolio</label>
                      <input
                        name="otherPlatform"
                        type="text"
                        value={formData.otherPlatform}
                        onChange={handleChange}
                        placeholder="Platform name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Other Portfolio</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                        </div>
                        <input
                          name="otherUrl"
                          type="url"
                          value={formData.otherUrl}
                          onChange={handleChange}
                          placeholder="https://example.com/yourprofile"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms & Agreements */}
              <div className="border rounded-xl p-6">
                <h3 className="font-medium text-gray-900 mb-3">Terms & Agreements</h3>
                <div className="space-y-3">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreements.termsOfService}
                      onChange={() => handleAgreementChange('termsOfService')}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                      required
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the <a href="#" className="text-blue-600 hover:text-blue-700">Terms of Service</a> and{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a> <span className="text-red-500">*</span>
                    </span>
                  </label>
                  
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreements.inclusiveHiring}
                      onChange={() => handleAgreementChange('inclusiveHiring')}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                      required
                    />
                    <span className="text-sm text-gray-700">
                      I commit to inclusive and non-discriminatory hiring practices <span className="text-red-500">*</span>
                    </span>
                  </label>
                  
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreements.compliance}
                      onChange={() => handleAgreementChange('compliance')}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                      required
                    />
                    <span className="text-sm text-gray-700">
                      I agree to comply with all applicable employment and accessibility laws <span className="text-red-500">*</span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <button
                  type="submit"
                  className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Complete Profile & Find Talent
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </form>
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

export default EmployerOnboardingCompletion;
