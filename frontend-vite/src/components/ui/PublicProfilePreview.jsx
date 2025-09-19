import React, { useState, useEffect } from 'react';
import api from '../../utils/api.js';

const PublicProfilePreview = ({ userId, onClose }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/retrieve/public/${userId}`);
        
        if (response.data.success) {
          setProfile(response.data.data);
        } else {
          setError('Profile not found or not public');
        }
      } catch (err) {
        console.error('Error fetching public profile:', err);
        if (err.response?.status === 403) {
          setError('Profile is not set to be searchable. Please enable "Make profile searchable" in your profile visibility settings.');
        } else if (err.response?.status === 404) {
          setError('Profile not found');
        } else {
          setError('Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPublicProfile();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Close
              </button>
              {error.includes('searchable') && (
                <button
                  onClick={() => {
                    onClose();
                    // Scroll to profile visibility section
                    setTimeout(() => {
                      const visibilitySection = document.querySelector('[data-section="profileVisibility"]');
                      if (visibilitySection) {
                        visibilitySection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Go to Settings
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Public Profile Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {/* Basic Info */}
          <div className="flex items-start space-x-4 mb-6">
            <img
              src={profile.profile_picture || "https://via.placeholder.com/80x80/3B82F6/FFFFFF?text=IMG"}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-lg text-blue-600">{profile.professional_role}</p>
              {profile.rating && (
                <div className="flex items-center mt-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(profile.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-sm text-gray-600">({profile.rating}/5)</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Personal Information */}
          {profile.personal_information && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                {profile.personal_information.email && (
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">Email:</span> {profile.personal_information.email}
                  </p>
                )}
                {profile.personal_information.phone && (
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">Phone:</span> {profile.personal_information.phone}
                  </p>
                )}
                {profile.personal_information.location && (
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Location:</span> {profile.personal_information.location}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Professional Summary */}
          {profile.professional_summary && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Professional Summary</h3>
              <p className="text-gray-700 leading-relaxed">{profile.professional_summary}</p>
            </div>
          )}

          {/* Skills and Expertise */}
          {profile.skills_and_expertise && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills and Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills_and_expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio Links */}
          {profile.portfolio_links && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Portfolio Links</h3>
              <div className="space-y-2">
                {profile.portfolio_links.portfolio && (
                  <a
                    href={profile.portfolio_links.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:text-blue-800"
                  >
                    Portfolio Website
                  </a>
                )}
                {profile.portfolio_links.github && (
                  <a
                    href={profile.portfolio_links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:text-blue-800"
                  >
                    GitHub Profile
                  </a>
                )}
                {profile.portfolio_links.linkedin && (
                  <a
                    href={profile.portfolio_links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:text-blue-800"
                  >
                    LinkedIn Profile
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Education */}
          {profile.education && profile.education.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Education</h3>
              <div className="space-y-4">
                {profile.education.map((edu, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                    <p className="text-gray-600">{edu.institution}</p>
                    <p className="text-sm text-gray-500">{edu.field_of_study}</p>
                    {edu.year_graduated && (
                      <p className="text-sm text-gray-500">Graduated: {edu.year_graduated}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {profile.experience && profile.experience.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Work Experience</h3>
              <div className="space-y-4">
                {profile.experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-medium text-gray-900">{exp.job_title}</h4>
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(exp.start_date).toLocaleDateString()} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'Present'}
                    </p>
                    {exp.description && (
                      <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Accommodation Needs */}
          {profile.accommodation_needs && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Accommodation Needs</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                {profile.accommodation_needs.visual_support && profile.accommodation_needs.visual_support.length > 0 && (
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-900 mb-1">Visual Support</h4>
                    <p className="text-sm text-gray-700">{profile.accommodation_needs.visual_support.join(', ')}</p>
                  </div>
                )}
                {profile.accommodation_needs.hearing_support && profile.accommodation_needs.hearing_support.length > 0 && (
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-900 mb-1">Hearing Support</h4>
                    <p className="text-sm text-gray-700">{profile.accommodation_needs.hearing_support.join(', ')}</p>
                  </div>
                )}
                {profile.accommodation_needs.mobility_support && profile.accommodation_needs.mobility_support.length > 0 && (
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-900 mb-1">Mobility Support</h4>
                    <p className="text-sm text-gray-700">{profile.accommodation_needs.mobility_support.join(', ')}</p>
                  </div>
                )}
                {profile.accommodation_needs.cognitive_support && profile.accommodation_needs.cognitive_support.length > 0 && (
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-900 mb-1">Cognitive Support</h4>
                    <p className="text-sm text-gray-700">{profile.accommodation_needs.cognitive_support.join(', ')}</p>
                  </div>
                )}
                {profile.accommodation_needs.additional_information && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Additional Information</h4>
                    <p className="text-sm text-gray-700">{profile.accommodation_needs.additional_information}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Employment Preferences */}
          {profile.employment_preferences && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Employment Preferences</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                {profile.employment_preferences.employment_types && (
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-900 mb-1">Employment Types</h4>
                    <p className="text-sm text-gray-700">{profile.employment_preferences.employment_types.join(', ')}</p>
                  </div>
                )}
                {profile.employment_preferences.experience_level && (
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-900 mb-1">Experience Level</h4>
                    <p className="text-sm text-gray-700">{profile.employment_preferences.experience_level}</p>
                  </div>
                )}
                {profile.employment_preferences.work_arrangement && (
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-900 mb-1">Work Arrangement</h4>
                    <p className="text-sm text-gray-700">{profile.employment_preferences.work_arrangement}</p>
                  </div>
                )}
                {profile.employment_preferences.salary_range && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Salary Range</h4>
                    <p className="text-sm text-gray-700">
                      {typeof profile.employment_preferences.salary_range === 'object' 
                        ? `₱${profile.employment_preferences.salary_range.min?.toLocaleString()} - ₱${profile.employment_preferences.salary_range.max?.toLocaleString()}`
                        : profile.employment_preferences.salary_range
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePreview;

