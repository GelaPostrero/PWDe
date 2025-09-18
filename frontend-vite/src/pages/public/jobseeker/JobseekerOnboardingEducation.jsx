import React, { useState } from 'react';
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

const JobseekerOnboardingEducation = () => {
  const navigate = useNavigate();
  const [institutionName, setinstitutionName] = useState('');
  const [location, setLocation] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [degree, setDegree] = useState('');
  const [graduationStatus, setGraduationStatus] = useState('Graduated');
  const [graduationYear, setGraduationYear] = useState('');
  const [additionalEducations, setAdditionalEducations] = useState([]);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load saved data from localStorage on component mount
  React.useEffect(() => {
    const savedData = localStorage.getItem('jobseeker-education-form');
    console.log('Loading saved education data:', savedData);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log('Parsed education data:', parsedData);
        setinstitutionName(parsedData.institutionName || '');
        setLocation(parsedData.location || '');
        setFieldOfStudy(parsedData.fieldOfStudy || '');
        setDegree(parsedData.degree || '');
        setGraduationStatus(parsedData.graduationStatus || 'Graduated');
        setGraduationYear(parsedData.graduationYear || '');
        setAdditionalEducations(parsedData.additionalEducations || []);
      } catch (error) {
        console.error('Error parsing saved education data:', error);
      }
    } else {
      console.log('No saved education data found in localStorage');
    }
    // Mark initial load as complete after a short delay
    setTimeout(() => setIsInitialLoad(false), 100);
  }, []);

  // Save form data to localStorage whenever form fields change
  React.useEffect(() => {
    // Don't save during initial load to avoid overwriting loaded data
    if (!isInitialLoad) {
      const formData = {
        institutionName,
        location,
        fieldOfStudy,
        degree,
        graduationStatus,
        graduationYear,
        additionalEducations,
        timestamp: Date.now()
      };
      console.log('Saving education data:', formData);
      localStorage.setItem('jobseeker-education-form', JSON.stringify(formData));
    }
  }, [institutionName, location, fieldOfStudy, degree, graduationStatus, graduationYear, additionalEducations, isInitialLoad]);

  const handleStepClick = (key) => {
    // Only allow navigation to previous steps or current step
    const currentStepIndex = steps.findIndex(step => step.key === 'education');
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

  const goBack = () => navigate(routeForStep('skills'));

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!institutionName.trim()) {
      newErrors.institutionName = "Institution name is required";
    }
    
    if (!location.trim()) {
      newErrors.location = "Location is required";
    }
    
    if (!fieldOfStudy.trim()) {
      newErrors.fieldOfStudy = "Field of study is required";
    }
    
    // Degree is optional based on the photo design
    
    if (graduationStatus === 'Graduated' && !graduationYear) {
      newErrors.graduationYear = "Graduation year is required";
    }
    
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setIsFormValid(isValid);
    return isValid;
  };

  // Check form validity on every change
  React.useEffect(() => {
    validateForm();
  }, [institutionName, location, fieldOfStudy, degree, graduationStatus, graduationYear]);

  const addAdditionalEducation = () => {
    if (additionalEducations.length < 5) {
      setAdditionalEducations([...additionalEducations, {
        institutionName: '',
        location: '',
        fieldOfStudy: '',
        degree: '',
        graduationStatus: 'Graduated',
        graduationYear: ''
      }]);
    }
  };

  const removeAdditionalEducation = (id) => {
    setAdditionalEducations(additionalEducations.filter(edu => edu.id !== id));
  };

  const updateAdditionalEducation = (id, field, value) => {
    setAdditionalEducations(additionalEducations.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const handleNext = async () => {
    if (!validateForm()) {
      console.log('Form validation failed:', errors);
      return;
    }

    setIsLoading(true);
    console.log('Form validation passed, proceeding...');

    // Add minimum loading time to see spinner (remove this in production)
    const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));

    const token = localStorage.getItem('authToken');
    const educationEntries = [{
        institutionName,
        location,
        fieldOfStudy,
        degree,
        graduationStatus,
        graduationYear,
      },
      ...additionalEducations
    ];

    const educationData = { educations: educationEntries };
    console.log('Submitting education data:', educationData);

    try {
      const response = await api.post('/onboard/pwd/onboard/education', educationData);

      // Wait for both API call and minimum loading time
      await Promise.all([response, minLoadingTime]);
      
      if(response.data.success) {
        Swal.fire({
          icon: 'success',
          html: '<h5><b>Education Background</b></h5>\n<h6>You may now fillup your work experience data.</h6>',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          toast: true,
          position: 'bottom-end'
        })
        navigate(routeForStep('experience'))
      } else {
        console.error('API returned success: false', data);
        alert('Failed to save education data. Please try again.');
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
        navigate(routeForStep('experience'));
      } else {
        alert('Failed to connect to the server. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleSkip = async () => {
    const shouldSkip = window.confirm('Education details help us match you with the right roles. Skip for now?');
    if (shouldSkip) {
      setIsLoading(true);
      
      // Add minimum loading time to see spinner (remove this in production)
      const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));

      try {
        // Send empty education data when skipping
        const response = await api.post('/onboard/pwd/onboard/education', { educations: [] });

        // Wait for both API call and minimum loading time
        await Promise.all([response, minLoadingTime]);
        
        if(response.data.success) {
          Swal.fire({
            icon: 'success',
            html: '<h5><b>Education Background</b></h5>\n<h6>You may now fillup your work experience data.</h6>',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            toast: true,
            position: 'bottom-end'
          })
          navigate(routeForStep('experience'))
        } else {
          console.error('API returned success: false', response.data);
          alert('Failed to save education data. Please try again.');
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
          navigate(routeForStep('experience'));
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
              currentKey="education" 
              onStepClick={handleStepClick}
              validationStates={{
                education: isFormValid ? 'valid' : (Object.keys(errors).length > 0 ? 'error' : 'pending')
              }}
            />
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Education & Qualifications</h2>
                <p className="text-gray-600">Tell us about your educational background.</p>
              </div>

              {/* Education Details Section */}
              <div>
                <div className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-900">Education #1</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Institution Name*</label>
                      <input 
                        value={institutionName} 
                        onChange={(e) => setinstitutionName(e.target.value)} 
                        className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.institutionName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., University of the Philippines Cebu" 
                      />
                      {errors.institutionName && (
                        <p className="mt-1 text-sm text-red-600">{errors.institutionName}</p>
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
                        placeholder="e.g., Cebu City, Philippines" 
                      />
                      {errors.location && (
                        <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study/Major*</label>
                      <input 
                        value={fieldOfStudy} 
                        onChange={(e) => setFieldOfStudy(e.target.value)} 
                        className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.fieldOfStudy ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., Computer Science, Business Administration" 
                      />
                      {errors.fieldOfStudy && (
                        <p className="mt-1 text-sm text-red-600">{errors.fieldOfStudy}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Degree/Certificate (Optional)</label>
                      <div className="relative">
                        <select 
                          value={degree} 
                          onChange={(e) => setDegree(e.target.value)} 
                          className={`w-full appearance-none bg-white border rounded-lg px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.degree ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value='' disabled hidden>Select degree type</option>
                          <option value="Certificate">Certificate</option>
                          <option value="Diploma">Diploma</option>
                          <option value="Bachelor's">Bachelor's</option>
                          <option value="Master's">Master's</option>
                          <option value="Doctorate">Doctorate</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {errors.degree && (
                        <p className="mt-1 text-sm text-red-600">{errors.degree}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Details</label>
                      <div className="flex items-center gap-4 text-sm text-gray-700">
                        <label className="inline-flex items-center gap-2">
                          <input 
                            type="radio" 
                            name="grad" 
                            checked={graduationStatus==='Graduated'} 
                            onChange={() => setGraduationStatus('Graduated')}
                            className="text-blue-600 focus:ring-blue-500"
                          /> 
                          Graduated
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input 
                            type="radio" 
                            name="grad" 
                            checked={graduationStatus==='Currently Studying'} 
                            onChange={() => setGraduationStatus('Currently Studying')}
                            className="text-blue-600 focus:ring-blue-500"
                          /> 
                          Currently Studying
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input 
                            type="radio" 
                            name="grad" 
                            checked={graduationStatus==='Did not complete'} 
                            onChange={() => setGraduationStatus('Did not complete')}
                            className="text-blue-600 focus:ring-blue-500"
                          /> 
                          Did not complete
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
                      <div className="relative">
                        <select 
                          value={graduationYear} 
                          onChange={(e) => setGraduationYear(e.target.value)} 
                          className={`w-full appearance-none bg-white border rounded-lg px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.graduationYear ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="" hidden>Select graduation year</option>
                          {Array.from({ length: 60 }).map((_, idx) => {
                            const year = 2025 - idx;
                            return <option value={year} key={year}>{year}</option>;
                          })}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {errors.graduationYear && (
                        <p className="mt-1 text-sm text-red-600">{errors.graduationYear}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Add Another Education Section */}
              <div className="mt-6">
                <button 
                  type="button" 
                  onClick={addAdditionalEducation}
                  disabled={additionalEducations.length >= 5}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex flex-col items-center">
                    <svg className="w-5 h-5 mb-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="font-medium">Add Another Education</span>
                  </div>
                </button>
                <p className="text-xs text-center text-gray-500 mt-2">
                  You can add up to 5 additional education entries
                </p>
              </div>

              {/* Additional Education Entries */}
              {additionalEducations.map((edu, index) => (
                <div key={edu.id} className="mt-6 border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-900">Education #{index + 2}</h4>
                    <button
                      onClick={() => removeAdditionalEducation(edu.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Institution Name</label>
                      <input 
                        value={edu.institutionName} 
                        onChange={(e) => updateAdditionalEducation(edu.id, 'institutionName', e.target.value)} 
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        placeholder="e.g., Technical Institute" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Location</label>
                      <input 
                        value={edu.location} 
                        onChange={(e) => updateAdditionalEducation(edu.id, 'location', e.target.value)} 
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        placeholder="e.g., Manila, Philippines" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Field of Study</label>
                      <input 
                        value={edu.fieldOfStudy} 
                        onChange={(e) => updateAdditionalEducation(edu.id, 'fieldOfStudy', e.target.value)} 
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        placeholder="e.g., Information Technology" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Degree/Certificate</label>
                      <div className="relative">
                        <select 
                          value={edu.degree} 
                          onChange={(e) => updateAdditionalEducation(edu.id, 'degree', e.target.value)} 
                          className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value='' disabled hidden>Select degree type</option>
                          <option value="Certificate">Certificate</option>
                          <option value="Diploma">Diploma</option>
                          <option value="Bachelor's">Bachelor's</option>
                          <option value="Master's">Master's</option>
                          <option value="Doctorate">Doctorate</option>
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Graduation Status</label>
                      <div className="flex items-center gap-4 text-sm text-gray-700">
                        <label className="inline-flex items-center gap-2">
                          <input 
                            type="radio" 
                            name={`grad-${edu.id}`} 
                            checked={edu.graduationStatus === 'Graduated'} 
                            onChange={() => updateAdditionalEducation(edu.id, 'graduationStatus', 'Graduated')} 
                          /> 
                          Graduated
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input 
                            type="radio" 
                            name={`grad-${edu.id}`} 
                            checked={edu.graduationStatus === 'Currently Studying'} 
                            onChange={() => updateAdditionalEducation(edu.id, 'graduationStatus', 'Currently Studying')} 
                          /> 
                          Currently Studying
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Graduation Year</label>
                      <div className="relative">
                        <select 
                          value={edu.graduationYear} 
                          onChange={(e) => updateAdditionalEducation(edu.id, 'graduationYear', e.target.value)} 
                          className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="" hidden>Select graduation year</option>
                          {Array.from({ length: 60 }).map((_, idx) => {
                            const year = 2025 - idx;
                            return <option value={year} key={year}>{year}</option>;
                          })}
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                      </div>
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

export default JobseekerOnboardingEducation;