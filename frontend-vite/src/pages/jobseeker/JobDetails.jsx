import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import JobseekerHeader from '../../components/ui/JobseekerHeader.jsx';
import Footer from '../../components/ui/Footer.jsx';
import Chatbot from '../../components/ui/Chatbot.jsx';
import api from '../../utils/api.js';

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSaved, setIsSaved] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [jobData, setJobData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Determine breadcrumb path based on referrer
  const getBreadcrumbPath = () => {
    const referrer = location.state?.from || document.referrer;
    
    if (referrer.includes('/find-job') || referrer.includes('/jobseeker/job-recommendations')) {
      return {
        firstLink: '/find-job',
        firstLabel: 'Jobs',
        secondLabel: 'View Job Details'
      };
    } else {
      return {
        firstLink: '/jobseeker/dashboard',
        firstLabel: 'Dashboard',
        secondLabel: 'View Job Details'
      };
    }
  };

  // Fetch job details from backend
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching job details for ID:', jobId);
        
        const response = await api.get(`/api/jobs/job/${jobId}`);
        console.log('Job details response:', response.data);
        
        if (response.data.success) {
          const job = response.data.job;
          
          // Transform backend data to match frontend format
          const transformedJob = {
            id: job.job_id,
            title: job.jobtitle,
            company: job.employer?.company_name || 'Unknown Company',
            companyLogo: job.employer?.profile_picture 
              ? `http://localhost:4000/uploads/Employer/${job.employer.user_id}/${job.employer.profile_picture}`
              : "https://via.placeholder.com/60x60/3B82F6/FFFFFF?text=LOGO",
            location: job.location_city || 'Location not specified',
            status: job.job_status || 'Active',
            postedDate: new Date(job.created_at).toLocaleDateString(),
            lastUpdated: new Date(job.updated_at || job.created_at).toLocaleDateString(),
            category: job.jobCategory || 'General', // Fixed: was job.job_category
            employmentType: job.employment_type || 'Full-time',
            workArrangement: job.work_arrangement || 'On-site',
            experienceLevel: job.experience_level || 'Not specified',
    salaryRange: {
              min: job.salary_min || 0,
              max: job.salary_max || 0,
              currency: "PHP",
              period: job.salary_type || "monthly" // Fixed: use actual salary_type from database
            },
            applications: job._count?.applications || 0,
            deadline: job.application_deadline ? new Date(job.application_deadline).toLocaleDateString() : 'No deadline',
            description: job.description || 'No description available.', // Fixed: was job.job_description
            requiredSkills: job.skills_required || [],
            accessibilityFeatures: job.workplace_accessibility_features || [],
            companyRating: job.employer?.rating || 0,
            companyReviews: 0, // This would need a separate API call
            companyDescription: job.employer?.company_description || 'No company description available.',
            isAccessibilityCertified: job.employer?.accessibilityFeatures?.length > 0 || false
          };
          
          setJobData(transformedJob);
        } else {
          setError('Job not found');
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to load job details');
      } finally {
        setIsLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  // Check if job is already saved
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!jobData?.id) return;
      
      try {
        const response = await api.get(`/api/saved-jobs/check/${jobData.id}`);
        console.log('Check saved status response:', response.data);
        setIsSaved(response.data.data?.isSaved || false);
      } catch (error) {
        console.error('Error checking saved status:', error);
        // Default to false if check fails
        setIsSaved(false);
      }
    };

    if (jobData?.id) {
      checkSavedStatus();
    }
  }, [jobData?.id]);

  // Check if user has already applied to this job
  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (!jobData?.id) return;
      
      try {
        const response = await api.get(`/api/applications/check/${jobData.id}`);
        console.log('Check application status response:', response.data);
        
        if (response.data.success) {
          setHasApplied(response.data.hasApplied);
          setApplicationData(response.data.application);
        }
      } catch (error) {
        console.error('Error checking application status:', error);
        // Default to false if check fails
        setHasApplied(false);
        setApplicationData(null);
      }
    };

    if (jobData?.id) {
      checkApplicationStatus();
    }
  }, [jobData?.id]);

  const handleWithdrawApplication = async () => {
    if (!window.confirm('Are you sure you want to withdraw your application? This action cannot be undone.')) {
      return;
    }

    try {
      setIsWithdrawing(true);
      const response = await api.post(`/api/applications/withdraw/${jobData.id}`);
      
      if (response.data.success) {
        alert('Application withdrawn successfully!');
        // Update the state to reflect that the user no longer has an application
        setHasApplied(false);
        setApplicationData(null);
        // Refresh the page to show the apply button
        window.location.reload();
      } else {
        alert('Failed to withdraw application. Please try again.');
      }
    } catch (error) {
      console.error('Error withdrawing application:', error);
      alert('Failed to withdraw application. Please try again.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const reviews = [
    {
      id: 1,
      name: "Sarah Mitchell",
      project: "E-commerce Website Development",
      rating: 5.0,
      comment: "Exceptional cooperation! The client is very accommodating, provided all the needed details and support.",
      postedDate: "1 week ago"
    },
    {
      id: 2,
      name: "Marcus Johnson",
      project: "Mobile App UI/UX Design",
      rating: 5.0,
      comment: "Exceptional cooperation! The client is very accommodating, provided all the needed details and support.",
      postedDate: "1 week ago"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      project: "WordPress Website Customization",
      rating: 4.0,
      comment: "Exceptional cooperation! The client is very accommodating and provided all the needed details.",
      postedDate: "2 weeks ago"
    }
  ];

  const formatSalary = () => {
    if (!jobData || !jobData.salaryRange) return 'Salary not specified';
    if (jobData.salaryRange.min === 0 && jobData.salaryRange.max === 0) return 'Salary not specified';
    
    const period = jobData.salaryRange.period;
    const periodText = period === 'monthly' ? 'month' : 
                      period === 'weekly' ? 'week' : 
                      period === 'biweekly' ? '2 weeks' : 
                      period === 'yearly' ? 'year' : 
                      period;
    
    return `₱${jobData.salaryRange.min.toLocaleString()} - ₱${jobData.salaryRange.max.toLocaleString()} ${jobData.salaryRange.currency} Per ${periodText}`;
  };

  const handleApply = () => {
    if (jobData) {
    navigate(`/jobseeker/submit-application/${jobData.id}`);
    }
  };

  const handleSave = async () => {
    try {
      if (!jobData) return;
      
      console.log('Toggling saved status for job:', jobData.id, 'Current status:', isSaved);
      
      if (isSaved) {
        // Remove from saved jobs
        console.log('Unsaving job:', jobData.id);
        const response = await api.delete(`/api/saved-jobs/unsave/${jobData.id}`);
        console.log('Job unsaved:', response.data);
        alert('Job removed from saved jobs successfully!');
        setIsSaved(false);
      } else {
        // Add to saved jobs
        console.log('Saving job:', jobData.id);
        const response = await api.post('/api/saved-jobs/save', { jobId: jobData.id });
        console.log('Job saved:', response.data);
        
        if (response.data.success) {
          alert('Job saved successfully!');
          setIsSaved(true);
        } else if (response.data.message === 'Job is already saved') {
          alert('Job is already saved!');
          setIsSaved(true); // Update state to reflect it's saved
        } else {
          alert(response.data.message || 'Job saved successfully!');
          setIsSaved(true);
        }
      }
    } catch (error) {
      console.error('Error saving/unsaving job:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // Show error message to user
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
      alert(`Failed to update saved status: ${errorMessage}. Please try again.`);
    }
  };

  const handleShare = async () => {
    try {
      const jobUrl = `${window.location.origin}/jobseeker/job/${jobData?.id}`;
      
      if (navigator.share) {
        // Use native share API if available (mobile)
        await navigator.share({
          title: jobData?.title || 'Job Posting',
          text: `Check out this job: ${jobData?.title} at ${jobData?.company}`,
          url: jobUrl
        });
      } else if (navigator.clipboard) {
        // Fallback to clipboard copy
        await navigator.clipboard.writeText(jobUrl);
        alert('Job link copied to clipboard!');
      } else {
        // Final fallback - show URL in alert
        alert(`Share this job: ${jobUrl}`);
      }
      
      console.log('Job shared:', jobData?.id);
    } catch (error) {
      console.error('Error sharing job:', error);
      // Fallback to showing URL
      const jobUrl = `${window.location.origin}/jobseeker/job/${jobData?.id}`;
      alert(`Share this job: ${jobUrl}`);
    }
  };

  const handleReviewSubmit = () => {
    if (reviewText.trim()) {
      console.log('Submitting review:', reviewText);
      setReviewText('');
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : i < rating 
              ? 'text-yellow-400 fill-current' 
              : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
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
      </div>
    );
  }

  // Error state
  if (error || !jobData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <JobseekerHeader disabled={false} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The job you are looking for does not exist.'}</p>
            <Link
              to="/find-job"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <JobseekerHeader disabled={false} />

      <div className="bg-white border-b border-gray-200">
        <div className="mx-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16">
          <nav className="flex items-center py-3">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Link to={getBreadcrumbPath().firstLink} className="hover:text-blue-600">
                {getBreadcrumbPath().firstLabel}
              </Link>
              <span>/</span>
              <span className="text-gray-900">{getBreadcrumbPath().secondLabel}</span>
            </div>
          </nav>
        </div>
      </div>

      <main className="flex-1 py-6 sm:py-8">
        <div className="mx-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {jobData?.title || 'Loading...'}
                    </h1>
                    <div className="flex items-center space-x-4 mb-3">
                    <Link 
                        to={`/company/${jobData?.company || ''}`}
                        className="text-lg text-blue-600 hover:text-blue-700 font-medium"
                    >
                        {jobData?.company || 'Loading...'}
                    </Link>
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
                        {jobData?.status || 'Loading...'}
                      </span>
                      <span className="text-sm text-gray-500">
                        Posted {jobData?.postedDate || 'Loading...'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {hasApplied ? (
                // Application-specific content
                <>
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                      {jobData?.description || 'No description available.'}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {jobData?.requiredSkills?.map((skill, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          {skill}
                        </span>
                      )) || <span className="text-gray-500">No skills specified</span>}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Accessibility</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {jobData?.accessibilityFeatures?.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      )) || <span className="text-gray-500">No accessibility features specified</span>}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Your Application</h2>
                    <div className="space-y-6">
                      
                      {/* Resume File */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Resume File</h3>
                        {applicationData?.resume ? (
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div>
                              <p className="font-medium text-gray-900">{applicationData.resume.title}</p>
                              <a 
                                href={`http://localhost:4000/uploads/Resumes/${applicationData.resume.file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 text-sm"
                              >
                                View Resume
                              </a>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No resume uploaded</p>
                        )}
                      </div>

                      {/* Cover Letter */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Cover Letter</h3>
                        {applicationData?.custom_message ? (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-gray-700 whitespace-pre-wrap">{applicationData.custom_message}</p>
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No cover letter provided</p>
                        )}
                      </div>

                      {/* Salary Expectation */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Salary Expectation</h3>
                        {applicationData?.proposed_salary ? (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-lg font-medium text-gray-900">
                              ₱{applicationData.proposed_salary.toLocaleString()}
                            </p>
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No salary expectation provided</p>
                        )}
                      </div>

                      {/* Work Experience */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Work Experience</h3>
                        {applicationData?.work_experience && applicationData.work_experience.length > 0 ? (
                          <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                            {applicationData.work_experience.map((exp, index) => {
                              // Debug: Log the actual data structure
                              console.log('Work experience data:', exp);
                              
                              // Handle both camelCase and snake_case field names
                              const title = exp.title || exp.job_title || '';
                              const company = exp.company || exp.company_name || '';
                              const startDate = exp.startDate || exp.start_date || '';
                              const endDate = exp.endDate || exp.end_date || '';
                              const employmentType = exp.employmentType || exp.employment_type || '';
                              const location = exp.location || exp.location_city || '';
                              const country = exp.country || exp.location_country || '';
                              const description = exp.description || exp.job_description || '';
                              
                              console.log('Processed work experience:', { title, company, startDate, endDate, employmentType, location, country, description });
                              
                              return (
                                <div key={index} className="space-y-1">
                                  <h4 className="font-medium text-gray-900">{title}</h4>
                                  <p className="text-sm text-gray-600">{company}</p>
                                  <p className="text-sm text-gray-500">
                                    {startDate ? new Date(startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''} -{" "}
                                    {endDate
                                      ? new Date(endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                      : "Present"}{" "}
                                    {employmentType && `• ${employmentType}`}
                                  </p>
                                  {(location || country) && (
                                    <p className="text-sm text-gray-500">
                                      {location && country ? `${location}, ${country}` : location || country}
                                    </p>
                                  )}
                                  {description && (
                                    <p className="text-sm text-gray-700 mt-2">{description}</p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-gray-500 italic">No work experience included in this application</p>
                          </div>
                        )}
                      </div>

                      {/* Portfolio Links */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Portfolio Links</h3>
                        {applicationData?.portfolio_links && Object.values(applicationData.portfolio_links).some(link => link && link.trim()) ? (
                          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                            {applicationData.portfolio_links.linkedin && (
                              <div>
                                <a 
                                  href={typeof applicationData.portfolio_links.linkedin === 'string' && applicationData.portfolio_links.linkedin.startsWith('http') ? applicationData.portfolio_links.linkedin : `https://${applicationData.portfolio_links.linkedin}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-blue-600 hover:text-blue-700 text-sm underline"
                                >
                                  LinkedIn Profile
                                </a>
                              </div>
                            )}
                            {applicationData.portfolio_links.github && (
                              <div>
                                <a 
                                  href={typeof applicationData.portfolio_links.github === 'string' && applicationData.portfolio_links.github.startsWith('http') ? applicationData.portfolio_links.github : `https://${applicationData.portfolio_links.github}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-blue-600 hover:text-blue-700 text-sm underline"
                                >
                                  GitHub Profile
                                </a>
                              </div>
                            )}
                            {applicationData.portfolio_links.portfolio && (
                              <div>
                                <a 
                                  href={typeof applicationData.portfolio_links.portfolio === 'string' && applicationData.portfolio_links.portfolio.startsWith('http') ? applicationData.portfolio_links.portfolio : `https://${applicationData.portfolio_links.portfolio}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-blue-600 hover:text-blue-700 text-sm underline"
                                >
                                  Portfolio Website
                                </a>
                              </div>
                            )}
                            {applicationData.portfolio_links.other && (
                              <div>
                                <a 
                                  href={typeof applicationData.portfolio_links.other === 'string' && applicationData.portfolio_links.other.startsWith('http') ? applicationData.portfolio_links.other : `https://${applicationData.portfolio_links.other}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-blue-600 hover:text-blue-700 text-sm underline"
                                >
                                  Other Links
                                </a>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-gray-500 italic">No portfolio links included in this application</p>
                          </div>
                        )}
                      </div>

                      {/* Video Introduction */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Video Introduction</h3>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-gray-500 italic">No video introduction included in this application</p>
                        </div>
                      </div>

                      {/* Application Date */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Application Details</h3>
                        <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Applied on:</span>
                            <span className="font-medium text-gray-900">
                              {new Date(applicationData?.submitted_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Application ID:</span>
                            <span className="font-medium text-gray-900">#{applicationData?.application_id}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // Regular job details content
                <>
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {jobData?.description || 'No description available.'}
                    </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                      {jobData?.requiredSkills?.map((skill, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </span>
                      )) || <span className="text-gray-500">No skills specified</span>}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Accessibility Features & Accommodations</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {jobData?.accessibilityFeatures?.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                      )) || <span className="text-gray-500">No accessibility features specified</span>}
                </div>
              </div>
                </>
              )}

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Feedback & Reviews</h2>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Rating</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    {renderStars(3.0)}
                    <span className="text-gray-600">3.0 out of 5</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Review</h3>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience working with this freelancer..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="4"
                  />
                  <div className="flex justify-end space-x-3 mt-3">
                    <button 
                      onClick={() => setReviewText('')}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleReviewSubmit}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                    >
                      Submit
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-t border-gray-200 pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{review.name}</h4>
                          <p className="text-sm text-gray-600">{review.project}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-600 ml-1">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{review.comment}</p>
                      <span className="text-xs text-gray-500">Posted {review.postedDate}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Job Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Job Category:</span>
                    <span className="font-medium text-gray-900">{jobData.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Employment Type:</span>
                    <span className="font-medium text-gray-900">{jobData.employmentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Work Arrangement:</span>
                    <span className="font-medium text-gray-900">{jobData.workArrangement}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium text-gray-900">Cebu City, Cebu, Philippines</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience Level:</span>
                    <span className="font-medium text-gray-900">{jobData.experienceLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Salary Range:</span>
                    <span className="font-medium text-gray-900">{formatSalary()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Applications:</span>
                    <span className="font-medium text-gray-900">{jobData.applications} applications received</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Application Deadline:</span>
                    <span className="font-medium text-red-600">{jobData.deadline}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {hasApplied ? (
                    // Application-specific buttons
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/jobseeker/submit-application/${jobData.id}`)}
                        className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit Application</span>
                      </button>
                      <button
                        onClick={handleWithdrawApplication}
                        disabled={isWithdrawing}
                        className={`flex-1 py-2 px-4 ${isWithdrawing ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'} text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>{isWithdrawing ? 'Withdrawing...' : 'Withdraw Application'}</span>
                      </button>
                    </div>
                  ) : (
                    // Regular apply button
                  <button
                    onClick={handleApply}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Apply Now</span>
                  </button>
                  )}
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className={`flex-1 py-2 px-4 rounded-lg border font-medium transition-colors flex items-center justify-center space-x-2 ${
                        isSaved 
                          ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <svg className={`w-4 h-4 ${isSaved ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{isSaved ? 'Saved' : 'Save'}</span>
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex-1 py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Date Posted:</span>
                    <span>{jobData.postedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span>{jobData.lastUpdated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Job ID:</span>
                    <span>{jobData.id}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">About {jobData.company}</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <img 
                    src={jobData.companyLogo} 
                    alt={`${jobData.company} logo`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <Link 
                      to={`/company/${jobData.company}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {jobData.company}
                    </Link>
                    <div className="flex items-center space-x-1">
                      {renderStars(jobData.companyRating)}
                      <span className="text-sm text-gray-600 ml-1">
                        {jobData.companyRating} ({jobData.companyReviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-4">
                  {jobData.companyDescription}
                </p>
                {jobData.isAccessibilityCertified && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Accessibility Certified
                  </span>
                )}
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

export default JobDetails;
