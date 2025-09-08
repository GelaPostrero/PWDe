import React, { useState } from 'react';

const JobDetails = ({ data, onDataChange, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    jobDescription: data.jobDescription || '',
    requiredSkills: data.requiredSkills || [],
    applicationDeadline: data.applicationDeadline || ''
  });

  const [skillSearch, setSkillSearch] = useState('');
  const [additionalSkill, setAdditionalSkill] = useState('');

  const handleInputChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onDataChange(newData);
  };

  const handleNext = () => {
    onNext();
  };

  const suggestedSkills = [
    // Programming
    { name: 'JavaScript', category: 'Programming' },
    { name: 'Python', category: 'Programming' },
    { name: 'Java', category: 'Programming' },
    { name: 'React', category: 'Programming' },
    
    // Creative
    { name: 'Graphic Design', category: 'Creative' },
    { name: 'UI/UX Design', category: 'Creative' },
    { name: 'Web Design', category: 'Creative' },
    { name: 'Figma', category: 'Creative' },
    
    // Management
    { name: 'Project Management', category: 'Management' },
    { name: 'Product Management', category: 'Management' },
    { name: 'Team Leadership', category: 'Management' },
    { name: 'Agile/Scrum', category: 'Management' }
  ];

  const filteredSkills = suggestedSkills.filter(skill =>
    skill.name.toLowerCase().includes(skillSearch.toLowerCase()) &&
    !formData.requiredSkills.some(selected => selected.name === skill.name)
  );

  const addSkill = (skill) => {
    const newSkills = [...formData.requiredSkills, skill];
    handleInputChange('requiredSkills', newSkills);
  };

  const removeSkill = (skillToRemove) => {
    const newSkills = formData.requiredSkills.filter(skill => skill.name !== skillToRemove.name);
    handleInputChange('requiredSkills', newSkills);
  };

  const addCustomSkill = () => {
    if (additionalSkill.trim()) {
      const newSkill = { name: additionalSkill.trim(), category: 'Custom' };
      addSkill(newSkill);
      setAdditionalSkill('');
    }
  };

  const isSkillSelected = (skillName) => {
    return formData.requiredSkills.some(skill => skill.name === skillName);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Details & Requirements</h2>
        <p className="text-gray-600">Provide a clear overview of the role, key responsibilities, and the qualifications or experience needed for this position.</p>
      </div>

      {/* Job Description & Details */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Description & Details</h3>
        
        {/* Rich Text Editor Toolbar */}
        <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-3 flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-200 rounded">
            <span className="font-bold text-sm">B</span>
          </button>
          <button className="p-2 hover:bg-gray-200 rounded">
            <span className="italic text-sm">I</span>
          </button>
          <button className="p-2 hover:bg-gray-200 rounded">
            <span className="underline text-sm">U</span>
          </button>
          <div className="w-px h-6 bg-gray-300"></div>
          <button className="p-2 hover:bg-gray-200 rounded">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-200 rounded">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </button>
          <div className="w-px h-6 bg-gray-300"></div>
          <button className="p-2 hover:bg-gray-200 rounded">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-200 rounded">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-200 rounded">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
            </svg>
          </button>
        </div>
        
        <textarea
          value={formData.jobDescription}
          onChange={(e) => handleInputChange('jobDescription', e.target.value)}
          placeholder="Enter job description and details"
          rows={8}
          className="w-full px-4 py-3 border border-gray-300 border-t-0 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Required Skills */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Skills</h3>
        
        {/* Skill Search */}
        <div className="relative mb-4">
          <input
            type="text"
            value={skillSearch}
            onChange={(e) => setSkillSearch(e.target.value)}
            placeholder="Type to search skills (e.g., JavaScript, Project Management, Design)"
            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Selected Skills */}
        {formData.requiredSkills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {formData.requiredSkills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {skill.name} ({skill.category})
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {filteredSkills.map((skill, index) => (
            <button
              key={index}
              onClick={() => addSkill(skill)}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="text-left">
                <div className="font-medium text-gray-900">{skill.name}</div>
                <div className="text-sm text-gray-500">({skill.category})</div>
              </div>
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          ))}
        </div>

        {/* Add Additional Skills */}
        <div className="flex gap-2">
          <input
            type="text"
            value={additionalSkill}
            onChange={(e) => setAdditionalSkill(e.target.value)}
            placeholder="Add additional skills"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
          />
          <button
            onClick={addCustomSkill}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Application Deadline */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Deadline</h3>
        <div className="relative max-w-xs">
          <input
            type="text"
            value={formData.applicationDeadline}
            onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
            placeholder="mm/dd/yy"
            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default JobDetails;
