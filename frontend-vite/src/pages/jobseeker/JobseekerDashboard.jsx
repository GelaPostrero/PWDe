import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../utils/api.js'
import JobseekerHeader from '../../components/ui/JobseekerHeader.jsx';
import Footer from '../../components/ui/Footer.jsx';
import Chatbot from '../../components/ui/Chatbot.jsx';

const JobseekerDashboard = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [textSize, setTextSize] = useState('normal');
  const [screenReader, setScreenReader] = useState(false);
  const [keyboardNavigation, setKeyboardNavigation] = useState(false);
  const [focusIndicators, setFocusIndicators] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [aiRecommendedJobs, setAiRecommendedJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [fetchedData, setFetchedData] = useState(null);
  const [userStats, setUserStats] = useState({
    applications: 0,
    interviews: 0,
    savedJobs: 0,
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

  // Real user profile data from backend
  const userProfile = fetchedData ? {
    name: fetchedData.fullname || `${fetchedData.firstname || ''} ${fetchedData.middlename || ''} ${fetchedData.lastname || ''}`.trim().replace(/\s+/g, ' ') || 'User',
    role: fetchedData.professional_role || 'Professional',
    rating: fetchedData.rating,
    profileViews: userStats.profileViews,
    applications: userStats.applications,
    interviews: userStats.interviews,
    savedJobs: userStats.savedJobs
  } : null;

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

  // Mock AI recommended jobs data
  const fetchRecommendedJobs = async () => {
    try {
      setIsLoadingJobs(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock AI recommended jobs data
      const mockRecommendedJobs = [
        {
          id: 1,
          job_id: 1,
          title: "Frontend Developer",
          jobtitle: "Frontend Developer",
          company: "TechCorp Solutions",
          companyLogo: "https://via.placeholder.com/40",
          type: "Full-time",
          employment_type: "Full-time",
          location: "Toronto, ON",
          location_city: "Toronto",
          salary: "$60,000 - $80,000",
          salary_min: 60000,
          salary_max: 80000,
          level: "Mid-level",
          experience_level: "Mid-level",
          matchScore: 85,
          matchReasons: ["Strong skills match", "Location preference", "Experience level"],
          requiredSkills: ["React", "JavaScript", "CSS"],
          skills_required: ["React", "JavaScript", "CSS"],
          accessibilityFeatures: ["Wheelchair accessible", "Screen reader friendly"],
          workplace_accessibility_features: ["Wheelchair accessible", "Screen reader friendly"]
        },
        {
          id: 2,
          job_id: 2,
          title: "UX Designer",
          jobtitle: "UX Designer", 
          company: "Design Studio Inc",
          companyLogo: "https://via.placeholder.com/40",
          type: "Contract",
          employment_type: "Contract",
          location: "Vancouver, BC",
          location_city: "Vancouver",
          salary: "$50,000 - $70,000",
          salary_min: 50000,
          salary_max: 70000,
          level: "Entry-level",
          experience_level: "Entry-level",
          matchScore: 72,
          matchReasons: ["Skills alignment", "Remote work option"],
          requiredSkills: ["Figma", "User Research", "Prototyping"],
          skills_required: ["Figma", "User Research", "Prototyping"],
          accessibilityFeatures: ["Flexible hours", "Remote work"],
          workplace_accessibility_features: ["Flexible hours", "Remote work"]
        },
        {
          id: 3,
          job_id: 3,
          title: "Data Analyst",
          jobtitle: "Data Analyst",
          company: "Analytics Pro",
          companyLogo: "https://via.placeholder.com/40",
          type: "Full-time",
          employment_type: "Full-time",
          location: "Montreal, QC",
          location_city: "Montreal",
          salary: "$55,000 - $75,000",
          salary_min: 55000,
          salary_max: 75000,
          level: "Mid-level",
          experience_level: "Mid-level",
          matchScore: 68,
          matchReasons: ["Technical skills match", "Growth opportunity"],
          requiredSkills: ["Python", "SQL", "Excel"],
          skills_required: ["Python", "SQL", "Excel"],
          accessibilityFeatures: ["Ergonomic workspace", "Assistive technology"],
          workplace_accessibility_features: ["Ergonomic workspace", "Assistive technology"]
        }
      ];
      
      setAiRecommendedJobs(mockRecommendedJobs);
    } catch (error) {
      console.error('Error loading mock recommended jobs:', error);
      setAiRecommendedJobs([]);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const response = await api.get('/retrieve/profile');
      if (response.data.success) {
        setFetchedData(response.data.data);
      } else {
        console.error('Profile fetch failed:', response.data);
        setFetchedData(null);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setFetchedData(null);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Fetch user statistics
  const fetchUserStats = async () => {
    try {
      const [applicationsRes, savedJobsRes] = await Promise.all([
        api.get('/api/applications/count'),
        api.get('/api/saved-jobs/count')
      ]);

      console.log("Saved jobs response:", savedJobsRes.data);

      setUserStats({
        applications: applicationsRes.data.data.total || 0,
        savedJobs: savedJobsRes.data.data.count || 0,
        profileViews: fetchedData?.profile_views || 0,
        interviews: 0 // This would come from a separate API
      });
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  // Load all data on component mount
  useEffect(() => {
    fetchUserProfile();
    fetchRecommendedJobs();
  }, []);

  // Fetch user stats when profile data is loaded
  useEffect(() => {
    if (fetchedData) {
      fetchUserStats();
    }
  }, [fetchedData]);

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

  // Profile completion tracking based on real data - matches profile page logic
  const getProfileCompletionItems = () => {
    if (!fetchedData) return [];
    
    return [
      { text: 'Basic information', completed: !!fetchedData.basic_information },
      { text: 'Professional summary', completed: !!fetchedData.professional_summary_completed },
      { text: 'Professional experience', completed: !!fetchedData.workexperience },
      { text: 'Education', completed: !!fetchedData.education },
      { text: 'Add portfolio items', completed: !!fetchedData.portfolio_items },
      { text: 'Complete skills assessment', completed: !!(fetchedData.skills && fetchedData.skills.length > 0) },
      { text: 'Set accessibility preferences', completed: !!fetchedData.set_accessibility_preferences }
    ];
  };

  const items = getProfileCompletionItems();
  const totalItems = items.length;
  const completedItems = items.filter(item => item.completed).length;
  const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  const itemsLeft = totalItems - completedItems;

  // Show loading state while data is being fetched
  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <JobseekerHeader disabled={false} />
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

  // Show error state if profile data failed to load
  if (!fetchedData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <JobseekerHeader disabled={false} />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Profile</h2>
                <p className="text-gray-600 mb-4">There was an error loading your profile data.</p>
                <button 
                  onClick={fetchUserProfile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
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
      <JobseekerHeader disabled={false} />

      {/* Main Content */}
      <main className="flex-1 py-4 sm:py-6 lg:py-8">
        <div className="max-full ml-8 mr-8 px-4 sm:px-6 lg:px-8">
          
          {/* Combined Profile and Key Metrics Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              {/* User Profile Section */}
              <div className="flex items-center space-x-4 flex-1">
                {/* Profile Avatar */}
                <div className="relative flex-shrink-0">
                  {fetchedData?.profile_picture ? (
                    <img
                      src={fetchedData.profile_picture}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ): (
                    <img
                      src="https://i.pravatar.cc/80?img=5"
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h2
                      className="text-xl font-bold text-gray-900"
                      title={userProfile.name}
                    >
                      {userProfile.name}
                    </h2>
                    {/* Verification Status */}
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                      fetchedData?.is_verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {fetchedData?.is_verified ? (
                        <>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Verified</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <span>Unverified</span>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{userProfile.role}</p>
                  <div className="flex items-center mt-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(userProfile.rating || 4.8)
                              ? 'text-yellow-400'
                              : i < (userProfile.rating || 4.8)
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
                    <span className="ml-2 text-sm text-gray-600 font-medium">{userProfile.rating || 4.8}/5</span>
                  </div>
                </div>
              </div>

              {/* Key Metrics - Professional Button Layout */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full lg:w-auto lg:min-w-[900px]">
                <Link to="/jobseeker/profile" className="bg-gray-50 hover:bg-gray-100 rounded-xl p-4 text-left transition-colors w-full">
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-sm font-medium text-gray-600 truncate">Profile Views</span>
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div className="text-xl font-medium text-gray-900 leading-none truncate">{userProfile.profileViews || 0}</div>
                </Link>

                <Link to="/jobseeker/applications" className="bg-gray-50 hover:bg-gray-100 rounded-xl p-4 text-left transition-colors w-full">
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-sm font-medium text-gray-600 truncate">Applications</span>
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="text-xl font-medium text-gray-900 leading-none truncate">{userProfile.applications || 0}</div>
                </Link>

                <Link to="/jobseeker/applications" className="bg-gray-50 hover:bg-gray-100 rounded-xl p-4 text-left transition-colors w-full">
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-sm font-medium text-gray-600 truncate">Interviews</span>
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-xl font-medium text-gray-900 leading-none truncate">{userProfile.interviews || 0}</div>
                </Link>

                <Link to="/find-job/saved" className="bg-gray-50 hover:bg-gray-100 rounded-xl p-4 text-left transition-colors w-full">
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-sm font-medium text-gray-600 truncate">Saved Jobs</span>
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div className="text-xl font-medium text-gray-900 leading-none truncate">{userProfile.savedJobs || 0}</div>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* Left Column - AI Jobs */}
            <div className="lg:col-span-3">
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
                      <div key={job.job_id || job.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow relative border-l-4 border-l-blue-500">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                            <img 
                              src={job.employer?.profile_picture || job.companyLogo || "https://via.placeholder.com/40"} 
                              alt={`${job.employer?.company_name || job.company} logo`}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{job.jobtitle || job.title}</h4>
                              <p className="text-xs sm:text-sm text-gray-600">{job.employer?.company_name || job.company}</p>
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
                            {job.employment_type || job.type} • {job.location_city || job.location}
                          </p>
                          <p className="text-xs sm:text-sm font-medium text-gray-900">
                            {job.salary_min && job.salary_max ? 
                              `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}` : 
                              formatSalary(job.salary)
                            }
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600">{job.experience_level || job.level}</p>
                        </div>

                        <div className="mb-3">
                          <div className="flex gap-1 mb-2 overflow-hidden">
                            {(job.skills_required || job.requiredSkills || []).slice(0, 4).map((skill, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded whitespace-nowrap flex-shrink-0">
                                {skill}
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-1 overflow-hidden">
                            {(job.workplace_accessibility_features || job.accessibilityFeatures || []).slice(0, 3).map((feature, index) => (
                              <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded whitespace-nowrap flex-shrink-0">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex space-x-2">
                            <Link
                              to={`/jobseeker/job/${job.job_id || job.id}`}
                              state={{ from: '/jobseeker/dashboard' }}
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
              </div>
            </div>

            {/* Right Column - Profile Completion, Quick Actions, Accessibility */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-6">
              {/* Profile Completion */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Completion</h3>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{progressPercentage}% Complete</span>
                    <span className="text-sm text-gray-500">
                      {itemsLeft} item{itemsLeft !== 1 ? 's' : ''} left
                    </span>
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
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm text-center block"
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
        showNotification={false} 
        notificationCount={3}
      />
    </div>
  );
};

export default JobseekerDashboard;