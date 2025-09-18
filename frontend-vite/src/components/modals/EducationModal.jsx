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
          <label className="block text-sm font-medium text-gray-700 mb-2">Institution Name *</label>
          <input
            type="text"
            value={formData.institution || ''}
            onChange={(e) => onFormChange('institution', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="e.g., University of the Philippines Cebu"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
          <input
            type="text"
            value={formData.location || ''}
            onChange={(e) => onFormChange('location', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="e.g., Cebu City, Philippines"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study/Major *</label>
          <input
            type="text"
            value={formData.fieldOfStudy || ''}
            onChange={(e) => onFormChange('fieldOfStudy', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="e.g., Computer Science, Business Administration"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Degree/Certificate (Optional)</label>
          <div className="relative">
            <select
              value={formData.degree || ''}
              onChange={(e) => onFormChange('degree', e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="" disabled hidden>Select degree type</option>
              <option value="Certificate">Certificate</option>
              <option value="Diploma">Diploma</option>
              <option value="Bachelor's">Bachelor's</option>
              <option value="Master's">Master's</option>
              <option value="Doctorate">Doctorate</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Details</label>
        <div className="flex items-center gap-4 text-sm text-gray-700">
          <label className="inline-flex items-center gap-2">
            <input 
              type="radio" 
              name="graduationStatus" 
              checked={formData.graduationStatus === 'Graduated'} 
              onChange={() => onFormChange('graduationStatus', 'Graduated')}
              className="text-blue-600 focus:ring-blue-500"
            /> 
            Graduated
          </label>
          <label className="inline-flex items-center gap-2">
            <input 
              type="radio" 
              name="graduationStatus" 
              checked={formData.graduationStatus === 'Currently Studying'} 
              onChange={() => onFormChange('graduationStatus', 'Currently Studying')}
              className="text-blue-600 focus:ring-blue-500"
            /> 
            Currently Studying
          </label>
          <label className="inline-flex items-center gap-2">
            <input 
              type="radio" 
              name="graduationStatus" 
              checked={formData.graduationStatus === 'Did not complete'} 
              onChange={() => onFormChange('graduationStatus', 'Did not complete')}
              className="text-blue-600 focus:ring-blue-500"
            /> 
            Did not complete
          </label>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Year Graduated/Expected</label>
          <div className="relative">
            <select
              value={formData.yearGraduated || ''}
              onChange={(e) => onFormChange('yearGraduated', e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="" disabled hidden>Select year</option>
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
    </div>
  );
};

export default EducationModal;