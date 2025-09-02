import React, { useState, useEffect } from 'react';
import JobseekerHeader from '../../components/ui/JobseekerHeader.jsx';
import Footer from '../../components/ui/Footer.jsx';
import Chatbot from '../../components/ui/Chatbot.jsx';

const JobseekerProfile = () => {
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Profile data state - matches onboarding structure
  const [profileData, setProfileData] = useState({
    // Basic Information (from onboarding)
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    disabilityType: '',
    location: '',
    
    // Professional Information
    jobTitle: '',
    professionalSummary: '',
    hourlyRate: '',
    
    // Skills and Education
    skills: [],
    education: [],
    workExperience: [],
    
    // Portfolio and Links
    portfolioLinks: {
      linkedin: '',
      github: '',
      portfolio: '',
      other: ''
    },
    
    // Accessibility and Accommodation
    accessibilityNeeds: {
      visual: [],
      hearing: [],
      mobility: [],
      cognitive: []
    },
    
    // Employment Preferences
    employmentPreferences: {
      workArrangement: '',
      employmentType: [],
      experienceLevel: '',
      salaryRange: {
        min: '',
        max: '',
        currency: 'PHP'
      },
      preferredLocations: []
    },
    
    // Profile Settings
    profileVisibility: {
      searchable: true,
      hourlyRate: true,
      personalInfo: true,
      portfolioLinks: true,
      accommodationNeeds: true
    },
    
    // Verification Status
    verification: {
      emailVerified: false,
      identityVerified: false,
      phoneVerified: false
    },
    
    // Profile Completion
    profileCompletion: {
      basicInfo: false,
      professionalInfo: false,
      skills: false,
      education: false,
      workExperience: false,
      portfolio: false,
      accessibility: false,
      preferences: false
    }
  });

  const [expandedSections, setExpandedSections] = useState({
    visualSupport: false,
    hearingSupport: false
  });

  // API Functions - Ready for backend integration
  const api = {
    // Fetch user profile data
    fetchProfile: async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // TODO: Replace with actual API call
        // const response = await fetch('/api/jobseeker/profile', {
        //   method: 'GET',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //     'Content-Type': 'application/json'
        //   }
        // });
        // const data = await response.json();
        
        // Mock API response - this will come from your onboarding data
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockData = {
          firstName: 'Angela',
          lastName: 'Martinez',
          email: 'angela.martinez@email.com',
          phone: '+63 917 123 4567',
          birthDate: '2005-03-18',
          disabilityType: 'Hearing',
          location: 'Cebu, Philippines',
          jobTitle: 'Full Stack Developer & UX Designer',
          professionalSummary: 'Experienced Full Stack Developer and UX Designer specializing in accessible, user-centered digital solutions. Proficient in React, Node.js, and inclusive design principles. Passionate about bridging technical excellence and user experience for underserved communities. Track record of delivering high-quality projects that meet accessibility standards. Strong advocate for WCAG 2.1 compliance and experienced in remote/agile environments.',
          hourlyRate: '25',
          skills: ['React.js', 'TypeScript', 'JavaScript', 'Frontend Architecture', 'Responsive Design', 'Redux', 'GraphQL', 'Webpack', 'Next.js'],
          education: [
            {
              id: 1,
              degree: 'Bachelor of Science in Computer Science',
              institution: 'University of Cebu',
              startYear: '2022',
              endYear: '2026',
              isCurrent: true
            }
          ],
          workExperience: [
            {
              id: 1,
              title: 'Senior Frontend Developer',
              company: 'TechCorp Solutions',
              startDate: '2023-01',
              endDate: '2024-01',
              employmentType: 'Full-time',
              location: 'Cebu City, Philippines',
              description: 'Led development of accessible e-commerce platform serving 100K+ users. Improved site performance by 45% through React optimization techniques. Mentored 3 junior developers and established accessibility testing protocols.'
            },
            {
              id: 2,
              title: 'UX Designer',
              company: 'DesignHub Agency',
              startDate: '2023-01',
              endDate: '2024-01',
              employmentType: 'Part-time',
              location: 'Cebu City, Philippines',
              description: 'Designed user interfaces for 20+ client projects across healthcare and fintech. Conducted accessibility audits resulting in 100% WCAG AA compliance. Created design system used by 5+ development teams.'
            }
          ],
          portfolioLinks: {
            linkedin: 'linkedin.com/in/angela-m',
            github: 'angelamartinez.dev',
            portfolio: '',
            other: ''
          },
          accessibilityNeeds: {
            visual: [],
            hearing: ['Hearing aids', 'Captioning services'],
            mobility: [],
            cognitive: []
          },
          employmentPreferences: {
            workArrangement: 'Remote',
            employmentType: ['Full-time', 'Contract'],
            experienceLevel: 'Senior',
            salaryRange: {
              min: '80000',
              max: '120000',
              currency: 'PHP'
            },
            preferredLocations: ['Remote', 'Cebu City']
          },
          profileVisibility: {
            searchable: true,
            hourlyRate: true,
            personalInfo: true,
            portfolioLinks: true,
            accommodationNeeds: true
          },
          verification: {
            emailVerified: true,
            identityVerified: true,
            phoneVerified: false
          },
          profileCompletion: {
            basicInfo: true,
            professionalInfo: true,
            skills: true,
            education: true,
            workExperience: true,
            portfolio: false,
            accessibility: false,
            preferences: true
          }
        };
        
        setProfileData(mockData);
        return mockData;
      } catch (err) {
        setError('Failed to load profile data');
        console.error('Error fetching profile:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },

    // Update profile data
    updateProfile: async (section, data) => {
      try {
        setIsSaving(true);
        setError(null);
        
        // TODO: Replace with actual API call
        // const response = await fetch('/api/jobseeker/profile', {
        //   method: 'PUT',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({ section, data })
        // });
        // const result = await response.json();
        
        // Mock API response
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Update local state
        setProfileData(prev => ({
          ...prev,
          [section]: data
        }));
        
        return { success: true };
      } catch (err) {
        setError('Failed to update profile');
        console.error('Error updating profile:', err);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },

    // Update profile visibility settings
    updateVisibility: async (settings) => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/jobseeker/profile/visibility', {
        //   method: 'PUT',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(settings)
        // });
        
        // Mock API response
        await new Promise(resolve => setTimeout(resolve, 200));
        
        setProfileData(prev => ({
          ...prev,
          profileVisibility: settings
        }));
        
        return { success: true };
      } catch (err) {
        setError('Failed to update visibility settings');
        console.error('Error updating visibility:', err);
        throw err;
      }
    }
  };

  // Event handlers
  const handleToggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleToggleVisibility = async (setting) => {
    try {
      const newSettings = {
        ...profileData.profileVisibility,
        [setting]: !profileData.profileVisibility[setting]
      };
      
      await api.updateVisibility(newSettings);
    } catch (err) {
      // Error already handled in API function
    }
  };

  const handleUpdateProfile = async (section, data) => {
    try {
      await api.updateProfile(section, data);
    } catch (err) {
      // Error already handled in API function
    }
  };

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    const sections = Object.values(profileData.profileCompletion);
    const completed = sections.filter(Boolean).length;
    return Math.round((completed / sections.length) * 100);
  };

  // Initialize data on component mount
  useEffect(() => {
    const initializeProfile = async () => {
      try {
        await api.fetchProfile();
      } catch (err) {
        // Error already handled in API function
      }
    };
    
    initializeProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <JobseekerHeader disabled={false} />
        <main className="flex-1 py-6 sm:py-8">
          <div className="mx-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading profile...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <JobseekerHeader disabled={false} />

      <main className="flex-1 py-6 sm:py-8">
        <div className="mx-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16">
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start space-x-4">
                <img
                  src="https://i.pravatar.cc/150?img=32"
                  alt="Angela Martinez"
                  className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {profileData.firstName} {profileData.lastName}
                    </h1>
                    {profileData.verification.identityVerified && (
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <p className="text-lg text-gray-700">{profileData.jobTitle}</p>
                    <button 
                      onClick={() => handleUpdateProfile('jobTitle', profileData.jobTitle)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{profileData.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm font-medium">4.8/5</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                  Preview Public Profile
                </button>
                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Account Settings</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Profile Completion */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Completion</h3>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{calculateCompletion()}% Complete</span>
                    <span className="text-sm text-gray-500">
                      {Object.values(profileData.profileCompletion).filter(Boolean).length} of {Object.keys(profileData.profileCompletion).length} completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${calculateCompletion()}%` }}></div>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { key: 'basicInfo', text: 'Basic information' },
                    { key: 'professionalInfo', text: 'Professional information' },
                    { key: 'skills', text: 'Skills & expertise' },
                    { key: 'education', text: 'Education' },
                    { key: 'workExperience', text: 'Work experience' },
                    { key: 'portfolio', text: 'Portfolio items' },
                    { key: 'accessibility', text: 'Accessibility preferences' },
                    { key: 'preferences', text: 'Employment preferences' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center space-x-3">
                      {profileData.profileCompletion[item.key] ? (
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                      )}
                      <span className={`text-sm ${profileData.profileCompletion[item.key] ? 'text-gray-900' : 'text-gray-600'}`}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="space-y-3 mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Email:</span>
                    <span className="text-sm text-gray-900 ml-2">{profileData.email}</span>
                    {profileData.verification.emailVerified && (
                      <svg className="w-4 h-4 text-green-500 ml-1 inline" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Phone:</span>
                    <span className="text-sm text-gray-900 ml-2">{profileData.phone}</span>
                    {profileData.verification.phoneVerified && (
                      <svg className="w-4 h-4 text-green-500 ml-1 inline" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Birthdate:</span>
                    <span className="text-sm text-gray-900 ml-2">
                      {new Date(profileData.birthDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Disability Type:</span>
                    <span className="text-sm text-gray-900 ml-2">{profileData.disabilityType}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleUpdateProfile('personalInfo', profileData)}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Edit Personal Information
                </button>
              </div>

              {/* Portfolio Links */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Links</h3>
                <div className="space-y-3 mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">LinkedIn:</span>
                    <span className="text-sm text-blue-600 ml-2">linkedin.com/in/angela-m</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Github:</span>
                    <span className="text-sm text-blue-600 ml-2">angelamartinez.dev</span>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                  Edit Portfolio Links
                </button>
              </div>

              {/* Verification Status */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Status</h3>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">100% Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  {[
                    { text: 'Identity verified', completed: true },
                    { text: 'Email verified', completed: true }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-900">{item.text}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                  Complete Verification
                </button>
              </div>

              {/* Profile Visibility */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Visibility</h3>
                <div className="space-y-4">
                  {[
                    { key: 'searchable', label: 'Make profile searchable' },
                    { key: 'hourlyRate', label: 'Show hourly rate' },
                    { key: 'personalInfo', label: 'Display personal info' },
                    { key: 'portfolioLinks', label: 'Display Portfolio Links' },
                    { key: 'accommodationNeeds', label: 'Show accommodation needs' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{setting.label}</span>
                      <button
                        onClick={() => toggleVisibility(setting.key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          profileVisibility[setting.key] ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            profileVisibility[setting.key] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Professional Summary */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Professional Summary</h3>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Experienced Full Stack Developer and UX Designer specializing in accessible, user-centered digital solutions. 
                  Proficient in React, Node.js, and inclusive design principles. Passionate about bridging technical excellence 
                  and user experience for underserved communities. Track record of delivering high-quality projects that meet 
                  accessibility standards. Strong advocate for WCAG 2.1 compliance and experienced in remote/agile environments.
                </p>
                <div className="text-sm text-gray-500">487/2000 characters</div>
              </div>

              {/* Skills & Expertise */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Skills & Expertise</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Manage Skills
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    'React.js', 'TypeScript', 'JavaScript', 'Frontend Architecture', 
                    'Responsive Design', 'Redux', 'GraphQL', 'Webpack', 'Next.js'
                  ].map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                  <span>Show 15 more skills</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Education */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    + Add Education
                  </button>
                </div>
                <div className="space-y-4">
                  {[1, 2].map((item) => (
                    <div key={item} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">Bachelor of Science in Computer Science</h4>
                          <p className="text-sm text-gray-600">University of Cebu</p>
                          <p className="text-sm text-gray-500">2022-2026</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Work Experience */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    + Add Experience
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">Senior Frontend Developer</h4>
                        <p className="text-sm text-gray-600">TechCorp Solutions</p>
                        <p className="text-sm text-gray-500">Jan 2023 - Jan 2024 • Full-time</p>
                        <p className="text-sm text-gray-500">Cebu City, Philippines</p>
                        <ul className="mt-2 space-y-1">
                          <li className="text-sm text-gray-700">• Led development of accessible e-commerce platform serving 100K+ users</li>
                          <li className="text-sm text-gray-700">• Improved site performance by 45% through React optimization techniques</li>
                          <li className="text-sm text-gray-700">• Mentored 3 junior developers and established accessibility testing protocols</li>
                        </ul>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">UX Designer</h4>
                        <p className="text-sm text-gray-600">DesignHub Agency</p>
                        <p className="text-sm text-gray-500">Jan 2023 - Jan 2024 • Part-Time</p>
                        <p className="text-sm text-gray-500">Cebu City, Philippines</p>
                        <ul className="mt-2 space-y-1">
                          <li className="text-sm text-gray-700">• Designed user interfaces for 20+ client projects across healthcare and fintech</li>
                          <li className="text-sm text-gray-700">• Conducted accessibility audits resulting in 100% WCAG AA compliance</li>
                          <li className="text-sm text-gray-700">• Created design system used by 5+ development teams</li>
                        </ul>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accessibility & Accommodation Needs */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Accessibility & Accommodation Needs</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Update Requirements
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleSection('visualSupport')}
                      className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-900">Visual Support</span>
                      </div>
                      <svg className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.visualSupport ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleSection('hearingSupport')}
                      className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                        <span className="text-sm font-medium text-gray-900">Hearing Support</span>
                      </div>
                      <svg className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.hearingSupport ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Employment Preferences */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Employment Preferences</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Update Preferences
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Work Arrangement:</span>
                    <span className="text-sm text-gray-900 ml-2">Remote - Work from anywhere</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Employment Type:</span>
                    <span className="text-sm text-gray-900 ml-2">Full-time, Contract</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Experience Level:</span>
                    <span className="text-sm text-gray-900 ml-2">Senior Level (6-5 years)</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Salary Range:</span>
                    <span className="text-sm text-gray-900 ml-2">₱80,000 - ₱120,000/month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <Chatbot 
        position="right" 
        showNotification={true} 
        notificationCount={3}
      />
    </div>
  );
};

export default JobseekerProfile;
