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

const CheckboxItem = ({ value, checked, onChange, children }) => (
  <label className="flex items-start gap-3 text-gray-700">
    <input 
      type="checkbox" 
      value={value}
      checked={checked}
      onChange={onChange}
      className="mt-1" 
    /> 
    <span>{children}</span>
  </label>
);

const handleCheckboxChange = (setter, currentValues, value) => {
  if (currentValues.includes(value)) {
    setter(currentValues.filter(v => v !== value)); // remove
  } else {
    setter([...currentValues, value]); // add
  }
};

const Section = ({ title, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
    <div className="text-gray-900 font-medium mb-3">{title}</div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">{children}</div>
  </div>
);

const JobseekerOnboardingAccessibility = () => {
  const navigate = useNavigate();
  const [visualNeeds, setVisualNeeds] = useState([]);
  const [hearingNeeds, setHearingNeeds] = useState([]);
  const [mobilityNeeds, setMobilityNeeds] = useState([]);
  const [cognitiveNeeds, setCognitiveNeeds] = useState([]);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validate form - at least one category should have selections
  const validateForm = () => {
    const hasSelections = visualNeeds.length > 0 || 
                         hearingNeeds.length > 0 || 
                         mobilityNeeds.length > 0 || 
                         cognitiveNeeds.length > 0;
    return hasSelections;
  };

  // Update form validity when selections change
  useEffect(() => {
    setIsFormValid(validateForm());
  }, [visualNeeds, hearingNeeds, mobilityNeeds, cognitiveNeeds]);

  const handleStepClick = (key) => {
    const currentStepIndex = steps.findIndex(step => step.key === 'accessibility');
    const targetStepIndex = steps.findIndex(step => step.key === key);
    
    // Allow going back, prevent going forward without completing form
    if (targetStepIndex > currentStepIndex && !isFormValid) {
      Swal.fire({
        icon: 'info',
        title: 'Complete Current Step',
        text: 'Please complete the accessibility needs selection before proceeding.',
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
  
  const goBack = () => navigate(routeForStep('experience'));
  const handleNext = async () => {
    console.log('Next button clicked in Accessibility page');
    console.log('Current form state:', { 
      visualNeeds, 
      hearingNeeds, 
      mobilityNeeds, 
      cognitiveNeeds,
      isFormValid 
    });
    
    if (!validateForm()) {
      console.log('Form validation failed - no accessibility needs selected');
      Swal.fire({
        icon: 'warning',
        title: 'Selection Required',
        text: 'Please select at least one accessibility need before proceeding.',
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
    const accessibilityData = {
      visualNeeds,
      hearingNeeds,
      mobilityNeeds,
      cognitiveNeeds,
      additionalInfo
    }
    
    try {
      const response = await api.post('/onboard/pwd/onboard/accessibility-needs', accessibilityData);

      // Wait for both API call and minimum loading time
      await Promise.all([response, minLoadingTime]);
      
      if(response.data.success) {
        Swal.fire({
          icon: 'success',
          html: '<h5><b>Accessibility Needs</b></h5>\n<h6>You may now fillup Job Preferences & Requirements.</h6>',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          toast: true,
          position: 'bottom-end'
        });
        navigate(routeForStep('preferences'))
      } else {
        console.error('API returned success: false', data);
        alert('Failed to save accessibility needs. Please try again.');
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
        navigate(routeForStep('preferences'));
      } else {
        alert('Failed to connect to the server. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleSkip = () => {
    const ok = window.confirm('Capturing accessibility needs helps us tailor inclusive opportunities. Skip for now?');
    if (ok) navigate(routeForStep('preferences'));;
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

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <Stepper 
              steps={steps} 
              currentKey="accessibility" 
              onStepClick={handleStepClick}
              validationStates={{
                'skills': 'completed',
                'education': 'completed', 
                'experience': 'completed',
                'accessibility': isFormValid ? 'valid' : 'active'
              }}
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Accessibility Needs</h2>
            <p className="text-gray-600">Help us understand your accessibility needs to ensure the best job matches. <button className="text-blue-600">Select all that apply</button>.</p>

            <Section title="Visual Support Needs">
              {[
                "Screen reader compatibility required",
                "High contrast display support",
                "Large text/font size options",
                "Color-blind friendly interfaces",
                "Magnification software support",
                "Braille display compatibility",
                "Audio descriptions for visual content",
                "None of the above"
              ].map(option => (
                <CheckboxItem
                  key={option}
                  value={option}
                  checked={visualNeeds.includes(option)}
                  onChange={() => handleCheckboxChange(setVisualNeeds, visualNeeds, option)}
                >
                  {option}
                </CheckboxItem>
              ))}
            </Section>

            <Section title="Hearing Support Needs">
              {[
                "Sign language interpretation",
                "Real-time captioning/subtitles",
                "Written communication preference",
                "Video relay services",
                "Hearing loop systems",
                "Visual alerts instead of audio",
                "TTY/TDD communication support",
                "None of the above"
              ].map(option => (
                <CheckboxItem
                  key={option}
                  value={option}
                  checked={hearingNeeds.includes(option)}
                  onChange={() => handleCheckboxChange(setHearingNeeds, hearingNeeds, option)}
                >
                  {option}
                </CheckboxItem>
              ))}
            </Section>

            <Section title="Mobility Support Needs">
              {[
                "Wheelchair accessible workspace",
                "Adjustable desk/workstation",
                "Voice recognition software",
                "Alternative keyboard/mouse options",
                "Flexible work positioning",
                "Ergonomic equipment",
                "Reduced physical demands",
                "None of the above"
              ].map(option => (
                <CheckboxItem
                  key={option}
                  value={option}
                  checked={mobilityNeeds.includes(option)}
                  onChange={() => handleCheckboxChange(setMobilityNeeds, mobilityNeeds, option)}
                >
                  {option}
                </CheckboxItem>
              ))}
            </Section>

            <Section title="Cognitive Support Needs">
              {[
                "Extended time for tasks",
                "Quiet work environment",
                "Structured work routines",
                "Written instructions preference",
                "Flexible scheduling",
                "Memory aids/reminders",
                "Reduced multitasking",
                "None of the above"
              ].map(option => (
                <CheckboxItem
                  key={option}
                  value={option}
                  checked={cognitiveNeeds.includes(option)}
                  onChange={() => handleCheckboxChange(setCognitiveNeeds, cognitiveNeeds, option)}
                >
                  {option}
                </CheckboxItem>
              ))}
            </Section>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-gray-900 font-medium mb-2">Additional Information</div>
              <textarea value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} rows="4" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Please share any other specific accommodation needs..." />
              <div className="mt-3 text-xs text-blue-700 bg-blue-50 border border-blue-100 rounded-lg p-3">This information is used only for job matching and accommodation purposes. Employers will only see relevant accommodation needs if you choose to share them.</div>
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
                    isFormValid ? 'Next' : 'Select at least one need'
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

export default JobseekerOnboardingAccessibility;


