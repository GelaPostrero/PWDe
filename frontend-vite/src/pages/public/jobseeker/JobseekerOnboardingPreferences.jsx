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

const JobseekerOnboardingPreferences = () => {
  const navigate = useNavigate();
  const handleStepClick = (key) => navigate(routeForStep(key));
  const goBack = () => navigate(routeForStep('accessibility'));
  const handleNext = () => navigate(routeForStep('completion'));
  const handleSkip = () => {
    const ok = window.confirm('Preferences help us shortlist the best opportunities. Skip for now?');
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

          <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-6">
            <Stepper steps={steps} currentKey="preferences" onStepClick={handleStepClick} />

            <h2 className="text-xl font-semibold text-gray-900 mt-2">Job Preferences & Requirements</h2>
            <p className="text-gray-600">Tell us about your ideal work environment and job requirements. <button className="text-blue-600">Select all that apply.</button></p>

            <div className="space-y-6">
              <div className="border rounded-xl p-4">
                <div className="font-medium text-gray-900 mb-2">Work Arrangement</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                  <label className="flex items-center gap-2"><input type="radio" name="workarr" /> Remote - Work from anywhere</label>
                  <label className="flex items-center gap-2"><input type="radio" name="workarr" /> Hybrid - Mix of remote and office work</label>
                  <label className="flex items-center gap-2"><input type="radio" name="workarr" /> On-site - Work from office location</label>
                  <label className="flex items-center gap-2"><input type="radio" name="workarr" /> Flexible - Open to all options</label>
                </div>
              </div>

              <div className="border rounded-xl p-4">
                <div className="font-medium text-gray-900 mb-2">Employment Type</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                  <label className="flex items-center gap-2"><input type="checkbox" /> Full-time (40+ hours/week)</label>
                  <label className="flex items-center gap-2"><input type="checkbox" /> Part-time (20-39 hours/week)</label>
                  <label className="flex items-center gap-2"><input type="checkbox" /> Contract/Freelance</label>
                  <label className="flex items-center gap-2"><input type="checkbox" /> Temporary/Seasonal</label>
                  <label className="flex items-center gap-2"><input type="checkbox" /> Internship</label>
                  <label className="flex items-center gap-2"><input type="checkbox" /> Volunteer opportunities</label>
                </div>
              </div>

              <div className="border rounded-xl p-4">
                <div className="font-medium text-gray-900 mb-2">Experience Level</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                  <label className="flex items-center gap-2"><input type="radio" name="explevel" /> Entry level (0-2 years)</label>
                  <label className="flex items-center gap-2"><input type="radio" name="explevel" /> Mid-level (3-5 years)</label>
                  <label className="flex items-center gap-2"><input type="radio" name="explevel" /> Senior level (6-10 years)</label>
                  <label className="flex items-center gap-2"><input type="radio" name="explevel" /> Expert level (10+ years)</label>
                  <label className="flex items-center gap-2"><input type="radio" name="explevel" /> Management/Leadership</label>
                </div>
              </div>

              <div className="border rounded-xl p-4">
                <div className="font-medium text-gray-900 mb-4">Salary Range (Optional)</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Currency</label>
                    <div className="relative">
                      <select className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>PHP (Philippine Peso)</option>
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Minimum</label>
                    <input className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 30,000" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Maximum</label>
                    <input className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 50,000" />
                  </div>
                </div>
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

export default JobseekerOnboardingPreferences;


