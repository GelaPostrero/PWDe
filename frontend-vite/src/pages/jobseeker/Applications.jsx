import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import JobseekerHeader from '../../components/ui/JobseekerHeader.jsx';
import Footer from '../../components/ui/Footer.jsx';
import Chatbot from '../../components/ui/Chatbot.jsx';
import api from '../../utils/api.js';

const Applications = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [applications, setApplications] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  // Fetch saved jobs status to update isSaved field
  const fetchSavedJobsStatus = async (applicationsData) => {
    try {
      const response = await api.get('/api/saved-jobs/my-saved-jobs?limit=100');
      if (response.data.success) {
        const savedJobIds = new Set(response.data.data.map(savedJob => savedJob.job.job_id));
        
        // Update applications with correct saved status
        setApplications(prev => prev.map(app => ({
          ...app,
          job: {
            ...app.job,
            isSaved: savedJobIds.has(app.job.job_id)
          }
        })));
      }
    } catch (error) {
      console.error('Error fetching saved jobs status:', error);
    }
  };

  // Load applied jobs on component mount
  useEffect(() => {
    const loadAppliedJobs = async () => {
      setIsLoadingJobs(true);
      setError(null);
      try {
        const response = await api.get('/api/applications/my-applications', {
          params: {
            page: currentPage,
            limit: 9
          }
        });
        
        if (response.data.success) {
          // Add isSaved field to each job in applications
          const applicationsWithSavedStatus = response.data.data.map(app => ({
            ...app,
            job: {
              ...app.job,
              isSaved: false // Default to false, will be updated when we fetch saved jobs
            }
          }));
          setApplications(applicationsWithSavedStatus);
          setTotalPages(response.data.pagination.pages);
          
          // Fetch saved jobs to update the isSaved status
          await fetchSavedJobsStatus(applicationsWithSavedStatus);
        } else {
          setError('Failed to load applications');
        }
      } catch (error) {
        console.error('Error loading applications:', error);
        setError('Failed to load applications');
      } finally {
        setIsLoadingJobs(false);
      }
    };
    loadAppliedJobs();
  }, [currentPage]);

  // Helper function to format salary display
  const formatSalary = (job) => {
    if (!job.salary_min || !job.salary_max) return 'Salary not specified';
    
    const period = job.salary_type;
    const periodText = period === 'Monthly' ? 'month' : 
                      period === 'Weekly' ? 'week' : 
                      period === 'Bi-weekly' ? '2 weeks' : 
                      period === 'Yearly' ? 'year' : 
                      period === 'Hourly' ? 'hour' :
                      period;
    
    return `₱${job.salary_min.toLocaleString()} - ₱${job.salary_max.toLocaleString()} PHP Per ${periodText}`;
  };

  // Helper function to get match score color
  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'bg-blue-100 text-blue-800';
    if (score >= 80) return 'bg-blue-100 text-blue-800';
    if (score >= 70) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Job action handlers
  const toggleSaved = async (jobId) => {
    try {
      const application = applications.find(app => app.job.job_id === jobId);
      if (!application) return;

      console.log('Toggling saved status for job:', jobId, 'Current status:', application.job.isSaved);

      let response;
      if (application.job.isSaved) {
        // Unsave the job
        console.log('Unsaving job:', jobId);
        response = await api.delete(`/api/saved-jobs/unsave/${jobId}`);
        console.log('Job unsaved:', response.data);
      } else {
        // Save the job
        console.log('Saving job:', jobId);
        response = await api.post('/api/saved-jobs/save', { jobId: jobId });
        console.log('Job saved:', response.data);
      }
      
      // Update local state based on response
      let updatedApplications;
      if (application.job.isSaved) {
        // Job was unsaved
        updatedApplications = applications.map(app => 
          app.job.job_id === jobId 
            ? { ...app, job: { ...app.job, isSaved: false } }
            : app
        );
        alert('Job removed from saved jobs');
      } else {
        // Job was saved (or already saved)
        updatedApplications = applications.map(app => 
          app.job.job_id === jobId 
            ? { ...app, job: { ...app.job, isSaved: true } }
            : app
        );
        if (response.data.success) {
          alert('Job saved successfully!');
        } else if (response.data.message === 'Job is already saved') {
          alert('Job is already saved!');
        } else {
          alert('Job saved successfully!');
        }
      }
      
      setApplications(updatedApplications);
      
    } catch (error) {
      console.error('Error toggling job saved status:', error);
      alert('Failed to update saved status. Please try again.');
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

  // Filter applications based on search query
  const filteredApplications = applications.filter(app => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      app.job.jobtitle.toLowerCase().includes(query) ||
      app.job.employer.company_name.toLowerCase().includes(query) ||
      app.job.jobCategory.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <JobseekerHeader disabled={false} />

      <main className="flex-1 py-6 sm:py-8">
        <div className="mx-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16">
          
          {/* Page Header */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
            <div>
              <h1 className="text-2xl sm:text-2xl font-bold text-gray-900 mb-1">
                My Applications
              </h1>
              <p className="text-lg text-gray-600">
                Track the status of all the jobs you've applied for.
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
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No applications found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredApplications.map((application) => {
                const job = application.job;
                return (
                <div key={application.application_id} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow relative border-l-4 border-l-blue-500">
                  
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                    <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                      <img 
                        src={job.employer.profile_picture || "https://via.placeholder.com/40"} 
                        alt={`${job.employer.company_name} logo`}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{job.jobtitle}</h4>
                        <p className="text-xs sm:text-sm text-gray-600">{job.employer.company_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block ${getMatchScoreColor(Math.floor(Math.random() * 40) + 30)} text-xs font-medium px-2 py-1 rounded-full`}>
                        {Math.floor(Math.random() * 40) + 30}% Match
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <p className="text-xs sm:text-sm text-gray-600">
                      {job.employment_type} • {job.location_city}, {job.location_province}
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-gray-900">
                      {formatSalary(job)}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">{job.experience_level}</p>
                  </div>

                  <div className="mb-3">
                    <div className="flex gap-1 mb-2 overflow-hidden">
                      {job.skills_required && job.skills_required.slice(0, 4).map((skill, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded whitespace-nowrap flex-shrink-0">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-1 overflow-hidden">
                      {job.workplace_accessibility_features && job.workplace_accessibility_features.slice(0, 3).map((feature, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded whitespace-nowrap flex-shrink-0">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex space-x-2">
                      <Link
                        to={`/jobseeker/job/${job.job_id}`}
                        className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>View Details</span>
                      </Link>
                      
                      <button
                        disabled
                        className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium bg-green-100 text-green-800 cursor-not-allowed"
                      >
                        <span>Applied</span>
                      </button>
                    </div>
                    
                    <button
                      onClick={() => toggleSaved(job.job_id)}
                      className={`p-2 rounded-lg transition-colors ${
                        job.isSaved 
                          ? 'text-red-500 hover:text-red-600' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                      title={job.isSaved ? "Remove from saved jobs" : "Save job"}
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill={job.isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
                );
              })}
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
              
              {totalPages > 0 && [...Array(totalPages)].map((_, i) => {
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

export default Applications;
