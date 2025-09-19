import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../../utils/api.js';
import JobseekerHeader from '../../components/ui/JobseekerHeader.jsx';
import Footer from '../../components/ui/Footer.jsx';
import Chatbot from '../../components/ui/Chatbot.jsx';

const JobseekerAccountSettings = () => {
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fetchData, setFetchData] = useState([]);

  // Account data state
  const [accountData, setAccountData] = useState({});

  useEffect(() => {
    if(fetchData && Object.keys(fetchData).length > 0) {
      console.log('Setting account data from fetchData:', fetchData);
      setAccountData(prev => ({
        ...prev,
        account: {
          // Basic Account Information
          email: fetchData.email || '',
          phone: fetchData.phone || '',
          password: '',
          confirmPassword: '',
          
          // Profile Information
          firstName: fetchData.firstname || '',
          lastName: fetchData.lastname || '',
          profilePicture: fetchData.profile_picture || '',
        },
        
        // Privacy Settings
        privacy: {
          profileVisibility: fetchData.profile_visibility || 'public', // public, connections, private
          display_personal_information: fetchData.display_personal_information !== undefined ? fetchData.display_personal_information : true,
          display_portfolio_links: fetchData.display_portfolio_links !== undefined ? fetchData.display_portfolio_links : true,
          show_professional_summary: fetchData.show_professional_summary !== undefined ? fetchData.show_professional_summary : true,
          show_skills_and_expertise: fetchData.show_skills_and_expertise !== undefined ? fetchData.show_skills_and_expertise : true,
          show_education: fetchData.show_education !== undefined ? fetchData.show_education : true,
          show_experience: fetchData.show_experience !== undefined ? fetchData.show_experience : true,
          display_accommodation_needs: fetchData.display_accommodation_needs !== undefined ? fetchData.display_accommodation_needs : true,
          display_employment_preferences: fetchData.display_employment_preferences !== undefined ? fetchData.display_employment_preferences : true,
          allowMessages: fetchData.allow_messages !== undefined ? fetchData.allow_messages : true
        },
        
        // Notification Preferences
        notifications: {
          email: {
            jobMatches: fetchData.job_matches,
            messages: fetchData.messages,
            applications: fetchData.application_updates
          },
          push: {
            jobMatches: fetchData.push_notif_job_matches,
            messages: fetchData.push_notif_messages,
            applications: fetchData.push_notif_application_updates
          },
          sms: {
            urgentMessages: fetchData.urgent_messages,
            securityAlerts: fetchData.security_alerts
          }
        },
        
        // Security Settings
        security: {
          twoFactorAuth: false,
          loginAlerts: true,
          sessionTimeout: 30, // minutes
          trustedDevices: []
        },
        
        // Account Status
        accountStatus: {
          active: true,
          verified: true,
          lastLogin: '',
          createdAt: ''
        }
      }));
    }
  }, [fetchData]);

  // Form states
  const [activeSection, setActiveSection] = useState('account');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  // Password form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // API Functions
  const apifunction = {
    fetchAccountData: async () => {
      try {
        setIsLoading(true);
        
        const { data } = await api.get('/account-settings/account-information');

        await new Promise(resolve => setTimeout(resolve, 500));

        if(data.success) {
          console.log('Account data fetched successfully:', data.data);
          setFetchData(data.data);
        } else {
          console.error('Failed to fetch account data:', data);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to load account data',
            timer: 3000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to load account data',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
        console.error('Error fetching account data:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },

    updateAccountData: async (section, data) => {
      try {
        setIsSaving(true);

        let dataToSend = { ...data };

        if(section === "account" && !selectedFile) {
          delete dataToSend.profilePicture
        }
        
        console.log('Sending update request:', { section, data: dataToSend });
        const response = await api.put('/account-settings/update', { section, data: dataToSend });
        console.log('Update response:', response.data);

        if(response.data && response.data.success) {
          setAccountData(prev => ({
            ...prev,
            [section]: data
          }));
          
          // Show SweetAlert success message
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Account updated successfully!',
            timer: 3000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });
          
          return { success: true };
        } else {
          const errorMsg = response.data?.error || 'Failed to update settings';
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: errorMsg,
            timer: 3000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });
          console.error('Update failed:', response.data);
        }
      } catch (err) {
        const errorMsg = err.response?.data?.error || err.message || 'Failed to update settings';
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: errorMsg,
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
        console.error('Error updating account data:', err);
        console.error('Error response:', err.response?.data);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },

    changePassword: async (currentPassword, newPassword) => {
      try {
        setIsSaving(true);
        
        const { data } = await api.put('/account-settings/update-password', {currentPassword, newPassword});
        //  Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if(data.success) {
          // Show SweetAlert success message
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Password changed successfully!',
            timer: 3000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });
          return { success: true };
        }

        
      } catch (err) {
        if (err.response?.status === 400) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Incorrect password',
            timer: 3000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to change password',
            timer: 3000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });
          console.error('Error changing password:', err);
          throw err;
        }
      } finally {
        setIsSaving(false);
      }
    },

    deleteAccount: async (password) => {
      try {
        setIsSaving(true);

        //  Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Redirect to login or home page
        window.location.href = '/';

        return { success: true };
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to delete account',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
        console.error('Error deleting account:', err);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },

    // Update profile visibility settings
    updateVisibility: async (settings) => {
      try {
        const response = await api.put('/retrieve/update/profile-visibility', settings);
        
        setAccountData(prev => ({
          ...prev,
          privacy: {
            ...prev.privacy,
            ...settings
          }
        }));
        
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Visibility settings updated successfully!',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
        
        return { success: true };
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to update visibility settings',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
        console.error('Error updating visibility:', err);
        throw err;
      }
    },

    // Update notification preferences
    updateNotifications: async (settings) => {
      try {
        const response = await api.put('/retrieve/update/notification-preferences', settings);
        
        setAccountData(prev => ({
          ...prev,
          notifications: {
            ...prev.notifications,
            ...settings
          }
        }));
        
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Notification preferences updated successfully!',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
        
        return { success: true };
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to update notification preferences',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
        console.error('Error updating notifications:', err);
        throw err;
      }
    }
  };

  // Event handlers
  const handleInputChange = (section, field, value) => {
    if (section === 'account' || section === 'privacy' || section === 'notifications' || section === 'security') {
      setAccountData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setAccountData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Photo upload handler
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Please select a valid image file',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
        return;
      }

      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'File size must be less than 2MB',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
        return;
      }

      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);

    }
  };

  // Save photo
  const handleSavePhoto = async () => {
    if (selectedFile) {
      try {
        setIsSaving(true);
        
        const formData = new FormData();
        formData.append('profilePhoto', selectedFile);
        const response = await api.put('/account-settings/update-profile-picture', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });

        if(response.data.success) {
          setAccountData(prev => ({
            ...prev,
            profilePicture: previewUrl
          }));
          
          // Show SweetAlert success message
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Profile photo updated successfully!',
            timer: 3000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });

          setSelectedFile(null);
          setPreviewUrl('');
          
          // Reset file input
          const fileInput = document.getElementById('photo-upload');
          if (fileInput) fileInput.value = '';

          setTimeout(() => window.location.reload(), 1000);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to update settings',
            timer: 3000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to update profile photo',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
        console.error('Error updating photo:', err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleNestedInputChange = (section, subsection, field, value) => {
    setAccountData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const handleSave = async (section) => {
    try {
      console.log('Saving section:', section, 'with data:', accountData[section]);
      await apifunction.updateAccountData(section, accountData[section]);
      console.log('Save completed successfully');
    } catch (err) {
      console.error('Save failed:', err);
      // Error already handled in API function
    }
  };

  // Handle visibility toggle
  const handleToggleVisibility = async (setting) => {
    try {
      const newSettings = {
        ...accountData.privacy,
        [setting]: !accountData.privacy?.[setting]
      };
      
      await apifunction.updateVisibility(newSettings);
    } catch (err) {
      // Error already handled in API function
    }
  };

  // Handle profile visibility radio button change
  const handleProfileVisibilityChange = async (value) => {
    try {
      const newSettings = {
        ...accountData.privacy,
        profileVisibility: value
      };
      
      await apifunction.updateVisibility(newSettings);
    } catch (err) {
      // Error already handled in API function
    }
  };

  // Handle notification toggle
  const handleNotificationToggle = async (type, setting) => {
    try {
      const newSettings = {
        ...accountData.notifications,
        [type]: {
          ...accountData.notifications[type],
          [setting]: !accountData.notifications[type][setting]
        }
      };
      
      await apifunction.updateNotifications(newSettings);
    } catch (err) {
      // Error already handled in API function
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please fill in all password fields',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      return;
    }
    
    // Check if passwords match
    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Passwords do not match',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      return;
    }
    
    try {
      await apifunction.changePassword(currentPassword, newPassword);
      setShowPasswordForm(false);
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      // Error already handled in API function
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    try {
      await apifunction.deleteAccount(accountData.password);
    } catch (err) {
      // Error already handled in API function
    }
  };

  // Remove trusted device
  const handleRemoveDevice = async (deviceId) => {
    try {
      setIsSaving(true);

      //Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Remove device from state
      setAccountData(prev => ({
        ...prev,
        security: {
          ...prev.security,
          trustedDevices: prev.security.trustedDevices.filter(device => device.id !== deviceId)
        }
      }));

      // Show SweetAlert success message
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Device removed successfully',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to remove device',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      console.error('Error removing device:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    const initializeAccount = async () => {
      try {
        await apifunction.fetchAccountData();
      } catch (err) {
        // Error already handled in API function
      }
    };

    initializeAccount();
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
                <p className="text-gray-500">Loading account settings...</p>
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



          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-gray-600 mt-2">Manage your account information, privacy, and security settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <nav className="space-y-2">
                {[
                  { id: 'account', label: 'Account Information', icon: '👤' },
                  { id: 'privacy', label: 'Privacy & Visibility', icon: '🔒' },
                  { id: 'notifications', label: 'Notifications', icon: '🔔' },
                  { id: 'security', label: 'Security', icon: '🛡️' },
                  { id: 'danger', label: 'Account Management', icon: '⚠️' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${activeSection === item.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <span className="text-lg mr-3">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">

              {/* Account Information Section */}
              {activeSection === 'account' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Information</h2>

                    <div className="space-y-6">
                      {/* Profile Picture */}
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={previewUrl || accountData.account?.profilePicture || '/favicon.png'}
                            alt="Profile"
                            className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                          />
                          {selectedFile && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                          <div className="flex space-x-2">
                            <label
                              htmlFor="photo-upload"
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                            >
                              {selectedFile ? 'Choose Different' : 'Change Photo'}
                            </label>
                            {selectedFile && (
                              <button
                                onClick={handleSavePhoto}
                                disabled={isSaving}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                              >
                                {isSaving ? 'Saving...' : 'Save Photo'}
                              </button>
                            )}
                            {selectedFile && (
                              <button
                                onClick={() => {
                                  setSelectedFile(null);
                                  setPreviewUrl('');
                                  const fileInput = document.getElementById('photo-upload');
                                  if (fileInput) fileInput.value = '';
                                }}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 2MB</p>
                          {selectedFile && (
                            <p className="text-sm text-green-600 mt-1">
                              Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Basic Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                          <input
                            type="text"
                            value={accountData.account?.firstName || ''}
                            onChange={(e) => handleInputChange('account', 'firstName', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                          <input
                            type="text"
                            value={accountData.account?.lastName || ''}
                            onChange={(e) => handleInputChange('account', 'lastName', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={accountData.account?.email || ''}
                          onChange={(e) => handleInputChange('account', 'email', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        <p className="text-sm text-gray-500 mt-1">This email will be used for account notifications</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={accountData.account?.phone || ''}
                          onChange={(e) => handleInputChange('account', 'phone', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>

                      {/* Password Section */}
                      <div className="border-t border-gray-200 pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">Password</h3>
                            <p className="text-sm text-gray-500">Change your account password</p>
                          </div>
                          <button
                            onClick={() => setShowPasswordForm(!showPasswordForm)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            {showPasswordForm ? 'Cancel' : 'Change Password'}
                          </button>
                        </div>

                        {showPasswordForm && (
                          <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                              <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                              <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                              <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required
                              />
                            </div>
                            <div className="flex space-x-3">
                              <button
                                type="submit"
                                disabled={isSaving}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                              >
                                {isSaving ? 'Updating...' : 'Update Password'}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowPasswordForm(false);
                                  setCurrentPassword('');
                                  setNewPassword('');
                                  setConfirmPassword('');
                                }}
                                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
                      <button
                        onClick={() => handleSave('account')}
                        disabled={isSaving}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy & Visibility Section */}
              {activeSection === 'privacy' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy & Visibility</h2>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Profile Visibility</label>
                        <div className="space-y-3">
                          {[
                            { value: 'public', label: 'Public', description: 'Employers can see your profile' },
                            { value: 'private', label: 'Private', description: 'Only you can see your profile' }
                          ].map((option) => (
                            <label key={option.value} className="flex items-start">
                              <input
                                type="radio"
                                name="profileVisibility"
                                value={option.value}
                                checked={accountData.privacy?.profileVisibility === option.value}
                                onChange={(e) => handleProfileVisibilityChange(e.target.value)}
                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-700">{option.label}</div>
                                <div className="text-sm text-gray-500">{option.description}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Information Visibility</h3>
                        <div className="space-y-4">
                          {[
                            { key: 'display_personal_information', label: 'Display personal information', description: 'Show your personal details on your profile' },
                            { key: 'display_portfolio_links', label: 'Display portfolio links', description: 'Show your portfolio and social links' },
                            { key: 'show_professional_summary', label: 'Show professional summary', description: 'Display your professional summary' },
                            { key: 'show_skills_and_expertise', label: 'Show skills and expertise', description: 'Display your skills and areas of expertise' },
                            { key: 'show_education', label: 'Show education', description: 'Display your educational background' },
                            { key: 'show_experience', label: 'Show experience', description: 'Display your work experience' },
                            { key: 'display_accommodation_needs', label: 'Display accommodation needs', description: 'Show your accessibility and accommodation requirements' },
                            { key: 'display_employment_preferences', label: 'Display employment preferences', description: 'Show your job preferences and requirements' },
                            { key: 'allowMessages', label: 'Allow messages', description: 'Let others send you messages' }
                          ].map((setting) => (
                            <div key={setting.key} className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium text-gray-700">{setting.label}</div>
                                <div className="text-sm text-gray-500">{setting.description}</div>
                              </div>
                              <button
                                onClick={() => handleToggleVisibility(setting.key)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${accountData.privacy?.[setting.key] ? 'bg-blue-600' : 'bg-gray-200'
                                  }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${accountData.privacy?.[setting.key] ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
                      <button
                        onClick={() => handleSave('privacy')}
                        disabled={isSaving}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>

                    <div className="space-y-8">
                      {/* Email Notifications */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                        <div className="space-y-4">
                          {[
                            { key: 'jobMatches', label: 'Job matches', description: 'Get notified when new jobs match your profile' },
                            { key: 'messages', label: 'Messages', description: 'Get notified when you receive new messages' },
                            { key: 'applications', label: 'Application updates', description: 'Get notified about your job applications' }
                          ].map((setting) => (
                            <div key={setting.key} className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium text-gray-700">{setting.label}</div>
                                <div className="text-sm text-gray-500">{setting.description}</div>
                              </div>
                              <button
                                onClick={() => handleNotificationToggle('email', setting.key)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${accountData.notifications?.email?.[setting.key] ? 'bg-blue-600' : 'bg-gray-200'
                                  }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${accountData.notifications?.email?.[setting.key] ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Push Notifications */}
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Push Notifications</h3>
                        <div className="space-y-4">
                          {[
                            { key: 'jobMatches', label: 'Job matches', description: 'Get push notifications for new job matches' },
                            { key: 'messages', label: 'Messages', description: 'Get push notifications for new messages' },
                            { key: 'applications', label: 'Application updates', description: 'Get push notifications for application updates' }
                          ].map((setting) => (
                            <div key={setting.key} className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium text-gray-700">{setting.label}</div>
                                <div className="text-sm text-gray-500">{setting.description}</div>
                              </div>
                              <button
                                onClick={() => handleNotificationToggle('push', setting.key)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${accountData.notifications?.push?.[setting.key] ? 'bg-blue-600' : 'bg-gray-200'
                                  }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${accountData.notifications?.push?.[setting.key] ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* SMS Notifications */}
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">SMS Notifications</h3>
                        <div className="space-y-4">
                          {[
                            { key: 'urgentMessages', label: 'Urgent messages', description: 'Get SMS for urgent messages' },
                            { key: 'securityAlerts', label: 'Security alerts', description: 'Get SMS for security-related notifications' }
                          ].map((setting) => (
                            <div key={setting.key} className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium text-gray-700">{setting.label}</div>
                                <div className="text-sm text-gray-500">{setting.description}</div>
                              </div>
                              <button
                                onClick={() => handleNotificationToggle('sms', setting.key)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${accountData.notifications?.sms?.[setting.key] ? 'bg-blue-600' : 'bg-gray-200'
                                  }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${accountData.notifications?.sms?.[setting.key] ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
                      <button
                        onClick={() => handleSave('notifications')}
                        disabled={isSaving}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Section */}
              {activeSection === 'security' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>

                    <div className="space-y-6">
                      {/* Two-Factor Authentication */}
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${accountData.security?.twoFactorAuth
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                            }`}>
                            {accountData.security?.twoFactorAuth ? 'Enabled' : 'Disabled'}
                          </span>
                          <button
                            onClick={() => handleInputChange('security', 'twoFactorAuth', !accountData.security?.twoFactorAuth)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            {accountData.security?.twoFactorAuth ? 'Disable' : 'Enable'}
                          </button>
                        </div>
                      </div>

                      {/* Login Alerts */}
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Login Alerts</h3>
                          <p className="text-sm text-gray-500">Get notified when someone logs into your account</p>
                        </div>
                        <button
                          onClick={() => handleInputChange('security', 'loginAlerts', !accountData.security?.loginAlerts)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${accountData.security?.loginAlerts ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${accountData.security?.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                              }`}
                          />
                        </button>
                      </div>

                      {/* Session Timeout */}
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Session Timeout</h3>
                        <p className="text-sm text-gray-500 mb-4">Automatically log out after a period of inactivity</p>
                        <div className="flex items-center space-x-4">
                          <select
                            value={accountData.security?.sessionTimeout || 30}
                            onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value={15}>15 minutes</option>
                            <option value={30}>30 minutes</option>
                            <option value={60}>1 hour</option>
                            <option value={120}>2 hours</option>
                            <option value={0}>Never</option>
                          </select>
                        </div>
                      </div>

                      {/* Trusted Devices */}
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Trusted Devices</h3>
                        <div className="space-y-3">
                          {(accountData.security?.trustedDevices || []).map((device) => (
                            <div key={device.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <div className="font-medium text-gray-900">{device.name}</div>
                                <div className="text-sm text-gray-500">
                                  Last used: {new Date(device.lastUsed).toLocaleDateString()} • {device.location}
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveDevice(device.id)}
                                disabled={isSaving}
                                className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              >
                                {isSaving ? 'Removing...' : 'Remove'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
                      <button
                        onClick={() => handleSave('security')}
                        disabled={isSaving}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Management Section */}
              {activeSection === 'danger' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Management</h2>

                    <div className="space-y-6">
                      {/* Account Status */}
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <h3 className="text-lg font-medium text-green-900">Account Active</h3>
                            <p className="text-sm text-green-700">
                              Your account is active and verified. Last login: {new Date(accountData.accountStatus.lastLogin).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Deactivate Account */}
                      <div className="p-4 border border-yellow-200 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Deactivate Account</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Temporarily deactivate your account. You can reactivate it anytime by logging in.
                        </p>
                        <button
                          onClick={() => setShowDeactivateModal(true)}
                          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                          Deactivate Account
                        </button>
                      </div>

                      {/* Delete Account */}
                      <div className="p-4 border border-red-200 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Account</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                        <button
                          onClick={() => setShowDeleteModal(true)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Delete Account</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>

              <form onSubmit={handleDeleteAccount} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={accountData.password}
                    onChange={(e) => handleInputChange('', 'password', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? 'Deleting...' : 'Delete Account'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Account Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Deactivate Account</h3>
                  <p className="text-sm text-gray-500">You can reactivate anytime</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to deactivate your account? You can reactivate it anytime by logging in.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={async () => {
                    try {
                      setIsSaving(true);

                      // TODO: Replace with actual API call
                      await new Promise(resolve => setTimeout(resolve, 1000));

                      setShowDeactivateModal(false);
                      
                      // Show SweetAlert success message
                      Swal.fire({
                        icon: 'success',
                        title: 'Account Deactivated',
                        text: 'Account deactivated successfully. You can reactivate by logging in.',
                        timer: 5000,
                        showConfirmButton: true
                      });

                      // Update account status
                      setAccountData(prev => ({
                        ...prev,
                        accountStatus: {
                          ...prev.accountStatus,
                          active: false
                        }
                      }));

                    } catch (err) {
                      Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Failed to deactivate account',
                        timer: 3000,
                        showConfirmButton: false,
                        toast: true,
                        position: 'top-end'
                      });
                      console.error('Error deactivating account:', err);
                    } finally {
                      setIsSaving(false);
                    }
                  }}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Deactivating...' : 'Deactivate Account'}
                </button>
                <button
                  onClick={() => setShowDeactivateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobseekerAccountSettings;
