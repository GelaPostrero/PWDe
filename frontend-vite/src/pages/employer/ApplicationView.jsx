import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import EmployerHeader from '../../components/ui/EmployerHeader.jsx';
import Footer from '../../components/ui/Footer.jsx';
import Chatbot from '../../components/ui/Chatbot.jsx';

const ApplicationView = () => {
  const { jobId, applicantId } = useParams();
  const [applicationStatus, setApplicationStatus] = useState('under_review'); // 'submitted', 'under_review', 'interview', 'hired', 'declined'
  const [applicationDataState, setApplicationDataState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch application data from backend
  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        setLoading(true);
        console.log('ApplicationView - Starting to fetch data for jobId:', jobId, 'applicantId:', applicantId);
        
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/employer/jobs/${jobId}/applications/${applicantId}`, {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //     'Content-Type': 'application/json'
        //   }
        // });
        // const data = await response.json();
        // setApplicationDataState(data);
        
        // Mock data for now
        const mockData = getMockApplicationData(applicantId, jobId);
        console.log('ApplicationView - Generated mock data:', mockData);
        setApplicationDataState(mockData);
      } catch (err) {
        setError('Failed to load application data');
        console.error('Error fetching application data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (jobId && applicantId) {
      fetchApplicationData();
    } else {
      console.log('ApplicationView - Missing jobId or applicantId:', { jobId, applicantId });
    }
  }, [jobId, applicantId]);

  // Mock application data - in real app, fetch this from backend based on applicantId
  const getMockApplicationData = (applicantId, jobId) => {
    console.log('ApplicationView - applicantId:', applicantId, 'jobId:', jobId);
    
    // Handle different applicantId formats: "applicant-1", "miguel-reyes-003", etc.
    let pwdId;
    if (applicantId.startsWith('applicant-')) {
      pwdId = parseInt(applicantId.replace('applicant-', ''));
    } else if (applicantId.includes('maria')) {
      pwdId = 1;
    } else if (applicantId.includes('anna')) {
      pwdId = 2;
    } else if (applicantId.includes('miguel')) {
      pwdId = 3;
    } else {
      pwdId = parseInt(applicantId.replace(/\D/g, '')) || 1;
    }
    
    console.log('ApplicationView - determined pwdId:', pwdId);

    // This would be the actual API response structure from backend
    const mockApiResponse = {
      application_id: pwdId,
      job_id: parseInt(jobId),
      pwd_id: pwdId,
      resume_id: 1,
      custom_message: "I am excited to apply for this position...",
      proposed_salary: 2500.00,
      submitted_at: "2024-12-15T10:30:00Z",
      updated_at: "2024-12-15T10:30:00Z",
      status_changed_at: "2024-12-15T10:30:00Z",
      pwd_profile: {
        pwd_id: pwdId,
        first_name: pwdId === 1 ? "Maria" : pwdId === 2 ? "Anna" : "Miguel",
        last_name: pwdId === 1 ? "Santos" : pwdId === 2 ? "Cruz" : "Reyes",
        middle_name: "",
        profile_picture: null,
        bio: "Experienced developer with passion for accessibility",
        disability_Type: "Visual Impairment",
        disability_severity: "MODERATE",
        gender: "FEMALE",
        rating: pwdId === 1 ? 4.9 : pwdId === 2 ? 4.8 : 4.7,
        address: pwdId === 1 ? "Manila, Philippines" : pwdId === 2 ? "Cebu, Philippines" : "Davao, Philippines",
        profession: "Software Developer",
        skills: ["React", "Node.js", "TypeScript", "Accessibility"],
        professional_role: pwdId === 1 ? "Senior Software Developer" : pwdId === 2 ? "Backend Developer" : "Frontend Developer",
        professional_summary: "Experienced developer with 5+ years in web development and accessibility",
        portfolio_url: "https://portfolio.example.com",
        github_url: "https://github.com/example",
        user: {
          user_id: pwdId,
          email: `${pwdId === 1 ? 'maria' : pwdId === 2 ? 'anna' : 'miguel'}@example.com`,
          phone_number: "+63 912 345 6789"
        }
      },
      resume: {
        resume_id: 1,
        title: "Software Developer Resume",
        summary: "Experienced software developer with expertise in modern web technologies",
        skills: "React, Node.js, TypeScript, JavaScript, HTML, CSS, MongoDB, PostgreSQL",
        work_experience: "5+ years of experience in full-stack development",
        education: "BS Computer Science",
        certifications: "AWS Certified Developer, React Certification",
        achievements: "Led development of accessible web applications",
        file_path: "/uploads/resumes/resume_2024.pdf"
      }
    };

    return {
      id: mockApiResponse.application_id.toString(),
      jobId: mockApiResponse.job_id.toString(),
      candidate: {
        name: `${mockApiResponse.pwd_profile.first_name} ${mockApiResponse.pwd_profile.last_name}`,
        location: mockApiResponse.pwd_profile.address,
        title: mockApiResponse.pwd_profile.professional_role,
        rating: mockApiResponse.pwd_profile.rating,
        profilePicture: mockApiResponse.pwd_profile.profile_picture,
        email: mockApiResponse.pwd_profile.user.email,
        phone: mockApiResponse.pwd_profile.user.phone_number,
        bio: mockApiResponse.pwd_profile.bio,
        disabilityType: mockApiResponse.pwd_profile.disability_Type,
        disabilitySeverity: mockApiResponse.pwd_profile.disability_severity,
        skills: mockApiResponse.pwd_profile.skills,
        portfolioUrl: mockApiResponse.pwd_profile.portfolio_url,
        githubUrl: mockApiResponse.pwd_profile.github_url
      },
      application: {
        customMessage: mockApiResponse.custom_message,
        proposedSalary: mockApiResponse.proposed_salary,
        submittedAt: mockApiResponse.submitted_at,
        updatedAt: mockApiResponse.updated_at
      },
      resume: {
        title: mockApiResponse.resume.title,
        summary: mockApiResponse.resume.summary,
        skills: mockApiResponse.resume.skills,
        workExperience: mockApiResponse.resume.work_experience,
        education: mockApiResponse.resume.education,
        certifications: mockApiResponse.resume.certifications,
        achievements: mockApiResponse.resume.achievements,
        filePath: mockApiResponse.resume.file_path
      }
    };
  };

  const applicationData = {
    ...getMockApplicationData(applicantId, jobId),
    resume: {
      filename: `Resume_${getMockApplicationData(applicantId, jobId).candidate.name.replace(' ', '')}_2024.pdf`,
      url: "#",
      preview: "PDF Preview"
    },
    coverLetter: getMockApplicationData(applicantId, jobId).application.customMessage,
    skills: {
      matching: getMockApplicationData(applicantId, jobId).candidate.skills,
      additional: getMockApplicationData(applicantId, jobId).resume.skills.split(', ').filter(skill => 
        !getMockApplicationData(applicantId, jobId).candidate.skills.includes(skill)
      )
    },
    portfolio: [
      {
        title: "E-commerce Dashboard",
        technologies: ["React", "TypeScript", "Tailwind CSS"],
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
        url: "#"
      },
      {
        title: "Accessibility Toolkit",
        technologies: ["Vue.js", "WCAG 2.1 AA"],
        image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop",
        url: "#"
      }
    ],
    videoIntroduction: {
      title: "Introduction Video",
      duration: "2:30",
      url: "#"
    },
    salaryProposal: {
      amount: getMockApplicationData(applicantId, jobId).application.proposedSalary,
      range: { min: 90000, max: 120000 }
    },
    reviews: [
      {
        id: 1,
        name: "Sarah Mitchell",
        rating: 5.0,
        project: "E-commerce Website Development",
        date: "1 week ago",
        comment: "Sarah delivered exceptional work with great attention to accessibility. Highly recommended!",
        avatar: "https://i.pravatar.cc/40?img=2"
      },
      {
        id: 2,
        name: "Marcus Johnson",
        rating: 5.0,
        project: "Mobile App UI/UX Design",
        date: "1 week ago",
        comment: "Outstanding frontend development skills and excellent communication throughout the project.",
        avatar: "https://i.pravatar.cc/40?img=3"
      },
      {
        id: 3,
        name: "Emma Rodriguez",
        rating: 4.0,
        project: "WordPress Website Customization",
        date: "2 weeks ago",
        comment: "Good work quality and timely delivery. Would work with again.",
        avatar: "https://i.pravatar.cc/40?img=4"
      }
    ],
    applicationTimeline: [
      { stage: "Submitted", date: "Dec 15, 2024", status: "completed" },
      { stage: "Under Review", date: "Current stage", status: "current" },
      { stage: "Interview", date: "Pending", status: "pending" },
      { stage: "Hire", date: "Pending", status: "pending" }
    ]
  };

  const handleStatusChange = (newStatus) => {
    setApplicationStatus(newStatus);
  };

  const handleHire = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/employer/jobs/${jobId}/applications/${applicantId}/hire`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      // if (response.ok) {
      //   setApplicationStatus('hired');
      // }
      
      // Mock implementation
      setApplicationStatus('hired');
      console.log('Hiring candidate:', applicationDataState?.candidate?.name);
    } catch (error) {
      console.error('Error hiring candidate:', error);
      alert('Failed to hire candidate. Please try again.');
    }
  };

  const handleDecline = async () => {
    if (window.confirm('Are you sure you want to decline this application?')) {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/employer/jobs/${jobId}/applications/${applicantId}/decline`, {
        //   method: 'PATCH',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //     'Content-Type': 'application/json'
        //   }
        // });
        // if (response.ok) {
        //   setApplicationStatus('declined');
        // }
        
        // Mock implementation
        setApplicationStatus('declined');
        console.log('Declining application for:', applicationDataState?.candidate?.name);
      } catch (error) {
        console.error('Error declining application:', error);
        alert('Failed to decline application. Please try again.');
      }
    }
  };

  const handleScheduleInterview = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/employer/jobs/${jobId}/applications/${applicantId}/schedule-interview`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      // if (response.ok) {
      //   setApplicationStatus('interview');
      // }
      
      // Mock implementation
      setApplicationStatus('interview');
      console.log('Scheduling interview for:', applicationDataState?.candidate?.name);
    } catch (error) {
      console.error('Error scheduling interview:', error);
      alert('Failed to schedule interview. Please try again.');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <EmployerHeader disabled={false} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading application details...</p>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Application</h2>
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
  if (!applicationDataState) {
    console.log('ApplicationView - No applicationDataState found');
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <EmployerHeader disabled={false} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Application not found</p>
            <p className="text-sm text-gray-500 mt-2">jobId: {jobId}, applicantId: {applicantId}</p>
          </div>
        </main>
      </div>
    );
  }

  console.log('ApplicationView - applicationDataState:', applicationDataState);

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
              <Link to="/employer/dashboard" className="hover:text-blue-600">Jobs</Link>
              <span className="mx-2">&gt;</span>
              <Link to={`/employer/job/${jobId}/posted`} className="hover:text-blue-600">Applications</Link>
              <span className="mx-2">&gt;</span>
              <span className="text-gray-900">Candidate</span>
            </nav>
          </div>

          {/* Candidate Profile Summary */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">SC</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{applicationDataState?.candidate?.name || 'Loading...'}</h1>
                  <p className="text-gray-600">{applicationDataState?.candidate?.location || ''}</p>
                  <p className="text-gray-600">{applicationDataState?.candidate?.title || ''}</p>
                  <div className="flex items-center mt-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1 text-sm text-gray-600">{applicationDataState?.candidate?.rating || 0}/5</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  Message
                </button>
                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Application Details */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Resume Section */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Resume</h3>
                  <div className="flex space-x-3">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Download</button>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View Full</button>
                  </div>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">PDF Preview</h4>
                  <p className="text-gray-600 mb-2">Click to view full document</p>
                  <p className="text-sm text-gray-500">{applicationDataState?.resume?.filename || 'Resume.pdf'}</p>
                </div>
              </div>

              {/* Cover Letter Section */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cover Letter</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{applicationDataState?.coverLetter || 'No cover letter provided.'}</p>
                </div>
              </div>

              {/* Skills & Technologies Section */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Skills & Technologies</h3>
                <p className="text-sm text-gray-600 mb-4">Skills matching job requirements</p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Matching Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {(applicationDataState?.skills?.matching || []).map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {(applicationDataState?.skills?.additional || []).map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Portfolio & Work Samples Section */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio & Work Samples</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(applicationDataState?.portfolio || []).map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{project.title}</h4>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.technologies.map((tech, techIndex) => (
                            <span key={techIndex} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          View Project
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Introduction Section */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Introduction</h3>
                <div className="bg-gray-900 rounded-lg p-8 text-center">
                  <svg className="w-16 h-16 text-white mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <h4 className="text-lg font-medium text-white mb-2">{applicationDataState?.videoIntroduction?.title || 'Introduction Video'}</h4>
                  <p className="text-gray-300">Duration: {applicationDataState?.videoIntroduction?.duration || '0:00'}</p>
                </div>
              </div>

              {/* Feedback & Reviews Section */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback & Reviews</h3>
                
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">Overall Rating</span>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                    <textarea 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                      placeholder="Share your experience working with this freelancer..."
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Submit</button>
                  </div>
                </div>

                <div className="space-y-4">
                  {(applicationDataState?.reviews || []).map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <img 
                          src={review.avatar} 
                          alt={review.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900">{review.name}</h4>
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">{review.rating}/5</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{review.project}</p>
                          <p className="text-sm text-gray-700">{review.comment}</p>
                          <p className="text-xs text-gray-500 mt-2">Posted {review.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Application Status & Actions */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Application Status */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
                <div className="space-y-4">
                  {(applicationDataState?.applicationTimeline || []).map((step, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.status === 'completed' ? 'bg-green-500' : 
                        step.status === 'current' ? 'bg-blue-500' : 'bg-gray-300'
                      }`}>
                        {step.status === 'completed' ? (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : step.status === 'current' ? (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        ) : step.stage === 'Hire' ? (
                          <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                        ) : (
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{step.stage}</p>
                        <p className="text-sm text-gray-600">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Salary Proposal */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary Proposal</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    ${(applicationDataState?.salaryProposal?.amount || 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Annual salary expectation</p>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>${((applicationDataState?.salaryProposal?.range?.min || 0) / 1000)}K</span>
                      <span>${((applicationDataState?.salaryProposal?.range?.max || 0) / 1000)}K</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ 
                          width: `${((applicationDataState?.salaryProposal?.amount || 0) - (applicationDataState?.salaryProposal?.range?.min || 0)) / ((applicationDataState?.salaryProposal?.range?.max || 1) - (applicationDataState?.salaryProposal?.range?.min || 0)) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={handleHire}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    Hire
                  </button>
                  <button 
                    onClick={handleScheduleInterview}
                    className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    Schedule Interview
                  </button>
                  <button 
                    onClick={handleDecline}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Decline Application
                  </button>
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

export default ApplicationView;
