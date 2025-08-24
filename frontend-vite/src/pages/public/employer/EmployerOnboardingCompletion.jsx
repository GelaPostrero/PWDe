import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../../components/ui/Logo.jsx';
import Stepper from '../../../components/ui/Stepper.jsx';

const EmployerOnboardingCompletion = () => {
  const [formData, setFormData] = useState({
    agreeTos: false,
    agreePrivacy: false,
    agreeMarketing: false,
    agreeInclusive: false,
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if all required agreements are accepted
    if (!formData.agreeTos || !formData.agreePrivacy || !formData.agreeInclusive) {
      alert('Please accept all required agreements to continue.');
      return;
    }

    console.log('Employer onboarding completion:', formData);
    
    // Redirect to employer dashboard
    navigate('/employer/dashboard');
  };

  const goBack = () => {
    navigate('/onboarding/employer/education');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo showText={true} />
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors" aria-label="Help">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors" aria-label="Settings">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10">
            <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900">Join PWDe Platform as an Employer</h1>
            <p className="text-center text-gray-600 mt-2">Create your account to access inclusive employment opportunities</p>

            {/* Progress Stepper */}
            <div className="mt-8 flex items-center justify-center">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate('/employer/verification')}
                  className="flex items-center hover:opacity-80 transition-opacity"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="ml-2 text-green-600 font-medium">Verification</span>
                </button>
                <div className="w-16 h-0.5 bg-green-500"></div>
                <button 
                  onClick={() => navigate('/onboarding/employer/skills')}
                  className="flex items-center hover:opacity-80 transition-opacity"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="ml-2 text-green-600 font-medium">Skills & Requirements</span>
                </button>
                <div className="w-16 h-0.5 bg-green-500"></div>
                <button 
                  onClick={() => navigate('/onboarding/employer/education')}
                  className="flex items-center hover:opacity-80 transition-opacity"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="ml-2 text-green-600 font-medium">Company Details</span>
                </button>
                <div className="w-16 h-0.5 bg-green-500"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">4</div>
                  <span className="ml-2 text-blue-600 font-medium">Completion</span>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              {/* Welcome Message */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 text-2xl mb-4">
                  🎉
                </div>
                <h2 className="text-xl font-semibold text-blue-900 mb-2">Welcome to PWDe!</h2>
                <p className="text-blue-700">
                  You're almost ready to start connecting with talented candidates and building an inclusive workplace.
                </p>
              </div>

              {/* What's Next */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1 mr-3 flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                      </svg>
                    </div>
                    <span className="text-gray-700">Your profile will be reviewed and activated within 24-48 hours</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1 mr-3 flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                      </svg>
                    </div>
                    <span className="text-gray-700">You'll receive access to post jobs and browse candidate profiles</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1 mr-3 flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                      </svg>
                    </div>
                    <span className="text-gray-700">Our team will reach out to help you get started</span>
                  </div>
                </div>
              </div>

              {/* Agreements */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Terms & Agreements</h3>
                
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeTos"
                    checked={formData.agreeTos}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                    required
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    I agree to the <a href="#" className="text-blue-600 hover:text-blue-700 underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-700 underline">User Agreement</a> *
                  </span>
                </label>

                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreePrivacy"
                    checked={formData.agreePrivacy}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                    required
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    I agree to the <a href="#" className="text-blue-600 hover:text-blue-700 underline">Privacy Policy</a> and consent to the processing of my data *
                  </span>
                </label>

                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeInclusive"
                    checked={formData.agreeInclusive}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                    required
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    I commit to creating an inclusive workplace and providing reasonable accommodations for candidates with disabilities *
                  </span>
                </label>

                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeMarketing"
                    checked={formData.agreeMarketing}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    I agree to receive updates about new features, best practices, and inclusive hiring resources (optional)
                  </span>
                </label>
              </div>

              {/* Final Actions */}
              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={goBack}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Complete Registration
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

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
