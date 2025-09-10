import React from 'react';

const AccessibilityNeedsModal = ({ formData, onFormChange }) => {
  const handleCheckboxChange = (category, option, checked) => {
    const current = formData[category] || [];
    if (checked) {
      onFormChange(category, [...current, option]);
    } else {
      onFormChange(category, current.filter(item => item !== option));
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Accessibility & Accommodation Needs</h3>
      <p className="text-gray-600 mb-6">Help us understand your accessibility requirements to ensure inclusive job matching.</p>
      
      <div className="border border-gray-200 rounded-xl p-4">
        <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Visual Support
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {['Screen reader', 'Magnification software', 'High contrast mode', 'Large text', 'Voice recognition', 'Braille display'].map((option) => (
            <label key={option} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={formData.visual?.includes(option) || false}
                onChange={(e) => handleCheckboxChange('visual', option, e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-xl p-4">
        <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          Hearing Support
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {['Hearing aids', 'Captioning services', 'Sign language interpreter', 'Visual alerts', 'Assistive listening devices', 'Written communication'].map((option) => (
            <label key={option} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={formData.hearing?.includes(option) || false}
                onChange={(e) => handleCheckboxChange('hearing', option, e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccessibilityNeedsModal;
