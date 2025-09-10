import React from 'react';

const PortfolioLinksModal = ({ formData, onFormChange }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio & Social Links</h3>
      <p className="text-gray-600 mb-6">Share your professional portfolio and social media profiles to showcase your work.</p>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
        <input
          type="url"
          value={formData.linkedin || ''}
          onChange={(e) => onFormChange('linkedin', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="https://linkedin.com/in/yourprofile"
        />
        <p className="text-xs text-gray-500 mt-1">Your professional LinkedIn profile URL</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Profile</label>
        <input
          type="url"
          value={formData.github || ''}
          onChange={(e) => onFormChange('github', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="https://github.com/yourusername"
        />
        <p className="text-xs text-gray-500 mt-1">Your GitHub profile to showcase your code</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Website</label>
        <input
          type="url"
          value={formData.portfolio || ''}
          onChange={(e) => onFormChange('portfolio', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="https://yourportfolio.com"
        />
        <p className="text-xs text-gray-500 mt-1">Your personal portfolio or website</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Other Links</label>
        <input
          type="url"
          value={formData.other || ''}
          onChange={(e) => onFormChange('other', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="https://other-link.com"
        />
        <p className="text-xs text-gray-500 mt-1">Any other relevant professional links (Behance, Dribbble, etc.)</p>
      </div>
    </div>
  );
};

export default PortfolioLinksModal;
