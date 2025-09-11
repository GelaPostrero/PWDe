import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../utils/api.js'
import JobseekerHeader from '../../components/ui/JobseekerHeader.jsx';
import Footer from '../../components/ui/Footer.jsx';
import Chatbot from '../../components/ui/Chatbot.jsx';

const JobseekerDashboard = () => {
  const navigate = useNavigate();
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(true);
  const [aiRecommendedJobs, setAiRecommendedJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [fetchedData, setFetchedData] = useState([]);

  // Mock data - replace with real data from backend
  const userProfile = {
    name: fetchedData.fullname,
    role: fetchedData.professional_role,
    rating: fetchedData.rating,
    profileViews: fetchedData.profile_views,
    applications: fetchedData.applications,
    interviews: fetchedData.interviews,
    savedJobs: fetchedData.saved_jobs
  };

  // Structured job data model - matches your backend schema
  const jobDataStructure = {
    // Basic job info
    id: "unique_job_id",
    title: "Job Title",
    company: "Company Name",
    companyLogo: "logo_url",
    
    // Job details
    type: "Full-time|Part-time|Contract|Freelance",
    location: "Remote|On-site|Hybrid",
    salary: {
      min: 1000,
      max: 5000,
      currency: "USD",
      period: "weekly|monthly|yearly|hourly",
      isFixed: false
    },
    level: "Entry|Mid|Senior|Lead|Executive",
    
    // Match scoring (AI-generated)
    matchScore: 95, // 0-100
    matchReasons: ["Skills match", "Experience level", "Accessibility needs"],
    
    // Skills and requirements
    requiredSkills: ["React", "TypeScript", "UI/UX"],
    preferredSkills: ["Figma", "Accessibility"],
    experienceYears: 3,
    
    // Accessibility features
    accessibilityFeatures: [
      "Screen Reader Optimized",
      "Flexible Hours", 
      "Remote Options",
      "Accessible Office"
    ],
    
    // Company accessibility info
    companyAccessibility: {
      hasAccessibilityPolicy: true,
      providesAccommodations: true,
      inclusiveHiring: true
    },
    
    // Application status
    applicationStatus: "not_applied|applied|interviewing|offered|rejected",
    isSaved: false,
    appliedDate: null,
    
    // Metadata
    postedDate: "2025-01-15",
    expiresDate: "2025-02-15",
    isActive: true
  };

  // Helper function to calculate match score based on user profile
  const calculateMatchScore = (job, userProfile) => {
    let score = 0;
    
    // Skills match (40% of total score)
    const userSkills = userProfile.skills || [];
    const skillMatches = job.requiredSkills.filter(skill => 
      userSkills.includes(skill)
    ).length;
    score += (skillMatches / job.requiredSkills.length) * 40;
    
    // Experience level match (25% of total score)
    const experienceDiff = Math.abs(job.experienceYears - (userProfile.experienceYears || 0));
    if (experienceDiff <= 1) score += 25;
    else if (experienceDiff <= 3) score += 15;
    else if (experienceDiff <= 5) score += 10;
    
    // Accessibility needs match (20% of total score)
    const userAccessibility = userProfile.accessibilityNeeds || [];
    const accessibilityMatches = job.accessibilityFeatures.filter(feature =>
      userAccessibility.includes(feature)
    ).length;
    score += (accessibilityMatches / job.accessibilityFeatures.length) * 20;
    
    // Location preference match (15% of total score)
    if (job.location === userProfile.preferredLocation) score += 15;
    
    return Math.round(score);
  };

  // Mock function to fetch jobs from backend
  const fetchRecommendedJobs = async () => {
    try {
      setIsLoadingJobs(true);
      
      // This will be replaced with actual API call
      // const response = await fetch('/api/jobs/recommended', {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // const jobs = await response.json();
      
      // For now, using mock data
      const mockJobs = [
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
        }
      ];

      // Calculate match scores based on user profile (when you have user data)
      // mockJobs.forEach(job => {
      //   job.matchScore = calculateMatchScore(job, userProfile);
      // });

      setAiRecommendedJobs(mockJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  // Load jobs on component mount
  useEffect(() => {
    fetchRecommendedJobs();
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
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-blue-100 text-blue-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Job action handlers - these will integrate with your backend
  const toggleJobSaved = async (jobId) => {
    try {
      // API call to toggle saved status
      // const response = await fetch(`/api/jobs/${jobId}/toggle-saved`, {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      
      // Update local state
      setAiRecommendedJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, isSaved: !job.isSaved } : job
      ));
      
      console.log(`Toggling saved state for job ${jobId}`);
    } catch (error) {
      console.error('Error toggling job saved status:', error);
    }
  };

  const applyToJob = async (jobId) => {
    try {
      // API call to apply to job
      // const response = await fetch(`/api/jobs/${jobId}/apply`, {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      
      // Update local state
      setAiRecommendedJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, applicationStatus: 'applied' } : job
      ));
      
      console.log(`Applied to job ${jobId}`);
    } catch (error) {
      console.error('Error applying to job:', error);
    }
  };

  const quickActions = [
    {
      title: "Update Resume",
      icon: "📄",
      subtitle: "Last updated 2 weeks ago",
      href: "/resume"
    },
    {
      title: "Browse Jobs",
      icon: "🔍",
      subtitle: "120+ new matches",
      href: "/find-job"
    },
    {
      title: "View Applications",
      icon: "📋",
      subtitle: "3 in progress",
      href: "/jobseeker/applications"
    },
    {
      title: "Edit Profile",
      icon: "👤",
      subtitle: "Complete missing sections",
      href: "/jobseeker/profile"
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/retrieve/dashboard');
        if(response.data.success) {
          setFetchedData(response.data.data);
        }
      } catch(error) {
        console.error("Failed to load profile:", error);
      }
    };
    fetchData();
  }, []);

  const items = [
    { text: 'Basic information', completed: fetchedData.basic_information },
    { text: 'Professional experience', completed: fetchedData.workexperience },
    { text: 'Education', completed: fetchedData.education },
    { text: 'Add portfolio items', completed: fetchedData.portfolio_items },
    { text: 'Complete skills assessment', completed: fetchedData.skills },
    { text: 'Set accessibility preferences', completed: fetchedData.set_accessibility_preferences }
  ];

  const totalItems = items.length;
  const completedItems = items.filter(item => item.completed).length;
  const progressPercentage = Math.round((completedItems / totalItems) * 100);
  const itemsLeft = totalItems - completedItems;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <JobseekerHeader disabled={false} />

      {/* Main Content */}
      <main className="flex-1 py-4 sm:py-6 lg:py-8">
        <div className="mx-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16">
          
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Top Section - Full Width Profile */}
            <div className="lg:col-span-3 mb-4 sm:mb-6 lg:mb-3">
              {/* User Profile Section */}
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  {/* Profile Avatar */}
                  <div className="relative flex-shrink-0 flex justify-center sm:justify-start">
                    {fetchedData.profile_picture ? (
                      <img
                        src={fetchedData.profile_picture}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover border-4 border-blue-100"
                      />
                    ): (
                      <img
                        src="https://i.pravatar.cc/80?img=5"
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover border-4 border-blue-100"
                      />
                    )}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>

                  {/* Name and Rating */}
                  <div className="flex-shrink-0 text-center sm:text-left">
                    <h2 className="text-lg font-bold text-gray-900">{userProfile.name}</h2>
                    <p className="text-sm text-gray-600">{userProfile.role}</p>
                    <div className="flex items-center justify-center sm:justify-start mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(userProfile.rating) 
                                ? 'text-yellow-400' 
                                : i < userProfile.rating 
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
                      <span className="ml-1 text-xs text-gray-600 font-medium">{userProfile.rating}/5</span>
                    </div>
                  </div>

                  {/* Key Metrics - inline with profile */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
                   <Link to="/jobseeker/profile" className="flex-1 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between h-full">
                        <div className="flex flex-col items-start">
                          <span className="text-xs font-medium text-gray-600 mb-1">Profile Views</span>
                          <div className="text-xl font-bold text-gray-600">{userProfile.profileViews}</div>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                    <Link to="/jobseeker/applications" className="flex-1 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between h-full">
                        <div className="flex flex-col items-start">
                          <span className="text-xs font-medium text-gray-600 mb-1">Applications</span>
                          <div className="text-xl font-bold text-gray-600">{userProfile.applications}</div>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                    <Link to="/jobseeker/applications" className="flex-1 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between h-full">
                        <div className="flex flex-col items-start">
                          <span className="text-xs font-medium text-gray-600 mb-1">Interviews</span>
                          <div className="text-xl font-bold text-gray-600">{userProfile.interviews}</div>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                    <Link to="/find-job/saved" className="flex-1 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between h-full">
                        <div className="flex flex-col items-start">
                          <span className="text-xs font-medium text-gray-600 mb-1">Saved Jobs</span>
                          <div className="text-xl font-bold text-gray-600">{userProfile.savedJobs}</div>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Column - AI Jobs */}
            <div className="lg:col-span-2">
              {/* AI Recommended Jobs Section */}
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-0">AI Recommended Jobs</h3>
                  <Link to="/find-job" className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base">
                    View All
                  </Link>
                </div>

                {/* Search Bar */}
                <div className="relative mb-4 sm:mb-6">
                  <input
                    type="text"
                    placeholder="Search jobs by keyword or role..."
                    className="w-full pl-4 pr-12 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>

                {/* Job Grid */}
                {isLoadingJobs ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="border border-gray-200 rounded-lg p-3 sm:p-4 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded mb-4"></div>
                        <div className="h-3 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {aiRecommendedJobs.map((job) => (
                      <div key={job.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow relative border-l-4 border-l-blue-500">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                            <img 
                              src={job.companyLogo} 
                              alt={`${job.company} logo`}
                              className="w-8 h-8 rounded"
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
                          <p className="text-xs sm:text-sm font-medium text-gray-900">{formatSalary(job.salary)}</p>
                          <p className="text-xs sm:text-sm text-gray-600">{job.level}</p>
                        </div>

                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1 mb-2">
                            {job.requiredSkills.slice(0, 3).map((skill, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {job.accessibilityFeatures.slice(0, 2).map((feature, index) => (
                              <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex space-x-2">
                            <Link
                              to={`/jobseeker/job/${job.id}`}
                              className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                            >
                              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              <span>View Details</span>
                            </Link>
                            
                            {job.applicationStatus === 'not_applied' ? (
                              <Link
                                to={`/jobseeker/submit-application/${job.id}`}
                                className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                                <span>Apply Now</span>
                              </Link>
                            ) : (
                              <button
                                disabled
                                className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium bg-green-100 text-green-800 cursor-not-allowed"
                              >
                                <span>Applied</span>
                              </button>
                            )}
                          </div>
                          
                          <button
                            onClick={() => toggleJobSaved(job.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              job.isSaved 
                                ? 'text-yellow-500 hover:text-yellow-600' 
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
                    <div key={index} className="flex items-center space-x-3">
                      {item.completed ? (
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                      )}
                      <span className={`text-sm ${item.completed ? 'text-gray-900' : 'text-gray-600'}`}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Link 
                  to="/jobseeker/profile"
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
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">High Contrast</span>
                    <button
                      onClick={() => setHighContrast(!highContrast)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        highContrast ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          highContrast ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Large Text</span>
                    <button
                      onClick={() => setLargeText(!largeText)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        largeText ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          largeText ? 'translate-x-6' : 'translate-x-1'
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
        showNotification={false} 
        notificationCount={3}
      />
    </div>
  );
};

export default JobseekerDashboard;