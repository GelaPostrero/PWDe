import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../../utils/api.js';
import JobseekerHeader from '../../components/ui/JobseekerHeader.jsx';
import Footer from '../../components/ui/Footer.jsx';
import Chatbot from '../../components/ui/Chatbot.jsx';
import ProfileModal from '../../components/ui/ProfileModal.jsx';
import {
  PersonalInfoModal,
  ProfessionalSummaryModal,
  SkillsModal,
  EducationModal,
  WorkExperienceModal,
  PortfolioLinksModal,
  AccessibilityNeedsModal,
  EmploymentPreferencesModal
} from '../../components/modals';

const JobseekerProfile = () => {
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [fetchedData, setFetchedData] = useState([]);
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    if(fetchedData) {
      // Profile data state - matches onboarding structure
      setProfileData(prev => ({
        ...prev,
        // Basic Information (from onboarding)
        firstName: fetchedData.firstname,
        middleName: fetchedData.middlename,
        lastName: fetchedData.lastname,
        email: fetchedData.email,
        phone: fetchedData.phone,
        birthDate: fetchedData.birthdate,
        disabilityType: fetchedData.disability_type,
        location: fetchedData.location,
        rating: fetchedData.rating,
        
        // Professional Information
        jobTitle: fetchedData.profession,
        professionalSummary: fetchedData.professional_summary,
        hourlyRate: '',
        
        // Skills and Education
        skills: fetchedData.skills,
        education: fetchedData.educations,
        workExperience: fetchedData.experiences,
        
        // Portfolio and Links
        portfolioLinks: {
          github: fetchedData.github_url,
          portfolio: fetchedData.portfolio_url,
          other: fetchedData.otherPlatform
        },
        
        // Accessibility and Accommodation
        accessibilityNeeds: fetchedData.accessibility_needs || [],
        
        // Employment Preferences
        employmentPreferences: {
          workArrangement: fetchedData.job_preferences?.[0]?.work_arrangement || '',
          employmentType: fetchedData.job_preferences?.[0]?.employment_types || [],
          experienceLevel: fetchedData.job_preferences?.[0]?.experience_level || '',
          salaryRange: fetchedData.job_preferences?.[0]?.salary_range || '',
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
          basicInfo: fetchedData.basic_information,
          professionalSummary: fetchedData.professional_summary_completed,
          professionalInfo: fetchedData.workexperience,
          skills: fetchedData.skills,
          education: fetchedData.education,
          portfolio: fetchedData.portfolio_items,
          accessibilityPreferences: fetchedData.set_accessibility_preferences
        }
      }));
    }
  }, [fetchedData]);

  const [expandedSections, setExpandedSections] = useState({
    visualSupport: false,
    hearingSupport: false,
    mobilitySupport: false,
    cognitiveSupport: false
  });

  // Modal states
  const [activeModal, setActiveModal] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  // Toggle functions
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleVisibility = (setting) => {
    handleToggleVisibility(setting);
  };

  // Modal functions
  const openModal = (modalType, item = null) => {
    setActiveModal(modalType);
    setEditingItem(item);
    
    // Initialize form data based on modal type
    switch (modalType) {
      case 'personalInfo':
        setFormData({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.email,
          phone: profileData.phone,
          birthDate: profileData.birthDate,
          disabilityType: profileData.disabilityType,
          location: profileData.location
        });
        break;
      case 'professionalSummary':
        setFormData({
          jobTitle: profileData.jobTitle,
          professionalSummary: profileData.professionalSummary,
          hourlyRate: profileData.hourlyRate
        });
        break;
      case 'skills':
        setFormData({
          skills: [...profileData.skills]
        });
        break;
      case 'education':
        setFormData(item ? {
          degree: item.degree,
          institution: item.institution,
          startYear: item.startYear,
          endYear: item.endYear,
          isCurrent: item.isCurrent
        } : {
          degree: '',
          institution: '',
          startYear: '',
          endYear: '',
          isCurrent: false
        });
        break;
      case 'workExperience':
        setFormData(item ? {
          title: item.title,
          company: item.company,
          startMonth: item.startDate ? item.startDate.split('-')[1] : '',
          startYear: item.startDate ? item.startDate.split('-')[0] : '',
          endMonth: item.endDate ? item.endDate.split('-')[1] : '',
          endYear: item.endDate ? item.endDate.split('-')[0] : '',
          employmentType: item.employmentType,
          location: item.location,
          description: item.description
        } : {
          title: '',
          company: '',
          startMonth: '',
          startYear: '',
          endMonth: '',
          endYear: '',
          employmentType: 'Full-time',
          location: '',
          description: ''
        });
        break;
      case 'portfolioLinks':
        setFormData({ ...profileData.portfolioLinks });
        break;
      case 'accessibilityNeeds':
        setFormData({ ...profileData.accessibilityNeeds });
        break;
      case 'employmentPreferences':
        setFormData({ ...profileData.employmentPreferences });
        break;
      default:
        setFormData({});
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setEditingItem(null);
    setFormData({});
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayFormChange = (field, value, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field, newItem) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], newItem]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // API Functions - Ready for backend integration
  const apifunctions = {
    // Fetch user profile data
    fetchProfile: async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data } = await api.get('/retrieve/profile'); // get data
        
        // Mock API response - this will come from your onboarding data
        await new Promise(resolve => setTimeout(resolve, 500));

        if(data.success) {
          console.log("Data: ", data.data);
          setFetchedData(data.data);
        }
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
        setIsLoading(true);
        setIsSaving(true);
        setError(null);
        
        const response = await api.put('/retrieve/update/basic-information', data);

        if(response.data.success) {
          // Update local state
          setProfileData(prev => ({
            ...prev,
            [section]: data
          }));

          return { success: true };
        }
      } catch (err) {
        setError('Failed to update profile');
        console.error('Error updating profile:', err);
        throw err;
      } finally {
        setIsSaving(false);
        setIsLoading(false);
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

  const handleToggleVisibility = async (setting) => {
    try {
      const newSettings = {
        ...profileData.profileVisibility,
        [setting]: !profileData.profileVisibility[setting]
      };
      
      await apifunctions.updateVisibility(newSettings);
    } catch (err) {
      // Error already handled in API function
    }
  };

  const handleUpdateProfile = async (section, data) => {
    try {
      await apifunctions.updateProfile(section, data);
    } catch (err) {
      // Error already handled in API function
    }
  };

  const handleSave = async () => {
    try {
      switch (activeModal) {
        case 'personalInfo':
          await handleUpdateProfile('personalInfo', formData);
          break;
        case 'professionalSummary':
          await handleUpdateProfile('professionalInfo', formData);
          break;
        case 'skills':
          await handleUpdateProfile('skills', formData.skills);
          break;
        case 'education':
          if (editingItem) {
            // Update existing education
            const updatedEducation = profileData.education.map(item => 
              item.id === editingItem.id ? { ...formData, id: editingItem.id } : item
            );
            await handleUpdateProfile('education', updatedEducation);
          } else {
            // Add new education
            const newEducation = [...profileData.education, { ...formData, id: Date.now() }];
            await handleUpdateProfile('education', newEducation);
          }
          break;
        case 'workExperience':
          if (editingItem) {
            // Update existing work experience
            const workData = {
              ...formData,
              id: editingItem.id,
              startDate: formData.startYear && formData.startMonth ? `${formData.startYear}-${formData.startMonth.padStart(2, '0')}` : '',
              endDate: formData.endYear && formData.endMonth ? `${formData.endYear}-${formData.endMonth.padStart(2, '0')}` : ''
            };
            const updatedExperience = profileData.workExperience.map(item => 
              item.id === editingItem.id ? workData : item
            );
            await handleUpdateProfile('workExperience', updatedExperience);
          } else {
            // Add new work experience
            const workData = {
              ...formData,
              id: Date.now(),
              startDate: formData.startYear && formData.startMonth ? `${formData.startYear}-${formData.startMonth.padStart(2, '0')}` : '',
              endDate: formData.endYear && formData.endMonth ? `${formData.endYear}-${formData.endMonth.padStart(2, '0')}` : ''
            };
            const newExperience = [...profileData.workExperience, workData];
            await handleUpdateProfile('workExperience', newExperience);
          }
          break;
        case 'portfolioLinks':
          await handleUpdateProfile('portfolioLinks', formData);
          break;
        case 'accessibilityNeeds':
          await handleUpdateProfile('accessibilityNeeds', formData);
          break;
        case 'employmentPreferences':
          await handleUpdateProfile('employmentPreferences', formData);
          break;
      }
      closeModal();
    } catch (err) {
      console.error('Error saving:', err);
    }
  };

  const handleDelete = async (section, itemId) => {
    try {
      switch (section) {
        case 'education':
          const updatedEducation = profileData.education.filter(item => item.id !== itemId);
          await handleUpdateProfile('education', updatedEducation);
          break;
        case 'workExperience':
          const updatedExperience = profileData.workExperience.filter(item => item.id !== itemId);
          await handleUpdateProfile('workExperience', updatedExperience);
          break;
      }
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    const sections = Object.values(profileData.profileCompletion);
    const completed = sections.filter(Boolean).length;
    return Math.round((completed / sections.length) * 100);
  };

  // Calculate completion items dynamically
  const getCompletionItems = () => {
    return [
      { text: 'Basic information', completed: profileData.profileCompletion.basicInfo },
      { text: 'Professional summary', completed: profileData.profileCompletion.professionalSummary },
      { text: 'Professional experience', completed: profileData.profileCompletion.professionalInfo },
      { text: 'Education', completed: profileData.profileCompletion.education },
      { text: 'Add portfolio items', completed: profileData.profileCompletion.portfolio },
      { text: 'Complete skills assessment', completed: profileData.profileCompletion.skills },
      { text: 'Set accessibility preferences', completed: profileData.profileCompletion.accessibilityPreferences }
    ];
  };

  // Initialize data on component mount
  useEffect(() => {
    const initializeProfile = async () => {
      await apifunctions.fetchProfile();
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

  if (isSaving) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <JobseekerHeader disabled={false} />
        <main className="flex-1 py-6 sm:py-8">
          <div className="mx-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Saving profile...</p>
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
                {fetchedData.profile_picture ? (
                  <img
                    src={fetchedData.profile_picture}
                    alt="Profile Picture"
                    className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                  />
                ) : (
                  <img
                    src="https://i.pravatar.cc/150?img=32"
                    alt="Angela Martinez"
                    className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {profileData.firstName} {profileData.middleName} {profileData.lastName}
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
                        {[...Array(5)].map((_, i) => {
                          const full = i < Math.floor(profileData.rating);
                          const half = i < profileData.rating && i >= Math.floor(profileData.rating);

                          return (
                            <div key={i} className="relative w-4 h-4">
                              {/* Empty star (gray background) */}
                              <svg
                                className="absolute inset-0 w-4 h-4 text-gray-300"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>

                              {/* Full star (yellow) */}
                              {full && (
                                <svg
                                  className="absolute inset-0 w-4 h-4 text-yellow-400"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              )}

                              {/* Half star (yellow left side only) */}
                              {half && (
                                <svg
                                  className="absolute inset-0 w-4 h-4 text-yellow-400"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  style={{ clipPath: "inset(0 50% 0 0)" }}
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <span className="text-sm font-medium">{profileData.rating}/5</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                  Preview Public Profile
                </button>
                <button 
                  onClick={() => window.location.href = '/jobseeker/account-settings'}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors flex items-center space-x-2"
                >
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
                      {getCompletionItems().filter(item => !item.completed).length} items left
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${calculateCompletion()}%` }}></div>
                  </div>
                </div>
                <div className="space-y-3">
                  {getCompletionItems().map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      {item.completed ? (
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                      )}
                      <span className={`text-sm ${item.completed ? 'text-gray-900' : 'text-gray-600'}`}>
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
                  onClick={() => openModal('personalInfo')}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Edit Personal Information
                </button>
              </div>

              {/* Portfolio Links */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Links</h3>
                <div className="space-y-3 mb-4">
                  {profileData.portfolioLinks.portfolio && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Portfolio:</span>
                      <span className="text-sm text-blue-600 ml-2">{profileData.portfolioLinks.portfolio}</span>
                    </div>
                  )}
                  {profileData.portfolioLinks.github && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Github:</span>
                      <span className="text-sm text-blue-600 ml-2">{profileData.portfolioLinks.github}</span>
                    </div>
                  )}
                  {Array.isArray(profileData.portfolioLinks.other) &&
                  profileData.portfolioLinks.other.length === 2 &&
                  profileData.portfolioLinks.other[0].trim() !== "" &&
                  profileData.portfolioLinks.other[1].trim() !== "" && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        {profileData.portfolioLinks.other[0]}:
                      </span>
                      <a
                        href={profileData.portfolioLinks.other[1]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 ml-2"
                      >
                        {profileData.portfolioLinks.other[1]}
                      </a>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => openModal('portfolioLinks')}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
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
                          profileData.profileVisibility[setting.key] ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            profileData.profileVisibility[setting.key] ? 'translate-x-6' : 'translate-x-1'
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
                  <button 
                    onClick={() => openModal('professionalSummary')}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {profileData.professionalSummary}
                </p>
                <div className="text-sm text-gray-500">{(profileData.professionalSummary?.length || 0)}/2000 characters</div>
              </div>

              {/* Skills & Expertise */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Skills & Expertise</h3>
                  <button 
                    onClick={() => openModal('skills')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Manage Skills
                  </button>
                </div>
                {profileData.skills && profileData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profileData.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
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
                  <button 
                    onClick={() => openModal('education')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Add Education
                  </button>
                </div>
                <div className="space-y-4">
                  {Array.isArray(profileData.education) && profileData.education.length > 0 &&  (
                    profileData.education.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.field_of_study}</h4>
                            <p className="text-sm text-gray-600">{item.institution}</p>
                            <p className="text-sm text-gray-500">
                              {/* {item.startYear}  */} WALA PA START YEAR
                              - {item.graduation_details === "Currently Studying" ? "Present" : item.endYear}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => openModal('education', item)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleDelete('education', item.id)}
                              className="p-1 text-gray-400 hover:text-red-600"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Work Experience */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
                  <button 
                    onClick={() => openModal('workExperience')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Add Experience
                  </button>
                </div>
                <div className="space-y-4">
                  {profileData.workExperience && (
                    profileData.workExperience.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.title}</h4>
                            <p className="text-sm text-gray-600">{item.company}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(item.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -{" "}
                              {item.end_date
                                ? new Date(item.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                : "Present"}{" "}
                              • {item.employment_type}
                            </p>
                            <p className="text-sm text-gray-500">{item.location}, {item.country}</p>
                            <p className="text-sm text-gray-700 mt-2">{item.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => openModal('workExperience', item)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleDelete('workExperience', item.id)}
                              className="p-1 text-gray-400 hover:text-red-600"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Accessibility & Accommodation Needs */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Accessibility & Accommodation Needs</h3>
                  <button 
                    onClick={() => openModal('accessibilityNeeds')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Update Requirements
                  </button>
                </div>
                {Array.isArray(profileData.accessibilityNeeds) &&
                  profileData.accessibilityNeeds.length > 0 && (
                    profileData.accessibilityNeeds.map((needs, idx) => (
                      <div key={idx} className="space-y-3">
                        {/* VISUAL SUPPORT */}
                        {needs.visual_support &&
                          needs.visual_support.length > 0 &&
                          !(needs.visual_support.length === 1 &&
                            needs.visual_support[0] === "None of the above") && (
                            <div className="border border-gray-200 rounded-lg">
                              <button
                                onClick={() => toggleSection("visualSupport")}
                                className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-center space-x-2">
                                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  <span className="text-sm font-medium text-gray-900">Visual Support</span>
                                </div>
                                <svg className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.visualSupport ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                            </div>
                        )}

                        {/* HEARING SUPPORT */}
                        {needs.hearing_support &&
                          needs.hearing_support.length > 0 && 
                          !(needs.hearing_support.length === 1 &&
                            needs.hearing_support[0] === "None of the above") && (
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
                        )}

                        {/* MOBILITY SUPPORT */}
                        {needs.mobility_support &&
                          needs.mobility_support.length > 0 && 
                          !(needs.mobility_support.length === 1 &&
                            needs.mobility_support[0] === "None of the above") && (
                          <div className="border border-gray-200 rounded-lg">
                            <button
                              onClick={() => toggleSection('mobilitySupport')}
                              className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                </svg>
                                <span className="text-sm font-medium text-gray-900">Mobility Support</span>
                              </div>
                              <svg className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.mobilitySupport ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                        )}

                        {/* COGNITIVE SUPPORT */}
                        {needs.cognitive_support &&
                          needs.cognitive_support.length > 0 && 
                          !(needs.cognitive_support.length === 1 &&
                            needs.cognitive_support[0] === "None of the above") && (
                          <div className="border border-gray-200 rounded-lg">
                            <button
                              onClick={() => toggleSection('cognitiveSupport')}
                              className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                </svg>
                                <span className="text-sm font-medium text-gray-900">Cognitive Support</span>
                              </div>
                              <svg className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.cognitiveSupport ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>

              {/* Employment Preferences */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Employment Preferences</h3>
                  <button 
                    onClick={() => openModal('employmentPreferences')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Update Preferences
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Work Arrangement:</span>
                    <span className="text-sm text-gray-900 ml-2">{profileData.employmentPreferences.workArrangement}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Employment Type:</span>
                    <span className="text-sm text-gray-900 ml-2">
                      {Array.isArray(profileData.employmentPreferences.employmentType) 
                      ? profileData.employmentPreferences.employmentType.join(', ') 
                      : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Experience Level:</span>
                    <span className="text-sm text-gray-900 ml-2">{profileData.employmentPreferences.experienceLevel}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Salary Range:</span>
                    <span className="text-sm text-gray-900 ml-2">
                      {profileData.employmentPreferences.salaryRange}/month
                    </span>
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

      {/* Modals */}
      <ProfileModal
        isOpen={activeModal === 'personalInfo'}
        onClose={closeModal}
        title="Edit Personal Information"
        description="Update your basic personal information"
        onSave={handleSave}
        isSaving={isSaving}
      >
        <PersonalInfoModal formData={formData} onFormChange={handleFormChange} />
      </ProfileModal>

      <ProfileModal
        isOpen={activeModal === 'professionalSummary'}
        onClose={closeModal}
        title="Edit Professional Summary"
        description="Tell us about your professional background"
        onSave={handleSave}
        isSaving={isSaving}
      >
        <ProfessionalSummaryModal formData={formData} onFormChange={handleFormChange} />
      </ProfileModal>

      <ProfileModal
        isOpen={activeModal === 'skills'}
        onClose={closeModal}
        title="Manage Skills & Expertise"
        description="Select and manage your professional skills"
        onSave={handleSave}
        isSaving={isSaving}
      >
        <SkillsModal 
          formData={formData} 
          onFormChange={handleFormChange}
          onAddSkill={addArrayItem}
          onRemoveSkill={removeArrayItem}
        />
      </ProfileModal>

      <ProfileModal
        isOpen={activeModal === 'education'}
        onClose={closeModal}
        title={editingItem ? 'Edit Education' : 'Add Education'}
        description="Add or update your educational background"
        onSave={handleSave}
        isSaving={isSaving}
      >
        <EducationModal 
          formData={formData} 
          onFormChange={handleFormChange}
          isEditing={!!editingItem}
        />
      </ProfileModal>

      <ProfileModal
        isOpen={activeModal === 'workExperience'}
        onClose={closeModal}
        title={editingItem ? 'Edit Work Experience' : 'Add Work Experience'}
        description="Add or update your work experience"
        onSave={handleSave}
        isSaving={isSaving}
      >
        <WorkExperienceModal 
          formData={formData} 
          onFormChange={handleFormChange}
          isEditing={!!editingItem}
        />
      </ProfileModal>

      <ProfileModal
        isOpen={activeModal === 'portfolioLinks'}
        onClose={closeModal}
        title="Edit Portfolio Links"
        description="Update your portfolio and social links"
        onSave={handleSave}
        isSaving={isSaving}
      >
        <PortfolioLinksModal formData={formData} onFormChange={handleFormChange} />
      </ProfileModal>

      <ProfileModal
        isOpen={activeModal === 'accessibilityNeeds'}
        onClose={closeModal}
        title="Update Accessibility Needs"
        description="Specify your accessibility requirements"
        onSave={handleSave}
        isSaving={isSaving}
      >
        <AccessibilityNeedsModal formData={formData} onFormChange={handleFormChange} />
      </ProfileModal>

      <ProfileModal
        isOpen={activeModal === 'employmentPreferences'}
        onClose={closeModal}
        title="Update Employment Preferences"
        description="Set your employment preferences"
        onSave={handleSave}
        isSaving={isSaving}
      >
        <EmploymentPreferencesModal formData={formData} onFormChange={handleFormChange} />
      </ProfileModal>
    </div>
  );
};

export default JobseekerProfile;
