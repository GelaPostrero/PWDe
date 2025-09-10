import React from 'react';

const ProfessionalSummaryModal = ({ formData, onFormChange }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
        <input
          type="text"
          value={formData.jobTitle || ''}
          onChange={(e) => onFormChange('jobTitle', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="e.g., Full Stack Developer, UX Designer"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Professional Summary *</label>
        <textarea
          value={formData.professionalSummary || ''}
          onChange={(e) => onFormChange('professionalSummary', e.target.value)}
          rows={6}
          maxLength={2000}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Describe your professional background, skills, and experience. This helps employers understand your expertise and value..."
        />
        <div className="flex justify-between items-center mt-2">
          <div className="text-sm text-gray-500">
            {formData.professionalSummary?.length || 0}/2000 characters
          </div>
          <div className="text-xs text-gray-400">
            💡 Tip: Include specific achievements and technologies you're proficient in
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate (USD)</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            value={formData.hourlyRate || ''}
            onChange={(e) => onFormChange('hourlyRate', e.target.value)}
            className="w-full pl-7 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="25"
            min="0"
            step="0.01"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Optional: Your preferred hourly rate for freelance work</p>
      </div>
    </div>
  );
};

export default ProfessionalSummaryModal;
