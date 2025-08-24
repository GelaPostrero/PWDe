import React, { useState } from 'react';
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

const JobseekerOnboardingEducation = () => {
  const navigate = useNavigate();

  const [graduationStatus, setGraduationStatus] = useState('graduated');

  const handleStepClick = (key) => {
    navigate(routeForStep(key));
  };

  const goBack = () => navigate(routeForStep('skills'));
  const handleNext = () => navigate(routeForStep('experience'));
  const handleSkip = () => {
    const ok = window.confirm('Education details help us match you with the right roles. Skip for now?');
    if (ok) handleNext();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <JobseekerHeader />

      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-6 space-y-6">
          <div className="bg-white rounded-2xl border shadow-sm p-8 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600 text-lg mb-3">🛠️</div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome to PWDe: AI-Powered Job Matching Platform</h1>
            <p className="text-gray-600 mt-2">Help us understand your skills and preferences to find the perfect job opportunities tailored for you.</p>
            <div className="mt-4 text-sm text-gray-600 bg-blue-50 border border-blue-100 inline-block px-4 py-2 rounded-lg">
              Our AI analyzes your profile to match you with inclusive employers and accessible positions.
            </div>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <Stepper steps={steps} currentKey="education" onStepClick={handleStepClick} />

            <h2 className="text-xl font-semibold text-gray-900 mt-6">Education & Qualifications</h2>
            <p className="text-gray-600 mt-1">Tell us about your educational background.</p>

            <div className="mt-4">
              <label className="block text-sm text-gray-700 mb-1">Highest Level of Education Completed</label>
              <div className="relative">
                <select className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Choose your highest level of education</option>
                  <option>High School</option>
                  <option>Vocational/Technical</option>
                  <option>Bachelor's Degree</option>
                  <option>Master's Degree</option>
                  <option>Doctorate</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
              </div>
            </div>

            <div className="mt-6 border rounded-xl p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Institution Name*</label>
                  <input className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., University of the Philippines Cebu" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Location*</label>
                  <input className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Cebu City, Philippines" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Field of Study/Major*</label>
                  <input className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Computer Science" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Degree/Certificate*</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Select degree type</option>
                      <option>Certificate</option>
                      <option>Diploma</option>
                      <option>Bachelor's</option>
                      <option>Master's</option>
                      <option>Doctorate</option>
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Graduation Details</label>
                  <div className="flex items-center gap-4 text-sm text-gray-700">
                    <label className="inline-flex items-center gap-2">
                      <input type="radio" name="grad" checked={graduationStatus==='graduated'} onChange={() => setGraduationStatus('graduated')} /> Graduated
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input type="radio" name="grad" checked={graduationStatus==='current'} onChange={() => setGraduationStatus('current')} /> Currently Studying
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input type="radio" name="grad" checked={graduationStatus==='incomplete'} onChange={() => setGraduationStatus('incomplete')} /> Did not complete
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Graduation Year</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Select graduation year</option>
                      {Array.from({ length: 60 }).map((_, idx) => {
                        const year = 2025 - idx;
                        return <option key={year}>{year}</option>;
                      })}
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button type="button" className="mx-auto flex items-center gap-2 border rounded-lg px-4 py-2 text-blue-600 border-blue-200 hover:bg-blue-50">
                  <span className="text-lg">＋</span> Add Another Education
                </button>
                <p className="text-xs text-center text-gray-500 mt-2">You can add up to 5 additional education entries</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button onClick={goBack} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Back</button>
              <div className="flex items-center gap-3">
                <button onClick={handleSkip} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Skip for now</button>
                <button onClick={handleNext} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Next</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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


