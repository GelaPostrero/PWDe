import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import JobseekerHeader from '../../../components/ui/JobseekerHeader.jsx';
import Stepper from '../../../components/ui/Stepper.jsx';

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

  const addAdditionalExperience = () => {
    if (additionalExperiences.length < 5) {
      setAdditionalExperiences([...additionalExperiences, {
        id: Date.now(),
        jobTitle: '',
        company: '',
        location: '',
        country: 'Philippines',
        startDate: null,
        endDate: null,
        isCurrent: false,
        employmentType: 'Full-time',
        description: ''
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

    console.log('Form validation passed, proceeding...');

    const token = localStorage.getItem('authToken');
    const experienceData = {
      jobTitle,
      company,
      location,
      country,
      startDate: startDate ? startDate.toISOString() : null,
      endDate: isCurrent ? null : (endDate ? endDate.toISOString() : null),
      isCurrent,
      employmentType,
      description,
      additionalExperiences: additionalExperiences.filter(exp => 
        exp.jobTitle.trim() && exp.company.trim() && exp.location.trim()
      )
    };

    console.log('Sending experience data:', experienceData);

    try {
      // Check if we have a valid token
      if (!token) {
        console.log('No auth token found, proceeding with mock data');
        // Mock success for development
        Swal.fire({
          icon: 'success',
          html: '<h5><b>Work Experience</b></h5>\n<h6>You may now fillup your Accessibility needs.</h6>',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          toast: true,
          position: 'bottom-end'
        });
        navigate(routeForStep('accessibility'));
        return;
      }

      var url = "http://localhost:4000/onboard/pwd/onboard/work-experience";
      var headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
      
      console.log('Attempting to connect to:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(experienceData)
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API response:', data);
      
      if(data.success) {
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
    }
  };
  const handleSkip = () => {
    const ok = window.confirm('Adding your work history improves matching quality. Skip for now?');
    if (ok) handleNext();
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

            <h2 className="text-xl font-semibold text-gray-900 mt-6">Experience</h2>
            <p className="text-gray-600 mt-1">Add your work experience starting with your most recent position</p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Job Title*</label>
                <input 
                  value={jobTitle} 
                  onChange={(e) => setJobTitle(e.target.value)} 
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.jobTitle ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="e.g., Software Developer" 
                />
                {errors.jobTitle && (
                  <p className="mt-1 text-sm text-red-600">{errors.jobTitle}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Company*</label>
                <input 
                  value={company} 
                  onChange={(e) => setCompany(e.target.value)} 
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.company ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="e.g., Tech Solutions Inc." 
                />
                {errors.company && (
                  <p className="mt-1 text-sm text-red-600">{errors.company}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Location*</label>
                <input 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.location ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="e.g., Cebu City, Manila, Makati" 
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Country*</label>
                <div className="relative">
                  <select 
                    value={country} 
                    onChange={(e) => setCountry(e.target.value)} 
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
                    checked={isCurrent} 
                    onChange={(e) => setIsCurrent(e.target.checked)} 
                  /> 
                  I am currently working in this role
                </label>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Start Date*</label>
                <input 
                  type="month"
                  value={startDate ? startDate.toISOString().slice(0, 7) : ''} 
                  onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value + '-01') : null)} 
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.startDate ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">End Date*</label>
                <input 
                  type="month"
                  value={endDate ? endDate.toISOString().slice(0, 7) : ''} 
                  onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value + '-01') : null)} 
                  disabled={isCurrent}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.endDate ? 'border-red-500' : 'border-gray-200'
                  } ${isCurrent ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Employment Type</label>
                <div className="relative">
                  <select 
                    value={employmentType} 
                    onChange={(e) => setEmploymentType(e.target.value)} 
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
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  rows="4" 
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Describe your responsibilities, achievements, and key accomplishments in this role." 
                />
              </div>
            </div>

            <div className="mt-6">
              <button 
                type="button" 
                onClick={addAdditionalExperience}
                disabled={additionalExperiences.length >= 5}
                className="mx-auto flex items-center gap-2 border rounded-lg px-4 py-2 text-blue-600 border-blue-200 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-lg">＋</span> Add Another Experience
              </button>
              <p className="text-xs text-center text-gray-500 mt-2">
                You can add up to 5 additional work experiences ({additionalExperiences.length}/5)
              </p>
            </div>

            {/* Additional Experience Entries */}
            {additionalExperiences.map((exp, index) => (
              <div key={exp.id} className="mt-6 border border-gray-200 rounded-xl p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-900">Additional Experience #{index + 1}</h4>
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
                    <input 
                      type="month"
                      value={exp.startDate ? exp.startDate.toISOString().slice(0, 7) : ''} 
                      onChange={(e) => updateAdditionalExperience(exp.id, 'startDate', e.target.value ? new Date(e.target.value + '-01') : null)} 
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">End Date</label>
                    <input 
                      type="month"
                      value={exp.endDate ? exp.endDate.toISOString().slice(0, 7) : ''} 
                      onChange={(e) => updateAdditionalExperience(exp.id, 'endDate', e.target.value ? new Date(e.target.value + '-01') : null)} 
                      disabled={exp.isCurrent}
                      className={`w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        exp.isCurrent ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''
                      }`}
                    />
                  </div>
                  <div>
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

            <div className="mt-6 flex items-center justify-between">
              <button onClick={goBack} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Back</button>
              <div className="flex items-center gap-3">
                <button onClick={handleSkip} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Skip for now</button>
                <button 
                  onClick={handleNext} 
                  disabled={!isFormValid}
                  className={`px-4 py-2 text-white rounded-lg transition-all duration-200 ${
                    isFormValid 
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isFormValid ? 'Next' : 'Complete Form'}
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


