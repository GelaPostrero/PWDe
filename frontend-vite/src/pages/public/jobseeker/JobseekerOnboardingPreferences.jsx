import { useState, useEffect } from 'react';
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

const JobseekerOnboardingPreferences = () => {
  const navigate = useNavigate();
  const [workArrangement, setWorkArrangement] = useState('');
  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [experienceLevel, setExperienceLevel] = useState('');
  const [salaryRange, setSalaryRange] = useState({ currency: 'PHP', min: '', max: '' });
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validate form - work arrangement and experience level are required
  const validateForm = () => {
    return workArrangement.trim() !== '' && experienceLevel.trim() !== '';
  };

  // Update form validity when required fields change
  useEffect(() => {
    setIsFormValid(validateForm());
  }, [workArrangement, experienceLevel]);

  const handleStepClick = (key) => {
    const currentStepIndex = steps.findIndex(step => step.key === 'preferences');
    const targetStepIndex = steps.findIndex(step => step.key === key);
    
    // Allow going back, prevent going forward without completing form
    if (targetStepIndex > currentStepIndex && !isFormValid) {
      Swal.fire({
        icon: 'info',
        title: 'Complete Current Step',
        text: 'Please complete the required preferences before proceeding.',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        toast: true,
        position: 'bottom-end'
      });
      return;
    }
    
    navigate(routeForStep(key));
  };
  
  const goBack = () => navigate(routeForStep('accessibility'));

  const formatNumber = (value) => {
    if (!value) return "";
    const numericValue = value.replace(/\D/g, ""); // remove all non-digits
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // add commas
  };

  const handleSalaryChange = (field, value) => {
    const formatted = formatNumber(value);
    setSalaryRange((prev) => ({
      ...prev,
      [field]: formatted, // stored with commas now
    }));
  };

  const handleBlur = () => {
    const minVal = parseInt(salaryRange.min.replace(/,/g, ""), 10) || 0;
    const maxVal = parseInt(salaryRange.max.replace(/,/g, ""), 10) || 0;

    if (minVal && maxVal && minVal > maxVal) {
      Swal.fire({
        icon: 'error',
        html: `Oops! Your salary range does not seem right. Please check and try again.`,
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        customClass: { popup: 'rounded-xl' },
        toast: true,
        position: 'bottom-end'
      });
      setSalaryRange({ ...salaryRange, max: '', min: '' });
    }
  };

  const handleNext = async () => {
    console.log('Next button clicked in Preferences page');
    console.log('Current form state:', { 
      workArrangement, 
      employmentTypes, 
      experienceLevel, 
      salaryRange,
      isFormValid 
    });
    
    if (!validateForm()) {
      console.log('Form validation failed - missing required fields');
      Swal.fire({
        icon: 'warning',
        title: 'Required Fields Missing',
        text: 'Please select your work arrangement and experience level before proceeding.',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        toast: true,
        position: 'bottom-end'
      });
      return;
    }

    setIsLoading(true);
    console.log('Form validation passed, proceeding...');

    // Add minimum loading time to see spinner (remove this in production)
    const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));

    const token = localStorage.getItem('authToken');
    const preferencesData = {
      workArrangement,
      employmentTypes,
      experienceLevel,
      salaryRange,
    }
    
    try {
      const response = await api.post('/onboard/pwd/onboard/job-preferences', preferencesData);

      // Wait for both API call and minimum loading time
      await Promise.all([response, minLoadingTime]);
      
      if(response.data.success) {
        Swal.fire({
          icon: 'success',
          html: '<h5><b>Job Preferences & Requirements</b></h5>\n<h6>You may now complete your profile.</h6>',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          toast: true,
          position: 'bottom-end'
        });
        navigate(routeForStep('completion'))
      } else {
        console.error('API returned success: false', data);
        alert('Failed to save preferences. Please try again.');
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
        navigate(routeForStep('completion'));
      } else {
        alert('Failed to connect to the server. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    const ok = window.confirm('Preferences help us shortlist the best opportunities. Skip for now?');
    if (ok) handleNext();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <JobseekerHeader disabled={true} />

      <main className="flex-1 py-8">
        <div className="mx-full px-6 sm:px-8 lg:px-10 xl:px-12 2xl:px-16 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600 text-lg mb-3">🛠️</div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome to PWDe: AI-Powered Job Matching Platform</h1>
            <p className="text-gray-600 mt-2">Help us understand your skills and preferences to find the perfect job opportunities tailored for you.</p>
            <div className="mt-4 text-sm text-gray-600 bg-blue-50 border border-blue-100 inline-block px-4 py-2 rounded-lg">
              Our AI analyzes your profile to match you with inclusive employers and accessible positions.
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <Stepper 
              steps={steps} 
              currentKey="preferences" 
              onStepClick={handleStepClick}
              validationStates={{
                'skills': 'completed',
                'education': 'completed', 
                'experience': 'completed',
                'accessibility': 'completed',
                'preferences': isFormValid ? 'valid' : 'active'
              }}
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Job Preferences & Requirements</h2>
            <p className="text-gray-600">Tell us about your ideal work environment and job requirements. <button className="text-blue-600">Select all that apply.</button></p>

            <div className="space-y-6">
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="font-medium text-gray-900 mb-2">Work Arrangement <span className="text-red-500">*</span></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                  {[
                    'Remote - Work from anywhere',
                    'Hybrid - Mix of remote and office work',
                    'On-site - Work from office location',
                    'Flexible - Open to all options'
                  ].map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="radio"
                        value={option}
                        checked={workArrangement === option}
                        onChange={(e) => setWorkArrangement(e.target.value)}
                        name="workarr"
                      />
                      {option}
                    </label>
                  ))}
                </div>  
              </div>

              <div className="border border-gray-200 rounded-xl p-4">
                <div className="font-medium text-gray-900 mb-2">Employment Type</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                  {[
                    'Full-time (40+ hours/week)',
                    'Part-time (20-39 hours/week)',
                    'Contract/Freelance',
                    'Temporary/Seasonal',
                    'Internship',
                    'Volunteer opportunities'
                  ].map((type) => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={type}
                        checked={employmentTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEmploymentTypes([...employmentTypes, type]);
                          } else {
                            setEmploymentTypes(employmentTypes.filter((t) => t !== type));
                          }
                        }}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-4">
                <div className="font-medium text-gray-900 mb-2">Experience Level <span className="text-red-500">*</span></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                  {[
                    'Entry level (0-2 years)',
                    'Mid-level (3-5 years)',
                    'Senior level (6-10 years)',
                    'Expert level (10+ years)',
                    'Management/Leadership'
                  ].map((level) => (
                    <label key={level} className="flex items-center gap-2">
                      <input
                        type="radio"
                        value={level}
                        checked={experienceLevel === level}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                        name="explevel"
                      />
                      {level}
                    </label>
                  ))}
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-4">
                <div className="font-medium text-gray-900 mb-4">Salary Range (Optional)</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Currency</label>
                    <div className="relative">
                      <select className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>PHP (Philippine Peso)</option>
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Minimum</label>
                    <input 
                      type='text' 
                      value={salaryRange.min} 
                      onChange={(e) => handleSalaryChange("min", e.target.value)}
                      onBlur={handleBlur}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 30,000" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Maximum</label>
                    <input 
                      type='text'
                      value={salaryRange.max}
                      onChange={(e) => handleSalaryChange("max", e.target.value)}
                      onBlur={handleBlur}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 50,000" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <button 
                onClick={goBack} 
                disabled={isLoading}
                className={`px-4 py-2 border border-gray-200 hover:border-gray-300 rounded-lg transition-colors ${
                  isLoading 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Back
              </button>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleSkip} 
                  disabled={isLoading}
                  className={`px-4 py-2 border border-gray-200 hover:border-gray-300 rounded-lg transition-colors ${
                    isLoading 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Skip for now
                </button>
                <button 
                  onClick={handleNext} 
                  disabled={!isFormValid || isLoading}
                  className={`px-4 py-2 border border-gray-200 hover:border-gray-300 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    isFormValid && !isLoading
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Spinner size="sm" color="white" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    isFormValid ? 'Next' : 'Complete required fields'
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

export default JobseekerOnboardingPreferences;


