import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/dist/sweetalert2.css';
import Logo from '../../../components/ui/Logo.jsx';


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
  const [companyEmail, setCompanyEmail] = useState(localStorage.getItem('companyEmail') || '');
  const [countdown, setCountdown] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

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

  const handleResendCode = async () => {
    setIsResendDisabled(true);
    const email = localStorage.getItem('companyEmail');
    if (!email) {
      alert('No email found. Please restart the registration process.');
      return;
    }
    try {
      const url = "http://localhost:4000/accounts/users/register/verify/resend";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if(data.success) {
        Swal.fire({
          icon: 'success',
          html: '<b>Verification code resent!</b> \n<p>A new code has been sent to your email.</p>',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'bottom-end'
        });
        setCountdown(30);
      } else {
        alert(data.message || 'Failed to resend code. Please try again.');
      }
    } catch (error) {
      console.error('Resend code failed:', error);
      alert('Failed to connect to the server. Please try again later.');
    }
  };

  const handleSubmit = async () => {
    const companyEmail = localStorage.getItem('companyEmail');
    const verificationCode = code.join('');
    const fdata = {
      email: companyEmail,
      code: verificationCode
    }
    try {
      console.log('Activation dataaa:', fdata);
      if (verificationCode.length === 6) {
        console.log('Submitting activation with code:', verificationCode);
        const response = await fetch("http://localhost:4000/accounts/users/register/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fdata)
        });

        const data = await response.json();
        if(data.success) {
          localStorage.removeItem('companyEmail');
          Swal.fire({
            icon: 'success',
            html: '<b>Activation successful!</b> \n<p>Your employer account is now active.</p>',
            timer: 3000,
            showConfirmButton: false,
            toast: true,
            position: 'bottom-end'
          });
          localStorage.setItem('authToken', data.token);
          navigate('/onboarding/employer/skills');
        } else if (data.message.includes('Incorrect verification')) {
          Swal.fire({
            icon: 'error',
            html: '<b>Incorrect Code!</b> \n<p>Please check the code and try again.</p>',
            timer: 4000,
            showConfirmButton: false,
            toast: true,
            position: 'bottom-end'
          });
          setCode(['', '', '', '', '', '']);
        } else {
          alert(data.message || 'Activation failed. Please try again.');
          return;
        }
      } else {
        alert('Please enter the complete 6-digit verification code.');
      }
    } catch (error) {
      console.error('Activation failed:', error);
      alert('Failed to connect to the server. Please try again later.');
      return;
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
              <div className="text-2xl font-semibold mt-1">{companyEmail}</div>
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
                    <span
                      className={`${countdown == 0 && isResendDisabled ? 'text-transparent' : 'text-gray-900'} font-semibold ml-1`}
                    >
                      {countdown}s
                    </span>
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