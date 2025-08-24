import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../../components/ui/Logo.jsx';
import Stepper from '../../../components/ui/Stepper.jsx';

const steps = [
  { key: 'registration', label: 'Registration' },
  { key: 'verification', label: 'Verification' },
  { key: 'activation', label: 'Activation' },
];

const JobseekerActivation = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '', '', '']);

  const handleStepClick = (key) => {
    if (key === 'registration') navigate('/signup/jobseeker');
    if (key === 'verification') navigate('/signup/jobseeker/verification');
  };

  const setDigit = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo showText={true} />
          </div>
        </div>
      </header>

      <main className="flex-1 py-10">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Activate Your PWDe Account</h1>
            <p className="text-gray-600 mt-2">Enter the 6-digit code sent to your email to verify and activate your account.</p>

            <Stepper steps={steps} currentKey="activation" onStepClick={handleStepClick} />

            <div className="mt-8">
              <div className="text-sm text-gray-600">Verification code sent to:</div>
              <div className="text-2xl font-semibold mt-1">your@email.com</div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4">
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  value={digit}
                  onChange={(e) => setDigit(idx, e.target.value)}
                  className="w-14 h-14 border rounded-lg text-center text-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={1}
                  inputMode="numeric"
                />
              ))}
            </div>

            <div className="mt-4 text-sm text-gray-600">Didn't receive the code? <button className="text-blue-600 hover:text-blue-700">Resend Code 30s</button></div>

            <div className="mt-8 flex gap-4">
              <button 
                onClick={() => navigate('/onboarding/jobseeker/skills')}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Skip & Continue to Onboarding
              </button>
              <button 
                onClick={() => navigate('/onboarding/jobseeker/skills')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Create Account
              </button>
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

export default JobseekerActivation;


