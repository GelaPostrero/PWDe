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

  const formatNumber = (value) => {
    if (!value) return "";
    const numericValue = value.replace(/\D/g, ""); // remove all non-digits
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // add commas
  };

  const handleSalaryChange = (field, value) => {
    const formatted = formatNumber(value);
    onFormChange('salaryRange', {
      ...formData.salaryRange,
      [field]: formatted
    });
  };

  const handleBlur = () => {
    const minVal = parseInt((formData.salaryRange?.min || "").replace(/,/g, ""), 10) || 0;
    const maxVal = parseInt((formData.salaryRange?.max || "").replace(/,/g, ""), 10) || 0;

    if (minVal && maxVal && minVal > maxVal) {
      onFormChange('salaryRange', { 
        ...formData.salaryRange, 
        max: '', 
        min: '' 
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Preferences & Requirements</h3>
      <p className="text-gray-600 mb-6">Tell us about your ideal work environment and job requirements. <button className="text-blue-600">Select all that apply.</button></p>
      
      <div className="space-y-6">
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="font-medium text-gray-900 mb-2">Work Arrangement <span className="text-red-500">*</span></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
            {[
              'Remote - Work from anywhere',
              'Hybrid - Mix of remote and office work',
              'On-site - Work from office location',
              'Flexible - Open to all options'
            ].map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={option}
                  checked={formData.workArrangement === option}
                  onChange={(e) => onFormChange('workArrangement', e.target.value)}
                  name="workarr"
                />
                {option}
              </label>
            ))}
          </div>  
        </div>

        <div className="border border-gray-200 rounded-xl p-4">
          <div className="font-medium text-gray-900 mb-2">Employment Type</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
            {[
              'Full-time (40+ hours/week)',
              'Part-time (20-39 hours/week)',
              'Contract/Freelance',
              'Temporary/Seasonal',
              'Internship',
              'Volunteer opportunities'
            ].map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={type}
                  checked={formData.employmentTypes?.includes(type) || false}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onFormChange('employmentTypes', [...(formData.employmentTypes || []), type]);
                    } else {
                      onFormChange('employmentTypes', (formData.employmentTypes || []).filter((t) => t !== type));
                    }
                  }}
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-4">
          <div className="font-medium text-gray-900 mb-2">Experience Level <span className="text-red-500">*</span></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
            {[
              'Entry level (0-2 years)',
              'Mid-level (3-5 years)',
              'Senior level (6-10 years)',
              'Expert level (10+ years)',
              'Management/Leadership'
            ].map((level) => (
              <label key={level} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={level}
                  checked={formData.experienceLevel === level}
                  onChange={(e) => onFormChange('experienceLevel', e.target.value)}
                  name="explevel"
                />
                {level}
              </label>
            ))}
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-4">
          <div className="font-medium text-gray-900 mb-4">Salary Range (Optional)</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Currency</label>
              <div className="relative">
                <select className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>PHP (Philippine Peso)</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Frequency</label>
              <div className="relative">
                <select 
                  value={formData.salaryRange?.frequency || ''}
                  onChange={(e) => onFormChange('salaryRange', { ...formData.salaryRange, frequency: e.target.value })}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select frequency</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Bi-weekly">Bi-weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                  <option value="Hourly">Hourly</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Minimum</label>
              <input 
                type='text' 
                value={formData.salaryRange?.min || ''} 
                onChange={(e) => handleSalaryChange("min", e.target.value)}
                onBlur={handleBlur}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="e.g. 30,000" 
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Maximum</label>
              <input 
                type='text'
                value={formData.salaryRange?.max || ''}
                onChange={(e) => handleSalaryChange("max", e.target.value)}
                onBlur={handleBlur}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="e.g. 50,000" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmploymentPreferencesModal;
