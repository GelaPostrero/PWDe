import React from 'react';

const EducationModal = ({ formData, onFormChange, isEditing = false }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Education & Qualifications</h3>
      <p className="text-gray-600 mb-6">Tell us about your educational background.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Degree/Program *</label>
          <input
            type="text"
            value={formData.degree || ''}
            onChange={(e) => onFormChange('degree', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="e.g., Bachelor of Science in Computer Science"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Institution *</label>
          <input
            type="text"
            value={formData.institution || ''}
            onChange={(e) => onFormChange('institution', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="e.g., University of the Philippines Cebu"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Year *</label>
          <div className="relative">
            <select
              value={formData.startYear || ''}
              onChange={(e) => onFormChange('startYear', e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="" disabled hidden>Select start year</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">End Year</label>
          <div className="relative">
            <select
              value={formData.endYear || ''}
              onChange={(e) => onFormChange('endYear', e.target.value)}
              disabled={formData.isCurrent}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100"
            >
              <option value="" disabled hidden>Select end year</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <input
          type="checkbox"
          id="isCurrent"
          checked={formData.isCurrent || false}
          onChange={(e) => onFormChange('isCurrent', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isCurrent" className="ml-3 block text-sm text-gray-700">
          I am currently studying this program
        </label>
      </div>
    </div>
  );
};

export default EducationModal;
