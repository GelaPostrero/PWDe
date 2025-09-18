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
import VerificationStatusModal from '../../components/modals/VerificationStatusModal.jsx';

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
        profession: fetchedData.profession,
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
          linkedin: fetchedData.linkedin_url,
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
        
        // Verification Status
        verificationStatus: {
          emailVerified: fetchedData.is_verified || false,
          documentStatus: fetchedData.document_verification_status || 'not_submitted', // 'not_submitted', 'pending', 'verified', 'rejected'
          rejectionReason: fetchedData.document_rejection_reason || null,
          uploadedFiles: fetchedData.verification_documents || []
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
      
      // Debug: Log profession data after profileData is created
      console.log('Profile data mapping - fetchedData.profession:', fetchedData.profession);
      console.log('Profile data mapping - fetchedData.educations:', fetchedData.educations);
      console.log('Profile data mapping - profileData.education:', profileData.education);
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
    console.log('Opening modal:', modalType, 'Current activeModal:', activeModal);
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
        // Use fetchedData.profession as fallback if profileData.profession is empty
        const professionValue = profileData.profession || fetchedData.profession || '';
        
        setFormData({
          skills: [...profileData.skills],
          profession: professionValue
        });
        break;
      case 'education':
         console.log('Education modal - Editing item:', item);
         if (item) {
           console.log('Education modal - Item field_of_study:', item.field_of_study);
           console.log('Education modal - Item fieldOfStudy:', item.fieldOfStudy);
         }
        setFormData(item ? {
          institution: item.institution,
           location: item.location,
           fieldOfStudy: item.field_of_study || item.fieldOfStudy || '',
           degree: item.degree,
           graduationStatus: item.graduation_details || item.graduationStatus || 'Graduated',
           yearGraduated: item.year_graduated || item.yearGraduated || ''
         } : {
          institution: '',
           location: '',
           fieldOfStudy: '',
           degree: '',
           graduationStatus: 'Graduated',
           yearGraduated: ''
        });
        break;
      case 'workExperience':
         console.log('Work Experience modal - Editing item:', item);
         if (item) {
           console.log('Work Experience modal - Item fields:', {
             jobTitle: item.jobTitle,
          title: item.title,
             job_title: item.job_title,
          company: item.company,
          location: item.location,
             country: item.country,
             startDate: item.startDate,
             start_date: item.start_date,
             endDate: item.endDate,
             end_date: item.end_date,
             isCurrent: item.isCurrent,
             employmentType: item.employmentType,
             employment_type: item.employment_type,
          description: item.description
           });
         }
         // Helper function to format date for HTML date input
         const formatDateForInput = (dateString) => {
           if (!dateString) return '';
           try {
             const date = new Date(dateString);
             return date.toISOString().split('T')[0];
           } catch (error) {
             console.error('Error formatting date:', error);
             return '';
           }
         };

         setFormData(item ? {
           jobTitle: item.jobTitle || item.title || item.job_title || '',
           company: item.company || '',
           location: item.location || '',
           country: item.country || 'Philippines',
           startDate: formatDateForInput(item.startDate || item.start_date),
           endDate: formatDateForInput(item.endDate || item.end_date),
           isCurrent: item.isCurrent || false,
           employmentType: item.employmentType || item.employment_type || 'Full-time',
           description: item.description || ''
         } : {
           jobTitle: '',
          company: '',
          location: '',
           country: 'Philippines',
           startDate: '',
           endDate: '',
           isCurrent: false,
           employmentType: 'Full-time',
          description: ''
        });
        break;
      case 'portfolioLinks':
        setFormData({ ...profileData.portfolioLinks });
        break;
      case 'accessibilityNeeds':
         console.log('Accessibility modal - Current profileData.accessibilityNeeds:', profileData.accessibilityNeeds);
         setFormData({
           visual_support: profileData.accessibilityNeeds?.[0]?.visual_support || [],
           hearing_support: profileData.accessibilityNeeds?.[0]?.hearing_support || [],
           mobility_support: profileData.accessibilityNeeds?.[0]?.mobility_support || [],
           cognitive_support: profileData.accessibilityNeeds?.[0]?.cognitive_support || [],
           additionalInfo: profileData.accessibilityNeeds?.[0]?.additionalInfo || ''
         });
        break;
      case 'employmentPreferences':
        console.log('Employment Preferences modal - Current profileData.employmentPreferences:', profileData.employmentPreferences);
        setFormData({
          workArrangement: profileData.employmentPreferences?.workArrangement || '',
          employmentTypes: profileData.employmentPreferences?.employmentType || [],
          experienceLevel: profileData.employmentPreferences?.experienceLevel || '',
          salaryRange: profileData.employmentPreferences?.salaryRange || { currency: 'PHP', min: '', max: '', frequency: '' }
        });
        break;
      case 'verificationStatus':
        console.log('Verification Status modal - Current profileData.verificationStatus:', profileData.verificationStatus);
        setFormData({
          emailVerified: profileData.verificationStatus?.emailVerified || false,
          documentStatus: profileData.verificationStatus?.documentStatus || 'not_submitted',
          rejectionReason: profileData.verificationStatus?.rejectionReason || null,
          uploadedFiles: profileData.verificationStatus?.uploadedFiles || [] // Load existing uploaded files
        });
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

  // Special handler for VerificationStatusModal that expects full formData object
  const handleVerificationFormChange = (updatedFormData) => {
    console.log('handleVerificationFormChange - received:', updatedFormData);
    setFormData(updatedFormData);
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
        
         console.log('Fetching profile data...');
         const { data } = await api.get('/retrieve/profile');
         
         console.log('Profile API response:', data);

         if(data && data.success) {
           console.log("Profile - Data received:", data.data);
           console.log("Profile - Profession field from API:", data.data.profession);
           console.log("Profile - Profile completion fields:", {
             basic_information: data.data.basic_information,
             professional_summary_completed: data.data.professional_summary_completed,
             workexperience: data.data.workexperience,
             education: data.data.education,
             portfolio_items: data.data.portfolio_items,
             skills: data.data.skills,
             set_accessibility_preferences: data.data.set_accessibility_preferences
           });
           console.log("Profile - Portfolio links data:", {
             github_url: data.data.github_url,
             portfolio_url: data.data.portfolio_url,
             linkedin_url: data.data.linkedin_url,
             otherPlatform: data.data.otherPlatform
           });
          setFetchedData(data.data);
         } else {
           throw new Error('Invalid response format from server');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
         
         // Handle different types of errors
         if (err.code === 'ECONNABORTED') {
           setError('Request timed out. Please check your internet connection and try again.');
         } else if (err.response) {
           // Server responded with error status
           setError(`Server error: ${err.response.status} - ${err.response.data?.message || 'Unknown error'}`);
         } else if (err.request) {
           // Request was made but no response received
           setError('Unable to connect to server. Please check if the backend is running.');
         } else {
           // Something else happened
           setError('Failed to load profile data. Please try again.');
         }
         
         console.error('Error response:', err.response);
         console.error('Error message:', err.message);
         if (err.response && err.response.data) {
           console.error('Backend error details:', err.response.data);
         }
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
        
        let endpoint = '';
        let payload = data;
        
        // Determine the correct endpoint based on section
        switch (section) {
          case 'personalInfo':
            endpoint = '/retrieve/update/basic-information';
            payload = {
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              phone: data.phone,
              birthDate: data.birthDate,
              disabilityType: data.disabilityType,
              location: data.location
            };
            break;
          case 'professionalInfo':
            endpoint = '/retrieve/update/professional-summary';
            payload = {
              professionalSummary: data.professionalSummary
            };
            break;
          case 'skills':
            endpoint = '/retrieve/update/skills';
            payload = {
              skills: data.skills,
              profession: data.profession
            };
            break;
          case 'education':
            endpoint = '/retrieve/update/education';
            console.log('Education API - Data being sent:', data);
            console.log('Education API - Data type:', typeof data, Array.isArray(data));
            console.log('Education API - First education entry:', data[0]);
            payload = {
              education: data.map(edu => {
                console.log('Education API - Mapping education entry:', edu);
                const mappedEdu = {
                  highestLevel: edu.degree,
                  institution: edu.institution,
                  location: edu.location,
                  degree: edu.degree,
                  fieldOfStudy: edu.fieldOfStudy || edu.field_of_study || '',
                  graduationDetails: edu.graduationStatus || edu.graduation_details || '',
                  yearGraduated: edu.yearGraduated || edu.year_graduated || ''
                };
                console.log('Education API - Mapped education entry:', mappedEdu);
                return mappedEdu;
              })
            };
            console.log('Education API - Final payload:', payload);
            break;
           case 'workExperience':
             endpoint = '/retrieve/update/work-experience';
             console.log('Work Experience API - Data being sent:', data);
             console.log('Work Experience API - Data type:', typeof data, Array.isArray(data));
             payload = {
               workExperience: data.map(exp => {
                 console.log('Work Experience API - Mapping experience entry:', exp);
                 const mappedExp = {
                   jobTitle: exp.jobTitle || exp.title || exp.job_title || '',
                   company: exp.company || '',
                   location: exp.location || '',
                   country: exp.country || 'Philippines',
                   startDate: exp.startDate || exp.start_date || '',
                   endDate: exp.endDate || exp.end_date || '',
                   isCurrent: exp.isCurrent || false,
                   employmentType: exp.employmentType || exp.employment_type || 'Full-time',
                   description: exp.description || ''
                 };
                 console.log('Work Experience API - Mapped experience entry:', mappedExp);
                 return mappedExp;
               })
             };
             console.log('Work Experience API - Final payload:', payload);
             break;
           case 'portfolioLinks':
             endpoint = '/retrieve/update/portfolio-links';
             payload = {
               portfolioUrl: data.portfolio,
               githubUrl: data.github,
               linkedinUrl: data.linkedin,
               otherPlatform: JSON.stringify(data.other || [])
             };
             break;
           case 'accessibilityNeeds':
             endpoint = '/retrieve/update/accessibility-needs';
             payload = {
               visual_support: data.visual_support || [],
               hearing_support: data.hearing_support || [],
               mobility_support: data.mobility_support || [],
               cognitive_support: data.cognitive_support || [],
               additionalInfo: data.additionalInfo || ''
             };
             break;
           case 'employmentPreferences':
             endpoint = '/retrieve/update/employment-preferences';
             payload = {
               workArrangement: data.workArrangement || '',
               employmentTypes: data.employmentTypes || [],
               experienceLevel: data.experienceLevel || '',
               salaryRange: data.salaryRange || { currency: 'PHP', min: '', max: '', frequency: '' }
             };
             break;
           default:
             throw new Error(`Unknown section: ${section}`);
        }

        console.log(`Updating ${section} with endpoint: ${endpoint}`, payload);
        const response = await api.put(endpoint, payload);

        if(response.data.success) {
          // Update local state
          setProfileData(prev => ({
            ...prev,
            [section]: data
          }));

          // Refresh profile data to get updated completion status
          await apifunctions.fetchProfile();

          return { success: true };
        } else {
          throw new Error(response.data.error || 'Update failed');
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
          await handleUpdateProfile('skills', {
            skills: formData.skills,
            profession: formData.profession
          });
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
            const updatedExperience = profileData.workExperience.map(item => 
              item.id === editingItem.id ? { ...formData, id: editingItem.id } : item
            );
            await handleUpdateProfile('workExperience', updatedExperience);
          } else {
            // Add new work experience
            const newExperience = [...profileData.workExperience, { ...formData, id: Date.now() }];
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
        case 'verificationStatus':
          // Handle document upload for verification
          console.log('Saving verification documents:', formData);
          console.log('formData.uploadedFiles:', formData.uploadedFiles);
          console.log('formData.uploadedFiles length:', formData.uploadedFiles?.length);
          if (formData.uploadedFiles && formData.uploadedFiles.length > 0) {
            console.log('Uploading files:', formData.uploadedFiles);
            
            try {
              // Create FormData for file upload
              const formDataToSend = new FormData();
              
              // Append each file
              formData.uploadedFiles.forEach((file, index) => {
                formDataToSend.append('documents', file);
              });
              
              // Make API call to upload documents
              const response = await api.put('/retrieve/update/verification-documents', formDataToSend, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
              
              if (response.data.success) {
                console.log('Documents uploaded successfully:', response.data);
                
                // Update the verification status to "pending" after successful upload
                setProfileData(prev => ({
                  ...prev,
                  verificationStatus: {
                    ...prev.verificationStatus,
                    documentStatus: 'pending',
                    uploadedFiles: formData.uploadedFiles // Store the uploaded files
                  }
                }));
                
                // Show success message
                alert(`${formData.uploadedFiles.length} document(s) uploaded successfully and will be reviewed within 1-3 business days.`);
              } else {
                throw new Error(response.data.message || 'Upload failed');
              }
            } catch (error) {
              console.error('Error uploading documents:', error);
              alert(`Error uploading documents: ${error.response?.data?.message || error.message}`);
            }
          } else {
            console.log('No uploaded files found in formData');
            alert('No documents selected for upload.');
          }
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
    let isMounted = true;
    
    const initializeProfile = async () => {
      try {
        if (isMounted) {
      await apifunctions.fetchProfile();
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error initializing profile:', error);
          setError('Failed to load profile data. Please check your connection and try again.');
        }
      }
    };
    
    initializeProfile();
    
    return () => {
      isMounted = false;
    };
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
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-red-600 text-sm font-medium">Error loading profile</p>
                   <p className="text-red-500 text-sm mt-1">{error}</p>
                 </div>
                 <button
                   onClick={() => {
                     setError(null);
                     apifunctions.fetchProfile();
                   }}
                   className="ml-4 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                 >
                   Retry
                 </button>
               </div>
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
                  {profileData.portfolioLinks.github && (
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
                  {profileData.portfolioLinks.linkedin && (
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
                  {Array.isArray(profileData.portfolioLinks.other) &&
                  profileData.portfolioLinks.other.length > 0 && 
                  profileData.portfolioLinks.other.some(item => 
                    (typeof item === 'string' && item.trim() !== '') ||
                    (typeof item === 'object' && item !== null && item.url && item.url.trim() !== '')
                  ) && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Other Links:</span>
                      <div className="mt-1 space-y-1">
                        {profileData.portfolioLinks.other.map((item, index) => {
                          if (typeof item === 'string' && item.trim() !== '') {
                            return (
                              <div key={index}>
                                <a
                                  href={item}
                        target="_blank"
                        rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline"
                                >
                                  {item}
                                </a>
                              </div>
                            );
                          } else if (typeof item === 'object' && item !== null && item.url && item.url.trim() !== '') {
                            return (
                              <div key={index}>
                                <span className="text-sm font-medium text-gray-700">{item.name || 'Link'}:</span>
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 ml-2 hover:underline"
                                >
                                  {item.url}
                                </a>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
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
                    <span className="text-sm font-medium text-gray-700">
                      {profileData.verificationStatus.emailVerified && profileData.verificationStatus.documentStatus === 'verified' ? '100% Complete' :
                       profileData.verificationStatus.emailVerified && profileData.verificationStatus.documentStatus === 'pending' ? '50% Complete' :
                       profileData.verificationStatus.emailVerified ? '50% Complete' : '0% Complete'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {profileData.verificationStatus.documentStatus === 'not_submitted' ? '2 items left' :
                       profileData.verificationStatus.documentStatus === 'pending' ? '1 item left' :
                       profileData.verificationStatus.documentStatus === 'rejected' ? '1 item left' : '0 items left'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ 
                        width: profileData.verificationStatus.emailVerified && profileData.verificationStatus.documentStatus === 'verified' ? '100%' :
                               profileData.verificationStatus.emailVerified ? '50%' : '0%'
                      }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-3">
                  {/* Email Verification */}
                  <div className="flex items-center space-x-3">
                    {profileData.verificationStatus.emailVerified ? (
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                    )}
                    <span className={`text-sm ${profileData.verificationStatus.emailVerified ? 'text-gray-900' : 'text-gray-600'}`}>
                      Email verified
                    </span>
                    </div>
                  
                  {/* Document Verification */}
                  <div className="flex items-center space-x-3">
                    {profileData.verificationStatus.documentStatus === 'verified' ? (
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                    )}
                    <span className={`text-sm ${profileData.verificationStatus.documentStatus === 'verified' ? 'text-gray-900' : 'text-gray-600'}`}>
                      {profileData.verificationStatus.documentStatus === 'verified' ? 'Documents verified' :
                       profileData.verificationStatus.documentStatus === 'pending' ? 'Documents under review' :
                       profileData.verificationStatus.documentStatus === 'rejected' ? 'Documents rejected' :
                       'Documents not submitted'}
                    </span>
                </div>
                </div>
                <button 
                  onClick={() => openModal('verificationStatus')}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors mt-4"
                >
                  {profileData.verificationStatus.documentStatus === 'not_submitted' ? 'Upload Documents' :
                   profileData.verificationStatus.documentStatus === 'pending' ? 'View Documents' :
                   profileData.verificationStatus.documentStatus === 'rejected' ? 'Resubmit Documents' :
                   profileData.verificationStatus.documentStatus === 'verified' ? 'View Documents' :
                   'View Status'}
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
                  {Array.isArray(profileData.education) && profileData.education.length > 0 ? (
                    profileData.education.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.field_of_study || item.fieldOfStudy || 'Field of Study'}</h4>
                            <p className="text-sm text-gray-600">{item.institution || 'Institution'}</p>
                            <p className="text-sm text-gray-500">
                              {item.location && `${item.location} • `}
                              {item.degree && `${item.degree} • `}
                              {(item.graduation_details || item.graduationStatus) === "Currently Studying" ? "Currently Studying" : 
                               (item.year_graduated || item.yearGraduated) ? (item.year_graduated || item.yearGraduated) : 
                               (item.graduation_details || item.graduationStatus) || "Graduated"}
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
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <p className="text-sm">No education information added yet</p>
                      <p className="text-xs text-gray-400 mt-1">Click "+ Add Education" to get started</p>
                    </div>
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
                             <h4 className="font-medium text-gray-900">{item.jobTitle || item.title || item.job_title}</h4>
                            <p className="text-sm text-gray-600">{item.company}</p>
                            <p className="text-sm text-gray-500">
                              {(item.startDate || item.start_date) && new Date(item.startDate || item.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -{" "}
                              {(item.endDate || item.end_date)
                                ? new Date(item.endDate || item.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                : "Present"}{" "}
                              • {item.employmentType || item.employment_type}
                            </p>
                            <p className="text-sm text-gray-500">{item.location && `${item.location}, `}{item.country}</p>
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
                  profileData.accessibilityNeeds.length > 0 ? (
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
                              {expandedSections.visualSupport && (
                                <div className="px-3 pb-3 border-t border-gray-200">
                                  <div className="pt-3">
                                    <div className="flex flex-wrap gap-2">
                                      {needs.visual_support.map((item, index) => (
                                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                          {item}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
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
                            {expandedSections.hearingSupport && (
                              <div className="px-3 pb-3 border-t border-gray-200">
                                <div className="pt-3">
                                  <div className="flex flex-wrap gap-2">
                                    {needs.hearing_support.map((item, index) => (
                                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {item}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
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
                            {expandedSections.mobilitySupport && (
                              <div className="px-3 pb-3 border-t border-gray-200">
                                <div className="pt-3">
                                  <div className="flex flex-wrap gap-2">
                                    {needs.mobility_support.map((item, index) => (
                                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                        {item}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
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
                            {expandedSections.cognitiveSupport && (
                              <div className="px-3 pb-3 border-t border-gray-200">
                                <div className="pt-3">
                                  <div className="flex flex-wrap gap-2">
                                    {needs.cognitive_support.map((item, index) => (
                                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                        {item}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* ADDITIONAL INFORMATION */}
                        {needs.additional_information && needs.additional_information.trim() && (
                          <div className="border border-gray-200 rounded-lg">
                            <div className="p-3">
                              <div className="flex items-center space-x-2 mb-2">
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-900">Additional Information</span>
                              </div>
                              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                {needs.additional_information}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm">No accessibility needs specified yet</p>
                    <p className="text-xs text-gray-400 mt-1">Click "Update Requirements" to add your accessibility needs</p>
                  </div>
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
                      {profileData.employmentPreferences.salaryRange && typeof profileData.employmentPreferences.salaryRange === 'object' ? (
                        profileData.employmentPreferences.salaryRange.min && profileData.employmentPreferences.salaryRange.max ? (
                          `₱${profileData.employmentPreferences.salaryRange.min.toLocaleString()} - ₱${profileData.employmentPreferences.salaryRange.max.toLocaleString()} ${profileData.employmentPreferences.salaryRange.frequency ? `per ${profileData.employmentPreferences.salaryRange.frequency.toLowerCase()}` : ''}`
                        ) : 'Not specified'
                      ) : (
                        profileData.employmentPreferences.salaryRange || 'Not specified'
                      )}
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

      <ProfileModal
        isOpen={activeModal === 'verificationStatus'}
        onClose={closeModal}
        title="Verification Status"
        description="Your account verification status and document review progress"
        onSave={handleSave}
        isSaving={isSaving}
        saveText="Save Changes"
      >
        <VerificationStatusModal formData={formData} onFormChange={handleVerificationFormChange} />
      </ProfileModal>
      
      {/* Debug info */}
      {console.log('Modal render - activeModal:', activeModal, 'verificationStatus check:', activeModal === 'verificationStatus')}
    </div>
  );
};

export default JobseekerProfile;
