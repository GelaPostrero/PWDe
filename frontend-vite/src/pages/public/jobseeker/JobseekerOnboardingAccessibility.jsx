import React from 'react';
import { useNavigate } from 'react-router-dom';
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

const CheckboxItem = ({ children }) => (
  <label className="flex items-start gap-3 text-gray-700"><input type="checkbox" className="mt-1" /> <span>{children}</span></label>
);

const Section = ({ title, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
    <div className="text-gray-900 font-medium mb-3">{title}</div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">{children}</div>
  </div>
);

const JobseekerOnboardingAccessibility = () => {
  const navigate = useNavigate();
  const handleStepClick = (key) => navigate(routeForStep(key));
  const goBack = () => navigate(routeForStep('experience'));
  const handleNext = () => navigate(routeForStep('preferences'));
  const handleSkip = () => {
    const ok = window.confirm('Capturing accessibility needs helps us tailor inclusive opportunities. Skip for now?');
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

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
            <Stepper steps={steps} currentKey="accessibility" onStepClick={handleStepClick} />

            <h2 className="text-xl font-semibold text-gray-900">Accessibility Needs</h2>
            <p className="text-gray-600">Help us understand your accessibility needs to ensure the best job matches. <button className="text-blue-600">Select all that apply</button>.</p>

            <Section title="Visual Support Needs">
              <CheckboxItem>Screen reader compatibility required</CheckboxItem>
              <CheckboxItem>High contrast display support</CheckboxItem>
              <CheckboxItem>Large text/font size options</CheckboxItem>
              <CheckboxItem>Color-blind friendly interfaces</CheckboxItem>
              <CheckboxItem>Magnification software support</CheckboxItem>
              <CheckboxItem>Braille display compatibility</CheckboxItem>
              <CheckboxItem>Audio descriptions for visual content</CheckboxItem>
              <CheckboxItem>None of the above</CheckboxItem>
            </Section>

            <Section title="Hearing Support Needs">
              <CheckboxItem>Sign language interpretation</CheckboxItem>
              <CheckboxItem>Real-time captioning/subtitles</CheckboxItem>
              <CheckboxItem>Written communication preference</CheckboxItem>
              <CheckboxItem>Video relay services</CheckboxItem>
              <CheckboxItem>Hearing loop systems</CheckboxItem>
              <CheckboxItem>Visual alerts instead of audio</CheckboxItem>
              <CheckboxItem>TTY/TDD communication support</CheckboxItem>
              <CheckboxItem>None of the above</CheckboxItem>
            </Section>

            <Section title="Mobility Support Needs">
              <CheckboxItem>Wheelchair accessible workspace</CheckboxItem>
              <CheckboxItem>Adjustable desk/workstation</CheckboxItem>
              <CheckboxItem>Voice recognition software</CheckboxItem>
              <CheckboxItem>Alternative keyboard/mouse options</CheckboxItem>
              <CheckboxItem>Flexible work positioning</CheckboxItem>
              <CheckboxItem>Ergonomic equipment</CheckboxItem>
              <CheckboxItem>Reduced physical demands</CheckboxItem>
              <CheckboxItem>None of the above</CheckboxItem>
            </Section>

            <Section title="Cognitive Support Needs">
              <CheckboxItem>Extended time for tasks</CheckboxItem>
              <CheckboxItem>Quiet work environment</CheckboxItem>
              <CheckboxItem>Structured work routines</CheckboxItem>
              <CheckboxItem>Written instructions preference</CheckboxItem>
              <CheckboxItem>Flexible scheduling</CheckboxItem>
              <CheckboxItem>Memory aids/reminders</CheckboxItem>
              <CheckboxItem>Reduced multitasking</CheckboxItem>
              <CheckboxItem>None of the above</CheckboxItem>
            </Section>

            <div className="bg-white">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="text-gray-900 font-medium mb-2">Additional Information</div>
                <textarea rows="4" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Please share any other specific accommodation needs..." />
                <div className="mt-3 text-xs text-blue-700 bg-blue-50 border border-blue-100 rounded-lg p-3">This information is used only for job matching and accommodation purposes. Employers will only see relevant accommodation needs if you choose to share them.</div>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <button onClick={goBack} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Back</button>
              <div className="flex items-center gap-3">
                <button onClick={handleSkip} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Skip for now</button>
                <button onClick={handleNext} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Next</button>
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


