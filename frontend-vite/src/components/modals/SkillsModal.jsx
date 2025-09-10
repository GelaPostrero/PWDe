import React from 'react';

const SkillsModal = ({ formData, onFormChange, onAddSkill, onRemoveSkill }) => {
  const handleAddSkill = () => {
    const input = document.querySelector('input[placeholder*="Type to search skills"]');
    if (input && input.value.trim()) {
      onAddSkill('skills', input.value.trim());
      input.value = '';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      onAddSkill('skills', e.target.value.trim());
      e.target.value = '';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Skills Assessment</h3>
        <p className="text-gray-600 mb-6">Search and select your skills to help us match you with the perfect opportunities</p>
        
        {/* Add New Skill */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Add New Skill</label>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Type to search skills (e.g., JavaScript, Project Management, Design)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={handleAddSkill}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add
            </button>
          </div>
        </div>

        {/* Selected Skills */}
        {formData.skills?.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">
                Selected Skills ({formData.skills.length})
              </label>
              <div className="text-xs text-gray-500">
                15 skills maximum
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <div key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {skill}
                  <button
                    onClick={() => onRemoveSkill('skills', index)}
                    className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Additional Skills Button */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-300 hover:bg-blue-50 transition-colors">
          <svg className="w-5 h-5 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <p className="text-sm text-gray-500">
            💡 Tip: Add skills that are specific to your expertise and not already listed above
          </p>
        </div>
      </div>
    </div>
  );
};

export default SkillsModal;
