import React from 'react';

const EmploymentPreferencesModal = ({ formData, onFormChange }) => {
  const handleCheckboxChange = (field, value, checked) => {
    const current = formData[field] || [];
    if (checked) {
      onFormChange(field, [...current, value]);
    } else {
      onFormChange(field, current.filter(item => item !== value));
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Preferences</h3>
      <p className="text-gray-600 mb-6">Set your preferences to help us match you with the right opportunities.</p>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Work Arrangement *</label>
        <div className="relative">
          <select
            value={formData.workArrangement || ''}
            onChange={(e) => onFormChange('workArrangement', e.target.value)}
            className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="" disabled hidden>Choose your preferred work arrangement</option>
            <option value="Remote">Remote - Work from anywhere</option>
            <option value="On-site">On-site - Office-based work</option>
            <option value="Hybrid">Hybrid - Mix of remote and office</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Employment Type *</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Full-time', 'Part-time', 'Contract', 'Freelance'].map((type) => (
            <label key={type} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={formData.employmentType?.includes(type) || false}
                onChange={(e) => handleCheckboxChange('employmentType', type, e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level *</label>
        <div className="relative">
          <select
            value={formData.experienceLevel || ''}
            onChange={(e) => onFormChange('experienceLevel', e.target.value)}
            className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="" disabled hidden>Choose your experience level</option>
            <option value="Entry">Entry Level (0-2 years)</option>
            <option value="Mid">Mid Level (3-5 years)</option>
            <option value="Senior">Senior Level (6+ years)</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Salary Range (PHP)</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Minimum Salary</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₱</span>
              </div>
              <input
                type="number"
                value={formData.salaryRange?.min || ''}
                onChange={(e) => onFormChange('salaryRange', { ...formData.salaryRange, min: e.target.value })}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="50000"
                min="0"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Maximum Salary</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₱</span>
              </div>
              <input
                type="number"
                value={formData.salaryRange?.max || ''}
                onChange={(e) => onFormChange('salaryRange', { ...formData.salaryRange, max: e.target.value })}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="100000"
                min="0"
              />
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">Optional: Your preferred salary range for job matching</p>
      </div>
    </div>
  );
};

export default EmploymentPreferencesModal;
