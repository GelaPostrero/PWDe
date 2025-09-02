import React from 'react';
import { Link, useParams } from 'react-router-dom';
import EmployerHeader from '../../components/ui/EmployerHeader.jsx';
import Footer from '../../components/ui/Footer.jsx';
import Chatbot from '../../components/ui/Chatbot.jsx';

const PostedJobView = () => {
  const { jobId } = useParams();

  // Mock job data - in real app, fetch this from backend
  const jobData = {
    id: jobId,
    title: "Senior Software Developer",
    company: "TechCorp Solutions Inc.",
    location: "Cebu City, Cebu, Philippines",
    type: "Full-time",
    workArrangement: "Hybrid",
    salary: "$85,000 - $110,000 CAD / weekly",
    experienceLevel: "Senior Level",
    category: "Programming",
    postedDate: "January 15, 2025",
    applicationDeadline: "June 25, 2025",
    applications: 0,
    views: 0,
    status: "Active",
    description: "We are seeking a talented Senior Software Developer to join our innovative team. You will be responsible for designing, developing, and maintaining high-quality software solutions that serve our diverse user base, including individuals with disabilities. As part of our commitment to accessibility and inclusion, you'll work on creating applications that are accessible to all users, implementing WCAG guidelines and ensuring our products can be used by everyone.",
    keyResponsibilities: [
      "Develop and maintain web applications using modern technologies",
      "Implement accessibility features following WCAG 2.1 AA standards",
      "Collaborate with UX/UI designers to create inclusive user experiences",
      "Participate in code reviews and maintain coding standards",
      "Mentor junior developers and contribute to team knowledge sharing"
    ],
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
              <span className="hover:text-blue-600 cursor-pointer">Jobs</span>
              <span className="mx-2"></span>
              <span className="text-gray-900">View Post</span>
            </nav>
          </div>

          {/* Job Details */}
          <div className="bg-white rounded-lg shadow p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Job Description */}
              <div className="lg:col-span-2 space-y-6">
                {/* Job Title and Company */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{jobData.title}</h1>
                    <div className="flex items-center text-gray-600">
                      <Link to="#" className="text-blue-600 hover:text-blue-700 font-medium">{jobData.company}</Link>
                      <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{jobData.location}</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                      View Post
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Applications (10)
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                      Hires (1)
                    </button>
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">{jobData.description}</p>
                  </div>
                </div>

                {/* Key Responsibilities */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Responsibilities</h3>
                  <ul className="space-y-2 text-gray-700">
                    {jobData.keyResponsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {responsibility}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Required Skills */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {jobData.requiredSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Accessibility Features */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Accessibility Features & Accommodations</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {jobData.accessibilityFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
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

              {/* Right Column - Job Summary & Actions */}
              <div className="lg:col-span-1 space-y-6">
                {/* Job Summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Summary</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Job Category:</span>
                      <p className="text-gray-900">{jobData.category}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-600">Employment Type:</span>
                      <p className="text-gray-900">{jobData.type}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-600">Work Arrangement:</span>
                      <p className="text-gray-900">{jobData.workArrangement}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-600">Location:</span>
                      <p className="text-gray-900">{jobData.location}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-600">Experience Level:</span>
                      <p className="text-gray-900">{jobData.experienceLevel}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-600">Salary Range:</span>
                      <p className="text-gray-900 font-bold">$85,000 - $110,000 CAD Per year</p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-600">Applications:</span>
                      <p className="text-gray-900">25 applications received</p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-600">Application Deadline:</span>
                      <p className="text-red-600 font-bold">June 25, 2025</p>
                    </div>
                  </div>
                  
                  {/* Mark as Completed Button */}
                  <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Mark as Completed
                  </button>
                </div>

                {/* Additional Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Date Posted:</span>
                      <p className="text-gray-900">December 2, 2024</p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-600">Last Updated:</span>
                      <p className="text-gray-900">December 4, 2024</p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-600">Job ID:</span>
                      <p className="text-gray-900">TC-2024-SD-001</p>
                    </div>
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

export default PostedJobView;
