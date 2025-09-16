import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import JobseekerHeader from '../../components/ui/JobseekerHeader.jsx';
import Footer from '../../components/ui/Footer.jsx';
import Chatbot from '../../components/ui/Chatbot.jsx';
import api from '../../utils/api.js';

const SavedJobs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [savedJobsData, setSavedJobsData] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [error, setError] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(new Set());

  // Fetch applied jobs to check which jobs user has already applied to
  const fetchAppliedJobs = async () => {
    try {
      const response = await api.get('/api/applications/my-applications?limit=100');
      if (response.data.success) {
        const appliedJobIds = new Set(response.data.data.map(app => app.job.job_id));
        setAppliedJobs(appliedJobIds);
      }
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
    }
  };

  // Fetch saved jobs from backend
  const fetchSavedJobs = async () => {
    try {
      setIsLoadingJobs(true);
      setError(null);
      
      console.log('Fetching saved jobs from API...');
      const response = await api.get('/api/saved-jobs/my-saved-jobs?limit=50');
      console.log('Saved jobs API Response:', response.data);
      
      if (response.data.success && response.data.data) {
        console.log('Saved jobs found:', response.data.data.length);
        console.log('First saved job:', response.data.data[0]);
        
        // Transform backend data to match frontend format
        console.log('First saved job employer data:', response.data.data[0]?.job?.employer);
        const transformedJobs = response.data.data.map(savedJob => ({
          id: savedJob.job.job_id,
          title: savedJob.job.jobtitle,
          company: savedJob.job.employer?.company_name || 'Unknown Company',
          companyLogo: savedJob.job.employer?.profile_picture || "https://via.placeholder.com/40",
          matchScore: Math.floor(Math.random() * 40) + 30, // Random score 30-70%
          type: savedJob.job.employment_type,
          location: `${savedJob.job.location_city}, ${savedJob.job.location_province}`,
          salaryRange: {
            min: savedJob.job.salary_min || 0,
            max: savedJob.job.salary_max || 0,
            currency: "PHP",
            period: savedJob.job.salary_type || "monthly"
          },
          level: savedJob.job.experience_level,
          requiredSkills: savedJob.job.skills_required || [],
          preferredSkills: [],
          experienceYears: 0,
          accessibilityFeatures: savedJob.job.workplace_accessibility_features || [],
          companyAccessibility: {
            hasAccessibilityPolicy: true,
            providesAccommodations: true,
            inclusiveHiring: true
          },
          applicationStatus: "not_applied",
          isSaved: true,
          postedDate: new Date(savedJob.job.created_at).toLocaleDateString(),
          expiresDate: savedJob.job.application_deadline ? new Date(savedJob.job.application_deadline).toLocaleDateString() : 'No deadline',
          isActive: true,
          savedAt: new Date().toLocaleDateString() // Use current date as fallback since saved_at doesn't exist
        }));
        
        console.log('First transformed job companyLogo:', transformedJobs[0]?.companyLogo);
        setSavedJobsData(transformedJobs);
      } else {
        console.log('No saved jobs found in response:', response.data);
        setSavedJobsData([]);
      }
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      setError('Failed to load saved jobs. Please try again.');
      setSavedJobsData([]);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  // Load saved jobs on component mount
  useEffect(() => {
    fetchSavedJobs();
    fetchAppliedJobs();
  }, []);

  // Filter and sort jobs based on current settings
  useEffect(() => {
    let filtered = [...savedJobsData];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.requiredSkills.some(skill => skill.toLowerCase().includes(query)) ||
        job.location.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'match-score':
        filtered.sort((a, b) => b.matchScore - a.matchScore);
        break;
      case 'salary-high':
        filtered.sort((a, b) => (b.salaryRange.max + b.salaryRange.min) - (a.salaryRange.max + a.salaryRange.min));
        break;
      case 'salary-low':
        filtered.sort((a, b) => (a.salaryRange.max + a.salaryRange.min) - (b.salaryRange.max + b.salaryRange.min));
        break;
      case 'experience':
        const experienceOrder = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive Level'];
        filtered.sort((a, b) => {
          const aIndex = experienceOrder.indexOf(a.level);
          const bIndex = experienceOrder.indexOf(b.level);
          return aIndex - bIndex;
        });
        break;
      case 'recent':
      default:
        // Sort by job posting date since we don't have saved_at
        filtered.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
        break;
    }

    setFilteredJobs(filtered);
  }, [savedJobsData, searchQuery, sortBy]);

  // Helper function to format salary display
  const formatSalary = (salaryRange) => {
    if (!salaryRange || (salaryRange.min === 0 && salaryRange.max === 0)) {
      return 'Salary not specified';
    }
    
    const period = salaryRange.period;
    const periodText = period === 'monthly' ? 'month' : 
                      period === 'weekly' ? 'week' : 
                      period === 'biweekly' ? '2 weeks' : 
                      period === 'yearly' ? 'year' : 
                      period;
    
    return `₱${salaryRange.min.toLocaleString()} - ₱${salaryRange.max.toLocaleString()} ${salaryRange.currency} Per ${periodText}`;
  };

  // Helper function to get match score color
  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'bg-blue-100 text-blue-800';
    if (score >= 80) return 'bg-blue-100 text-blue-800';
    if (score >= 70) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Job action handlers
  const removeFromSaved = async (jobId) => {
    try {
      console.log(`Removing job ${jobId} from saved jobs`);
      
      // API call to remove from saved
      const response = await api.delete(`/api/saved-jobs/unsave/${jobId}`);
      console.log('Job removed from saved:', response.data);
      
      // Update local state
      setSavedJobsData(prevJobs => prevJobs.filter(job => job.id !== jobId));
      
      // Show success message
      alert('Job removed from saved jobs successfully!');
    } catch (error) {
      console.error('Error removing job from saved:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
      alert(`Failed to remove job from saved: ${errorMessage}. Please try again.`);
    }
  };

  const applyToJob = async (jobId) => {
    try {
      // API call to apply to job
      // const response = await fetch(`/api/jobs/${jobId}/apply`, {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      
      console.log(`Applied to job ${jobId}`);
    } catch (error) {
      console.error('Error applying to job:', error);
    }
  };

  // Pagination
  const jobsPerPage = 9; // Show 9 jobs (3x3 grid) for better visual balance
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <JobseekerHeader disabled={false} />

      <main className="flex-1 py-6 sm:py-8">
        <div className="mx-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16">
          
          {/* Page Header */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
            <div>
              <h1 className="text-2xl sm:text-2xl font-bold text-gray-900 mb-1">
                Saved Jobs
              </h1>
              <p className="text-lg text-gray-600">
                Easily revisit and apply to jobs you've bookmarked.
              </p>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              
              {/* Search Bar */}
              <div className="flex-1 lg:max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search jobs by keyword or role..."
                    className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Filters and Sort */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                
                {/* Filters Button */}
                <button className="px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                  </svg>
                  <span>Filters</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Sort Button */}
                <button className="px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                  <span>Sort</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Job Grid */}
          {isLoadingJobs ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 lg:p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 text-lg font-medium mb-2">Error Loading Saved Jobs</div>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchSavedJobs}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg font-medium mb-2">No Saved Jobs Found</div>
              <p className="text-gray-600">
                {searchQuery 
                  ? 'No saved jobs match your search criteria. Try adjusting your search terms.'
                  : 'You haven\'t saved any jobs yet. Start exploring and save jobs you\'re interested in!'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {currentJobs.map((job) => (
                <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow relative border-l-4 border-l-blue-500">
                  
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                    <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                      <img 
                        src={job.companyLogo} 
                        alt={`${job.company} logo`}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{job.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-600">{job.company}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block ${getMatchScoreColor(job.matchScore)} text-xs font-medium px-2 py-1 rounded-full`}>
                      {job.matchScore}% Match
                    </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <p className="text-xs sm:text-sm text-gray-600">
                      {job.type} • {job.location}
                    </p>
                      <p className="text-xs sm:text-sm font-medium text-gray-900">
                        {formatSalary(job.salaryRange)}
                      </p>
                    <p className="text-xs sm:text-sm text-gray-600">{job.level}</p>
                  </div>

                  <div className="mb-3">
                    <div className="flex gap-1 mb-2 overflow-hidden">
                      {job.requiredSkills.slice(0, 4).map((skill, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded whitespace-nowrap flex-shrink-0">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-1 overflow-hidden">
                      {job.accessibilityFeatures.slice(0, 3).map((feature, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded whitespace-nowrap flex-shrink-0">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex space-x-2">
                      <Link
                        to={`/jobseeker/job/${job.id}`}
                        state={{ from: '/jobseeker/saved-jobs' }}
                        className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>View Details</span>
                      </Link>
                      
                      {appliedJobs.has(job.id) ? (
                        <button
                          disabled
                          className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium bg-green-100 text-green-800 cursor-not-allowed"
                        >
                          <span>Applied</span>
                        </button>
                      ) : (
                      <Link
                          to={`/jobseeker/submit-application/${job.id}`}
                          className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span>Apply Now</span>
                      </Link>
                      )}
                    </div>
                    
                    <button
                      onClick={() => removeFromSaved(job.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        job.isSaved 
                          ? 'text-red-500 hover:text-red-600' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill={job.isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center">
            <nav className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        pageNum === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return <span key={pageNum} className="px-2 text-gray-500">...</span>;
                }
                return null;
              })}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
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

export default SavedJobs;
