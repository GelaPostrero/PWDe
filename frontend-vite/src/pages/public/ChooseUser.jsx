import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/ui/Logo.jsx';

const ChooseUser = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('job-seeker');

  const goToSignIn = () => {
    navigate('/signin', { state: { role: selectedRole } });
  };

  const goToCreateAccount = () => {
    if (selectedRole === 'job-seeker') {
      navigate('/signup/jobseeker');
    } else {
      navigate('/signup/employer');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className=" mx-full px-6 sm:px-8 lg:px-10 xl:px-12 2xl:px-16">
          <div className="flex justify-between items-center py-4">
            <Logo size="default" showText={true} />
            <div className="flex items-center space-x-4">
              <button
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Help"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
              <button
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Settings"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-10 xl:px-12 2xl:px-16">
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-10 md:p-14">
              <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
                Join PWDe Platform as a Job Seeker or Employer
              </h1>
              <p className="text-center text-gray-600 mt-4">
                Create your account to access inclusive employment opportunities
              </p>

              {/* Role Selection */}
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  type="button"
                  onClick={() => setSelectedRole('job-seeker')}
                  className={`rounded-xl px-8 py-10 text-left border transition-all ${
                    selectedRole === 'job-seeker'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        selectedRole === 'job-seeker'
                          ? 'bg-white/20'
                          : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">Job Seeker</div>
                      <div
                        className={`text-sm ${
                          selectedRole === 'job-seeker'
                            ? 'text-blue-50'
                            : 'text-gray-600'
                        }`}
                      >
                        Looking for employment opportunities
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('employer')}
                  className={`rounded-xl px-8 py-10 text-left border transition-all ${
                    selectedRole === 'employer'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        selectedRole === 'employer'
                          ? 'bg-white/20'
                          : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">Employer</div>
                      <div
                        className={`text-sm ${
                          selectedRole === 'employer'
                            ? 'text-blue-50'
                            : 'text-gray-600'
                        }`}
                      >
                        Hiring inclusive talent
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex flex-col items-center gap-4">
                <button
                  onClick={goToCreateAccount}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Create Account
                </button>
                <div className="text-gray-700">
                  Already have an account?{' '}
                  <button
                    onClick={goToSignIn}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="mx-full px-6 sm:px-8 lg:px-10 xl:px-12 2xl:px-16">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
            <p>© 2025 PWDe. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-gray-700 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-700 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-gray-700 transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChooseUser;
