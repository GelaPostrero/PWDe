import React, { useState, useEffect } from 'react';
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

const initialSkills = [
  { id: 'javascript', label: 'JavaScript', category: 'Programming' },
  { id: 'python', label: 'Python', category: 'Programming' },
  { id: 'java', label: 'Java', category: 'Programming' },
  { id: 'react', label: 'React', category: 'Programming' },
  { id: 'graphic', label: 'Graphic Design', category: 'Creative' },
  { id: 'uiux', label: 'UI/UX Design', category: 'Creative' },
  { id: 'webdesign', label: 'Web Design', category: 'Creative' },
  { id: 'figma', label: 'Figma', category: 'Creative' },
  { id: 'pm', label: 'Project Management', category: 'Management' },
  { id: 'product', label: 'Product Management', category: 'Management' },
  { id: 'leadership', label: 'Team Leadership', category: 'Management' },
  { id: 'agile', label: 'Agile/Scrum', category: 'Management' },
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

const JobseekerOnboardingSkills = () => {
  const navigate = useNavigate();
  const [profession, setProfession] = useState("");
  const [selected, setSelected] = useState([]);
  const [customSkill, setCustomSkill] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load saved data from localStorage on component mount
  React.useEffect(() => {
    const savedData = localStorage.getItem('jobseeker-skills-form');
    console.log('Loading saved skills data:', savedData);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log('Parsed skills data:', parsedData);
        console.log('Setting profession to:', parsedData.profession);
        console.log('Setting selected to:', parsedData.selected);
        setProfession(parsedData.profession || "");
        setSelected(parsedData.selected || []);
      } catch (error) {
        console.error('Error parsing saved skills data:', error);
      }
    } else {
      console.log('No saved data found in localStorage');
    }
    // Mark initial load as complete after a short delay
    setTimeout(() => setIsInitialLoad(false), 100);
  }, []);

  // Save form data to localStorage whenever profession or selected skills change
  React.useEffect(() => {
    // Don't save during initial load to avoid overwriting loaded data
    if (!isInitialLoad) {
      const formData = {
        profession,
        selected,
        timestamp: Date.now()
      };
      console.log('Saving skills data:', formData);
      localStorage.setItem('jobseeker-skills-form', JSON.stringify(formData));
    }
  }, [profession, selected, isInitialLoad]);

  const toggleSkill = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const handleStepClick = (key) => {
    // Only allow navigation to previous steps or current step
    const currentStepIndex = steps.findIndex(step => step.key === 'skills');
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

  const handleChange = (e) => {
    setProfession(e.target.value);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!profession) {
      newErrors.profession = "Please select your profession category";
    }
    
    if (selected.length === 0) {
      newErrors.skills = "Please select at least one skill";
    }
    
    if (selected.length > 15) {
      newErrors.skills = "Maximum 15 skills allowed";
    }
    
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setIsFormValid(isValid);
    return isValid;
  };

  // Check form validity on every change
  React.useEffect(() => {
    validateForm();
  }, [profession, selected]);

  const addCustomSkill = () => {
    if (customSkill.trim() && !selected.includes(customSkill.toLowerCase().replace(/\s+/g, '-'))) {
      const newSkill = {
        id: customSkill.toLowerCase().replace(/\s+/g, '-'),
        label: customSkill.trim(),
        category: 'Custom'
      };
      
      // Add to initialSkills if not already there
      if (!initialSkills.find(s => s.id === newSkill.id)) {
        initialSkills.push(newSkill);
      }
      
      setSelected(prev => [...prev, newSkill.id]);
      setCustomSkill("");
    }
  };

  const handleNext = async () => {
    console.log('Next button clicked in Skills page');
    console.log('Current form state:', { profession, selected, selectedLength: selected.length, isFormValid });
    
    if (!validateForm()) {
      console.log('Form validation failed:', errors);
      return;
    }

    setIsLoading(true);
    console.log('Form validation passed, proceeding...');

    // Add minimum loading time to see spinner (remove this in production)
    const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));

    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    const selectedSkill = selected.map((skillId) => {
      const skill = initialSkills.find(s => s.id === skillId);
      return skill ? `${skill.label} (${skill.category})` : null;
    })

    console.log('Sending data:', { selectedSkill, profession });

    try {
      const response = await api.post('/onboard/pwd/onboard/assessment', {
        selectedSkill,
        profession
      });

      // Wait for both API call and minimum loading time
      await Promise.all([response, minLoadingTime]);
      
      if(response.data.success) {
        // Don't clear saved form data - let user navigate back and see their data
        // localStorage.removeItem('jobseeker-skills-form');
        Swal.fire({
          icon: 'success',
          html: '<h5><b>Professional Skills Assessment</b></h5>\n<h6>You may now fillup your education data.</h6>',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          toast: true,
          position: 'bottom-end'
        })
        navigate(routeForStep('education'));
      } else {
        console.error('API returned success: false', data);
        alert('Failed to save skills. Please try again.');
      }
    } catch(error) {
      console.error('Server error.', error);
      
      // Check if it's a network error
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.log('Network error detected, proceeding with mock data');
        // Wait for minimum loading time even for network errors
        await minLoadingTime;
        // Don't clear saved form data - let user navigate back and see their data
        // localStorage.removeItem('jobseeker-skills-form');
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
        navigate(routeForStep('education'));
      } else {
        alert("Failed to connect to the server. Please try again later.")
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    const shouldSkip = window.confirm('Adding your skills greatly improves job matches. Do you want to skip for now?');
    if (shouldSkip) navigate(routeForStep('education'));
  };

  // Function to clear saved data (can be called from completion page)
  const clearSavedData = () => {
    localStorage.removeItem('jobseeker-skills-form');
  };

  // Make clearSavedData available globally for other components to call
  React.useEffect(() => {
    window.clearJobseekerSkillsData = clearSavedData;
    return () => {
      delete window.clearJobseekerSkillsData;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <JobseekerHeader disabled={true} />

      <main className="flex-5 py-10">
        {/* Consistent margin with header - matching max-w-15xl */}
        <div className="mx-full px-6 sm:px-8 lg:px-10 xl:px-12 2xl:px-16 space-y-6">
          
          {/* Welcome Section */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600 text-lg mb-3">🛠️</div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome to PWDe: AI-Powered Job Matching Platform</h1>
            <p className="text-gray-600 mt-2">Help us understand your skills and preferences to find the perfect job opportunities tailored for you.</p>
            <div className="mt-4 text-sm text-gray-600 bg-blue-50 border border-blue-100 inline-block px-4 py-2 rounded-lg">
              Our AI analyzes your profile to match you with inclusive employers and accessible positions.
            </div>
          </div>

          {/* Stepper - Outside of content box */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            <Stepper 
              steps={steps} 
              currentKey="skills" 
              onStepClick={handleStepClick}
              validationStates={{
                skills: isFormValid ? 'valid' : (Object.keys(errors).length > 0 ? 'error' : 'pending')
              }}
            />
          </div>

          {/* Main Content Box */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
            {/* Skills Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Professional Skills Assessment
                </h2>
                <p className="text-gray-600">
                  Search and select your skills to help us match you with the perfect opportunities
                </p>
              </div>

              {/* Profession Category Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profession Category *
                </label>
                <div className="relative">
                  <select 
                    value={profession} 
                    onChange={handleChange} 
                    className={`w-full appearance-none bg-white border rounded-lg px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.profession ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="" disabled hidden>Choose your profession</option>
                    <option value="Software Development">Software Development</option>
                    <option value="Design">Design</option>
                    <option value="Management">Management</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Customer Service">Customer Service</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Finance">Finance</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.profession && (
                  <p className="mt-1 text-sm text-red-600">{errors.profession}</p>
                )}
              </div>

              {/* Skills Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-gray-700">
                    Select Skills ({selected.length})
                  </div>
                  <div className="text-xs text-gray-500">
                    15 skills maximum
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Type to search skills (e.g., JavaScript, Project Management, Design)"
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Selected Skills Tags */}
                {selected.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selected.map((skillId) => {
                      const skill = initialSkills.find(s => s.id === skillId);
                      return skill ? (
                        <span key={skillId} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {skill.label} ({skill.category})
                          <button
                            onClick={() => toggleSkill(skillId)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>
                )}

                {/* Skills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {initialSkills
                    .filter(skill => 
                      skill.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      skill.category.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((skill) => {
                    const isSelected = selected.includes(skill.id);
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => toggleSkill(skill.id)}
                        disabled={!isSelected && selected.length >= 15}
                        className={`flex items-center justify-between rounded-lg border p-4 text-left transition-all duration-200 ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50 shadow-sm' 
                            : selected.length >= 15
                            ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{skill.label}</div>
                          <div className="text-xs text-gray-500 mt-1">{skill.category}</div>
                        </div>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ml-3 ${
                          isSelected 
                            ? 'bg-blue-600 border-blue-600' 
                            : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                
                {errors.skills && (
                  <p className="mt-2 text-sm text-red-600">{errors.skills}</p>
                )}

                {/* Add Custom Skills Input */}
                <div className="mt-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      placeholder="Enter custom skill (e.g., Machine Learning, Digital Marketing)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
                    />
                    <button
                      onClick={addCustomSkill}
                      disabled={!customSkill.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Tip: Add skills that are specific to your expertise and not already listed above
                  </p>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button 
                  onClick={() => navigate(-1)} 
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
                        ? 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105' 
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

      {/* Footer */}
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

export default JobseekerOnboardingSkills;