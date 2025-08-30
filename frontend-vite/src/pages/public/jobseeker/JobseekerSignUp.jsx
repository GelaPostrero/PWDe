import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../../components/ui/Logo.jsx';
import Stepper from '../../../components/ui/Stepper.jsx';

const JobseekerSignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    userType: 'PWD',
    phone: '',
    birthdate: '',
    gender: '',
    disabilityType: '',
    address: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.email) {
      alert("Email is required.");
      return;
    }
    localStorage.setItem('userEmail', formData.email);
    
    try {
      const response = await fetch("http://localhost:4000/accounts/users/register/pwd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if(data.success) {
        alert("Registration successful! Please verify your email or phone number.");
        navigate('/signup/jobseeker/verification');        
      } else {
        if (data.message?.includes("already registered")) {
          alert("Email or phone number already exists. Please use a different one.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to the server. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="mx-full px-6 sm:px-8 lg:px-10 xl:px-12 2xl:px-16">
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
            <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900">Join PWDe Platform as a Job Seeker</h1>
            <p className="text-center text-gray-600 mt-2">Create your account to access inclusive employment opportunities</p>

            <Stepper
              steps={[
                { key: 'registration', label: 'Registration' },
                { key: 'verification', label: 'Verification' },
                { key: 'activation', label: 'Activation' },
              ]}
              currentKey="registration"
              onStepClick={(key) => {
                if (key === 'registration') return;
                if (key === 'verification') navigate('/signup/jobseeker/verification');
              }}
            />

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Enter your first name" className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <input name="middleName" value={formData.middleName} onChange={handleChange} placeholder="Enter your middle name" className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Enter your last name" className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="birthdate" value={formData.birthdate} onChange={handleChange} placeholder="mm/dd/yy" className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <select name="gender" value={formData.gender} onChange={handleChange} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700">
                  <option value="" disabled>Choose your gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="prefer-not">Prefer not to say</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <select name="disabilityType" value={formData.disabilityType} onChange={handleChange} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700">
                  <option value="" disabled>Choose disability type</option>
                  <option value="visual">Visual Impairment</option>
                  <option value="hearing">Hearing Impairment</option>
                  <option value="mobility">Mobility Disability</option>
                  <option value="cognitive">Cognitive/Neurological</option>
                  <option value="other">Other</option>
                </select>
                <input name="address" value={formData.address} onChange={handleChange} placeholder="Enter complete address" className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">Continue to Verification</button>
              </div>
            </form>
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

export default JobseekerSignUp;


