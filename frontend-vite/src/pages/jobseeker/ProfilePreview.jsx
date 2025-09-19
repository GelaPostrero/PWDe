import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../../utils/api.js';
import JobseekerHeader from '../../components/ui/JobseekerHeader.jsx';
import Footer from '../../components/ui/Footer.jsx';
import Chatbot from '../../components/ui/Chatbot.jsx';

const ProfilePreview = () => {
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchedData, setFetchedData] = useState([]);
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    if(fetchedData && Object.keys(fetchedData).length > 0) {
      
      setProfileData(prev => ({
        ...prev,
        // Basic Information (from onboarding)
        userId: fetchedData.user_id,
        firstName: fetchedData.firstname || '',
        middleName: fetchedData.middlename || '',
        lastName: fetchedData.lastname || '',
        fullName: fetchedData.name || '',
        email: fetchedData.personal_information?.email || fetchedData.email,
        phone: fetchedData.personal_information?.phone || fetchedData.phone,
        birthDate: fetchedData.personal_information?.birthdate || fetchedData.birthdate,
        disabilityType: fetchedData.personal_information?.disability_type || fetchedData.disability_type,
        location: fetchedData.personal_information?.location || fetchedData.location,
        rating: fetchedData.rating,
        
        // Professional Information
        jobTitle: fetchedData.professional_role || fetchedData.profession,
        profession: fetchedData.profession,
        profilePicture: fetchedData.profile_picture,
        professionalSummary: fetchedData.professional_summary,
        hourlyRate: '',
        
        // Skills and Education
        skills: fetchedData.skills,
        education: fetchedData.educations,
        workExperience: fetchedData.experiences,
        
        // Portfolio and Links
        portfolioLinks: fetchedData.portfolio_links || {
          github: fetchedData.github_url,
          portfolio: fetchedData.portfolio_url,
          linkedin: fetchedData.linkedin_url,
          other: fetchedData.otherPlatform
        },
        
        // Accessibility and Accommodation
        accessibilityNeeds: fetchedData.accommodation_needs || fetchedData.accessibility_needs || [],
        
        // Employment Preferences
        employmentPreferences: {
          workArrangement: fetchedData.employment_preferences?.[0]?.work_arrangement || fetchedData.job_preferences?.[0]?.work_arrangement || '',
          employmentType: fetchedData.employment_preferences?.[0]?.employment_types || fetchedData.job_preferences?.[0]?.employment_types || [],
          experienceLevel: fetchedData.employment_preferences?.[0]?.experience_level || fetchedData.job_preferences?.[0]?.experience_level || '',
          salaryRange: fetchedData.employment_preferences?.[0]?.salary_range || fetchedData.job_preferences?.[0]?.salary_range || '',
          preferredLocations: []
        },
        
        // Verification Status
        verificationStatus: {
          emailVerified: fetchedData.is_verified || false,
          documentStatus: fetchedData.document_verification_status || 'not_submitted', // 'not_submitted', 'pending', 'verified', 'rejected'
          rejectionReason: fetchedData.document_rejection_reason || null,
          uploadedFiles: fetchedData.verification_documents || []
        },
        
        
        // Profile Settings
        profileVisibility: {
          make_profile_searchable: fetchedData.make_profile_searchable || false,
          display_personal_information: fetchedData.display_personal_information || false,
          display_portfolio_links: fetchedData.display_portfolio_links || false,
          show_professional_summary: fetchedData.show_professional_summary || false,
          show_skills_and_expertise: fetchedData.show_skills_and_expertise || false,
          show_education: fetchedData.show_education || false,
          show_experience: fetchedData.show_experience || false,
          display_accommodation_needs: fetchedData.display_accommodation_needs || false,
          display_employment_preferences: fetchedData.display_employment_preferences || false
        },
        
        // Verification Status
        verification: {
          emailVerified: false,
          identityVerified: false,
          phoneVerified: false
        },
        
        // Debug logging
        debug: {
          birthDate: fetchedData.personal_information?.birthdate || fetchedData.birthdate,
          disabilityType: fetchedData.personal_information?.disability_type || fetchedData.disability_type
        },
        
        // Profile Completion
        profileCompletion: {
          basicInfo: fetchedData.basic_information,
          professionalSummary: fetchedData.professional_summary_completed,
          professionalInfo: fetchedData.workexperience,
          skills: fetchedData.skills,
          education: fetchedData.education,
          portfolio: fetchedData.portfolio_items,
          accessibilityPreferences: fetchedData.set_accessibility_preferences
        }
      }));
      
      // Debug: Log profession data after profileData is created
      console.log('Profile data mapping - fetchedData.profession:', fetchedData.profession);
      console.log('Profile data mapping - profileData.profession:', profileData.profession);
      console.log('Full fetchedData:', fetchedData);
      console.log('Setting profession to:', fetchedData.profession || fetchedData.professional_role);
      console.log('Profile picture URL:', fetchedData.profile_picture);
      console.log('Debug data:', {
        birthDate: profileData.debug?.birthDate,
        disabilityType: profileData.debug?.disabilityType
      });
      console.log('Employment preferences data:', {
        workArrangement: profileData.employmentPreferences?.workArrangement,
        employmentType: profileData.employmentPreferences?.employmentType,
        experienceLevel: profileData.employmentPreferences?.experienceLevel,
        salaryRange: profileData.employmentPreferences?.salaryRange
      });
    }
  }, [fetchedData]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        // First get the current user's ID
        const profileResponse = await api.get('/retrieve/profile');
        console.log('Profile response:', profileResponse.data);
        if (profileResponse.data.success) {
          const userId = profileResponse.data.data.user_id;
          console.log('User ID:', userId);
          
          // Then get the public profile data (which respects visibility settings)
          const publicResponse = await api.get(`/retrieve/public/${userId}`);
          
          if (publicResponse.data.success) {
            console.log('Public profile data received:', publicResponse.data.data);
            console.log('Name fields:', {
              name: publicResponse.data.data.name,
              firstname: publicResponse.data.data.firstname,
              middlename: publicResponse.data.data.middlename,
              lastname: publicResponse.data.data.lastname
            });
            console.log('Professional role:', publicResponse.data.data.professional_role);
            console.log('Profession:', publicResponse.data.data.profession);
            console.log('Personal information:', publicResponse.data.data.personal_information);
            console.log('Birthdate from personal_info:', publicResponse.data.data.personal_information?.birthdate);
            console.log('Disability type from personal_info:', publicResponse.data.data.personal_information?.disability_type);
            console.log('Accommodation needs:', publicResponse.data.data.accommodation_needs);
            console.log('Accessibility needs:', publicResponse.data.data.accessibility_needs);
            console.log('Employment preferences:', publicResponse.data.data.employment_preferences);
            setFetchedData(publicResponse.data.data);
          } else {
            setError('Failed to load public profile data');
          }
        } else {
          setError('Failed to load profile data');
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
        if (err.response?.status === 403) {
          setError('Profile is not set to be public. Please enable "Make profile public" in your profile settings first.');
        } else {
          setError('Failed to load profile data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Refresh data when page becomes visible (user returns from main profile)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible, refresh data
        const fetchProfileData = async () => {
          try {
            const profileResponse = await api.get('/retrieve/profile');
            if (profileResponse.data.success) {
              const userId = profileResponse.data.data.user_id;
              const publicResponse = await api.get(`/retrieve/public/${userId}`);
              if (publicResponse.data.success) {
                console.log('Refreshed public profile data:', publicResponse.data.data);
                setFetchedData(publicResponse.data.data);
              }
            }
          } catch (err) {
            console.error('Error refreshing profile data:', err);
          }
        };
        fetchProfileData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => window.location.href = '/jobseeker/profile'}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Back to Profile
            </button>
            {error.includes('Make profile public') && (
              <button
                onClick={() => {
                  window.location.href = '/jobseeker/profile';
                  // Scroll to profile visibility section after navigation
                  setTimeout(() => {
                    const element = document.querySelector('[data-section="profileVisibility"]');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Go to Settings
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <JobseekerHeader />
      
      {/* Back Button */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start space-x-4">
                <img
                  src={fetchedData.profile_picture || "/favicon.png"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profileData.fullName || `${profileData.firstName} ${profileData.middleName} ${profileData.lastName}`.trim()}
                  </h1>
                  <p className="text-lg text-gray-700">
                    {profileData.jobTitle || fetchedData.professional_role || fetchedData.profession || 'Professional'}
                  </p>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(profileData.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-sm font-medium ml-1">{profileData.rating}/5</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                <button 
                  onClick={() => window.location.href = '/jobseeker/profile'}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Back to Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Personal Information */}
            {fetchedData.personal_information && (
              <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-3 mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Email:</span>
                  <span className="text-sm text-gray-900 ml-2">{profileData.email}</span>
                  {profileData.verification?.emailVerified && (
                    <svg className="w-4 h-4 text-green-500 ml-1 inline" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Phone:</span>
                  <span className="text-sm text-gray-900 ml-2">{profileData.phone}</span>
                  {profileData.verification?.phoneVerified && (
                    <svg className="w-4 h-4 text-green-500 ml-1 inline" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Location:</span>
                  <span className="text-sm text-gray-900 ml-2">{profileData.location}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Date of Birth:</span>
                  <span className="text-sm text-gray-900 ml-2">{profileData.birthDate}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Disability Type:</span>
                  <span className="text-sm text-gray-900 ml-2">{profileData.disabilityType}</span>
                </div>
              </div>
            </div>
            )}

            {/* Portfolio Links */}
            {fetchedData.portfolio_links && (
              <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Links</h3>
              <div className="space-y-3 mb-4">
                {profileData.portfolioLinks?.portfolio && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Portfolio:</span>
                    <a
                      href={profileData.portfolioLinks.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 ml-2 hover:underline"
                    >
                      {profileData.portfolioLinks.portfolio}
                    </a>
                  </div>
                )}
                {profileData.portfolioLinks?.github && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Github:</span>
                    <a
                      href={profileData.portfolioLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 ml-2 hover:underline"
                    >
                      {profileData.portfolioLinks.github}
                    </a>
                  </div>
                )}
                {profileData.portfolioLinks?.linkedin && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">LinkedIn:</span>
                    <a
                      href={profileData.portfolioLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 ml-2 hover:underline"
                    >
                      {profileData.portfolioLinks.linkedin}
                    </a>
                  </div>
                )}
                {(!profileData.portfolioLinks?.portfolio && !profileData.portfolioLinks?.github && !profileData.portfolioLinks?.linkedin) && (
                  <p className="text-gray-500">No portfolio links provided</p>
                )}
              </div>
            </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Professional Summary */}
            {fetchedData.professional_summary && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Summary</h3>
                <p className="text-gray-700 leading-relaxed">
                  {fetchedData.professional_summary || 'No professional summary provided.'}
                </p>
              </div>
            )}

            {/* Skills and Expertise */}
            {fetchedData.skills_and_expertise && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills and Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {fetchedData.skills_and_expertise && fetchedData.skills_and_expertise.length > 0 ? (
                    fetchedData.skills_and_expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No skills listed</p>
                  )}
                </div>
              </div>
            )}

            {/* Education */}
            {fetchedData.education && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
                <div className="space-y-4">
                  {fetchedData.education && fetchedData.education.length > 0 ? (
                    fetchedData.education.map((edu, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                        <p className="text-gray-600">{edu.institution}</p>
                        <p className="text-sm text-gray-500">{edu.field_of_study}</p>
                        {edu.year_graduated && (
                          <p className="text-sm text-gray-500">Graduated: {edu.year_graduated}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No education information provided</p>
                  )}
                </div>
              </div>
            )}

            {/* Work Experience */}
            {fetchedData.experience && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Experience</h3>
                <div className="space-y-4">
                  {fetchedData.experience && fetchedData.experience.length > 0 ? (
                    fetchedData.experience.map((exp, index) => (
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
                    ))
                  ) : (
                    <p className="text-gray-500">No work experience provided</p>
                  )}
                </div>
              </div>
            )}


            {/* Accessibility Needs */}
            {fetchedData.accommodation_needs && (
              <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Accessibility & Accommodation Needs</h3>
              <div className="space-y-4">
                {profileData.accessibilityNeeds && profileData.accessibilityNeeds.length > 0 ? (
                  profileData.accessibilityNeeds.map((needs, index) => (
                    <div key={index} className="space-y-3">
                      {/* VISUAL SUPPORT */}
                      {needs.visual_support && 
                        needs.visual_support.length > 0 && 
                        !(needs.visual_support.length === 1 && needs.visual_support[0] === "None of the above") && (
                        <div className="border border-gray-200 rounded-lg">
                          <div className="px-3 py-2 bg-gray-50 rounded-t-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-900">Visual Support</span>
                              </div>
                            </div>
                          </div>
                          <div className="px-3 pb-3 border-t border-gray-200">
                            <div className="pt-3">
                              <div className="flex flex-wrap gap-2">
                                {needs.visual_support.map((item, itemIndex) => (
                                  <span key={itemIndex} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* HEARING SUPPORT */}
                      {needs.hearing_support && 
                        needs.hearing_support.length > 0 && 
                        !(needs.hearing_support.length === 1 && needs.hearing_support[0] === "None of the above") && (
                        <div className="border border-gray-200 rounded-lg">
                          <div className="px-3 py-2 bg-gray-50 rounded-t-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-900">Hearing Support</span>
                              </div>
                            </div>
                          </div>
                          <div className="px-3 pb-3 border-t border-gray-200">
                            <div className="pt-3">
                              <div className="flex flex-wrap gap-2">
                                {needs.hearing_support.map((item, itemIndex) => (
                                  <span key={itemIndex} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* MOBILITY SUPPORT */}
                      {needs.mobility_support && 
                        needs.mobility_support.length > 0 && 
                        !(needs.mobility_support.length === 1 && needs.mobility_support[0] === "None of the above") && (
                        <div className="border border-gray-200 rounded-lg">
                          <div className="px-3 py-2 bg-gray-50 rounded-t-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-900">Mobility Support</span>
                              </div>
                            </div>
                          </div>
                          <div className="px-3 pb-3 border-t border-gray-200">
                            <div className="pt-3">
                              <div className="flex flex-wrap gap-2">
                                {needs.mobility_support.map((item, itemIndex) => (
                                  <span key={itemIndex} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* COGNITIVE SUPPORT */}
                      {needs.cognitive_support && 
                        needs.cognitive_support.length > 0 && 
                        !(needs.cognitive_support.length === 1 && needs.cognitive_support[0] === "None of the above") && (
                        <div className="border border-gray-200 rounded-lg">
                          <div className="px-3 py-2 bg-gray-50 rounded-t-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-900">Cognitive Support</span>
                              </div>
                            </div>
                          </div>
                          <div className="px-3 pb-3 border-t border-gray-200">
                            <div className="pt-3">
                              <div className="flex flex-wrap gap-2">
                                {needs.cognitive_support.map((item, itemIndex) => (
                                  <span key={itemIndex} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ADDITIONAL INFORMATION */}
                      {needs.additional_information && (
                        <div className="border border-gray-200 rounded-lg">
                          <div className="px-3 py-2 bg-gray-50 rounded-t-lg">
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-sm font-medium text-gray-900">Additional Information</span>
                            </div>
                          </div>
                          <div className="px-3 pb-3 border-t border-gray-200">
                            <div className="pt-3">
                              <p className="text-sm text-gray-700">{needs.additional_information}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No accessibility needs specified</p>
                )}
              </div>
            </div>
            )}

            {/* Employment Preferences */}
            {fetchedData.employment_preferences && (
              <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Preferences</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  <div>
                    <span className="font-medium text-gray-900">Employment Types:</span>
                    <span className="text-gray-700 ml-2">
                      {profileData.employmentPreferences?.employmentType && Array.isArray(profileData.employmentPreferences.employmentType) 
                        ? profileData.employmentPreferences.employmentType.join(', ')
                        : profileData.employmentPreferences?.employmentType || 'Not specified'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Work Arrangement:</span>
                    <span className="text-gray-700 ml-2">{profileData.employmentPreferences?.workArrangement || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Experience Level:</span>
                    <span className="text-gray-700 ml-2">{profileData.employmentPreferences?.experienceLevel || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Salary Range:</span>
                    <span className="text-gray-700 ml-2">
                      {(() => {
                        let salaryRange = profileData.employmentPreferences?.salaryRange;
                        
                        // Parse JSON string if it's a string
                        if (typeof salaryRange === 'string') {
                          try {
                            salaryRange = JSON.parse(salaryRange);
                          } catch (e) {
                            return salaryRange || 'Not specified';
                          }
                        }
                        
                        // Handle object format
                        if (salaryRange && typeof salaryRange === 'object' && salaryRange.min && salaryRange.max) {
                          const min = parseInt(salaryRange.min.toString().replace(/,/g, ''));
                          const max = parseInt(salaryRange.max.toString().replace(/,/g, ''));
                          return `₱${min.toLocaleString()} - ₱${max.toLocaleString()} ${salaryRange.frequency ? `per ${salaryRange.frequency.toLowerCase()}` : ''}`;
                        }
                        
                        return salaryRange || 'Not specified';
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
          </div>
        </div>
      </div>

      <Footer />
      <Chatbot />
    </div>
  );
};

export default ProfilePreview;
