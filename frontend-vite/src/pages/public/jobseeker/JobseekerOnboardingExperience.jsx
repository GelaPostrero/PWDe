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

const JobseekerOnboardingExperience = () => {
  const navigate = useNavigate();
  const [isCurrent, setIsCurrent] = useState(false);

  const handleStepClick = (key) => navigate(routeForStep(key));
  const goBack = () => navigate(routeForStep('education'));
  const handleNext = () => navigate(routeForStep('accessibility'));
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
            <Stepper steps={steps} currentKey="experience" onStepClick={handleStepClick} />

            <h2 className="text-xl font-semibold text-gray-900 mt-6">Experience</h2>
            <p className="text-gray-600 mt-1">Add your work experience starting with your most recent position</p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Job Title*</label>
                <input className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Software Developer" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Company*</label>
                <input className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Cebu City, Philippines" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Location*</label>
                <input className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Cebu City, Manila, Makati" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Country*</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Philippines</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={isCurrent} onChange={(e)=>setIsCurrent(e.target.checked)} /> I am currently working in this role
                </label>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Start Date*</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <select className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-3 pr-8 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m=> <option key={m}>{m}</option>)}
                    </select>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                  </div>
                  <div className="relative">
                    <select className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-3 pr-8 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      {Array.from({length: 60}).map((_,i)=>{ const y=2025-i; return <option key={y}>{y}</option>;})}
                    </select>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">End Date*</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <select disabled={isCurrent} className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-3 pr-8 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m=> <option key={m}>{m}</option>)}
                    </select>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                  </div>
                  <div className="relative">
                    <select disabled={isCurrent} className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-3 pr-8 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      {Array.from({length: 60}).map((_,i)=>{ const y=2025-i; return <option key={y}>{y}</option>;})}
                    </select>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Employment Type</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Freelance</option>
                    <option>Internship</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-1">Description</label>
                <textarea rows="4" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Describe your responsibilities, achievements, and key accomplishments in this role." />
              </div>
            </div>

            <div className="mt-6">
              <button type="button" className="mx-auto flex items-center gap-2 border rounded-lg px-4 py-2 text-blue-600 border-blue-200 hover:bg-blue-50">
                <span className="text-lg">＋</span> Add Another Experience
              </button>
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


