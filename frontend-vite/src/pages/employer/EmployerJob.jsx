import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EmployerHeader from '../../components/ui/EmployerHeader.jsx';
import Footer from '../../components/ui/Footer.jsx';
import Chatbot from '../../components/ui/Chatbot.jsx';

const EmployerJob = () => {
  // State management
  const [activeTab, setActiveTab] = useState('Posted');
  const [sortBy, setSortBy] = useState('Recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Mock job data - ready for backend integration
  const [jobPostings, setJobPostings] = useState([
    {
      id: 1,
      title: "Senior Software Engineer",
      status: "Active",
      type: "Full-time",
      location: "Remote",
      salary: "P50,000 - P70,000",
      period: "monthly",
      level: "Senior Level",
      skills: ["React", "Node.js", "TypeScript"],
      accessibilityFeatures: ["Screen Reader Optimized", "Flexible Hours"],
      applications: 15,
      dueDate: "Dec 15",
      postedDate: "2024-12-01"
    },
    {
      id: 2,
      title: "UX/UI Designer",
      status: "Active",
      type: "Full-time",
      location: "Hybrid",
      salary: "P50,000 - P70,000",
      period: "semi-monthly",
      level: "Mid Level",
      skills: ["Figma", "Adobe XD", "Prototyping"],
      accessibilityFeatures: ["Screen Reader Optimized", "Flexible Hours"],
      applications: 8,
      dueDate: "Dec 20",
      postedDate: "2024-11-28"
    },
    {
      id: 3,
      title: "Customer Support Specialist",
      status: "Closed",
      type: "Part-time",
      location: "On-Site",
      salary: "P50,000 - P70,000",
      period: "hourly",
      level: "Mid Level",
      skills: ["Communication", "Problem Solving"],
      accessibilityFeatures: ["Accessible Office"],
      applications: 8,
      dueDate: "Dec 10",
      postedDate: "2024-11-25"
    },
    {
      id: 4,
      title: "Frontend Developer",
      status: "Active",
      type: "Full-time",
      location: "Remote",
      salary: "P45,000 - P65,000",
      period: "monthly",
      level: "Mid Level",
      skills: ["React", "JavaScript", "CSS"],
      accessibilityFeatures: ["Screen Reader Optimized", "Flexible Hours"],
      applications: 12,
      dueDate: "Dec 18",
      postedDate: "2024-11-30"
    },
    {
      id: 5,
      title: "Backend Developer",
      status: "Active",
      type: "Full-time",
      location: "Hybrid",
      salary: "P55,000 - P75,000",
      period: "monthly",
      level: "Senior Level",
      skills: ["Python", "Django", "PostgreSQL"],
      accessibilityFeatures: ["Screen Reader Optimized", "Flexible Hours"],
      applications: 9,
      dueDate: "Dec 22",
      postedDate: "2024-12-02"
    },
    {
      id: 6,
      title: "Data Analyst",
      status: "Active",
      type: "Full-time",
      location: "Remote",
      salary: "P40,000 - P60,000",
      period: "monthly",
      level: "Mid Level",
      skills: ["Python", "SQL", "Tableau"],
      accessibilityFeatures: ["Screen Reader Optimized", "Flexible Hours"],
      applications: 6,
      dueDate: "Dec 25",
      postedDate: "2024-12-03"
    },
    {
      id: 7,
      title: "Product Manager",
      status: "Active",
      type: "Full-time",
      location: "Hybrid",
      salary: "P60,000 - P80,000",
      period: "monthly",
      level: "Senior Level",
      skills: ["Product Strategy", "Agile", "Analytics"],
      accessibilityFeatures: ["Screen Reader Optimized", "Flexible Hours"],
      applications: 11,
      dueDate: "Dec 28",
      postedDate: "2024-12-04"
    },
    {
      id: 8,
      title: "Marketing Specialist",
      status: "Active",
      type: "Part-time",
      location: "Remote",
      salary: "P30,000 - P45,000",
      period: "monthly",
      level: "Mid Level",
      skills: ["Digital Marketing", "SEO", "Social Media"],
      accessibilityFeatures: ["Screen Reader Optimized", "Flexible Hours"],
      applications: 7,
      dueDate: "Dec 30",
      postedDate: "2024-12-05"
    },
    {
      id: 9,
      title: "DevOps Engineer",
      status: "Active",
      type: "Full-time",
      location: "Remote",
      salary: "P55,000 - P75,000",
      period: "monthly",
      level: "Senior Level",
      skills: ["AWS", "Docker", "Kubernetes"],
      accessibilityFeatures: ["Screen Reader Optimized", "Flexible Hours"],
      applications: 5,
      dueDate: "Jan 5",
      postedDate: "2024-12-06"
    },
    {
        id: 10,
        title: "Cleaner",
        status: "Active",
        type: "Full-time",
        location: "Remote",
        salary: "P55,000 - P75,000",
        period: "monthly",
        level: "Senior Level",
        skills: ["Cleaning :)"],
        accessibilityFeatures: ["Screen Reader Optimized", "Flexible Hours"],
        applications: 5,
        dueDate: "Jan 5",
        postedDate: "2024-12-06"
      },
      {
        id: 11,
        title: "Cook",
        status: "Active",
        type: "Full-time",
        location: "Remote",
        salary: "P55,000 - P75,000",
        period: "monthly",
        level: "Senior Level",
        skills: ["Cooking :)"],
        accessibilityFeatures: ["Screen Reader Optimized", "Flexible Hours"],
        applications: 5,
        dueDate: "Jan 5",
        postedDate: "2024-12-06"
      }
  ]);

  // API Functions - Ready for backend integration
  const api = {
    // Fetch job postings
    fetchJobPostings: async (filters = {}) => {
      try {
        setIsLoading(true);
        
        // TODO: Replace with actual API call
        // const response = await fetch('/api/employer/jobs', {
        //   method: 'GET',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(filters)
        // });
        // const data = await response.json();
        
        // Mock API response
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return jobPostings;
      } catch (err) {
        console.error('Error fetching job postings:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },

    // Delete job posting
    deleteJob: async (jobId) => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/employer/jobs/${jobId}`, {
        //   method: 'DELETE',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //     'Content-Type': 'application/json'
        //   }
        // });
        
        // Mock API response
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Update local state
        setJobPostings(prev => prev.filter(job => job.id !== jobId));
        
        return { success: true };
      } catch (err) {
        console.error('Error deleting job:', err);
        throw err;
      }
    },

    // Update job status
    updateJobStatus: async (jobId, status) => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/employer/jobs/${jobId}/status`, {
        //   method: 'PUT',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({ status })
        // });
        
        // Mock API response
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Update local state
        setJobPostings(prev => prev.map(job => 
          job.id === jobId ? { ...job, status } : job
        ));
        
        return { success: true };
      } catch (err) {
        console.error('Error updating job status:', err);
        throw err;
      }
    }
  };

  // Filter and sort jobs based on current state
  const getFilteredAndSortedJobs = () => {
    let filtered = jobPostings;

    // Filter by tab
    if (activeTab === 'Active') {
      filtered = filtered.filter(job => job.status === 'Active');
    } else if (activeTab === 'Closed') {
      filtered = filtered.filter(job => job.status === 'Closed');
    }
    // 'Posted' shows all jobs

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort jobs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'Recent':
          return new Date(b.postedDate) - new Date(a.postedDate);
        case 'Oldest':
          return new Date(a.postedDate) - new Date(b.postedDate);
        case 'Most Applications':
          return b.applications - a.applications;
        case 'Least Applications':
          return a.applications - b.applications;
        case 'Title A-Z':
          return a.title.localeCompare(b.title);
        case 'Title Z-A':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return filtered;
  };

  // Pagination
  const itemsPerPage = 6;
  const filteredJobs = getFilteredAndSortedJobs();
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  // Event handlers
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
    setShowSortDropdown(false);
    setCurrentPage(1); // Reset to first page when changing sort
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await api.deleteJob(jobId);
        // Job will be removed from state by the API function
      } catch (err) {
        alert('Failed to delete job posting. Please try again.');
      }
    }
  };

  const handleEditJob = (jobId) => {
    // Navigate to edit job page
    window.location.href = `/employer/edit-job/${jobId}`;
  };

  const handleViewJob = (jobId) => {
    // Navigate to job details page
    window.location.href = `/employer/job/${jobId}`;
  };

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        await api.fetchJobPostings();
      } catch (err) {
        // Error already handled in API function
      }
    };
    
    initializeData();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.sort-dropdown-container')) {
        setShowSortDropdown(false);
      }
      if (!event.target.closest('.filters-dropdown-container')) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <EmployerHeader disabled={false} />

      {/* Main Content */}
      <main className="flex-1 py-4 sm:py-6 lg:py-8">
        <div className="mx-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16">
          
          {/* Page Header */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl sm:text-2xl font-bold text-gray-900 mb-2">Job Postings</h1>
                <p className="text-gray-600">Manage your job listings and track applications</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Link
                  to="/employer/post-job"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Post New Job
                </Link>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              
              {/* View Tabs */}
              <div className="flex items-center space-x-3">
                <h2 className="text-sm font-medium text-gray-700">View:</h2>
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                  {['Posted', 'Active', 'Closed'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => handleTabChange(tab)}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search and Sort Controls */}
              <div className="flex flex-col sm:flex-row gap-3 flex-1 lg:justify-end">
                
                {/* Sort Dropdown */}
                <div className="relative sort-dropdown-container">
                  <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm text-gray-700">Sort by: {sortBy}</span>
                    <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showSortDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      {['Recent', 'Oldest', 'Most Applications', 'Least Applications', 'Title A-Z', 'Title Z-A'].map((option) => (
                        <button
                          key={option}
                          onClick={() => handleSortChange(option)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Search Bar */}
                <div className="relative flex-1 lg:max-w-md">
                  <input
                    type="text"
                    placeholder="Search jobs by keyword or role..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Filters Button */}
                <div className="relative filters-dropdown-container">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm text-gray-700">Filters</span>
                    <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showFilters && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
                      <h4 className="font-medium text-gray-900 mb-3">Filter Options</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                            <option>All Types</option>
                            <option>Full-time</option>
                            <option>Part-time</option>
                            <option>Contract</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                            <option>All Locations</option>
                            <option>Remote</option>
                            <option>Hybrid</option>
                            <option>On-Site</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                            <option>All Levels</option>
                            <option>Entry Level</option>
                            <option>Mid Level</option>
                            <option>Senior Level</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Job Postings Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                  
                                        {/* Job Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        </div>
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                          job.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {job.status}
                        </span>
                      </div>

                  {/* Job Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {job.type}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      ₱{job.salary} / {job.period}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6z" />
                      </svg>
                      {job.level}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {job.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Accessibility Features */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {job.accessibilityFeatures.map((feature, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Application Info */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {job.applications} applications
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Due: {job.dueDate}
                    </div>
                  </div>

                                 {/* Action Buttons */}
                      <div className="flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleViewJob(job.id)}
                          className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex-1"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </button>
                        
                        <button
                          onClick={() => handleEditJob(job.id)}
                          className="flex items-center justify-center p-2 text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 hover:bg-gray-200 rounded-lg"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="flex items-center justify-center p-2 text-gray-400 hover:text-red-600 transition-colors bg-gray-100 hover:bg-red-50 rounded-lg"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
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
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* AI Chatbot */}
      <Chatbot 
        position="right" 
        showNotification={true} 
        notificationCount={3}
      />
    </div>
  );
};

export default EmployerJob;
