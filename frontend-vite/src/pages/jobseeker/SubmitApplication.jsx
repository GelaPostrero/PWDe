import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import JobseekerHeader from '../../components/ui/JobseekerHeader.jsx';
import Footer from '../../components/ui/Footer.jsx';
import Chatbot from '../../components/ui/Chatbot.jsx';

const SubmitApplication = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [salaryExpectation, setSalaryExpectation] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState({
    resume: null,
    coverLetter: null,
    portfolio: []
  });
  const [coverLetter, setCoverLetter] = useState(`Dear Hiring Manager,

I am writing to express my strong interest in the Senior Software Developer position at TechCorp Solutions Inc. With over 5 years of experience in React, TypeScript, and modern web technologies, I am excited about the opportunity to contribute to your team's mission of creating accessible software solutions.

My background includes developing inclusive applications that meet WCAG 2.1 AA standards, and I bring a unique perspective on accessibility due to my experience with visual impairment. I believe this combination of technical expertise and personal understanding of accessibility challenges would be valuable to your team.

I am particularly drawn to TechCorp's commitment to creating software for diverse users, including individuals with disabilities. Your focus on accessibility aligns perfectly with my professional goals and personal values.

Thank you for considering my application. I look forward to discussing how I can contribute to your team.

Best regards,
Sarah Chen`);

  // Mock job data - in real app, fetch this based on jobId
  const jobData = {
    id: "TC-2024-SD-001",
    title: "Senior Software Developer",
    company: "TechCorp Solutions Inc.",
    companyLogo: "https://via.placeholder.com/60x60/3B82F6/FFFFFF?text=TECH",
    location: "Toronto, Ontario, Canada",
    status: "Active",
    postedDate: "3 days ago",
    category: "Programming",
    employmentType: "Full-time",
    workArrangement: "Hybrid",
    experienceLevel: "Senior Level",
    salaryRange: {
      min: 85000,
      max: 110000,
      currency: "CAD",
      period: "yearly"
    },
    applications: 25,
    deadline: "June 25, 2025",
    description: "We are seeking a Senior Software Developer to join our team in developing high-quality, accessible software solutions for a diverse user base, including individuals with disabilities. Our commitment to accessibility and inclusion drives everything we do, ensuring our products meet WCAG guidelines and provide an excellent user experience for everyone."
  };

  const portfolioItems = [
    {
      id: 1,
      title: "E-commerce Dashboard",
      technologies: ["React", "TypeScript", "Tailwind CSS"],
      thumbnail: "https://via.placeholder.com/200x120/3B82F6/FFFFFF?text=Dashboard",
      link: "#"
    },
    {
      id: 2,
      title: "Accessibility Toolkit",
      technologies: ["Vue.js", "WCAG 2.1 AA"],
      thumbnail: "https://via.placeholder.com/200x120/10B981/FFFFFF?text=Mobile+App",
      link: "#"
    }
  ];

  const applicationStatus = [
    { stage: "Submitted", date: "Dec 15, 2024", status: "completed", icon: "check" },
    { stage: "Under Review", date: "Current stage", status: "current", icon: "circle" },
    { stage: "Interview", date: "Pending", status: "pending", icon: "person" },
    { stage: "Hire", date: "Pending", status: "pending", icon: "person" }
  ];

  const formatSalary = () => {
    return `$${jobData.salaryRange.min.toLocaleString()} - $${jobData.salaryRange.max.toLocaleString()} ${jobData.salaryRange.currency} per year`;
  };

  const handleFileUpload = (type, file) => {
    if (type === 'portfolio') {
      setUploadedFiles(prev => ({
        ...prev,
        portfolio: [...prev.portfolio, file]
      }));
    } else {
      setUploadedFiles(prev => ({
        ...prev,
        [type]: file
      }));
    }
  };

  const handleFileRemove = (type, index = null) => {
    if (type === 'portfolio' && index !== null) {
      setUploadedFiles(prev => ({
        ...prev,
        portfolio: prev.portfolio.filter((_, i) => i !== index)
      }));
    } else {
      setUploadedFiles(prev => ({
        ...prev,
        [type]: null
      }));
    }
  };

  const handleEditApplication = () => {
    console.log('Editing application');
  };

  const handleWithdrawApplication = () => {
    console.log('Withdrawing application');
  };

  const handleSubmitApplication = () => {
    const applicationData = {
      jobId,
      coverLetter,
      salaryExpectation,
      uploadedFiles
    };
    console.log('Submitting application:', applicationData);
    // API call would go here
    navigate('/jobseeker/applications');
  };

  const getStatusIcon = (icon, status) => {
    if (icon === "check") {
      return (
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
          status === "completed" ? "bg-green-500" : "bg-gray-300"
        }`}>
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      );
    } else if (icon === "circle") {
      return (
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
          status === "current" ? "bg-blue-500" : "bg-gray-300"
        }`}>
          <div className={`w-3 h-3 rounded-full ${
            status === "current" ? "bg-white" : "bg-gray-400"
          }`}></div>
        </div>
      );
    } else if (icon === "person") {
      return (
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
          status === "pending" ? "bg-gray-300" : "bg-gray-300"
        }`}>
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      );
    }
  };

  const FileUploadArea = ({ type, accept, multiple = false, title, description }) => {
    const handleFileChange = (e) => {
      const files = Array.from(e.target.files);
      if (multiple) {
        files.forEach(file => handleFileUpload(type, file));
      } else if (files[0]) {
        handleFileUpload(type, files[0]);
      }
    };

    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
          id={`file-upload-${type}`}
        />
        <label htmlFor={`file-upload-${type}`} className="cursor-pointer">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">{title}</p>
          <p className="text-gray-500 text-sm">{description}</p>
        </label>
      </div>
    );
  };

  const FilePreview = ({ file, onRemove, type }) => {
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <JobseekerHeader disabled={false} />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16">
          <nav className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Link to="/jobseeker/dashboard" className="hover:text-blue-600">Dashboard</Link>
              <span>/</span>
              <Link to="/find-job" className="hover:text-blue-600">Jobs</Link>
              <span>/</span>
              <Link to={`/jobseeker/job/${jobId}`} className="hover:text-blue-600">View Job Details</Link>
              <span>/</span>
              <span className="text-gray-900">Submit Application</span>
            </div>
          </nav>
        </div>
      </div>

      <main className="flex-1 py-6 sm:py-8">
        <div className="mx-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Job Title & Company */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {jobData.title}
                    </h1>
                    <p className="text-lg text-blue-600 font-medium mb-2">
                      {jobData.company}
                    </p>
                    <p className="text-gray-600 mb-3">
                      {jobData.location}
                    </p>
                    <div className="flex items-center space-x-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {jobData.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        Posted {jobData.postedDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {jobData.description}
                </p>
                <div className="flex items-center space-x-4">
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    more...
                  </button>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                    View Job Posting
                  </button>
                </div>
              </div>

              {/* Resume Upload */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Resume</h2>
                
                {uploadedFiles.resume ? (
                  <FilePreview 
                    file={uploadedFiles.resume} 
                    onRemove={() => handleFileRemove('resume')}
                    type="resume"
                  />
                ) : (
                  <FileUploadArea
                    type="resume"
                    accept=".pdf,.doc,.docx"
                    title="Upload Resume"
                    description="PDF, DOC, or DOCX files only (Max 10MB)"
                  />
                )}
                
                <div className="mt-4 text-sm text-gray-500">
                  <p>Your resume should highlight your relevant experience and skills for this position.</p>
                </div>
              </div>

              {/* Cover Letter */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Cover Letter</h2>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Upload File
                    </button>
                    <span className="text-gray-400">|</span>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Write Here
                    </button>
                  </div>
                </div>
                
                {uploadedFiles.coverLetter ? (
                  <FilePreview 
                    file={uploadedFiles.coverLetter} 
                    onRemove={() => handleFileRemove('coverLetter')}
                    type="coverLetter"
                  />
                ) : (
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="12"
                    placeholder="Write your cover letter here..."
                  />
                )}
              </div>

              {/* Salary Expectation */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Salary Expectation</h2>
                <div className="mb-4">
                  <p className="text-blue-600 font-medium">
                    Employer's budget: {formatSalary()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={salaryExpectation}
                    onChange={(e) => setSalaryExpectation(e.target.value)}
                    placeholder="Enter your yearly rate"
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-gray-600 font-medium">/yr</span>
                </div>
              </div>

              {/* Portfolio & Work Samples */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Portfolio & Work Samples</h2>
                  <label htmlFor="portfolio-upload" className="text-blue-600 hover:text-blue-700 font-medium text-sm cursor-pointer">
                    Add More
                  </label>
                  <input
                    type="file"
                    id="portfolio-upload"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    multiple
                    onChange={(e) => {
                      Array.from(e.target.files).forEach(file => handleFileUpload('portfolio', file));
                    }}
                    className="hidden"
                  />
                </div>

                {/* Existing Portfolio Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {portfolioItems.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title}
                        className="w-full h-24 object-cover rounded mb-3"
                      />
                      <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.technologies.map((tech, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        View Project
                      </button>
                    </div>
                  ))}
                </div>

                {/* Uploaded Portfolio Files */}
                {uploadedFiles.portfolio.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <h4 className="font-medium text-gray-900">Additional Files:</h4>
                    {uploadedFiles.portfolio.map((file, index) => (
                      <FilePreview 
                        key={index}
                        file={file} 
                        onRemove={() => handleFileRemove('portfolio', index)}
                        type="portfolio"
                      />
                    ))}
                  </div>
                )}

                {/* Upload Area for Portfolio */}
                <FileUploadArea
                  type="portfolio"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  multiple={true}
                  title="Upload Additional Portfolio Items"
                  description="Images, PDFs, or documents (Max 10MB each)"
                />
              </div>

              {/* Video Introduction */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Video Introduction (Optional)</h2>
                <FileUploadArea
                  type="video"
                  accept=".mp4,.mov,.avi,.webm"
                  title="Upload Video Introduction"
                  description="MP4, MOV, AVI, or WEBM (Max 50MB)"
                />
                <div className="mt-4 text-sm text-gray-500">
                  <p>A brief video introduction can help employers get to know you better. Keep it under 3 minutes.</p>
                </div>
              </div>

              {/* Additional Documents */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Documents (Optional)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">References</h3>
                    <FileUploadArea
                      type="references"
                      accept=".pdf,.doc,.docx"
                      title="Upload References"
                      description="PDF or DOC files"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Certifications</h3>
                    <FileUploadArea
                      type="certifications"
                      accept=".pdf,.jpg,.jpeg,.png"
                      title="Upload Certifications"
                      description="Images or PDF files"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Application */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Ready to Submit?</h3>
                    <p className="text-gray-600">Review your application before submitting.</p>
                  </div>
                  <button
                    onClick={handleSubmitApplication}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Submit Application
                  </button>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Job Summary */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Job Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Job Category:</span>
                    <span className="font-medium text-gray-900">{jobData.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Employment Type:</span>
                    <span className="font-medium text-gray-900">{jobData.employmentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Work Arrangement:</span>
                    <span className="font-medium text-gray-900">{jobData.workArrangement}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium text-gray-900">{jobData.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience Level:</span>
                    <span className="font-medium text-gray-900">{jobData.experienceLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Salary Range:</span>
                    <span className="font-medium text-gray-900">{formatSalary()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Applications:</span>
                    <span className="font-medium text-gray-900">{jobData.applications} received</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deadline:</span>
                    <span className="font-medium text-gray-900">{jobData.deadline}</span>
                  </div>
                </div>
              </div>

              {/* Application Status */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Application Status</h3>
                <div className="space-y-4">
                  {applicationStatus.map((status, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      {getStatusIcon(status.icon, status.status)}
                      <div className="flex-1">
                        <p className={`font-medium ${
                          status.status === "current" ? "text-blue-600" : "text-gray-900"
                        }`}>
                          {status.stage}
                        </p>
                        <p className="text-sm text-gray-500">{status.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleEditApplication}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Edit Application
                  </button>
                  <button
                    onClick={handleWithdrawApplication}
                    className="w-full bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Withdraw Application
                  </button>
                </div>
              </div>

              {/* Application Tips */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-3">Application Tips</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Tailor your cover letter to this specific role</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Highlight accessibility experience and awareness</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Include portfolio samples that demonstrate relevant skills</span>
                  </li>
                </ul>
              </div>
            </div>
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

export default SubmitApplication;