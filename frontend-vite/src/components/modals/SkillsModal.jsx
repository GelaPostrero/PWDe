import React, { useState, useEffect } from 'react';

const initialSkills = [
  { id: 'javascript', label: 'JavaScript', category: 'Programming' },
  { id: 'python', label: 'Python', category: 'Programming' },
  { id: 'java', label: 'Java', category: 'Programming' },
  { id: 'react', label: 'React', category: 'Programming' },
  { id: 'graphic', label: 'Graphic Design', category: 'Creative' },
  { id: 'uiux', label: 'UI/UX Design', category: 'Creative' },
  { id: 'webdesign', label: 'Web Design', category: 'Creative' },
  { id: 'figma', label: 'Figma', category: 'Creative' },
  { id: 'pm', label: 'Project Management', category: 'Management' },
  { id: 'product', label: 'Product Management', category: 'Management' },
  { id: 'leadership', label: 'Team Leadership', category: 'Management' },
  { id: 'agile', label: 'Agile/Scrum', category: 'Management' },
];

const SkillsModal = ({ formData, onFormChange, onAddSkill, onRemoveSkill }) => {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [customSkill, setCustomSkill] = useState('');
  const [profession, setProfession] = useState(formData.profession || '');
  const [selected, setSelected] = useState(formData.skills || []);

  // Sync local state with formData prop changes
  useEffect(() => {
    // Update profession state when formData changes
    if (formData.profession !== profession) {
      setProfession(formData.profession || '');
    }
    
    setSelected(formData.skills || []);
  }, [formData.profession, formData.skills, profession]);

  const toggleSkill = (skillId) => {
    const skill = initialSkills.find(s => s.id === skillId);
    if (!skill) return;

    const skillLabel = `${skill.label} (${skill.category})`;
    
    if (selected.includes(skillLabel)) {
      const newSelected = selected.filter(s => s !== skillLabel);
      setSelected(newSelected);
      onFormChange('skills', newSelected);
    } else if (selected.length < 15) {
      const newSelected = [...selected, skillLabel];
      setSelected(newSelected);
      onFormChange('skills', newSelected);
    }
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && selected.length < 15) {
      const newSelected = [...selected, customSkill.trim()];
      setSelected(newSelected);
      onFormChange('skills', newSelected);
      setCustomSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    const newSelected = selected.filter(skill => skill !== skillToRemove);
    setSelected(newSelected);
    onFormChange('skills', newSelected);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Skills Assessment</h3>
        <p className="text-gray-600 mb-6">Search and select your skills to help us match you with the perfect opportunities</p>
        
        {/* Profession Category Dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profession Category *
          </label>
          <div className="relative">
            <select 
              value={profession || ''} 
              onChange={(e) => {
                setProfession(e.target.value);
                onFormChange('profession', e.target.value);
              }}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {!profession && <option value="" disabled hidden>Choose your profession</option>}
              <option value="Software Development">Software Development</option>
              <option value="Design">Design</option>
              <option value="Management">Management</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Customer Service">Customer Service</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Finance">Finance</option>
              <option value="Other">Other</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Skills Selection */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-gray-700">
              Select Skills ({selected.length})
            </div>
            <div className="text-xs text-gray-500">
              15 skills maximum
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type to search skills (e.g., JavaScript, Project Management, Design)"
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Selected Skills Tags */}
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selected.map((skill, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {initialSkills
              .filter(skill => 
                skill.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                skill.category.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((skill) => {
                const skillLabel = `${skill.label} (${skill.category})`;
                const isSelected = selected.includes(skillLabel);
                return (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => toggleSkill(skill.id)}
                    disabled={!isSelected && selected.length >= 15}
                    className={`flex items-center justify-between rounded-lg border p-4 text-left transition-all duration-200 ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 shadow-sm' 
                        : selected.length >= 15
                        ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{skill.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{skill.category}</div>
                    </div>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ml-3 ${
                      isSelected 
                        ? 'bg-blue-600 border-blue-600' 
                        : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
          </div>

          {/* Add Custom Skills Input */}
          <div className="mt-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Enter custom skill (e.g., Machine Learning, Digital Marketing)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
              />
              <button
                onClick={addCustomSkill}
                disabled={!customSkill.trim() || selected.length >= 15}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Tip: Add skills that are specific to your expertise and not already listed above
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsModal;
