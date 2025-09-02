import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import JobseekerHeader from '../../components/ui/JobseekerHeader.jsx';
import Footer from '../../components/ui/Footer.jsx';
import Chatbot from '../../components/ui/Chatbot.jsx';

const AppliedJobs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Mock applied jobs data - in real app, fetch this from backend
  const appliedJobsData = [
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
      applicationStatus: "applied",
      appliedDate: "2025-01-20",
      isSaved: true,
      postedDate: "2025-01-15",
      expiresDate: "2025-02-15",
      isActive: true
    },
    {
      id: 2,
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
      applicationStatus: "interviewing",
      appliedDate: "2025-01-18",
      isSaved: true,
      postedDate: "2025-01-12",
      expiresDate: "2025-02-12",
      isActive: true
    },
    {
      id: 3,
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
      applicationStatus: "offered",
      appliedDate: "2025-01-16",
      isSaved: true,
      postedDate: "2025-01-14",
      expiresDate: "2025-02-14",
      isActive: true
    }
  ];

  // Load applied jobs on component mount
  useEffect(() => {
    const loadAppliedJobs = async () => {
      setIsLoadingJobs(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoadingJobs(false);
      }, 1000);
    };
    loadAppliedJobs();
  }, []);

  // Helper function to format salary display
  const formatSalary = (salary) => {
    if (salary.isFixed) {
      return `$${salary.min.toLocaleString()} (fixed)`;
    }
    
    const periodText = salary.period === 'hourly' ? '/hour' : 
                      salary.period === 'weekly' ? '/weekly' :
                      salary.period === 'bi-weekly' ? '/bi-weekly' :
                      salary.period === 'monthly' ? '/monthly' : '/yearly';
    
    if (salary.min === salary.max) {
      return `$${salary.min.toLocaleString()}${periodText}`;
    }
    
    return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}${periodText}`;
  };

  // Helper function to get match score color
  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'bg-blue-100 text-blue-800';
    if (score >= 80) return 'bg-blue-100 text-blue-800';
    if (score >= 70) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Helper function to get application status color and text
  const getApplicationStatusInfo = (status) => {
    switch (status) {
      case 'applied':
        return { color: 'bg-blue-100 text-blue-800', text: 'Applied' };
      case 'interviewing':
        return { color: 'bg-yellow-100 text-yellow-800', text: 'Interviewing' };
      case 'offered':
        return { color: 'bg-green-100 text-green-800', text: 'Offer Received' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-800', text: 'Not Selected' };
      default:
        return { color: 'bg-gray-100 text-gray-800', text: 'Applied' };
    }
  };

  // Pagination
  const totalPages = 3;
  const jobsPerPage = 9;
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const currentJobs = appliedJobsData.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <JobseekerHeader disabled={false} />

      <main className="flex-1 py-6 sm:py-8">
        <div className="mx-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16">
          
          {/* Page Header */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Applied Jobs
              </h1>
              <p className="text-lg text-gray-600">
                Track the status of your job applications and interviews.
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
                    placeholder="Search applied jobs by keyword or role..."
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {currentJobs.map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-lg p-4 lg:p-6 hover:shadow-md transition-shadow relative border-l-4 border-l-blue-500">
                  
                  {/* Job Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={job.companyLogo} 
                        alt={`${job.company} logo`}
                        className="w-10 h-10 rounded"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.company}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block ${getMatchScoreColor(job.matchScore)} text-sm font-medium px-3 py-1 rounded-full mb-2`}>
                        {job.matchScore}% Match
                      </span>
                      <div className={`inline-block ${getApplicationStatusInfo(job.applicationStatus).color} text-xs font-medium px-2 py-1 rounded-full`}>
                        {getApplicationStatusInfo(job.applicationStatus).text}
                      </div>
                    </div>
                  </div>

                  {/* Application Date */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      Applied on: {new Date(job.appliedDate).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Job Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <span>{formatSalary(job.salary)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M12 16h.01" />
                      </svg>
                      <span>{job.level}</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.slice(0, 4).map((skill, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Accessibility Features */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {job.accessibilityFeatures.slice(0, 3).map((feature, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Link
                        to={`/jobseeker/job/${job.id}`}
                        className="px-4 py-2 text-sm font-medium transition-colors flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>View Details</span>
                      </Link>
                      
                      <button
                        className="px-4 py-2 text-sm font-medium transition-colors flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>Contact</span>
                      </button>
                    </div>
                    
                    <button
                      className="p-2 rounded-lg transition-colors text-yellow-500 hover:text-yellow-600"
                      title="Remove from saved jobs"
                    >
                      <svg className="w-5 h-5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
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

export default AppliedJobs;
