import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import JobseekerHeader from '../../components/ui/JobseekerHeader.jsx';
import Footer from '../../components/ui/Footer.jsx';
import Chatbot from '../../components/ui/Chatbot.jsx';
import ProfileModal from '../../components/ui/ProfileModal.jsx';
import WorkExperienceModal from '../../components/modals/WorkExperienceModal.jsx';
import api from '../../utils/api.js';

const SubmitApplication = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';
  const [salaryExpectation, setSalaryExpectation] = useState('');
  const [salaryError, setSalaryError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({
    resume: null,
    coverLetter: null,
    portfolio: [],
    video: null
  });
  
  // Edit mode states
  const [existingApplication, setExistingApplication] = useState(null);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);


  const [coverLetter, setCoverLetter] = useState('');
  const [jobData, setJobData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [workExperience, setWorkExperience] = useState([]);
  const [selectedExperiences, setSelectedExperiences] = useState([]);
  const [portfolioLinks, setPortfolioLinks] = useState({
    portfolio: '',
    github: '',
    linkedin: '',
    other: ''
  });
  
  // Modal states
  const [activeModal, setActiveModal] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Fetch job data from backend
  const fetchJobData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching job data for ID:', jobId);
      const response = await api.get(`/api/jobs/job/${jobId}`);
      console.log('Job data response:', response.data);
      
      if (response.data.success && response.data.job) {
        const job = response.data.job;
        
         // Transform backend data to match frontend format
         const transformedJob = {
           id: job.job_id,
           title: job.jobtitle,
           company: job.employer?.company_name || 'Unknown Company',
           companyLogo: job.employer?.profile_picture 
             ? `http://localhost:4000/uploads/Employer/${job.employer.user_id}/${job.employer.profile_picture}`
             : "https://via.placeholder.com/60x60/3B82F6/FFFFFF?text=LOGO",
           location: `${job.location_city}, ${job.location_province}`,
           status: job.job_status || 'Active',
           postedDate: new Date(job.created_at).toLocaleDateString(),
           category: job.jobCategory || 'General',
           employmentType: job.employment_type || 'Full-time',
           workArrangement: job.work_arrangement || 'On-site',
           experienceLevel: job.experience_level || 'Entry Level',
    salaryRange: {
             min: job.salary_min || 0,
             max: job.salary_max || 0,
             currency: "PHP",
             period: job.salary_type || "monthly"
           },
          applications: job._count?.applications || 0,
          deadline: job.application_deadline ? new Date(job.application_deadline).toLocaleDateString() : 'No deadline',
          description: job.description || 'No description available.',
          companyDescription: job.employer?.company_description || 'No company description available.',
          companyRating: job.employer?.rating || 0,
          isAccessibilityCertified: job.employer?.accessibilityFeatures?.length > 0 || false
        };
        
         setJobData(transformedJob);
      } else {
        setError('Job not found');
      }
    } catch (error) {
      console.error('Error fetching job data:', error);
      setError('Failed to load job details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch existing application data for edit mode
  const fetchExistingApplication = async () => {
    if (!isEditMode) return;
    
    try {
      setIsLoadingExisting(true);
      console.log('Fetching existing application for job:', jobId);
      
      const response = await api.get(`/api/applications/check/${jobId}`);
      console.log('Existing application response:', response.data);
      
      if (response.data.success && response.data.application) {
        const app = response.data.application;
        setExistingApplication(app);
        
        // Pre-fill form data
        if (app.custom_message) {
          setCoverLetter(app.custom_message);
        }
        
        if (app.proposed_salary) {
          setSalaryExpectation(app.proposed_salary.toString());
        }
        
        if (app.work_experience) {
          const workExp = Array.isArray(app.work_experience) ? app.work_experience : JSON.parse(app.work_experience);
          console.log('Work experience from database:', workExp);
          
          // Extract IDs if workExp contains objects, otherwise use as is
          const experienceIds = workExp.map(exp => {
            if (typeof exp === 'object' && exp.id) {
              return exp.id;
            }
            return exp;
          });
          
          console.log('Selected experience IDs:', experienceIds);
          setSelectedExperiences(experienceIds);
        }
        
        if (app.portfolio_links) {
          const portfolio = typeof app.portfolio_links === 'string' ? JSON.parse(app.portfolio_links) : app.portfolio_links;
          setPortfolioLinks({
            portfolio: portfolio.portfolio || '',
            github: portfolio.github || '',
            linkedin: portfolio.linkedin || '',
            other: portfolio.other || ''
          });
        }
        
        // Handle resume
        if (app.resume) {
          setUploadedFiles(prev => ({
            ...prev,
            resume: {
              name: app.resume.title,
              type: 'application/pdf',
              size: 0 // We don't have the actual file size
            }
          }));
        }
        
        // Handle video
        if (app.video_file_path) {
          setUploadedFiles(prev => ({
            ...prev,
            video: {
              name: app.video_file_path,
              type: 'video/mp4',
              size: 0 // We don't have the actual file size
            }
          }));
        }
        
        console.log('Application data pre-filled successfully');
      }
    } catch (error) {
      console.error('Error fetching existing application:', error);
      // Don't show error to user, just continue with empty form
    } finally {
      setIsLoadingExisting(false);
    }
  };

  // Fetch user work experience and portfolio data
  const fetchUserData = async () => {
    try {
      console.log('Fetching user work experience and portfolio data');
      const response = await api.get('/retrieve/profile');
      
      if (response.data.success && response.data.data) {
        const userData = response.data.data;
        console.log('User data:', userData);
        
        // Set work experience data
        setWorkExperience(userData.experiences || []);
        
         // Set portfolio links data
         setPortfolioLinks({
           portfolio: userData.portfolio_url || '',
           github: userData.github_url || '',
           linkedin: userData.linkedin_url || '',
           other: userData.otherPlatform || ''
         });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Keep empty data if fetch fails
      setWorkExperience([]);
      setPortfolioLinks({});
    }
  };

  // Load job data and user data on component mount
  useEffect(() => {
    if (jobId) {
      fetchJobData();
      fetchUserData();
      fetchExistingApplication();
    }
  }, [jobId, isEditMode]);

  // Modal functions
  const openModal = (modalType, item = null) => {
    setActiveModal(modalType);
    setEditingItem(item);
    
    if (modalType === 'workExperience') {
      if (item) {
        // Editing existing work experience
        setFormData({
          title: item.title || '',
          company: item.company || '',
          startMonth: item.startDate ? item.startDate.split('-')[1] : '',
          startYear: item.startDate ? item.startDate.split('-')[0] : '',
          endMonth: item.endDate ? item.endDate.split('-')[1] : '',
          endYear: item.endDate ? item.endDate.split('-')[0] : '',
          employmentType: item.employmentType || 'Full-time',
          location: item.location || '',
          country: item.country || 'Philippines',
          description: item.description || ''
        });
      } else {
        // Adding new work experience
        setFormData({
          title: '',
          company: '',
          startMonth: '',
          startYear: '',
          endMonth: '',
          endYear: '',
          employmentType: 'Full-time',
          location: '',
          country: 'Philippines',
          description: ''
        });
      }
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

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      if (activeModal === 'workExperience') {
        const workData = {
          ...formData,
          startDate: formData.startYear && formData.startMonth ? `${formData.startYear}-${formData.startMonth.padStart(2, '0')}` : '',
          endDate: formData.endYear && formData.endMonth ? `${formData.endYear}-${formData.endMonth.padStart(2, '0')}` : ''
        };

         if (editingItem) {
           // Update existing work experience
           const updatedExperience = workExperience.map(item => 
             item.id === editingItem.id ? { ...workData, id: editingItem.id } : item
           );
           setWorkExperience(updatedExperience);
           
           // Save to backend
           await api.put('/retrieve/update/basic-information', {
             experiences: updatedExperience
           });
         } else {
           // Add new work experience
           const newExperience = [...workExperience, { ...workData, id: Date.now() }];
           setWorkExperience(newExperience);
           
           // Save to backend
           await api.put('/retrieve/update/basic-information', {
             experiences: newExperience
           });
         }
      }
      
      closeModal();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const updatedExperience = workExperience.filter(item => item.id !== itemId);
      setWorkExperience(updatedExperience);
      
      // Remove from selected experiences if it was selected
      setSelectedExperiences(prev => prev.filter(id => id !== itemId));
      
      // Save to backend
      await api.put('/retrieve/update/basic-information', {
        experiences: updatedExperience
      });
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete experience. Please try again.');
    }
  };

  const handleExperienceSelection = (experienceId, isSelected) => {
    if (isSelected) {
      setSelectedExperiences(prev => [...prev, experienceId]);
    } else {
      setSelectedExperiences(prev => prev.filter(id => id !== experienceId));
    }
  };

  const handlePortfolioLinksChange = async (field, value) => {
    const updatedLinks = {
      ...portfolioLinks,
      [field]: value
    };
    setPortfolioLinks(updatedLinks);
    
    // Don't save to backend immediately - let user save when they submit application
    // This prevents errors when clearing fields
    console.log('Portfolio links updated locally:', updatedLinks);
  };

  const formatSalary = () => {
    if (!jobData || !jobData.salaryRange) return 'Salary not specified';
    if (jobData.salaryRange.min === 0 && jobData.salaryRange.max === 0) return 'Salary not specified';
    
    const period = jobData.salaryRange.period;
    const periodText = period === 'monthly' ? 'Monthly' : 
                      period === 'weekly' ? 'Weekly' : 
                      period === 'biweekly' ? 'Bi-weekly' : 
                      period === 'yearly' ? 'Yearly' : 
                      period;
    
    return `₱${jobData.salaryRange.min.toLocaleString()} - ₱${jobData.salaryRange.max.toLocaleString()} PHP Per ${periodText}`;
  };

  const validateSalaryExpectation = (value) => {
    if (!value || value === '') {
      setSalaryError('');
      return true;
    }

    const salary = parseFloat(value);
    if (isNaN(salary)) {
      setSalaryError('Please enter a valid number');
      return false;
    }

    if (!jobData?.salaryRange) {
      setSalaryError('');
      return true;
    }

    const maxSalary = jobData.salaryRange.max;
    if (salary > maxSalary) {
      setSalaryError(`Your salary expectation (₱${salary.toLocaleString()}) exceeds the employer's maximum budget (₱${maxSalary.toLocaleString()})`);
      return false;
    }

    setSalaryError('');
    return true;
  };

  const handleSalaryChange = (e) => {
    const value = e.target.value;
    setSalaryExpectation(value);
    validateSalaryExpectation(value);
  };

  const handleFileUpload = (type, file) => {
    console.log('File upload triggered:', { type, file: { name: file.name, size: file.size, type: file.type } });
    
    if (type === 'portfolio') {
      setUploadedFiles(prev => ({
        ...prev,
        portfolio: [...prev.portfolio, file]
      }));
    } else {
      setUploadedFiles(prev => ({
        ...prev,
        [type]: file
      }));
    }
    
    console.log('Updated uploadedFiles:', uploadedFiles);
  };

  const handleFileRemove = (type, index = null) => {
    if (type === 'portfolio' && index !== null) {
      setUploadedFiles(prev => ({
        ...prev,
        portfolio: prev.portfolio.filter((_, i) => i !== index)
      }));
    } else {
      setUploadedFiles(prev => ({
        ...prev,
        [type]: null
      }));
    }
  };


  const validateApplication = () => {
    const errors = {};

    // Check required fields
    if (!uploadedFiles.resume) {
      errors.resume = 'Resume is required';
    }

    if (!uploadedFiles.coverLetter && !coverLetter.trim()) {
      errors.coverLetter = 'Cover letter is required (upload file or write text)';
    }

    if (!salaryExpectation || salaryExpectation.trim() === '') {
      errors.salaryExpectation = 'Salary expectation is required';
    } else if (!validateSalaryExpectation(salaryExpectation)) {
      errors.salaryExpectation = salaryError;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const uploadResume = async (resumeFile) => {
    console.log('Uploading resume file:', {
      name: resumeFile.name,
      size: resumeFile.size,
      type: resumeFile.type
    });
    
    const formData = new FormData();
    formData.append('resumeFile', resumeFile); // Backend expects 'resumeFile'
    formData.append('title', resumeFile.name);
    formData.append('summary', ''); // Empty summary
    formData.append('skills', JSON.stringify([])); // Empty skills array
    formData.append('workExperience', JSON.stringify([])); // Empty work experience
    formData.append('education', JSON.stringify([])); // Empty education
    formData.append('certifications', JSON.stringify([])); // Empty certifications
    formData.append('achievements', JSON.stringify([])); // Empty achievements
    
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    
    const response = await api.post('/api/resumes/upload', formData);
    
    console.log('Resume upload response:', response.data);
    return response.data.data.resume_id; // Backend returns data in 'data' field
  };

  const uploadVideo = async (videoFile) => {
    console.log('Uploading video file:', {
      name: videoFile.name,
      size: videoFile.size,
      type: videoFile.type
    });
    
    const formData = new FormData();
    formData.append('videoFile', videoFile); // Backend expects 'videoFile'
    
    console.log('Video FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    
    const response = await api.post('/api/resumes/upload-video', formData);
    
    if (response.data.success) {
      return response.data.data.file_path;
    } else {
      throw new Error(response.data.message || 'Failed to upload video');
    }
  };

  const handleSubmitApplication = async () => {
    // Validate all required fields
    if (!validateApplication()) {
      alert('Please complete all required fields before submitting your application.');
      return;
    }

    try {
      console.log('=== SUBMIT APPLICATION DEBUG ===');
      console.log('isEditMode:', isEditMode);
      console.log('existingApplication:', existingApplication);
      console.log('uploadedFiles:', uploadedFiles);
      
      // Handle resume upload
      let resumeId = null;
      
      console.log('=== RESUME HANDLING DEBUG ===');
      console.log('isEditMode:', isEditMode);
      console.log('existingApplication:', existingApplication);
      console.log('existingApplication?.resume:', existingApplication?.resume);
      console.log('existingApplication?.resume?.resume_id:', existingApplication?.resume?.resume_id);
      console.log('uploadedFiles.resume:', uploadedFiles.resume);
      
      // In edit mode, if there's an existing resume, use it instead of uploading
      
      if (isEditMode && existingApplication?.resume?.resume_id) {
        resumeId = existingApplication.resume.resume_id;
        console.log('Edit mode: Using existing resume ID:', resumeId);
      } else if (uploadedFiles.resume) {
        // Only upload if it's a new file (not in edit mode or no existing resume)
        console.log('New resume upload:', uploadedFiles.resume.name);
        try {
          resumeId = await uploadResume(uploadedFiles.resume);
          console.log('Resume uploaded with ID:', resumeId);
        } catch (uploadError) {
          console.error('Resume upload failed:', uploadError);
          console.log('Continuing with application submission without resume ID');
        }
      }

      // Handle video upload
      let videoFilePath = null;
      
      // In edit mode, if there's an existing video, use it instead of uploading
      if (isEditMode && existingApplication?.video_file_path) {
        videoFilePath = existingApplication.video_file_path;
        console.log('Edit mode: Using existing video path:', videoFilePath);
      } else if (uploadedFiles.video) {
        // Only upload if it's a new file (not in edit mode or no existing video)
        console.log('New video upload:', uploadedFiles.video.name);
        try {
          videoFilePath = await uploadVideo(uploadedFiles.video);
          console.log('Video uploaded with path:', videoFilePath);
        } catch (videoError) {
          console.error('Video upload failed:', videoError);
          console.log('Continuing with application submission without video file');
        }
      }

      // Save portfolio links to backend before submitting application
      try {
        await api.put('/retrieve/update/basic-information', {
          portfolio_url: portfolioLinks.portfolio,
          github_url: portfolioLinks.github,
          linkedin_url: portfolioLinks.linkedin,
          otherPlatform: portfolioLinks.other
        });
      } catch (profileError) {
        console.error('Profile update failed:', profileError);
        // Continue with application submission even if profile update fails
      }

    // Get selected work experiences
    const selectedWorkExperiences = workExperience.filter(exp => 
      selectedExperiences.includes(exp.id)
    );

    console.log('Selected work experiences being sent:', selectedWorkExperiences);

    const applicationData = {
      jobId,
      customMessage: coverLetter.trim(),
      proposedSalary: parseFloat(salaryExpectation),
      resumeId: resumeId || null, // Send null if no resume was uploaded
      workExperience: selectedWorkExperiences,
      portfolioLinks: portfolioLinks,
      videoFilePath: videoFilePath || null // Send null if no video was uploaded
    };
      
    console.log('Submitting application:', applicationData);
      
      // Submit application to backend
      const endpoint = isEditMode ? '/api/applications/update' : '/api/applications/apply';
      const response = await api.post(endpoint, applicationData);
      
      if (response.data.success) {
        alert(isEditMode ? 'Application updated successfully!' : 'Application submitted successfully!');
        navigate('/jobseeker/applications');
      } else {
        alert(`Failed to ${isEditMode ? 'update' : 'submit'} application. Please try again.`);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };


  const FileUploadArea = ({ type, accept, multiple = false, title, description }) => {
    const handleFileChange = (e) => {
      const files = Array.from(e.target.files);
      if (multiple) {
        files.forEach(file => handleFileUpload(type, file));
      } else if (files[0]) {
        handleFileUpload(type, files[0]);
      }
    };

    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
          id={`file-upload-${type}`}
        />
        <label htmlFor={`file-upload-${type}`} className="cursor-pointer">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">{title}</p>
          <p className="text-gray-500 text-sm">{description}</p>
        </label>
      </div>
    );
  };

  const FilePreview = ({ file, onRemove, type }) => {
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <JobseekerHeader disabled={false} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading job details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <JobseekerHeader disabled={false} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Job</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchJobData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // No job data
  if (!jobData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <JobseekerHeader disabled={false} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-500 text-6xl mb-4">📄</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
            <p className="text-gray-600 mb-4">The job you're looking for doesn't exist or has been removed.</p>
            <Link
              to="/jobseeker/dashboard"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <JobseekerHeader disabled={false} />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16">
          <nav className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Link to="/jobseeker/dashboard" className="hover:text-blue-600">Dashboard</Link>
              <span>/</span>
              <Link to="/find-job" className="hover:text-blue-600">Jobs</Link>
              <span>/</span>
              <Link to={`/jobseeker/job/${jobId}`} className="hover:text-blue-600">View Job Details</Link>
              <span>/</span>
              <span className="text-gray-900">Submit Application</span>
            </div>
          </nav>
        </div>
      </div>

      <main className="flex-1 py-6 sm:py-8">
        <div className="mx-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Job Title & Company */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {jobData?.title || 'Loading...'}
                    </h1>
                    <div className="flex items-center space-x-4 mb-3">
                      <p className="text-lg text-blue-600 hover:text-blue-700 font-medium">
                        {jobData?.company || 'Loading...'}
                      </p>
                      <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {jobData?.location || 'Loading...'}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {jobData?.status || 'Active'}
                      </span>
                      <span className="text-sm text-gray-500">
                        Posted {jobData?.postedDate || 'Loading...'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                   {jobData?.description || 'No description available.'}
                </p>
                <div className="flex items-center space-x-4">
                   <Link 
                     to={`/jobseeker/job/${jobId}`}
                     className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                   >
                    View Job Posting
                   </Link>
                </div>
              </div>

              {/* Resume Upload */}
              <div className="bg-white rounded-lg shadow p-6">
                 <div className="flex items-center space-x-2 mb-4">
                   <h2 className="text-xl font-bold text-gray-900">Resume</h2>
                   <span className="text-red-500 text-sm">*</span>
                 </div>
                
                {uploadedFiles.resume ? (
                  <FilePreview 
                    file={uploadedFiles.resume} 
                    onRemove={() => handleFileRemove('resume')}
                    type="resume"
                  />
                ) : (
                  <FileUploadArea
                    type="resume"
                    accept=".pdf,.doc,.docx"
                    title="Upload Resume"
                    description="PDF, DOC, or DOCX files only (Max 10MB)"
                  />
                )}
                
                <div className="mt-4 text-sm text-gray-500">
                  <p>Your resume should highlight your relevant experience and skills for this position.</p>
                </div>
                 {validationErrors.resume && (
                   <div className="mt-2 flex items-center space-x-2 text-red-600 text-sm">
                     <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                     </svg>
                     <span>{validationErrors.resume}</span>
                   </div>
                 )}
              </div>

              {/* Cover Letter */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-gray-900">Cover Letter</h2>
                     <span className="text-red-500 text-sm">*</span>
                   </div>
                   <div className="relative">
                     <input
                       type="file"
                       accept=".pdf,.doc,.docx"
                       onChange={(e) => {
                         if (e.target.files[0]) {
                           handleFileUpload('coverLetter', e.target.files[0]);
                         }
                       }}
                       className="hidden"
                       id="cover-letter-upload"
                     />
                     <label 
                       htmlFor="cover-letter-upload"
                       className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
                     >
                      Upload File
                     </label>
                  </div>
                </div>
                
                {uploadedFiles.coverLetter ? (
                  <FilePreview 
                    file={uploadedFiles.coverLetter} 
                    onRemove={() => handleFileRemove('coverLetter')}
                    type="coverLetter"
                  />
                ) : (
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="12"
                    placeholder="Write your cover letter here..."
                  />
                )}
                 {validationErrors.coverLetter && (
                   <div className="mt-2 flex items-center space-x-2 text-red-600 text-sm">
                     <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                     </svg>
                     <span>{validationErrors.coverLetter}</span>
                   </div>
                )}
              </div>

              {/* Salary Expectation */}
              <div className="bg-white rounded-lg shadow p-6">
                 <div className="flex items-center space-x-2 mb-4">
                   <h2 className="text-xl font-bold text-gray-900">Salary Expectation</h2>
                   <span className="text-red-500 text-sm">*</span>
                 </div>
                <div className="mb-4">
                  <p className="text-blue-600 font-medium">
                    Employer's budget: {formatSalary()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Your salary expectation should not exceed the employer's maximum budget.
                  </p>
                </div>
                 <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={salaryExpectation}
                       onChange={handleSalaryChange}
                       placeholder="Enter your expected rate"
                       className={`flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                         salaryError || validationErrors.salaryExpectation
                           ? 'border-red-500 focus:ring-red-500' 
                           : 'border-gray-300 focus:ring-blue-500'
                       }`}
                     />
                   </div>
                   {(salaryError || validationErrors.salaryExpectation) && (
                     <div className="flex items-center space-x-2 text-red-600 text-sm">
                       <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                       </svg>
                       <span>{validationErrors.salaryExpectation || salaryError}</span>
                     </div>
                   )}
                </div>
              </div>

              {/* Work Experience */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                   <div>
                     <h2 className="text-xl font-bold text-gray-900">Work Experience</h2>
                     <p className="text-sm text-gray-600 mt-1">Select which experiences to include in your application</p>
                   </div>
                   <button 
                     onClick={() => openModal('workExperience')}
                     className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                   >
                     + Add Experience
                   </button>
                 </div>
                 <div className="space-y-4">
                   {workExperience.length > 0 ? (
                     workExperience.map((experience) => {
                       console.log('SubmitApplication work experience data:', experience);
                       return (
                       <div key={experience.id} className={`border rounded-lg p-4 transition-colors ${
                         selectedExperiences.includes(experience.id) 
                           ? 'border-blue-500 bg-blue-50' 
                           : 'border-gray-200'
                       }`}>
                         <div className="flex items-start space-x-3">
                           <div className="flex-shrink-0 mt-1">
                  <input
                               type="checkbox"
                               id={`experience-${experience.id}`}
                               checked={selectedExperiences.includes(experience.id)}
                               onChange={(e) => handleExperienceSelection(experience.id, e.target.checked)}
                               className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </div>
                           <div className="flex-1">
                             <div className="flex items-start justify-between">
                               <div className="flex-1">
                                 <h4 className="font-medium text-gray-900">{experience.title || experience.job_title || ''}</h4>
                                 <p className="text-sm text-gray-600">{experience.company || experience.company_name || ''}</p>
                                 <p className="text-sm text-gray-500">
                                   {(experience.startDate || experience.start_date) ? new Date(experience.startDate || experience.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''} -{" "}
                                   {(experience.endDate || experience.end_date)
                                     ? new Date(experience.endDate || experience.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                     : "Present"}{" "}
                                   {(experience.employmentType || experience.employment_type) && `• ${experience.employmentType || experience.employment_type}`}
                                 </p>
                                 {((experience.location || experience.location_city) || (experience.country || experience.location_country)) && (
                                   <p className="text-sm text-gray-500">
                                     {(experience.location || experience.location_city) && (experience.country || experience.location_country) 
                                       ? `${experience.location || experience.location_city}, ${experience.country || experience.location_country}` 
                                       : (experience.location || experience.location_city) || (experience.country || experience.location_country)}
                                   </p>
                                 )}
                                 {(experience.description || experience.job_description) && (
                                   <p className="text-sm text-gray-700 mt-2">{experience.description || experience.job_description}</p>
                                 )}
                               </div>
                               <div className="flex items-center space-x-2">
                                 <button 
                                   onClick={() => openModal('workExperience', experience)}
                                   className="p-1 text-gray-400 hover:text-gray-600"
                                 >
                                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                   </svg>
                                 </button>
                                 <button 
                                   onClick={() => handleDelete(experience.id)}
                                   className="p-1 text-gray-400 hover:text-red-600"
                                 >
                                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                   </svg>
                                 </button>
                      </div>
                             </div>
                           </div>
                         </div>
                      </div>
                     );
                     })
                   ) : (
                     <div className="text-center py-8">
                       <div className="text-gray-400 text-4xl mb-2">💼</div>
                       <p className="text-gray-500 text-sm">No work experience found in your profile.</p>
                       <button 
                         onClick={() => openModal('workExperience')}
                         className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
                       >
                         Add your first work experience
                      </button>
                    </div>
                   )}
                 </div>
                </div>

               {/* Portfolio Links */}
               <div className="bg-white rounded-lg shadow p-6">
                 <h2 className="text-xl font-bold text-gray-900 mb-4">Portfolio Links</h2>
                 <div className="space-y-4">
                   {/* LinkedIn Profile and GitHub Profile - Side by Side */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                       <input
                         type="url"
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                         placeholder="https://linkedin.com/in/yourusername"
                         value={portfolioLinks.linkedin || ''}
                         onChange={(e) => handlePortfolioLinksChange('linkedin', e.target.value)}
                       />
                  </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Profile</label>
                       <input
                         type="url"
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                         placeholder="https://github.com/yourusername"
                         value={portfolioLinks.github || ''}
                         onChange={(e) => handlePortfolioLinksChange('github', e.target.value)}
                       />
                     </div>
                  </div>
                   
                   {/* Portfolio Website and Other Links - Side by Side */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Website</label>
                       <input
                         type="url"
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                         placeholder="https://yourportfolio.com"
                         value={portfolioLinks.portfolio || ''}
                         onChange={(e) => handlePortfolioLinksChange('portfolio', e.target.value)}
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Other Links</label>
                       <input
                         type="url"
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                         placeholder="https://behance.net/yourusername or https://dribbble.com/yourusername"
                         value={portfolioLinks.other || ''}
                         onChange={(e) => handlePortfolioLinksChange('other', e.target.value)}
                       />
                     </div>
                   </div>
                 </div>
                 <div className="mt-4 text-sm text-gray-500">
                   <p>Add your portfolio links to showcase your work to employers. These will be included in your application when you submit.</p>
                 </div>
              </div>

              {/* Video Introduction */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Video Introduction (Optional)</h2>
                
                {uploadedFiles.video ? (
                  <FilePreview 
                    file={uploadedFiles.video} 
                    onRemove={() => handleFileRemove('video')}
                    type="video"
                  />
                ) : (
                  <FileUploadArea
                    type="video"
                    accept=".mp4,.mov,.avi,.webm"
                    title="Upload Video Introduction"
                    description="MP4, MOV, AVI, or WEBM (Max 50MB)"
                  />
                )}
                
                <div className="mt-4 text-sm text-gray-500">
                  <p>A brief video introduction can help employers get to know you better. Keep it under 3 minutes.</p>
                </div>
              </div>


              {/* Submit Application */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={handleSubmitApplication}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    {isEditMode ? 'Update Application' : 'Submit Application'}
                  </button>
                  <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Job Summary */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Job Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Job Category:</span>
                    <span className="font-medium text-gray-900">{jobData?.category || 'General'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Employment Type:</span>
                    <span className="font-medium text-gray-900">{jobData?.employmentType || 'Full-time'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Work Arrangement:</span>
                    <span className="font-medium text-gray-900">{jobData?.workArrangement || 'On-site'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium text-gray-900">{jobData?.location || 'Location not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience Level:</span>
                    <span className="font-medium text-gray-900">{jobData?.experienceLevel || 'Entry Level'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Salary Range:</span>
                    <span className="font-medium text-gray-900">{formatSalary()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Applications:</span>
                    <span className="font-medium text-gray-900">{jobData?.applications || 0} received</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Application Deadline:</span>
                    <span className="font-medium text-red-600">{jobData?.deadline || 'No deadline'}</span>
                  </div>
                </div>
              </div>

              {/* About Company */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">About {jobData?.company || 'Company'}</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <img 
                    src={jobData?.companyLogo || "https://via.placeholder.com/48x48/3B82F6/FFFFFF?text=LOGO"} 
                    alt={`${jobData?.company || 'Company'} logo`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-blue-600 hover:text-blue-700 font-medium">
                      {jobData?.company || 'Loading...'}
                    </p>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(jobData?.companyRating || 0) 
                              ? 'text-yellow-400 fill-current' 
                              : i < (jobData?.companyRating || 0) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-sm text-gray-500 ml-1">
                        ({jobData?.companyRating || 0}/5)
                      </span>
                </div>
              </div>
                </div>
                <p className="text-gray-700 text-sm mb-4">
                  {jobData?.companyDescription || 'No company description available.'}
                </p>
                {jobData?.isAccessibilityCertified && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Accessibility Certified
                  </span>
                )}
              </div>

              {/* Application Tips */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-3">Application Tips</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Tailor your cover letter to this specific role</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Highlight accessibility experience and awareness</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Include portfolio samples that demonstrate relevant skills</span>
                  </li>
                </ul>
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

      {/* Work Experience Modal */}
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
    </div>
  );
};

export default SubmitApplication;