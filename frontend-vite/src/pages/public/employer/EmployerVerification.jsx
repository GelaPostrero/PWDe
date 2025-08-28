import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../../components/ui/Logo.jsx';


const EmployerVerification = () => {
  const [formData, setFormData] = useState({
    companyWebsite: '',
    linkedinProfile: '',
    otherSocialMedia: '',
    contactName: 'John Doe',
    jobTitle: 'HR Manager',
    phoneNumber: '+1 (555) 123-4567',
    agreeEqualOpportunity: false,
  });

  const [uploadedFiles, setUploadedFiles] = useState({
    businessRegistration: null,
    taxDocuments: null,
    governmentId: null,
  });

  const [uploadErrors, setUploadErrors] = useState({});
  const [isUploading, setIsUploading] = useState({});

  const navigate = useNavigate();

  // File validation function
  const validateFile = (file, fieldName) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];

    if (!file) {
      return 'Please select a file';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }

    if (!allowedTypes.includes(file.type)) {
      return 'File must be PDF, DOC, DOCX, JPG, JPEG, or PNG';
    }

    return null;
  };

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file type icon
  const getFileIcon = (fileType) => {
    if (fileType?.includes('pdf')) {
      return (
        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 18h12V6l-4-4H4v16zm-2-2V4a2 2 0 012-2h8l4 4v10a2 2 0 01-2 2H4a2 2 0 01-2-2z"/>
          <path d="M9 13h2v-2H9v2zm0-4h2V7H9v2z"/>
        </svg>
      );
    } else if (fileType?.includes('image')) {
      return (
        <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
        </svg>
      );
    } else {
      return (
        <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
        </svg>
      );
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = async (field, file) => {
    if (!file) return;

    // Clear previous errors
    setUploadErrors(prev => ({ ...prev, [field]: null }));

    // Validate file
    const error = validateFile(file, field);
    if (error) {
      setUploadErrors(prev => ({ ...prev, [field]: error }));
      return;
    }

    // Set uploading state
    setIsUploading(prev => ({ ...prev, [field]: true }));

    // Simulate upload delay (remove this in real implementation)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create file object with metadata
    const fileData = {
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toISOString(),
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    };

    // Update uploaded files
    setUploadedFiles(prev => ({
      ...prev,
      [field]: fileData
    }));

    // Clear uploading state
    setIsUploading(prev => ({ ...prev, [field]: false }));

    console.log(`File uploaded for ${field}:`, fileData);
  };

  const removeFile = (field) => {
    // Revoke object URL if it exists
    if (uploadedFiles[field]?.preview) {
      URL.revokeObjectURL(uploadedFiles[field].preview);
    }

    setUploadedFiles(prev => ({
      ...prev,
      [field]: null
    }));

    setUploadErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if required files are uploaded
    const requiredFiles = ['businessRegistration', 'taxDocuments', 'governmentId'];
    const missingFiles = requiredFiles.filter(field => !uploadedFiles[field]);
    
    if (missingFiles.length > 0) {
      alert(`Please upload the following required documents: ${missingFiles.join(', ')}`);
      return;
    }

    if (!formData.agreeEqualOpportunity) {
      alert('Please agree to the Equal Opportunity Employment commitment.');
      return;
    }

    console.log('Employer verification submitted:', {
      formData,
      uploadedFiles: Object.entries(uploadedFiles).reduce((acc, [key, value]) => {
        if (value) {
          acc[key] = {
            name: value.name,
            size: value.size,
            type: value.type,
            uploadDate: value.uploadDate
          };
        }
        return acc;
      }, {})
    });

    navigate('/employer/activation');
  };

  const handleSkip = () => {
    navigate('/onboarding/employer/activation');
  };

  // File upload component
  const FileUploadArea = ({ field, label, isRequired = true }) => {
    const isUploaded = !!uploadedFiles[field];
    const isCurrentlyUploading = isUploading[field];
    const error = uploadErrors[field];

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
        
        {!isUploaded ? (
          <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400'
          }`}>
            {isCurrentlyUploading ? (
              <div className="space-y-2">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-sm text-blue-600">Uploading...</p>
              </div>
            ) : (
              <>
                <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-gray-600 mb-2">{label}</p>
                <button
                  type="button"
                  onClick={() => document.getElementById(field).click()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  Choose File
                </button>
              </>
            )}
            <input
              id={field}
              type="file"
              className="hidden"
              onChange={(e) => handleFileUpload(field, e.target.files[0])}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
          </div>
        ) : (
          <div className="border border-green-300 bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getFileIcon(uploadedFiles[field].type)}
                <div>
                  <p className="text-sm font-medium text-gray-900">{uploadedFiles[field].name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(uploadedFiles[field].size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(field)}
                className="text-red-600 hover:text-red-800 transition-colors"
                title="Remove file"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            {error}
          </p>
        )}

        <p className="text-xs text-gray-500">
          Supported formats: PDF, DOC, DOCX, JPG, PNG. Max size: 5MB
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo showText={true} />
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors" aria-label="Help">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors" aria-label="Settings">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10">
            <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900">Employer Verification</h1>
            <p className="text-center text-gray-600 mt-2">Please upload your documents to verify your account</p>

            {/* Progress Stepper */}
            <div className="mt-8 flex items-center justify-center">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate('/signup/employer')}
                  className="flex items-center hover:opacity-80 transition-opacity"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="ml-2 text-green-600 font-medium">Registration</span>
                </button>
                <div className="w-16 h-0.5 bg-green-500"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">2</div>
                  <span className="ml-2 text-blue-600 font-medium">Verification</span>
                </div>
                <div className="w-16 h-0.5 bg-gray-300"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 font-semibold">3</div>
                  <span className="ml-2 text-gray-500 font-medium">Activation</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-8">
              {/* Company Verification Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Company Verification</h2>
                </div>
                <p className="text-gray-600 mb-6">Upload required documents to verify your business</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Business Registration Documents */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Business Registration Documents</h3>
                    <div className="space-y-4">
                      <FileUploadArea 
                        field="businessRegistration"
                        label="Business registration certificate"
                      />
                      <FileUploadArea 
                        field="taxDocuments"
                        label="Tax identification documents"
                      />
                    </div>
                  </div>

                  {/* Right Column - Company Website & Social Media */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Company Website & Social Media</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Website</label>
                        <input
                          name="companyWebsite"
                          type="url"
                          value={formData.companyWebsite}
                          onChange={handleChange}
                          placeholder="https://yourcompany.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                        <input
                          name="linkedinProfile"
                          type="url"
                          value={formData.linkedinProfile}
                          onChange={handleChange}
                          placeholder="https://linkedin.com/company/yourcompany"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Other Social Media (Optional)</label>
                        <input
                          name="otherSocialMedia"
                          type="url"
                          value={formData.otherSocialMedia}
                          onChange={handleChange}
                          placeholder="https://twitter.com/yourcompany"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Person Verification Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Contact Person Verification</h2>
                </div>
                <p className="text-gray-600 mb-6">Verify the authorized representative for hiring</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Contact Details */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Contact Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          name="contactName"
                          type="text"
                          value={formData.contactName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                        <input
                          name="jobTitle"
                          type="text"
                          value={formData.jobTitle}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          name="phoneNumber"
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Identity Verification */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Identity Verification</h3>
                    <FileUploadArea 
                      field="governmentId"
                      label="Government-issued ID"
                    />
                  </div>
                </div>
              </div>

              {/* Equal Opportunity Employment Commitment Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l1-6M6 7l-1 6m6-2l3 1m-3-1l-3 9a5.002 5.002 0 006.001 0M18 7l-3 9m3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Equal Opportunity Employment Commitment</h2>
                </div>
                <p className="text-gray-600 mb-6">Commit to fair and inclusive hiring practices</p>

                <div className="bg-white rounded-lg p-6 mb-6">
                  <h3 className="font-medium text-gray-900 mb-4">Our Commitment to Equality</h3>
                  <p className="text-gray-700 mb-4">
                    We are committed to providing equal employment opportunities to all individuals regardless of race, color, religion, gender, sexual orientation, age, national origin, disability, or veteran status.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                        </svg>
                      </div>
                      <span className="text-gray-700">Fair and unbiased job postings</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                        </svg>
                      </div>
                      <span className="text-gray-700">Inclusive interview processes</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                        </svg>
                      </div>
                      <span className="text-gray-700">Equal consideration for all applicants</span>
                    </div>
                  </div>
                </div>

                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeEqualOpportunity"
                    checked={formData.agreeEqualOpportunity}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                    required
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    I agree to uphold equal opportunity employment practices and comply with all applicable laws and regulations. <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>

              {/* Why We Verify Employers Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Why We Verify Employers</h2>
                </div>
                <p className="text-gray-600 mb-6">Our verification process ensures a safe and trustworthy platform for both employers and job seekers</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Protect Job Seekers</h3>
                    <p className="text-sm text-gray-600">Verify legitimate employers to prevent fraudulent job postings</p>
                  </div>

                  <div className="bg-white rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Build Trust</h3>
                    <p className="text-sm text-gray-600">Verified badge increases candidate confidence and application rates</p>
                  </div>

                  <div className="bg-white rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l1-6M6 7l-1 6m6-2l3 1m-3-1l-3 9a5.002 5.002 0 006.001 0M18 7l-3 9m3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Ensure Compliance</h3>
                    <p className="text-sm text-gray-600">Maintain legal compliance and fair hiring practices</p>
                  </div>
                </div>
              </div>

              {/* Upload Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-blue-900">Upload Summary</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries({
                    businessRegistration: 'Business Registration',
                    taxDocuments: 'Tax Documents',
                    governmentId: 'Government ID'
                  }).map(([field, label]) => (
                    <div key={field} className="flex items-center space-x-2">
                      {uploadedFiles[field] ? (
                        <>
                          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          <span className="text-green-700 font-medium">{label} ✓</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                          </svg>
                          <span className="text-red-700 font-medium">{label} (Required)</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Skip for Now
                </button>
                <button
                  type="submit"
                  disabled={Object.values(isUploading).some(Boolean)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  {Object.values(isUploading).some(Boolean) ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Submit Documents
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

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

export default EmployerVerification;