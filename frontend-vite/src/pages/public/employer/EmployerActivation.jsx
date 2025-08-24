import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock Logo component (replace with your actual Logo component)
const Logo = ({ showText }) => (
  <div className="flex items-center">
    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
      <span className="text-white font-bold">P</span>
    </div>
    {showText && <span className="text-xl font-bold text-gray-900">PWDe</span>}
  </div>
);

// Mock Stepper component (replace with your actual Stepper component)
const Stepper = ({ steps, currentKey, onStepClick }) => (
  <div className="mt-8 flex items-center justify-center">
    <div className="flex items-center space-x-4">
      {steps.map((step, index) => (
        <React.Fragment key={step.key}>
          <button 
            onClick={() => onStepClick && onStepClick(step.key)}
            className="flex items-center hover:opacity-80 transition-opacity"
            disabled={step.key === currentKey}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
              step.key === 'registration' || step.key === 'verification' ? 'bg-green-500' : 
              step.key === currentKey ? 'bg-blue-600' : 'bg-gray-300'
            }`}>
              {step.key === 'registration' || step.key === 'verification' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span className={`ml-2 font-medium ${
              step.key === 'registration' || step.key === 'verification' ? 'text-green-600' : 
              step.key === currentKey ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {step.label}
            </span>
          </button>
          {index < steps.length - 1 && (
            <div className={`w-16 h-0.5 ${
              step.key === 'registration' || step.key === 'verification' ? 'bg-green-500' : 'bg-gray-300'
            }`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
);

const steps = [
  { key: 'registration', label: 'Registration' },
  { key: 'verification', label: 'Verification' },
  { key: 'activation', label: 'Activation' },
];

const EmployerActivation = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [countdown]);

  const handleStepClick = (key) => {
    if (key === 'registration') navigate('/signup/employer');
    if (key === 'verification') navigate('/employer/verification');
  };

  const setDigit = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleResendCode = () => {
    setCountdown(30);
    setIsResendDisabled(true);
    // Here you would typically call an API to resend the code
    console.log('Resending verification code...');
  };

  const handleSubmit = () => {
    const verificationCode = code.join('');
    if (verificationCode.length === 6) {
      console.log('Verification code submitted:', verificationCode);
      // Here you would typically verify the code with an API
      // For now, redirect to onboarding since we can't receive email codes
      navigate('/onboarding/employer/skills');
    } else {
      alert('Please enter the complete 6-digit verification code.');
    }
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

            <div onSubmit={handleSubmit}>
              <div className="mt-8 flex items-center justify-center gap-4">
                {code.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`code-${idx}`}
                    value={digit}
                    onChange={(e) => setDigit(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-14 h-14 border rounded-lg text-center text-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    maxLength={1}
                    inputMode="numeric"
                  />
                ))}
              </div>

              <div className="mt-4 text-sm text-gray-600">
                Didn't receive the code?{' '}
                <button 
                  type="button"
                  onClick={handleResendCode}
                  disabled={isResendDisabled}
                  className={`transition-colors ${
                    isResendDisabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  Resend Code
                  {isResendDisabled && (
                    <span className="text-gray-900 font-semibold ml-1">{countdown}s</span>
                  )}
                </button>
              </div>

              <div className="mt-8 flex gap-4">
                <button 
                  type="button"
                  onClick={() => navigate('/onboarding/employer/skills')}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Skip & Continue to Onboarding
                </button>
                <button 
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Create Account
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

export default EmployerActivation;