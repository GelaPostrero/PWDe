import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/dist/sweetalert2.css';
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
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '');
  const [countdown, setCountdown] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [countdown]);

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

  const handleActivation = async () => {
    const pwdEmail = localStorage.getItem('userEmail');
    const fdata = {
      email: pwdEmail,
      code: code.join('')
    }
    console.log('Activation dataaa:', fdata);
    try {
      var url = "http://localhost:4000/accounts/users/register/verify";

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fdata)
      });

      const data = await response.json();
      if(data.success) {
        localStorage.removeItem('userEmail');
        Swal.fire({
          icon: 'success',
          html: '<b>Activation successful!</b> \n<p>Your employer account is now active.</p>',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'bottom-end'
        });
        localStorage.setItem('authToken', data.token);
        navigate('/onboarding/jobseeker/skills');
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
      }
      else {
        alert(data.message || 'Activation failed. Please try again.');
        return;
      }
    } catch (error) {
      console.error('Activation failed:', error);
      alert('Failed to connect to the server. Please try again later.');
      return;
    }
  };

  const handleResendCode = async () => {
    setIsResendDisabled(true);
    const email = localStorage.getItem('userEmail');
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
          title: 'Verification code resent!',
          text: 'A new verification code has been sent to your email.',
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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

      <main className="flex-1 py-30">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Activate Your PWDe Account</h1>
            <p className="text-gray-600 mt-2">Enter the 6-digit code sent to your email to verify and activate your account.</p>

            <Stepper steps={steps} currentKey="activation" onStepClick={handleStepClick} />

            <div className="mt-8">
              <div className="text-sm text-gray-600">Verification code sent to:</div>
              <div className="text-2xl font-semibold mt-1">{userEmail}</div>
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
                onClick={() => navigate('/onboarding/jobseeker/skills')}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Skip & Continue to Onboarding
              </button>
              <button 
                onClick={handleActivation}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="mx-full px-6 sm:px-8 lg:px-10 xl:px-12 2xl:px-16">
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


