import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import JobseekerHeader from '../../components/ui/JobseekerHeader.jsx';
import Footer from '../../components/ui/Footer.jsx';
import Chatbot from '../../components/ui/Chatbot.jsx';
import api from '../../utils/api.js';

const JobRecommendations = () => {
  const [viewMode, setViewMode] = useState('all-jobs');
  const [sortBy, setSortBy] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [savedJobsCount, setSavedJobsCount] = useState(3);
  const [jobData, setJobData] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [error, setError] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  
  // Filter states
  const [filters, setFilters] = useState({
    employmentType: '',
    workArrangement: '',
    experienceLevel: '',
    salaryRange: '',
    location: '',
    skills: []
  });
  const [showFilters, setShowFilters] = useState(false);

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

  // Fetch jobs from backend
  const fetchJobs = async () => {
    try {
      setIsLoadingJobs(true);
      setError(null);
      
      console.log('Fetching jobs from API...');
      const response = await api.get('/api/jobs/jobs?limit=50');
      console.log('API Response:', response.data);
      
      if (response.data.success && response.data.data) {
        console.log('Jobs found:', response.data.data.length);
        console.log('First job:', response.data.data[0]);
        
        // Transform backend data to match frontend format
        console.log('First job employer data:', response.data.data[0]?.employer);
        const transformedJobs = response.data.data.map(job => ({
          id: job.job_id,
          title: job.jobtitle,
          company: job.employer?.company_name || 'Unknown Company',
          companyLogo: job.employer?.profile_picture || "https://via.placeholder.com/40",
          matchScore: Math.floor(Math.random() * 40) + 30, // Random score 30-70%
          type: job.employment_type,
          location: `${job.location_city}, ${job.location_province}`,
          salaryRange: {
            min: job.salary_min || 0,
            max: job.salary_max || 0,
            currency: "PHP",
            period: job.salary_type || "monthly"
          },
          level: job.experience_level,
          requiredSkills: job.skills_required || [],
          preferredSkills: [],
          experienceYears: 0,
          accessibilityFeatures: job.workplace_accessibility_features || [],
          companyAccessibility: {
            hasAccessibilityPolicy: true,
            providesAccommodations: true,
            inclusiveHiring: true
          },
          applicationStatus: "not_applied",
          isSaved: false,
          postedDate: new Date(job.created_at).toISOString().split('T')[0],
          expiresDate: job.application_deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          isActive: job.job_status === 'Active'
        }));
        
        console.log('First transformed job companyLogo:', transformedJobs[0]?.companyLogo);
        setJobData(transformedJobs);
        
        // Check saved status for all jobs
        await checkSavedStatusForJobs(transformedJobs);
      } else {
        console.log('No jobs found in response:', response.data);
        setError('Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setIsLoadingJobs(false);
    }
  };

  // Check saved status for multiple jobs
  const checkSavedStatusForJobs = async (jobs) => {
    try {
      const savedStatusPromises = jobs.map(async (job) => {
        try {
          const response = await api.get(`/api/saved-jobs/check/${job.id}`);
          console.log(`Check saved status for job ${job.id}:`, response.data);
          return { ...job, isSaved: response.data.data?.isSaved || false };
        } catch (error) {
          console.error(`Error checking saved status for job ${job.id}:`, error);
          return { ...job, isSaved: false };
        }
      });
      
      const jobsWithSavedStatus = await Promise.all(savedStatusPromises);
      setJobData(jobsWithSavedStatus);
      
      // Update saved jobs count
      const savedCount = jobsWithSavedStatus.filter(job => job.isSaved).length;
      setSavedJobsCount(savedCount);
    } catch (error) {
      console.error('Error checking saved status for jobs:', error);
      setJobData(jobs); // Fallback to original jobs
    }
  };

  // Load jobs on component mount
  useEffect(() => {
    fetchJobs();
    fetchAppliedJobs();
  }, []);

  // Filter and sort jobs based on current settings
  useEffect(() => {
    let filtered = [...jobData];

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

    // Apply other filters
    if (filters.employmentType) {
      filtered = filtered.filter(job => job.type === filters.employmentType);
    }
    if (filters.experienceLevel) {
      filtered = filtered.filter(job => job.level === filters.experienceLevel);
    }
    if (filters.location) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.salaryRange) {
      const [min, max] = filters.salaryRange.split('-').map(Number);
      filtered = filtered.filter(job => {
        const jobSalary = (job.salaryRange.min + job.salaryRange.max) / 2;
        return jobSalary >= min && jobSalary <= max;
      });
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
        filtered.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
        break;
    }

    // Apply view mode filter
    if (viewMode === 'ai-matches') {
      filtered = filtered.filter(job => job.matchScore >= 70);
    }

    setFilteredJobs(filtered);
  }, [jobData, searchQuery, filters, sortBy, viewMode]);

  // Mock job data fallback (remove this after testing)
  const mockJobData = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "TechCorp Inc.",
      companyLogo: "https://via.placeholder.com/40",
      matchScore: 95,
      type: "Full-time",
      location: "Remote",
      salary: {
        min: 1000,
        max: 5000,
        currency: "USD",
        period: "weekly",
        isFixed: false
      },
      level: "Senior Level",
      requiredSkills: ["React", "TypeScript", "Tailwind"],
      preferredSkills: ["Figma", "Accessibility"],
      experienceYears: 3,
      accessibilityFeatures: ["Screen Reader Optimized", "Flexible Hours"],
      companyAccessibility: {
        hasAccessibilityPolicy: true,
        providesAccommodations: true,
        inclusiveHiring: true
      },
      applicationStatus: "not_applied",
      isSaved: false,
      postedDate: "2025-01-15",
      expiresDate: "2025-02-15",
      isActive: true
    },
    {
      id: 2,
      title: "Frontend Developer",
      company: "TechCorp Inc.",
      companyLogo: "https://via.placeholder.com/40",
      matchScore: 95,
      type: "Part-time",
      location: "Remote",
      salary: {
        min: 1000,
        max: 5000,
        currency: "USD",
        period: "bi-weekly",
        isFixed: false
      },
      level: "Mid-Level",
      requiredSkills: ["React", "TypeScript", "Tailwind"],
      preferredSkills: ["Figma", "Accessibility"],
      experienceYears: 2,
      accessibilityFeatures: ["Screen Reader Optimized", "Flexible Hours"],
      companyAccessibility: {
        hasAccessibilityPolicy: true,
        providesAccommodations: true,
        inclusiveHiring: true
      },
      applicationStatus: "not_applied",
      isSaved: false,
      postedDate: "2025-01-10",
      expiresDate: "2025-02-10",
      isActive: true
    },
    {
      id: 3,
      title: "UX/UI Designer",
      company: "DesignHub",
      companyLogo: "https://via.placeholder.com/40",
      matchScore: 88,
      type: "Full-time",
      location: "Remote",
      salary: {
        min: 5000,
        max: 5000,
        currency: "USD",
        period: "monthly",
        isFixed: true
      },
      level: "Entry Level",
      requiredSkills: ["Figma", "Adobe XD", "Prototyping"],
      preferredSkills: ["Accessibility", "User Research"],
      experienceYears: 1,
      accessibilityFeatures: ["Accessible Office", "Remote Options"],
      companyAccessibility: {
        hasAccessibilityPolicy: true,
        providesAccommodations: true,
        inclusiveHiring: true
      },
      applicationStatus: "not_applied",
      isSaved: false,
      postedDate: "2025-01-12",
      expiresDate: "2025-02-12",
      isActive: true
    },
    {
      id: 4,
      title: "Content Writer",
      company: "MediaGroup",
      companyLogo: "https://via.placeholder.com/40",
      matchScore: 82,
      type: "Part-time",
      location: "Remote",
      salary: {
        min: 10,
        max: 10,
        currency: "USD",
        period: "hourly",
        isFixed: true
      },
      level: "Entry-Level",
      requiredSkills: ["SEO", "Blogging", "Content Strategy"],
      preferredSkills: ["Social Media", "Analytics"],
      experienceYears: 1,
      accessibilityFeatures: ["Flexible Schedule", "Global Opportunity"],
      companyAccessibility: {
        hasAccessibilityPolicy: true,
        providesAccommodations: true,
        inclusiveHiring: true
      },
      applicationStatus: "not_applied",
      isSaved: true,
      postedDate: "2025-01-08",
      expiresDate: "2025-02-08",
      isActive: true
    },
    {
      id: 5,
      title: "Frontend Developer",
      company: "TechCorp Inc.",
      companyLogo: "https://via.placeholder.com/40",
      matchScore: 95,
      type: "Full-time",
      location: "Remote",
      salary: {
        min: 1000,
        max: 5000,
        currency: "USD",
        period: "weekly",
        isFixed: false
      },
      level: "Senior Level",
      requiredSkills: ["React", "TypeScript", "Tailwind"],
      preferredSkills: ["Figma", "Accessibility"],
      experienceYears: 3,
      accessibilityFeatures: ["Screen Reader Optimized", "Flexible Hours"],
      companyAccessibility: {
        hasAccessibilityPolicy: true,
        providesAccommodations: true,
        inclusiveHiring: true
      },
      applicationStatus: "not_applied",
      isSaved: false,
      postedDate: "2025-01-15",
      expiresDate: "2025-02-15",
      isActive: true
    },
    {
      id: 6,
      title: "UX/UI Designer",
      company: "DesignHub",
      companyLogo: "https://via.placeholder.com/40",
      matchScore: 88,
      type: "Full-time",
      location: "Remote",
      salary: {
        min: 5000,
        max: 5000,
        currency: "USD",
        period: "monthly",
        isFixed: true
      },
      level: "Entry Level",
      requiredSkills: ["Figma", "Adobe XD", "Prototyping"],
      preferredSkills: ["Accessibility", "User Research"],
      experienceYears: 1,
      accessibilityFeatures: ["Accessible Office", "Remote Options"],
      companyAccessibility: {
        hasAccessibilityPolicy: true,
        providesAccommodations: true,
        inclusiveHiring: true
      },
      applicationStatus: "not_applied",
      isSaved: false,
      postedDate: "2025-01-12",
      expiresDate: "2025-02-12",
      isActive: true
    },
    {
      id: 7,
      title: "Backend Developer",
      company: "DataTech Solutions",
      companyLogo: "https://via.placeholder.com/40",
      matchScore: 91,
      type: "Full-time",
      location: "Hybrid",
      salary: {
        min: 6000,
        max: 8000,
        currency: "USD",
        period: "monthly",
        isFixed: false
      },
      level: "Mid-Level",
      requiredSkills: ["Node.js", "Python", "PostgreSQL"],
      preferredSkills: ["AWS", "Docker"],
      experienceYears: 2,
      accessibilityFeatures: ["Flexible Hours", "Accessible Office"],
      companyAccessibility: {
        hasAccessibilityPolicy: true,
        providesAccommodations: true,
        inclusiveHiring: true
      },
      applicationStatus: "not_applied",
      isSaved: false,
      postedDate: "2025-01-14",
      expiresDate: "2025-02-14",
      isActive: true
    },
    {
      id: 8,
      title: "Product Manager",
      company: "InnovateCorp",
      companyLogo: "https://via.placeholder.com/40",
      matchScore: 87,
      type: "Full-time",
      location: "On-site",
      salary: {
        min: 8000,
        max: 12000,
        currency: "USD",
        period: "monthly",
        isFixed: false
      },
      level: "Senior Level",
      requiredSkills: ["Product Strategy", "Agile", "User Research"],
      preferredSkills: ["Data Analysis", "A/B Testing"],
      experienceYears: 4,
      accessibilityFeatures: ["Accessible Office", "Flexible Schedule"],
      companyAccessibility: {
        hasAccessibilityPolicy: true,
        providesAccommodations: true,
        inclusiveHiring: true
      },
      applicationStatus: "not_applied",
      isSaved: false,
      postedDate: "2025-01-13",
      expiresDate: "2025-02-13",
      isActive: true
    },
    {
      id: 9,
      title: "DevOps Engineer",
      company: "CloudWorks Inc.",
      companyLogo: "https://via.placeholder.com/40",
      matchScore: 89,
      type: "Contract",
      location: "Remote",
      salary: {
        min: 80,
        max: 120,
        currency: "USD",
        period: "hourly",
        isFixed: false
      },
      level: "Mid-Level",
      requiredSkills: ["Docker", "Kubernetes", "AWS"],
      preferredSkills: ["Terraform", "Jenkins"],
      experienceYears: 3,
      accessibilityFeatures: ["Remote Options", "Flexible Hours"],
      companyAccessibility: {
        hasAccessibilityPolicy: true,
        providesAccommodations: true,
        inclusiveHiring: true
      },
      applicationStatus: "not_applied",
      isSaved: false,
      postedDate: "2025-01-11",
      expiresDate: "2025-02-11",
      isActive: true
    }
  ];

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
  const toggleJobSaved = async (jobId) => {
    try {
      const job = jobData.find(j => j.id === jobId);
      if (!job) return;

      console.log('Toggling saved status for job:', jobId, 'Current status:', job.isSaved);

      let response;
      if (job.isSaved) {
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
      let updatedJobs;
      if (job.isSaved) {
        // Job was unsaved
        updatedJobs = jobData.map(j => 
          j.id === jobId ? { ...j, isSaved: false } : j
        );
        alert('Job removed from saved jobs');
      } else {
        // Job was saved (or already saved)
        updatedJobs = jobData.map(j => 
          j.id === jobId ? { ...j, isSaved: true } : j
        );
        if (response.data.success) {
          alert('Job saved successfully!');
        } else if (response.data.message === 'Job is already saved') {
          alert('Job is already saved!');
        } else {
          alert('Job saved successfully!');
        }
      }
      
      setJobData(updatedJobs);
      
      // Update saved jobs count
      const newSavedCount = updatedJobs.filter(job => job.isSaved).length;
      setSavedJobsCount(newSavedCount);
      
    } catch (error) {
      console.error('Error toggling job saved status:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      // Show error message to user
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
      alert(`Failed to update saved status: ${errorMessage}. Please try again.`);
    }
  };

  // Filter update functions
  const updateFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      employmentType: '',
      workArrangement: '',
      experienceLevel: '',
      salaryRange: '',
      location: '',
      skills: []
    });
  };

  // Get unique values for filter options
  const getUniqueValues = (field) => {
    return [...new Set(jobData.map(job => job[field]).filter(Boolean))];
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
  }, [searchQuery, filters, sortBy, viewMode]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <JobseekerHeader disabled={false} />

      <main className="flex-1 py-6 sm:py-8">
        <div className="mx-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16">
          
          {/* Page Header */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl sm:text-2xl font-bold text-gray-900 mb-1">
                  Job Recommendations
                </h1>
                <p className="text-lg text-gray-600">
                  AI-powered matches tailored to your profile and accessibility needs.
                </p>
              </div>
              <Link
                to="/jobseeker/saved-jobs"
                className="mt-4 sm:mt-0 inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Saved Jobs ({savedJobsCount})</span>
              </Link>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              
              {/* View and Sort Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
                
                {/* View Mode */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">View:</span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setViewMode('ai-matches')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        viewMode === 'ai-matches'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      AI Matches
                    </button>
                    <button
                      onClick={() => setViewMode('all-jobs')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        viewMode === 'all-jobs'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      All Jobs
                    </button>
                  </div>
                </div>

                {/* Sort By */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="recent">Recent</option>
                    <option value="match-score">Match Score</option>
                    <option value="salary-high">Salary (High to Low)</option>
                    <option value="salary-low">Salary (Low to High)</option>
                    <option value="experience">Experience Level</option>
                  </select>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search jobs by keyword or role..."
                    className="w-full sm:w-64 pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>

                {/* Filters Button */}
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                  </svg>
                  <span>Filters</span>
                  <svg className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear All
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Employment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                  <select
                    value={filters.employmentType}
                    onChange={(e) => updateFilter('employmentType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">All Types</option>
                    {getUniqueValues('type').map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                  <select
                    value={filters.experienceLevel}
                    onChange={(e) => updateFilter('experienceLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">All Levels</option>
                    {getUniqueValues('level').map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Salary Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                  <select
                    value={filters.salaryRange}
                    onChange={(e) => updateFilter('salaryRange', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">All Ranges</option>
                    <option value="0-20000">₱0 - ₱20,000</option>
                    <option value="20000-40000">₱20,000 - ₱40,000</option>
                    <option value="40000-60000">₱40,000 - ₱60,000</option>
                    <option value="60000-80000">₱60,000 - ₱80,000</option>
                    <option value="80000-100000">₱80,000 - ₱100,000</option>
                    <option value="100000-999999">₱100,000+</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => updateFilter('location', e.target.value)}
                    placeholder="Enter city or province"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>
          )}

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
              <div className="text-red-500 text-lg font-medium mb-2">Error Loading Jobs</div>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={fetchJobs}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg font-medium mb-2">No Jobs Found</div>
              <p className="text-gray-600">
                {searchQuery || Object.values(filters).some(f => f) 
                  ? 'No jobs match your current filters. Try adjusting your search criteria.'
                  : 'There are currently no job postings available.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredJobs.map((job) => (
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
                        state={{ from: '/find-job' }}
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
                      onClick={() => toggleJobSaved(job.id)}
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

export default JobRecommendations;
