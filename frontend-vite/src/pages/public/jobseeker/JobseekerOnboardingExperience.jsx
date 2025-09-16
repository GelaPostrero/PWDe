import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../../utils/api.js'
import JobseekerHeader from '../../../components/ui/JobseekerHeader.jsx';
import Stepper from '../../../components/ui/Stepper.jsx';
import Spinner from '../../../components/ui/Spinner.jsx';

const steps = [
  { key: 'skills', label: 'Skills' },
  { key: 'education', label: 'Education' },
  { key: 'experience', label: 'Experience' },
  { key: 'accessibility', label: 'Accessibility' },
  { key: 'preferences', label: 'Preferences' },
  { key: 'completion', label: 'Profile Completion' },
];

const routeForStep = (key) => {
  switch (key) {
    case 'skills':
      return '/onboarding/jobseeker/skills';
    case 'education':
      return '/onboarding/jobseeker/education';
    case 'experience':
      return '/onboarding/jobseeker/experience';
    case 'accessibility':
      return '/onboarding/jobseeker/accessibility';
    case 'preferences':
      return '/onboarding/jobseeker/preferences';
    case 'completion':
      return '/onboarding/jobseeker/completion';
    default:
      return '/onboarding/jobseeker/skills';
  }
};

const JobseekerOnboardingExperience = () => {
  const navigate = useNavigate();
  const [isCurrent, setIsCurrent] = useState(false);
  const [additionalExperiences, setAdditionalExperiences] = useState([]);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleStepClick = (key) => {
    // Only allow navigation to previous steps or current step
    const currentStepIndex = steps.findIndex(step => step.key === 'experience');
    const targetStepIndex = steps.findIndex(step => step.key === key);
    
    if (targetStepIndex <= currentStepIndex) {
      navigate(routeForStep(key));
    } else {
      // Show message that they need to complete current step first
      Swal.fire({
        icon: 'info',
        title: 'Complete Current Step',
        text: 'Please complete the current step before moving forward.',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    }
  };
  const goBack = () => navigate(routeForStep('education'));

  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('Philippines');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [description, setDescription] = useState('');

  // Calendar state for start date
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [startCalendarDate, setStartCalendarDate] = useState(new Date());
  const startCalendarRef = useRef(null);

  // Calendar state for end date
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [endCalendarDate, setEndCalendarDate] = useState(new Date());
  const endCalendarRef = useRef(null);

  // Refs for additional experience calendars
  const additionalExperienceRefs = useRef({});

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!jobTitle.trim()) {
      newErrors.jobTitle = "Job title is required";
    }
    
    if (!company.trim()) {
      newErrors.company = "Company name is required";
    }
    
    if (!location.trim()) {
      newErrors.location = "Location is required";
    }
    
    if (!startDate) {
      newErrors.startDate = "Start date is required";
    }
    
    if (!isCurrent && !endDate) {
      newErrors.endDate = "End date is required";
    }
    
    if (startDate && endDate && startDate > endDate) {
      newErrors.endDate = "End date must be after start date";
    }
    
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setIsFormValid(isValid);
    return isValid;
  };

  // Check form validity on every change
  React.useEffect(() => {
    validateForm();
  }, [jobTitle, company, location, startDate, endDate, isCurrent]);

  // Calendar helper functions
  const changeStartMonth = (direction) => {
    setStartCalendarDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const changeEndMonth = (direction) => {
    setEndCalendarDate(prev => {
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

  const handleStartDateSelect = (selectedDate) => {
    setStartDate(selectedDate);
    setShowStartCalendar(false);
  };

  const handleEndDateSelect = (selectedDate) => {
    setEndDate(selectedDate);
    setShowEndCalendar(false);
  };

  // Calendar handlers for additional experiences
  const handleAdditionalStartDateSelect = (expId, selectedDate) => {
    setAdditionalExperiences(additionalExperiences.map(exp => 
      exp.id === expId ? { ...exp, startDate: selectedDate, showStartCalendar: false } : exp
    ));
  };

  const handleAdditionalEndDateSelect = (expId, selectedDate) => {
    setAdditionalExperiences(additionalExperiences.map(exp => 
      exp.id === expId ? { ...exp, endDate: selectedDate, showEndCalendar: false } : exp
    ));
  };

  const changeAdditionalStartMonth = (expId, direction) => {
    const exp = additionalExperiences.find(e => e.id === expId);
    if (exp) {
      const newDate = new Date(exp.startCalendarDate);
      newDate.setMonth(newDate.getMonth() + direction);
      updateAdditionalExperience(expId, 'startCalendarDate', newDate);
    }
  };

  const changeAdditionalEndMonth = (expId, direction) => {
    const exp = additionalExperiences.find(e => e.id === expId);
    if (exp) {
      const newDate = new Date(exp.endCalendarDate);
      newDate.setMonth(newDate.getMonth() + direction);
      updateAdditionalExperience(expId, 'endCalendarDate', newDate);
    }
  };

  // Handle click outside calendars
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (startCalendarRef.current && !startCalendarRef.current.contains(event.target)) {
        setShowStartCalendar(false);
      }
      if (endCalendarRef.current && !endCalendarRef.current.contains(event.target)) {
        setShowEndCalendar(false);
      }
      
      // Handle additional experience calendars
      additionalExperiences.forEach(exp => {
        const startRef = additionalExperienceRefs.current[`start-${exp.id}`];
        const endRef = additionalExperienceRefs.current[`end-${exp.id}`];
        
        if (startRef && !startRef.contains(event.target)) {
          updateAdditionalExperience(exp.id, 'showStartCalendar', false);
        }
        if (endRef && !endRef.contains(event.target)) {
          updateAdditionalExperience(exp.id, 'showEndCalendar', false);
        }
      });
    };

    const hasAnyCalendarOpen = showStartCalendar || showEndCalendar || 
      additionalExperiences.some(exp => exp.showStartCalendar || exp.showEndCalendar);

    if (hasAnyCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStartCalendar, showEndCalendar, additionalExperiences]);

  const addAdditionalExperience = () => {
    if (additionalExperiences.length < 5) {
      setAdditionalExperiences([...additionalExperiences, {
        jobTitle: '',
        company: '',
        location: '',
        country: 'Philippines',
        startDate: null,
        endDate: null,
        isCurrent: false,
        employmentType: 'Full-time',
        description: '',
        showStartCalendar: false,
        showEndCalendar: false,
        startCalendarDate: new Date(),
        endCalendarDate: new Date()
      }]);
    }
  };

  const removeAdditionalExperience = (id) => {
    setAdditionalExperiences(additionalExperiences.filter(exp => exp.id !== id));
  };

  const updateAdditionalExperience = (id, field, value) => {
    setAdditionalExperiences(additionalExperiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const handleNext = async () => {
    console.log('Next button clicked in Experience page');
    console.log('Current form state:', { 
      jobTitle, 
      company, 
      location, 
      startDate, 
      endDate, 
      isCurrent,
      isFormValid 
    });
    
    if (!validateForm()) {
      console.log('Form validation failed:', errors);
      return;
    }

    setIsLoading(true);

    console.log('Form validation passed, proceeding...');

    // Add minimum loading time to see spinner (remove this in production)
    const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));

    const token = localStorage.getItem('authToken');
    const experienceEntries = [{
      jobTitle,
      company,
      location,
      country,
      startDate: startDate && startDate instanceof Date ? startDate.toISOString() : null,
      endDate: isCurrent ? null : (endDate && endDate instanceof Date ? endDate.toISOString() : null),
      isCurrent,
      employmentType,
      description
    },
      ...additionalExperiences
    ];

    const experienceData = {experience: experienceEntries}
    console.log('Sending experience data:', experienceData);

    try {
      const response = await api.post('/onboard/pwd/onboard/work-experience', experienceData);

      // Wait for both API call and minimum loading time
      await Promise.all([response, minLoadingTime]);
      
      if(response.data.success) {
        Swal.fire({
          icon: 'success',
          html: '<h5><b>Work Experience</b></h5>\n<h6>You may now fillup your Accessibility needs.</h6>',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          toast: true,
          position: 'bottom-end'
        })
        navigate(routeForStep('accessibility'))
      } else {
        console.error('API returned success: false', data);
        alert('Failed to save work experience. Please try again.');
      }
    } catch(error) {
      console.error("Server error: ", error);
      
      // Check if it's a network error
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.log('Network error detected, proceeding with mock data');
        // Wait for minimum loading time even for network errors
        await minLoadingTime;
        Swal.fire({
          icon: 'info',
          title: 'Development Mode',
          text: 'Server not available, proceeding with mock data.',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          toast: true,
          position: 'bottom-end'
        });
        navigate(routeForStep('accessibility'));
      } else {
        alert('Failed to connect to the server. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleSkip = async () => {
    const shouldSkip = window.confirm('Adding your work history improves matching quality. Skip for now?');
    if (shouldSkip) {
      setIsLoading(true);
      
      // Add minimum loading time to see spinner (remove this in production)
      const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));

      try {
        // Send empty experience data when skipping
        const response = await api.post('/onboard/pwd/onboard/work-experience', { experience: [] });

        // Wait for both API call and minimum loading time
        await Promise.all([response, minLoadingTime]);
        
        if(response.data.success) {
          Swal.fire({
            icon: 'success',
            html: '<h5><b>Work Experience</b></h5>\n<h6>You may now fillup your Accessibility needs.</h6>',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            toast: true,
            position: 'bottom-end'
          })
          navigate(routeForStep('accessibility'))
        } else {
          console.error('API returned success: false', response.data);
          alert('Failed to save work experience. Please try again.');
        }
      } catch(error) {
        console.error("Server error: ", error);
        
        // Check if it's a network error
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          console.log('Network error detected, proceeding with mock data');
          // Wait for minimum loading time even for network errors
          await minLoadingTime;
          Swal.fire({
            icon: 'info',
            title: 'Development Mode',
            text: 'Server not available, proceeding with mock data.',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            toast: true,
            position: 'bottom-end'
          });
          navigate(routeForStep('accessibility'));
        } else {
          alert('Failed to connect to the server. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <JobseekerHeader disabled={true} />

      <main className="flex-1 py-8">
        <div className="mx-full px-6 sm:px-8 lg:px-10 xl:px-12 2xl:px-16 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600 text-lg mb-3">🛠️</div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome to PWDe: AI-Powered Job Matching Platform</h1>
            <p className="text-gray-600 mt-2">Help us understand your skills and preferences to find the perfect job opportunities tailored for you.</p>
            <div className="mt-4 text-sm text-gray-600 bg-blue-50 border border-blue-100 inline-block px-4 py-2 rounded-lg">
              Our AI analyzes your profile to match you with inclusive employers and accessible positions.
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <Stepper 
              steps={steps} 
              currentKey="experience" 
              onStepClick={handleStepClick}
              validationStates={{
                experience: isFormValid ? 'valid' : (Object.keys(errors).length > 0 ? 'error' : 'pending')
              }}
            />
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Experience</h2>
                <p className="text-gray-600">Tell us about your work experience. Add your work experience starting with your most recent position.</p>
              </div>

              {/* Experience Details Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience Details</h3>
                <div className="border border-gray-200 rounded-xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Title*</label>
                      <input 
                        value={jobTitle} 
                        onChange={(e) => setJobTitle(e.target.value)} 
                        className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.jobTitle ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., Software Developer, Marketing Manager" 
                      />
                      {errors.jobTitle && (
                        <p className="mt-1 text-sm text-red-600">{errors.jobTitle}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company*</label>
                      <input 
                        value={company} 
                        onChange={(e) => setCompany(e.target.value)} 
                        className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.company ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., Cebu City, Philippines" 
                      />
                      {errors.company && (
                        <p className="mt-1 text-sm text-red-600">{errors.company}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location*</label>
                      <input 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                        className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.location ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., Cebu City, Manila, Makati" 
                      />
                      {errors.location && (
                        <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country*</label>
                      <div className="relative">
                        <select 
                          value={country} 
                          onChange={(e) => setCountry(e.target.value)} 
                          className="w-full appearance-none bg-white border rounded-lg px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                        >
                          <option>Philippines</option>
                          <option>United States</option>
                          <option>Canada</option>
                          <option>Australia</option>
                          <option>Singapore</option>
                          <option>Other</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                        <input 
                          type="checkbox" 
                          checked={isCurrent} 
                          onChange={(e) => setIsCurrent(e.target.checked)}
                          className="text-blue-600 focus:ring-blue-500"
                        /> 
                        I am currently working in this role
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date*</label>
                      <div className="relative">
                        <input 
                          value={startDate ? startDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : ''} 
                          onClick={() => setShowStartCalendar(true)}
                          readOnly
                          placeholder="Select start date"
                          className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer ${
                            errors.startDate ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  {showStartCalendar && (
                    <div ref={startCalendarRef} className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 w-80">
                      {/* Calendar Header */}
                      <div className="flex items-center justify-between mb-4">
                        <button
                          type="button"
                          onClick={() => changeStartMonth(-1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <h3 className="text-lg font-semibold">
                          {startCalendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h3>
                        <button
                          type="button"
                          onClick={() => changeStartMonth(1)}
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
                        {getDaysInMonth(startCalendarDate).map((day, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => day && handleStartDateSelect(day)}
                            disabled={!day}
                            className={`
                              h-8 w-8 text-sm rounded hover:bg-blue-100 
                              ${!day ? 'invisible' : ''}
                              ${day && startDate && day.toDateString() === startDate.toDateString() 
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
                          value={startCalendarDate.getFullYear()}
                          onChange={(e) => setStartCalendarDate(new Date(startCalendarDate.setFullYear(parseInt(e.target.value))))}
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
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                )}
              </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date*</label>
                      <div className="relative">
                        <input 
                          value={endDate ? endDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : ''} 
                          onClick={() => !isCurrent && setShowEndCalendar(true)}
                          readOnly
                          placeholder="Select end date"
                          disabled={isCurrent}
                          className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.endDate ? 'border-red-500' : 'border-gray-300'
                          } ${isCurrent ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'cursor-pointer'}`}
                        />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  {showEndCalendar && !isCurrent && (
                    <div ref={endCalendarRef} className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 w-80">
                      {/* Calendar Header */}
                      <div className="flex items-center justify-between mb-4">
                        <button
                          type="button"
                          onClick={() => changeEndMonth(-1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <h3 className="text-lg font-semibold">
                          {endCalendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h3>
                        <button
                          type="button"
                          onClick={() => changeEndMonth(1)}
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
                        {getDaysInMonth(endCalendarDate).map((day, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => day && handleEndDateSelect(day)}
                            disabled={!day}
                            className={`
                              h-8 w-8 text-sm rounded hover:bg-blue-100 
                              ${!day ? 'invisible' : ''}
                              ${day && endDate && day.toDateString() === endDate.toDateString() 
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
                          value={endCalendarDate.getFullYear()}
                          onChange={(e) => setEndCalendarDate(new Date(endCalendarDate.setFullYear(parseInt(e.target.value))))}
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
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                )}
              </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                      <div className="relative">
                        <select 
                          value={employmentType} 
                          onChange={(e) => setEmploymentType(e.target.value)} 
                          className="w-full appearance-none bg-white border rounded-lg px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                        >
                          <option>Full Time</option>
                          <option>Part-time</option>
                          <option>Contract</option>
                          <option>Freelance</option>
                          <option>Internship</option>
                          <option>Volunteer</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        rows="4" 
                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300" 
                        placeholder="Describe your responsibilities, achievements, and key accomplishments in this role. Focus on specific results and skills you developed." 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

              {/* Add Another Experience Section */}
              <div className="mt-6">
                <button 
                  type="button" 
                  onClick={addAdditionalExperience}
                  disabled={additionalExperiences.length >= 5}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex flex-col items-center">
                    <svg className="w-5 h-5 mb-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="font-medium">Add Another Experience</span>
                  </div>
                </button>
                <p className="text-xs text-center text-gray-500 mt-2">
                  You can add up to 5 additional work experiences
                </p>
              </div>

            {/* Additional Experience Entries */}
            {additionalExperiences.map((exp, index) => (
              <div key={exp.id} className="mt-6 border border-gray-200 rounded-xl p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-900">Experience #{index + 2}</h4>
                  <button
                    onClick={() => removeAdditionalExperience(exp.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Job Title</label>
                    <input 
                      value={exp.jobTitle} 
                      onChange={(e) => updateAdditionalExperience(exp.id, 'jobTitle', e.target.value)} 
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="e.g., Junior Developer" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Company</label>
                    <input 
                      value={exp.company} 
                      onChange={(e) => updateAdditionalExperience(exp.id, 'company', e.target.value)} 
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="e.g., Startup Company" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Location</label>
                    <input 
                      value={exp.location} 
                      onChange={(e) => updateAdditionalExperience(exp.id, 'location', e.target.value)} 
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="e.g., Quezon City, Philippines" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Country</label>
                    <div className="relative">
                      <select 
                        value={exp.country} 
                        onChange={(e) => updateAdditionalExperience(exp.id, 'country', e.target.value)} 
                        className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option>Philippines</option>
                        <option>United States</option>
                        <option>Canada</option>
                        <option>Australia</option>
                        <option>Singapore</option>
                        <option>Other</option>
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                      <input 
                        type="checkbox" 
                        checked={exp.isCurrent} 
                        onChange={(e) => updateAdditionalExperience(exp.id, 'isCurrent', e.target.checked)} 
                      /> 
                      I am currently working in this role
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Start Date</label>
                    <div className="relative">
                      <input 
                        value={exp.startDate ? exp.startDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : ''} 
                        onClick={() => updateAdditionalExperience(exp.id, 'showStartCalendar', true)}
                        placeholder="Select start date"
                        className={`w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer ${
                          errors.startDate ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      
                      {exp.showStartCalendar && (
                        <div 
                          ref={el => additionalExperienceRefs.current[`start-${exp.id}`] = el}
                          className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 w-80"
                        >
                          {/* Calendar Header */}
                          <div className="flex items-center justify-between mb-4">
                            <button
                              type="button"
                              onClick={() => changeAdditionalStartMonth(exp.id, -1)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <h3 className="text-lg font-semibold">
                              {exp.startCalendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h3>
                            <button
                              type="button"
                              onClick={() => changeAdditionalStartMonth(exp.id, 1)}
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
                            {getDaysInMonth(exp.startCalendarDate).map((day, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => day && handleAdditionalStartDateSelect(exp.id, day)}
                                disabled={!day}
                                className={`
                                  h-8 w-8 text-sm rounded hover:bg-blue-100 
                                  ${!day ? 'invisible' : ''}
                                  ${day && exp.startDate && day.toDateString() === exp.startDate.toDateString() 
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
                              value={exp.startCalendarDate.getFullYear()}
                              onChange={(e) => {
                                const newDate = new Date(exp.startCalendarDate);
                                newDate.setFullYear(parseInt(e.target.value));
                                updateAdditionalExperience(exp.id, 'startCalendarDate', newDate);
                              }}
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
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">End Date</label>
                    <div className="relative">
                      <input 
                        value={exp.endDate ? exp.endDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : ''} 
                        onClick={() => !exp.isCurrent && updateAdditionalExperience(exp.id, 'showEndCalendar', true)}
                        placeholder="Select end date"
                        disabled={exp.isCurrent}
                        className={`w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          exp.isCurrent ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      
                      {exp.showEndCalendar && !exp.isCurrent && (
                        <div 
                          ref={el => additionalExperienceRefs.current[`end-${exp.id}`] = el}
                          className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 w-80"
                        >
                          {/* Calendar Header */}
                          <div className="flex items-center justify-between mb-4">
                            <button
                              type="button"
                              onClick={() => changeAdditionalEndMonth(exp.id, -1)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <h3 className="text-lg font-semibold">
                              {exp.endCalendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h3>
                            <button
                              type="button"
                              onClick={() => changeAdditionalEndMonth(exp.id, 1)}
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
                            {getDaysInMonth(exp.endCalendarDate).map((day, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => day && handleAdditionalEndDateSelect(exp.id, day)}
                                disabled={!day}
                                className={`
                                  h-8 w-8 text-sm rounded hover:bg-blue-100 
                                  ${!day ? 'invisible' : ''}
                                  ${day && exp.endDate && day.toDateString() === exp.endDate.toDateString() 
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
                              value={exp.endCalendarDate.getFullYear()}
                              onChange={(e) => {
                                const newDate = new Date(exp.endCalendarDate);
                                newDate.setFullYear(parseInt(e.target.value));
                                updateAdditionalExperience(exp.id, 'endCalendarDate', newDate);
                              }}
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
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 mb-1">Employment Type</label>
                    <div className="relative">
                      <select 
                        value={exp.employmentType} 
                        onChange={(e) => updateAdditionalExperience(exp.id, 'employmentType', e.target.value)} 
                        className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Contract</option>
                        <option>Freelance</option>
                        <option>Internship</option>
                        <option>Volunteer</option>
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 mb-1">Description</label>
                    <textarea 
                      value={exp.description} 
                      onChange={(e) => updateAdditionalExperience(exp.id, 'description', e.target.value)} 
                      rows="3" 
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Describe your responsibilities and achievements in this role." 
                    />
                  </div>
                </div>
              </div>
            ))}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button 
                  onClick={goBack} 
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleSkip} 
                    disabled={isLoading}
                    className={`text-sm font-medium transition-colors ${
                      isLoading 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-blue-600 hover:text-blue-800'
                    }`}
                  >
                    Skip for now
                  </button>
                  <button 
                    onClick={handleNext} 
                    disabled={!isFormValid || isLoading}
                    className={`inline-flex items-center px-6 py-2 text-white text-sm font-medium rounded-lg transition-all duration-200 ${
                      isFormValid && !isLoading
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
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

      <footer className="bg-white border-t border-gray-100 mt-12">
        <div className="mx-full px-6 sm:px-8 lg:px-10 xl:px-12 2xl:px-16 py-6">
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

export default JobseekerOnboardingExperience;


