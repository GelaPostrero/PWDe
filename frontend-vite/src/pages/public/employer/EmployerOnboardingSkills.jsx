import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import EmployerHeader from '../../../components/ui/EmployerHeader.jsx';

const EmployerOnboardingSkills = () => {
  const navigate = useNavigate();
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedRoles, setSelectedRoles] = useState(['Software Developer', 'Customer Support', 'Data Analyst']);
  const [selectedSkills, setSelectedSkills] = useState(['JavaScript (Programming)', 'UI/UX Design (Creative)', 'Project Management (Management)']);

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Consulting',
    'Non-profit',
    'Other'
  ];

  const suggestedRoles = [
    { name: 'Software Developer', category: 'Programming' },
    { name: 'Customer Support', category: 'Service' },
    { name: 'Data Analyst', category: 'Analytics' },
    { name: 'Content Writer', category: 'Creative' },
    { name: 'Sales Representative', category: 'Sales' },
    { name: 'Marketing Specialist', category: 'Marketing' },
    { name: 'Project Manager', category: 'Management' },
    { name: 'UX Designer', category: 'Design' },
    { name: 'Quality Assurance', category: 'Testing' }
  ];

  const suggestedSkills = [
    { name: 'JavaScript', category: 'Programming' },
    { name: 'UI/UX Design', category: 'Creative' },
    { name: 'Project Management', category: 'Management' },
    { name: 'Python', category: 'Programming' },
    { name: 'Java', category: 'Programming' },
    { name: 'React', category: 'Programming' },
    { name: 'Graphic Design', category: 'Creative' },
    { name: 'Web Design', category: 'Creative' },
    { name: 'Figma', category: 'Creative' },
    { name: 'Product Management', category: 'Management' },
    { name: 'Team Leadership', category: 'Management' },
    { name: 'Agile/Scrum', category: 'Management' }
  ];

  const handleRoleToggle = (role) => {
    if (selectedRoles.includes(role.name)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role.name));
    } else {
      setSelectedRoles([...selectedRoles, role.name]);
    }
  };

  const handleSkillToggle = (skill) => {
    if (selectedSkills.includes(skill.name + ' (' + skill.category + ')')) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill.name + ' (' + skill.category + ')'));
    } else {
      setSelectedSkills([...selectedSkills, skill.name + ' (' + skill.category + ')']);
    }
    console.log("Selected Skill: " + selectedSkills);
  };

  const removeRole = (role) => {
    setSelectedRoles(selectedRoles.filter(r => r !== role));
  };

  const removeSkill = (skill) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };

  const handleNext = async () => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const cleanSkills = selectedSkills.map(skill => skill.split(" (")[0]);
    console.log(`Selected Industry: ${selectedIndustry} \nSelected Role: ${selectedRoles} \nSelected SKill: ${cleanSkills}`); //debu

    try {
      var url = "http://localhost:4000/onboard/emp/onboard/jobroles-requirements";
      var headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({selectedIndustry, selectedRoles, cleanSkills})
      });

      const data = await response.json();
      console.log("Errpr: ", data.error);
      if(data.success) {
        Swal.fire({
          icon: 'success',
          html: '<h5><b>Job Roles & Requirements</b></h5>\n<h6>You may now fillup your Work Environment.</h6>',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          toast: true,
          position: 'bottom-end'
        })
        navigate('/onboarding/employer/education');
      }
    } catch (error) {
      console.error('Server error.', error);
    }
  };

  const handleBack = () => {
    navigate('/employer/verification');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <EmployerHeader disabled={true} />

      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-6">
          {/* Welcome Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2">
              Welcome to PWDe: AI-Powered Job Matching Platform
            </h1>
            <p className="text-center text-gray-600 mb-4">
              Help us understand the skills and preferences you required to match our job seekers the perfect job opportunities tailored for them.
            </p>
            <div className="text-center">
              <div className="inline-block bg-blue-50 border border-blue-100 px-4 py-2 rounded-lg text-sm text-blue-700">
                Our AI analyzes your profile to match you with job seekers.
              </div>
            </div>
          </div>

          {/* Progress Stepper */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">1</div>
                <span className="ml-2 text-blue-600 font-medium">Job Roles & Requirements</span>
              </div>
              <div className="w-16 h-0.5 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 font-semibold">2</div>
                <span className="ml-2 text-gray-500 font-medium">Work Environment</span>
              </div>
              <div className="w-16 h-0.5 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 font-semibold">3</div>
                <span className="ml-2 text-gray-500 font-medium">Complete Company Profile</span>
              </div>
            </div>
          </div>

          {/* Job Roles & Requirements Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Roles & Requirements</h2>
            <p className="text-gray-600 mb-8">Define Your Hiring Needs</p>

            {/* Industry Preference */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry Preference</label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose industry preference</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            {/* Job Roles */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Roles You Typically Hire For</label>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search for job roles"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Selected Roles */}
              {selectedRoles.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedRoles.map((role) => (
                      <span
                        key={role}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {role}
                        <button
                          onClick={() => removeRole(role)}
                          className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Roles Grid */}
              <div className="grid grid-cols-3 gap-3">
                {suggestedRoles.map((role) => (
                  <button
                    key={role.name}
                    onClick={() => handleRoleToggle(role)}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      selectedRoles.includes(role.name)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{role.name}</div>
                        <div className="text-sm text-gray-500">({role.category})</div>
                      </div>
                      {selectedRoles.includes(role.name) ? (
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <a href="#" className="text-blue-600 hover:text-blue-700 text-sm">Add a custom role</a>
              </div>
            </div>

            {/* Required & Preferred Skills */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Required & Preferred Skills</label>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Type to search skills (e.g., JavaScript, Project Management, Design)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Selected Skills */}
              {selectedSkills.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Skills Grid */}
              <div className="grid grid-cols-4 gap-3">
                {suggestedSkills.map((skill) => (
                  <button
                    key={skill.name}
                    onClick={() => handleSkillToggle(skill)}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      selectedSkills.includes(skill.name + ' (' + skill.category + ')')
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{skill.name}</div>
                        <div className="text-sm text-gray-500">({skill.category})</div>
                      </div>
                      {selectedSkills.includes(skill.name + ' (' + skill.category + ')') ? (
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <a href="#" className="text-blue-600 hover:text-blue-700 text-sm">Add additional skills</a>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6">
              <button
                onClick={handleBack}
                className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <div className="flex items-center space-x-4">
                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                  Skip for now
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Next
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
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

export default EmployerOnboardingSkills;

