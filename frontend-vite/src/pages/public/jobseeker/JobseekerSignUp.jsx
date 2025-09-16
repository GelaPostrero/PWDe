import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/dist/sweetalert2.css';
import Logo from '../../../components/ui/Logo.jsx';
import Stepper from '../../../components/ui/Stepper.jsx';
import Spinner from '../../../components/ui/Spinner.jsx';

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
    confirmPassword: '',
  });

  // Calendar state
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const calendarRef = useRef(null);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Special handler for birthdate formatting
  const handleBirthdateChange = (e) => {
    const input = e.target.value;
    
    // Remove all non-numeric characters
    const numbersOnly = input.replace(/\D/g, '');
    
    // Format as MM/DD/YY
    let formatted = '';
    
    if (numbersOnly.length > 0) {
      if (numbersOnly.length <= 2) {
        formatted = numbersOnly;
      } else if (numbersOnly.length <= 4) {
        formatted = numbersOnly.slice(0, 2) + '/' + numbersOnly.slice(2);
      } else if (numbersOnly.length <= 8) {
        formatted = numbersOnly.slice(0, 2) + '/' + numbersOnly.slice(2, 4) + '/' + numbersOnly.slice(4, 8);
      }
    }
    
    // Limit to MM/DD/YYYY format (but we'll display as MM/DD/YY)
    if (formatted.length > 10) {
      formatted = formatted.slice(0, 10);
    }
    
    setFormData((prev) => ({ ...prev, birthdate: formatted }));
  };

  // Calendar helper functions
  const changeMonth = (direction) => {
    setCalendarDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const handleDateSelect = (selectedDate) => {
    const formattedDate = `${String(selectedDate.getMonth() + 1).padStart(2, '0')}/${String(selectedDate.getDate()).padStart(2, '0')}/${selectedDate.getFullYear()}`;
    setFormData((prev) => ({ ...prev, birthdate: formattedDate }));
    setShowCalendar(false);
  };

  // Handle click outside calendar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Set loading state
    setIsLoading(true);

    if(!formData.email || !formData.phone || !formData.address || !formData.gender || !formData.password || !formData.confirmPassword || !formData.disabilityType || !formData.firstName || !formData.lastName || !formData.middleName) {
      Swal.fire({
        icon: 'warning',
        title: 'Please double check your data.',
        text: 'We think you have forgotten some fields.',
        timer: 4000,
        showConfirmButton: false,
        toast: true,
        position: 'bottom-end'
      });
      setIsLoading(false);
      return;
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'Passwords do not match. Please try again.',
        timer: 4000,
        showConfirmButton: false,
        toast: true,
        position: 'bottom-end'
      });
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Weak Password',
        text: 'Password must be at least 6 characters long.',
        timer: 4000,
        showConfirmButton: false,
        toast: true,
        position: 'bottom-end'
      });
      setIsLoading(false);
      return;
    }

    // Validate birthdate format and age
    const birthdatePattern = /^\d{2}\/\d{2}\/\d{4}$/;
    if (formData.birthdate && !birthdatePattern.test(formData.birthdate)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Date Format',
        text: 'Please enter birthdate in MM/DD/YYYY format.',
        timer: 4000,
        showConfirmButton: false,
        toast: true,
        position: 'bottom-end'
      });
      setIsLoading(false);
      return;
    }

    // Validate age (must be at least 16 years old)
    if (!formData.birthdate) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Don`t forget to set your birthdate.',
        timer: 4000,
        showConfirmButton: false,
        toast: true,
        position: 'bottom-end'
      });
      setIsLoading(false);
      return;
    } else {
      const birthDate = new Date(formData.birthdate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 16) {
        Swal.fire({
          icon: 'error',
          title: 'Age Requirement',
          text: 'You must be at least 16 years old to register.',
          timer: 4000,
          showConfirmButton: false,
          toast: true,
          position: 'bottom-end'
        });
        setIsLoading(false);
        return;
      }
    }

    localStorage.setItem('userEmail', formData.email);
    console.log("Formdata: ", formData);
    try {
      // Add minimum loading time to see spinner (remove this in production)
      const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));
      
      const url = "http://localhost:4000/accounts/users/register/pwd";
      const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(formData)
      });
      
      // Wait for both API call and minimum loading time
      await Promise.all([response, minLoadingTime]);

      const data = await response.json();
      if(data.success) {
        Swal.fire({
          icon: 'success',
          title: 'First phase registration successful!',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'bottom-end'
        })
        navigate('/signup/jobseeker/verification');        
      } else {
        alert(`Registration failed: ${data.error || data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to the server. Please try again later.");
    } finally {
      setIsLoading(false);
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
                <div className="relative">
                  <input 
                    name="birthdate" 
                    value={formData.birthdate} 
                    onClick={() => setShowCalendar(true)}
                    readOnly
                    placeholder="Select your birthdate"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer w-full" 
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  {showCalendar && (
                    <div ref={calendarRef} className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 w-80">
                      {/* Calendar Header */}
                      <div className="flex items-center justify-between mb-4">
                        <button
                          type="button"
                          onClick={() => changeMonth(-1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <h3 className="text-lg font-semibold">
                          {calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h3>
                        <button
                          type="button"
                          onClick={() => changeMonth(1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>

                      {/* Days of week header */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                          <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Calendar Days */}
                      <div className="grid grid-cols-7 gap-1">
                        {getDaysInMonth(calendarDate).map((day, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => day && handleDateSelect(day)}
                            disabled={!day}
                            className={`
                              h-8 w-8 text-sm rounded hover:bg-blue-100 
                              ${!day ? 'invisible' : ''}
                              ${day && day.toDateString() === new Date(formData.birthdate).toDateString() 
                                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                                : 'text-gray-700'
                              }
                            `}
                          >
                            {day?.getDate()}
                          </button>
                        ))}
                      </div>

                      {/* Quick year navigation */}
                      <div className="mt-4 flex justify-center space-x-2">
                        <select
                          value={calendarDate.getFullYear()}
                          onChange={(e) => setCalendarDate(new Date(calendarDate.setFullYear(parseInt(e.target.value))))}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          {Array.from({length: 100}, (_, i) => new Date().getFullYear() - i).map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                    isLoading 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  {isLoading ? (
                    <>
                      <Spinner size="sm" color="white" />
                      Creating Account...
                    </>
                  ) : (
                    'Continue to Verification'
                  )}
                </button>
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