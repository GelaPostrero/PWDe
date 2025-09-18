import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api.js';
import Swal from 'sweetalert2';
import EmployerHeader from '../../components/ui/EmployerHeader.jsx';
import Footer from '../../components/ui/Footer.jsx';
import Chatbot from '../../components/ui/Chatbot.jsx';

const PostedJobView = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('view'); // 'view', 'applications', 'hires'
  const [jobStatus, setJobStatus] = useState('active'); // 'active' or 'completed'
  const [applicationsTab, setApplicationsTab] = useState('proposals'); // 'proposals', 'shortlisted', 'messaged', 'declined'
  const [jobData, setJobData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch job data from backend
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/job/${jobId}/posted`);

        if(response.data.success) {
          setJobData(response.data.job);
          setJobStatus(mockJobData.status);
        }
      } catch (err) {
        setError('Failed to load job data');
        console.error('Error fetching job data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobData();
    }
  }, [jobId]);

  // Fetch applications data from backend
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/employer/jobs/${jobId}/applications`, {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //     'Content-Type': 'application/json'
        //   }
        // });
        // const data = await response.json();
        // setApplications(data);


        
        // Mock data for now
        setApplications(mockApplications);
      } catch (err) {
        console.error('Error fetching applications:', err);
      }
    };

    if (jobId && activeTab === 'applications') {
      fetchApplications();
    }
  }, [jobId, activeTab]);

  // Mock data - replace with actual API calls
  const mockJobData = {
    id: jobId,
    title: "Senior Software Developer",
    company: "TechCorp Solutions Inc.",
    location: "Cebu City, Cebu, Philippines",
    type: "Full-time",
    workArrangement: "Hybrid",
    salary: "$85,000 - $110,000 CAD / yearly",
    experienceLevel: "Senior Level",
    category: "Programming",
    postedDate: "January 15, 2025",
    applicationDeadline: "June 25, 2025",
    applications: 25,
    views: 0,
    status: jobStatus,
    description: "We are seeking a talented Senior Software Developer to join our innovative team. You will be responsible for designing, developing, and maintaining high-quality software solutions that serve our diverse user base, including individuals with disabilities. As part of our commitment to accessibility and inclusion, you'll work on creating applications that are accessible to all users, implementing WCAG guidelines and ensuring our products can be used by everyone.",
    requiredSkills: [
      { name: "JavaScript", category: "Programming" },
      { name: "React", category: "Programming" },
      { name: "Node.js", category: "Programming" },
      { name: "WCAG 2.1", category: "Accessibility" },
      { name: "Accessibility Testing", category: "Testing" },
      { name: "SQL", category: "Database" },
      { name: "Git", category: "Version Control" }
    ],
    accessibilityFeatures: [
      "Wheelchair accessible workplace",
      "Flexible work arrangements",
      "Sign language interpretation",
      "Screen reader compatible tools",
      "Assistive technology support",
      "Adjustable desk setup"
    ]
  };

  // Mock applications data - matches backend API response structure
  const mockApplications = [
    {
      application_id: 1,
      job_id: parseInt(jobId),
      pwd_id: 1,
      resume_id: 1,
      custom_message: "I am excited to apply for the Senior Software Developer position...",
      proposed_salary: 2500.00,
      submitted_at: "2024-12-15T10:30:00Z",
      updated_at: "2024-12-15T10:30:00Z",
      status_changed_at: "2024-12-15T10:30:00Z",
      pwd_profile: {
        pwd_id: 1,
        first_name: "Maria",
        last_name: "Santos",
        middle_name: "",
        profile_picture: null,
        bio: "Experienced developer with passion for accessibility",
        disability_Type: "Visual Impairment",
        disability_severity: "MODERATE",
        gender: "FEMALE",
        rating: 4.9,
        address: "Manila, Philippines",
        profession: "Software Developer",
        skills: ["React", "Node.js", "TypeScript", "Accessibility"],
        professional_role: "Senior Software Developer",
        professional_summary: "I'm a Senior Software Developer with 8+ years of experience in full-stack development. I specialize in React, Node.js, and AWS cloud architecture. I've led teams of 5+ developers and delivered enterprise solutions for fintech and healthcare industries.",
        portfolio_url: "https://portfolio.example.com",
        github_url: "https://github.com/maria-santos",
        user: {
          user_id: 1,
          email: "maria.santos@example.com",
          phone_number: "+63 912 345 6789"
        }
      },
      resume: {
        resume_id: 1,
        title: "Senior Software Developer Resume",
        summary: "Experienced software developer with expertise in modern web technologies",
        skills: "React, Node.js, TypeScript, JavaScript, HTML, CSS, MongoDB, PostgreSQL, AWS",
        work_experience: "8+ years of experience in full-stack development",
        education: "BS Computer Science",
        certifications: "AWS Certified Developer, React Certification",
        achievements: "Led development of accessible web applications",
        file_path: "/uploads/resumes/maria_santos_resume_2024.pdf"
      }
    },
    {
      application_id: 2,
      job_id: parseInt(jobId),
      pwd_id: 2,
      resume_id: 2,
      custom_message: "I am writing to express my interest in the Backend Developer role...",
      proposed_salary: 1800.00,
      submitted_at: "2024-12-14T14:20:00Z",
      updated_at: "2024-12-14T14:20:00Z",
      status_changed_at: "2024-12-14T14:20:00Z",
      pwd_profile: {
        pwd_id: 2,
        first_name: "Anna",
        last_name: "Cruz",
        middle_name: "",
        profile_picture: null,
        bio: "Backend specialist with expertise in database optimization",
        disability_Type: "Hearing Impairment",
        disability_severity: "MILD",
        gender: "FEMALE",
        rating: 4.8,
        address: "Cebu, Philippines",
        profession: "Backend Developer",
        skills: ["Node.js", "MongoDB", "Express", "JavaScript", "PostgreSQL"],
        professional_role: "Backend Developer",
        professional_summary: "I have 5 years of experience developing web applications using React, Node.js, and MongoDB. I've worked on projects ranging from e-commerce platforms to real-time analytics dashboards.",
        portfolio_url: "https://portfolio.example.com",
        github_url: "https://github.com/anna-cruz",
        user: {
          user_id: 2,
          email: "anna.cruz@example.com",
          phone_number: "+63 912 345 6788"
        }
      },
      resume: {
        resume_id: 2,
        title: "Backend Developer Resume",
        summary: "Backend specialist with expertise in Node.js and database optimization",
        skills: "Node.js, MongoDB, Express, JavaScript, PostgreSQL, Redis, Docker",
        work_experience: "5 years of experience in backend development",
        education: "BS Information Technology",
        certifications: "MongoDB Certified Developer, Node.js Certification",
        achievements: "Optimized database queries resulting in 40% performance improvement",
        file_path: "/uploads/resumes/anna_cruz_resume_2024.pdf"
      }
    },
    {
      application_id: 3,
      job_id: parseInt(jobId),
      pwd_id: 3,
      resume_id: 3,
      custom_message: "I am excited about the opportunity to join your team as a Frontend Developer...",
      proposed_salary: 2000.00,
      submitted_at: "2024-12-13T09:15:00Z",
      updated_at: "2024-12-13T09:15:00Z",
      status_changed_at: "2024-12-13T09:15:00Z",
      pwd_profile: {
        pwd_id: 3,
        first_name: "Miguel",
        last_name: "Reyes",
        middle_name: "",
        profile_picture: null,
        bio: "Frontend specialist with focus on accessibility and user experience",
        disability_Type: "Mobility Impairment",
        disability_severity: "MILD",
        gender: "MALE",
        rating: 4.7,
        address: "Davao, Philippines",
        profession: "Frontend Developer",
        skills: ["React", "Vue.js", "TypeScript", "CSS", "Accessibility"],
        professional_role: "Frontend Developer",
        professional_summary: "I'm a frontend specialist with 6 years of experience creating responsive, accessible web applications. I excel at translating designs into pixel-perfect interfaces using modern frameworks like React and Vue.",
        portfolio_url: "https://portfolio.example.com",
        github_url: "https://github.com/miguel-reyes",
        user: {
          user_id: 3,
          email: "miguel.reyes@example.com",
          phone_number: "+63 912 345 6787"
        }
      },
      resume: {
        resume_id: 3,
        title: "Frontend Developer Resume",
        summary: "Frontend specialist with expertise in React and accessibility",
        skills: "React, Vue.js, TypeScript, CSS, HTML, Accessibility, WCAG, Jest",
        work_experience: "6 years of experience in frontend development",
        education: "BS Computer Engineering",
        certifications: "React Certification, Accessibility Specialist",
        achievements: "Implemented WCAG 2.1 AA compliance across multiple projects",
        file_path: "/uploads/resumes/miguel_reyes_resume_2024.pdf"
      }
    }
  ];

  // Handle tab switching
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle marking job as completed (hired)
  const handleMarkAsCompleted = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/employer/jobs/${jobId}/complete`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      // if (response.ok) {
      //   setJobStatus('completed');
      //   setActiveTab('hires');
      // }
      
      // Mock implementation
      setJobStatus('completed');
      setActiveTab('hires');
    } catch (error) {
      console.error('Error marking job as completed:', error);
      alert('Failed to mark job as completed. Please try again.');
    }
  };

  // Handle job deletion
  const handleDeleteJob = async (jobid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.delete(`/job/delete/${jobId}`);
          if (response.data.success) {
            navigate('/employer/dashboard')
            Swal.fire({
              toast: true,
              position: "bottom-end",
              icon: "success",
              title: "Job deleted successfully",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true
            });
          }
        } catch (error) {
          console.error("Failed to delete job:", error);
          Swal.fire({
            toast: true,
            position: "bottom-end",
            icon: "error",
            title: "Something went wrong while deleting",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          });
        }
      }
    });
  };

  // Handle job editing
  const handleEditJob = () => {
    // Navigate to edit job page
    navigate(`/employer/edit-job/${jobId}`);
  };

  // Handle applicant card click
  const handleApplicantClick = (applicantId) => {
    navigate(`/employer/job/${jobId}/application/${applicantId}`);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <EmployerHeader disabled={false} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading job details...</p>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <EmployerHeader disabled={false} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Job</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Show main content
  if (!jobData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <EmployerHeader disabled={false} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Job not found</p>
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
          
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <nav className="text-sm text-gray-600">
              <Link to="/employer/jobs" className="hover:text-blue-600 cursor-pointer">Jobs</Link>
              <span className="mx-2">›</span>
              <span className="text-gray-900">View Post</span>
            </nav>
          </div>

          {/* Job Header with Navigation Tabs */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 sm:px-8 pt-6">
              {/* Job Title and Company */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <button className="p-2 mr-3 hover:bg-gray-100 rounded-lg">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h1 className="text-2xl font-bold text-gray-900">{jobData.jobtitle}</h1>
                </div>
                <div className="flex items-center text-gray-600 ml-11">
                  <Link to="#" className="text-blue-600 hover:text-blue-700 font-medium">{jobData.employer.company_name}</Link>
                  <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{jobData.location_city}, {jobData.location_province}, {jobData.location_country}</span>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-0 border-b border-gray-200">
                <button 
                  onClick={() => handleTabChange('view')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'view' 
                      ? 'text-blue-600 border-blue-600' 
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  View Post
                </button>
                <button 
                  onClick={() => handleTabChange('applications')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'applications' 
                      ? 'text-blue-600 border-blue-600' 
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Applications ({jobData._count.applications})
                </button>
                <button 
                  onClick={() => handleTabChange('hires')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'hires' 
                      ? 'text-blue-600 border-blue-600' 
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Hires ({jobStatus === 'completed' ? '1' : '0'})
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="px-6 sm:px-8 pb-6">
              {activeTab === 'view' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                  {/* Left Column - Job Description */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Job Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
                      <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed mb-4">{jobData.description}</p>
                        <p className="text-gray-700 leading-relaxed">
                          As part of our commitment to accessibility and inclusion, you'll work on creating applications that 
                          are accessible to all users, implementing WCAG guidelines and ensuring our products can be used by everyone.
                        </p>
                      </div>
                    </div>


                    {/* Required Skills */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {jobData.skills_required.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Accessibility Features */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Accessibility Features & Accommodations</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {jobData.workplace_accessibility_features.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Job Summary */}
                  <div className="lg:col-span-1">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Summary</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <span className="text-sm font-medium text-gray-600 block mb-1">Job Category</span>
                          <p className="text-gray-900 font-medium">{jobData.jobCategory}</p>
                        </div>
                        
                        <div>
                          <span className="text-sm font-medium text-gray-600 block mb-1">Employment Type</span>
                          <p className="text-gray-900 font-medium">{jobData.employment_type}</p>
                        </div>
                        
                        <div>
                          <span className="text-sm font-medium text-gray-600 block mb-1">Work Arrangement</span>
                          <p className="text-gray-900 font-medium">{jobData.work_arrangement}</p>
                        </div>
                        
                        <div>
                          <span className="text-sm font-medium text-gray-600 block mb-1">Location</span>
                          <p className="text-gray-900 font-medium">{jobData.location_city}, {jobData.location_province}, {jobData.location_country}</p>
                        </div>
                        
                        <div>
                          <span className="text-sm font-medium text-gray-600 block mb-1">Experience Level</span>
                          <p className="text-gray-900 font-medium">{jobData.experience_level}</p>
                        </div>
                        
                        <div>
                          <span className="text-sm font-medium text-gray-600 block mb-1">Salary Range</span>
                          <p className="text-gray-900 font-bold">${jobData.salary_min} - ${jobData.salary_max} CAD / {jobData.salary_type.toLowerCase()}</p>
                          <p className="text-sm text-gray-500">Per year</p>
                        </div>
                        
                        <div>
                          <span className="text-sm font-medium text-gray-600 block mb-1">Applications</span>
                          <p className="text-gray-900 font-medium">{jobData._count.applications} applications received</p>
                        </div>
                        
                        <div>
                          <span className="text-sm font-medium text-gray-600 block mb-1">Application Deadline</span>
                          <p className="text-red-600 font-bold">
                            {jobData.application_deadline
                              ? new Date(jobData.application_deadline).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "No deadline"}
                          </p>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      {jobStatus === 'active' ? (
                        <div className="flex gap-3 mt-6">
                          <button 
                            onClick={() => {handleDeleteJob(jobData.job_id);}}
                            className="flex-1 border border-red-600 text-red-600 hover:bg-red-50 py-2 px-4 rounded-lg font-medium transition-colors text-sm"
                          >
                            Delete
                          </button>
                          <button 
                            onClick={handleEditJob}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={handleMarkAsCompleted}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm"
                          >
                            Mark as Completed
                          </button>
                        </div>
                      ) : (
                        <div className="mt-6">
                          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-center">
                            <div className="flex items-center justify-center">
                              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="font-medium">Job Completed - Position Filled</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Additional Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date Posted:</span>
                            <span className="text-gray-900">
                              {jobData.created_at
                              ? new Date(jobData.created_at).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "No deadline"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Last Updated:</span>
                            <span className="text-gray-900">
                              {jobData.updated_at
                              ? new Date(jobData.updated_at).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "No deadline"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Job ID:</span>
                            <span className="text-gray-900">{jobData.job_code}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'applications' && (
                <div className="mt-6">
                  {/* Application Sub-tabs */}
                  <div className="flex space-x-6 border-b border-gray-200 mb-6">
                    <button 
                      onClick={() => setApplicationsTab('proposals')}
                      className={`pb-2 text-sm font-medium border-b-2 ${
                        applicationsTab === 'proposals'
                          ? 'text-blue-600 border-blue-600'
                          : 'text-gray-500 border-transparent hover:text-gray-700'
                      }`}
                    >
                      Proposals 25
                    </button>
                    <button 
                      onClick={() => setApplicationsTab('shortlisted')}
                      className={`pb-2 text-sm font-medium border-b-2 ${
                        applicationsTab === 'shortlisted'
                          ? 'text-blue-600 border-blue-600'
                          : 'text-gray-500 border-transparent hover:text-gray-700'
                      }`}
                    >
                      Shortlisted 3
                    </button>
                    <button 
                      onClick={() => setApplicationsTab('messaged')}
                      className={`pb-2 text-sm font-medium border-b-2 ${
                        applicationsTab === 'messaged'
                          ? 'text-blue-600 border-blue-600'
                          : 'text-gray-500 border-transparent hover:text-gray-700'
                      }`}
                    >
                      Messaged 1
                    </button>
                    <button 
                      onClick={() => setApplicationsTab('declined')}
                      className={`pb-2 text-sm font-medium border-b-2 ${
                        applicationsTab === 'declined'
                          ? 'text-blue-600 border-blue-600'
                          : 'text-gray-500 border-transparent hover:text-gray-700'
                      }`}
                    >
                      Declined 1
                    </button>
                  </div>

                  {/* Search and Filter Section */}
                  <div className="flex items-center justify-between mb-6 bg-gray-50 p-4 rounded-lg">
                    <div className="flex-1 max-w-md">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search"
                          className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        />
                        <svg className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 ml-4">
                      <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filters
                      </button>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Sort by:</span>
                        <select className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>Recent</option>
                          <option>Rating</option>
                          <option>Rate</option>
                          <option>Experience</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Applicant Cards */}
                  <div className="space-y-4">
                    {applications.length > 0 ? (
                      applications.map((application, index) => {
                        const applicant = application.pwd_profile;
                        const initials = `${applicant.first_name[0]}${applicant.last_name[0]}`.toUpperCase();
                        const gradientColors = [
                          'from-blue-400 to-blue-600',
                          'from-purple-400 to-purple-600', 
                          'from-orange-400 to-orange-600',
                          'from-green-400 to-green-600',
                          'from-pink-400 to-pink-600'
                        ];
                        const gradientColor = gradientColors[index % gradientColors.length];
                        const applicantId = `applicant-${application.pwd_id}`;
                        
                        return (
                          <div 
                            key={application.application_id}
                            onClick={() => handleApplicantClick(applicantId)}
                            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4">
                                <div className="flex flex-col items-center">
                                  <div className={`w-16 h-16 bg-gradient-to-br ${gradientColor} rounded-full flex items-center justify-center`}>
                                    <span className="text-white font-bold text-lg">{initials}</span>
                                  </div>
                                  {index === 0 && (
                                    <div className="mt-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                                      Best match
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h4 className="text-lg font-semibold text-gray-900">{applicant.first_name} {applicant.last_name}</h4>
                                    <div className="flex items-center">
                                      <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                          <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                          </svg>
                                        ))}
                                      </div>
                                      <span className="ml-1 text-sm text-gray-600">{applicant.rating}/5</span>
                                      {applicant.rating >= 4.8 && (
                                        <div className="ml-2 flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                          </svg>
                                          Top Rated
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{applicant.professional_role} • ${application.proposed_salary}/month</p>
                                  <p className="text-sm text-gray-700 leading-relaxed">
                                    {applicant.professional_summary}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <button 
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                  </svg>
                                </button>
                                <button 
                                  onClick={(e) => e.stopPropagation()}
                                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                >
                                  Message
                                </button>
                                <button 
                                  onClick={(e) => e.stopPropagation()}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  Hire
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">📝</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
                        <p className="text-gray-600">Applications from jobseekers will appear here once they start applying to your job posting.</p>
                      </div>
                    )}
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-center mt-8">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">1</button>
                      <button className="px-3 py-2 text-gray-600 hover:text-gray-900 rounded-lg text-sm font-medium">2</button>
                      <button className="px-3 py-2 text-gray-600 hover:text-gray-900 rounded-lg text-sm font-medium">3</button>
                      <button className="px-3 py-2 text-gray-600 hover:text-gray-900 rounded-lg text-sm font-medium">4</button>
                      <button className="px-3 py-2 text-gray-600 hover:text-gray-900 rounded-lg text-sm font-medium">5</button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'hires' && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hires</h3>
                  {jobStatus === 'completed' ? (
                    <div className="space-y-4">
                      <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-sm">JS</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Jane Smith</h4>
                              <p className="text-sm text-gray-600">Senior Software Developer</p>
                              <p className="text-xs text-green-600 font-medium">Hired on December 15, 2024</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                              Hired
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No hires yet</h3>
                      <p className="text-gray-600">When you hire someone, they will appear here.</p>
                    </div>
                  )}
                </div>
              )}
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

export default PostedJobView;
