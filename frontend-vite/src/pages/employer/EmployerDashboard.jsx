import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api.js'
import EmployerHeader from '../../components/ui/EmployerHeader.jsx';
import Footer from '../../components/ui/Footer.jsx';
import Chatbot from '../../components/ui/Chatbot.jsx';

const EmployerDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [textSize, setTextSize] = useState('normal');
  const [screenReader, setScreenReader] = useState(false);
  const [keyboardNavigation, setKeyboardNavigation] = useState(false);
  const [focusIndicators, setFocusIndicators] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fetchedData, setFetchedData] = useState(null);
  const [fetchJob, setFetchJob] = useState([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [companyStats, setCompanyStats] = useState({
    jobsPosted: 0,
    applicationsReceived: 0,
    interviewsScheduled: 0,
    profileViews: 0
  });

  // Accessibility functions
  const applyAccessibilityStyles = (darkMode, size, screenReader, keyboardNav, focusInd, reducedMotion) => {
    const root = document.documentElement;
    console.log('Applying accessibility styles:', { darkMode, size, screenReader, keyboardNav, focusInd, reducedMotion });
    
    // Dark mode
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Text size
    root.classList.remove('text-small', 'text-normal', 'text-large', 'text-extra-large');
    root.classList.add(`text-${size}`);

    // Screen reader optimizations
    if (screenReader) {
      root.classList.add('screen-reader-optimized');
    } else {
      root.classList.remove('screen-reader-optimized');
    }

    // Keyboard navigation
    if (keyboardNav) {
      root.classList.add('keyboard-navigation');
    } else {
      root.classList.remove('keyboard-navigation');
    }

    // Focus indicators
    if (focusInd) {
      root.classList.add('focus-indicators');
    } else {
      root.classList.remove('focus-indicators');
    }

    // Reduced motion
    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  };

  // Load saved accessibility preferences
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedTextSize = localStorage.getItem('textSize') || 'normal';
    const savedScreenReader = localStorage.getItem('screenReader') === 'true';
    const savedKeyboardNavigation = localStorage.getItem('keyboardNavigation') === 'true';
    const savedFocusIndicators = localStorage.getItem('focusIndicators') !== 'false';
    const savedReducedMotion = localStorage.getItem('reducedMotion') === 'true';

    setIsDarkMode(savedDarkMode);
    setTextSize(savedTextSize);
    setScreenReader(savedScreenReader);
    setKeyboardNavigation(savedKeyboardNavigation);
    setFocusIndicators(savedFocusIndicators);
    setReducedMotion(savedReducedMotion);

    // Apply initial styles
    applyAccessibilityStyles(savedDarkMode, savedTextSize, savedScreenReader, savedKeyboardNavigation, savedFocusIndicators, savedReducedMotion);
  }, []);

  // Real company profile data from backend
  const companyProfile = fetchedData ? {
    companylogo: fetchedData.companylogo || '',
    name: fetchedData.company_name || 'Company',
    industry: fetchedData.industryPreference || 'Technology',
    rating: fetchedData.rating || 0,
    profileViews: companyStats.profileViews,
    applications: companyStats.applicationsReceived,
    interviews: companyStats.interviewsScheduled,
    jobsPosted: companyStats.jobsPosted
  } : null;

  // Real job postings data from backend
  const jobPostings = fetchJob || [];

  // Mock recent applicants data
  const recentApplicants = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Senior Software Developer",
      rating: 4.8,
      avatar: "https://i.pravatar.cc/64?img=1"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "UX Designer",
      rating: 4.9,
      avatar: "https://i.pravatar.cc/64?img=2"
    }
  ];

  // Profile completion tracking based on real data
  const getProfileCompletionItems = () => {
    if (!fetchedData) return [];
    
    return [
      { text: 'Company Profile', completed: !!(fetchedData.company_name && fetchedData.company_email) },
      { text: 'Job Roles & Requirements', completed: !!(fetchedData.jobRoles_requirements && fetchedData.jobRoles_requirements.length > 0) },
      { text: 'Work Environment', completed: !!(fetchedData.work_environment && fetchedData.work_environment.length > 0) }
    ];
  };

  const items = getProfileCompletionItems();

  const totalItems = items.length;
  const completedItems = items.filter(item => item.completed).length;
  const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  const itemsLeft = totalItems - completedItems;

  const quickActions = [
    {
      title: "Manage Jobs",
      icon: "🔍",
      subtitle: "3 jobs posted",
      href: "/employer/jobs"
    },
    {
      title: "View Messages",
      icon: "📄",
      subtitle: "3 unread messages",
      href: "/employer/messages"
    },
    {
      title: "Edit Profile",
      icon: "👤",
      subtitle: "Complete missing sections",
      href: "/employer/profile"
    }
  ];

  // Fetch company profile data
  const fetchCompanyProfile = async () => {
      try {
      setIsLoadingProfile(true);
        const response = await api.get("/retrieve/dashboard");
        if (response.data.success) {
          setFetchedData(response.data.data);
        }
      } catch (error) {
      console.error("Failed to load company profile:", error);
    } finally {
      setIsLoadingProfile(false);
      }
    };

  // Fetch company job postings
  const fetchCompanyJobs = async () => {
      try {
      setIsLoadingJobs(true);
        const response = await api.get('/job/all');
        if(response.data.success) {
        setFetchJob(response.data.job || []);
        }
      } catch (error) {
        console.error("Failed to load jobs:", error);
      setFetchJob([]);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  // Fetch company statistics
  const fetchCompanyStats = async () => {
    try {
      const [jobsRes, applicationsRes] = await Promise.all([
        api.get('/job/count'),
        api.get('/api/applications/employer/count')
      ]);

      setCompanyStats({
        jobsPosted: jobsRes.data.count || 0,
        applicationsReceived: applicationsRes.data.count || 0,
        interviewsScheduled: 0, // This would come from a separate API
        profileViews: fetchedData?.profile_views || 0
      });
    } catch (error) {
      console.error('Failed to fetch company stats:', error);
    }
  };

  // Load all data on component mount
  useEffect(() => {
    fetchCompanyProfile();
    fetchCompanyJobs();
  }, []);

  // Fetch company stats when profile data is loaded
  useEffect(() => {
    if (fetchedData) {
      fetchCompanyStats();
    }
  }, [fetchedData]);

  // Show loading state while data is being fetched
  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <EmployerHeader disabled={false} />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading dashboard...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <EmployerHeader disabled={false} />

      {/* Main Content */}
      <main className="flex-1 py-4 sm:py-6 lg:py-8">
        <div className="mx-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Top Section - Full Width Company Profile */}
            <div className="lg:col-span-3 mb-4 sm:mb-6 lg:mb-3">
              {/* Company Profile Section */}
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="relative flex-shrink-0 flex justify-center sm:justify-start">
                  {/* Company Logo */}
                  {companyProfile?.companylogo ?  (
                      <img 
                        src={companyProfile.companylogo} 
                        alt="Company Logo"
                        className="w-16 h-16 rounded-full object-cover border-4 border-blue-100"
                      />
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">LOGO</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                    </>
                  )}
                  </div>
                  {/* Company Name and Rating */}
                  <div className="flex-shrink-0 text-center sm:text-left">
                    <h2 className="text-lg font-bold text-gray-900">{companyProfile.name}</h2>
                    <p className="text-sm text-gray-600">{companyProfile.industry}</p>
                    <div className="flex items-center justify-center sm:justify-start mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(companyProfile.rating) 
                                ? 'text-yellow-400' 
                                : i < companyProfile.rating 
                                  ? 'text-yellow-400' 
                                  : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-1 text-xs text-gray-600 font-medium">{companyProfile.rating}/5</span>
                    </div>
                  </div>

                  {/* Key Metrics - inline with profile */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
                   <Link to="/employer/profile" className="flex-1 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between h-full">
                        <div className="flex flex-col items-start">
                          <span className="text-xs font-medium text-gray-600 mb-1">Profile Views</span>
                          <div className="text-xl font-bold text-gray-600">{companyProfile.profileViews}</div>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                    <Link to="/employer/applications" className="flex-1 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between h-full">
                        <div className="flex flex-col items-start">
                          <span className="text-xs font-medium text-gray-600 mb-1">Applications</span>
                          <div className="text-xl font-bold text-gray-600">{companyProfile.applications}</div>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                    <Link to="/employer/applications" className="flex-1 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between h-full">
                        <div className="flex flex-col items-start">
                          <span className="text-xs font-medium text-gray-600 mb-1">Interviews</span>
                          <div className="text-xl font-bold text-gray-600">{companyProfile.interviews}</div>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                    <Link to="/employer/candidates" className="flex-1 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between h-full">
                        <div className="flex flex-col items-start">
                          <span className="text-xs font-medium text-gray-600 mb-1">Saved Jobs</span>
                          <div className="text-xl font-bold text-gray-600">{companyProfile.savedJobs}</div>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Column - Job Postings and Recent Applicants */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Your Job Postings Section */}
              <div className="bg-white rounded-lg shadow p-4 sm:p-6 ">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-0">Your Job Postings</h3>
                  <div className="flex flex-col sm:flex-row gap-10">
                    <Link to="/employer/jobs" className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base mt-2.5">
                      View All
                    </Link>
                    <Link to="/employer/post-job" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm sm:text-base">
                      + Post New Job
                    </Link>
                  </div>
                </div>

                {/* Job Postings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {fetchJob.map((job) => (
                    <div key={job.job_id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                      
                      {/* Job Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{job.jobtitle}</h3>
                        </div>
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                          job.job_status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {job.job_status}
                        </span>
                      </div>

                      {/* Job Details */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {job.employment_type}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {job.work_arrangement}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          ₱{job.salary_min} - ₱{job.salary_max} / {job.salary_type.toLowerCase()}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6z" />
                          </svg>
                          {job.experience_level}
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {job.skills_required.slice(0, 3).map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {skill.replace(/ \(.*\)$/, '')}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Accessibility Features */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {job.workplace_accessibility_features.slice(0, 3).map((feature, index) => (
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
                          {job._count.applications} applications
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Due: {job.application_deadline
                                ? new Date(job.application_deadline).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "No deadline"}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between gap-2">
                        <button
                          onClick={() => window.location.href = `/employer/job/${job.id}`}
                          className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex-1"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </button>
                        
                        <button
                          onClick={() => window.location.href = `/employer/edit-job/${job.id}`}
                          className="flex items-center justify-center p-2 text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 hover:bg-gray-200 rounded-lg"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this job posting?')) {
                              // Handle delete
                              console.log('Delete job:', job.id);
                            }
                          }}
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
              </div>

              {/* Recent Applicants Section */}
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Recent Applicants</h3>
                <div className="space-y-4">
                  {recentApplicants.map((applicant) => (
                    <div key={applicant.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img
                          src={applicant.avatar}
                          alt={applicant.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm sm:text-base">{applicant.name}</h4>
                          <p className="text-xs sm:text-sm text-gray-600">{applicant.role}</p>
                          <div className="flex items-center mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="ml-1 text-xs text-gray-600 font-medium">{applicant.rating}/5</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/employer/applicant/${applicant.id}`}
                          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors"
                        >
                          Review
                        </Link>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Profile Completion, Quick Actions, Accessibility */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-6">
              {/* Profile Completion */}
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Profile Completion</h3>
                <div className="mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{progressPercentage}% Complete</span>
                    <span className="text-xs sm:text-sm text-gray-500">{itemsLeft} item{itemsLeft !== 1 ? 's' : ''} left</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {item.completed ? (
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                      )}
                      <span className="text-xs sm:text-sm text-gray-700">{item.text}</span>
                    </div>
                  ))}
                  {/* {profileCompletion.completed.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                  {profileCompletion.remaining.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                      <span className="text-xs sm:text-sm text-gray-500">{item}</span>
                    </div>
                  ))} */}
                </div>
                
                <Link 
                  to="/employer/profile"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm sm:text-base text-center block"
                >
                  Complete Your Profile
                </Link>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <Link
                      key={index}
                      to={action.href}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-xl sm:text-2xl">{action.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm sm:text-base">{action.title}</div>
                        <div className="text-xs sm:text-sm text-gray-500">{action.subtitle}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Accessibility Tools */}
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Accessibility Tools</h3>
                <div className="space-y-4">
                  {/* Dark Mode */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Dark Mode</span>
                    <button
                      onClick={() => {
                        const newDarkMode = !isDarkMode;
                        setIsDarkMode(newDarkMode);
                        localStorage.setItem('darkMode', newDarkMode.toString());
                        applyAccessibilityStyles(newDarkMode, textSize, screenReader, keyboardNavigation, focusIndicators, reducedMotion);
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isDarkMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Text Size */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Large Text</span>
                    <button
                      onClick={() => {
                        const newTextSize = textSize === 'normal' ? 'large' : 'normal';
                        setTextSize(newTextSize);
                        localStorage.setItem('textSize', newTextSize);
                        applyAccessibilityStyles(isDarkMode, newTextSize, screenReader, keyboardNavigation, focusIndicators, reducedMotion);
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        textSize === 'large' ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          textSize === 'large' ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Screen Reader Optimizations */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Screen Reader Optimized</span>
                    <button
                      onClick={() => {
                        const newScreenReader = !screenReader;
                        setScreenReader(newScreenReader);
                        localStorage.setItem('screenReader', newScreenReader.toString());
                        applyAccessibilityStyles(isDarkMode, textSize, newScreenReader, keyboardNavigation, focusIndicators, reducedMotion);
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        screenReader ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          screenReader ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Enhanced Keyboard Navigation */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Enhanced Keyboard Navigation</span>
                    <button
                      onClick={() => {
                        const newKeyboardNavigation = !keyboardNavigation;
                        setKeyboardNavigation(newKeyboardNavigation);
                        localStorage.setItem('keyboardNavigation', newKeyboardNavigation.toString());
                        applyAccessibilityStyles(isDarkMode, textSize, screenReader, newKeyboardNavigation, focusIndicators, reducedMotion);
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        keyboardNavigation ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          keyboardNavigation ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Enhanced Focus Indicators */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Enhanced Focus Indicators</span>
                    <button
                      onClick={() => {
                        const newFocusIndicators = !focusIndicators;
                        setFocusIndicators(newFocusIndicators);
                        localStorage.setItem('focusIndicators', newFocusIndicators.toString());
                        applyAccessibilityStyles(isDarkMode, textSize, screenReader, keyboardNavigation, newFocusIndicators, reducedMotion);
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        focusIndicators ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          focusIndicators ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Reduced Motion */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Reduced Motion</span>
                    <button
                      onClick={() => {
                        const newReducedMotion = !reducedMotion;
                        setReducedMotion(newReducedMotion);
                        localStorage.setItem('reducedMotion', newReducedMotion.toString());
                        applyAccessibilityStyles(isDarkMode, textSize, screenReader, keyboardNavigation, focusIndicators, newReducedMotion);
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        reducedMotion ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          reducedMotion ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

export default EmployerDashboard;
