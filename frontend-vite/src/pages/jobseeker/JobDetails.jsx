import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import JobseekerHeader from '../../components/ui/JobseekerHeader.jsx';
import Footer from '../../components/ui/Footer.jsx';
import Chatbot from '../../components/ui/Chatbot.jsx';

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [reviewText, setReviewText] = useState('');

  // Mock job data - in real app, fetch this based on jobId
  const jobData = {
    id: "TC-2024-SD-001",
    title: "Senior Software Developer",
    company: "TechCorp Solutions Inc.",
    companyLogo: "https://via.placeholder.com/60x60/3B82F6/FFFFFF?text=TECH",
    location: "Banilad, Cebu City",
    status: "Active",
    postedDate: "December 2, 2024",
    lastUpdated: "December 4, 2024",
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
    description: "We are seeking a Senior Software Developer to join our team in developing high-quality, accessible software solutions for a diverse user base, including individuals with disabilities. Our commitment to accessibility and inclusion drives everything we do, ensuring our products meet WCAG guidelines and provide an excellent user experience for everyone.",
    responsibilities: [
      "Develop and maintain web applications using modern technologies",
      "Implement accessibility features following WCAG 2.1 AA standards",
      "Collaborate with UX/UI designers to create inclusive user experiences",
      "Participate in code reviews and provide constructive feedback",
      "Mentor junior developers and share best practices"
    ],
    requiredSkills: [
      "JavaScript", "React", "Node.js", "WCAG 2.1", 
      "Accessibility Testing", "SQL", "Git"
    ],
    accessibilityFeatures: [
      "Wheelchair accessible workplace",
      "Flexible work arrangements",
      "Sign language interpretation",
      "Screen reader compatible tools",
      "Assistive technology support",
      "Adjustable desk setup"
    ],
    companyRating: 4.6,
    companyReviews: 124,
    companyDescription: "Leading technology company committed to creating inclusive and accessible digital solutions for everyone.",
    isAccessibilityCertified: true
  };

  const reviews = [
    {
      id: 1,
      name: "Sarah Mitchell",
      project: "E-commerce Website Development",
      rating: 5.0,
      comment: "Exceptional cooperation! The client is very accommodating, provided all the needed details and support.",
      postedDate: "1 week ago"
    },
    {
      id: 2,
      name: "Marcus Johnson",
      project: "Mobile App UI/UX Design",
      rating: 5.0,
      comment: "Exceptional cooperation! The client is very accommodating, provided all the needed details and support.",
      postedDate: "1 week ago"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      project: "WordPress Website Customization",
      rating: 4.0,
      comment: "Exceptional cooperation! The client is very accommodating and provided all the needed details.",
      postedDate: "2 weeks ago"
    }
  ];

  const formatSalary = () => {
    return `$${jobData.salaryRange.min.toLocaleString()} - $${jobData.salaryRange.max.toLocaleString()} ${jobData.salaryRange.currency} Per ${jobData.salaryRange.period}`;
  };

  const handleApply = () => {
    navigate(`/jobseeker/submit-application/${jobData.id}`);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    console.log('Sharing job:', jobData.id);
  };

  const handleReviewSubmit = () => {
    if (reviewText.trim()) {
      console.log('Submitting review:', reviewText);
      setReviewText('');
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : i < rating 
              ? 'text-yellow-400 fill-current' 
              : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <JobseekerHeader disabled={false} />

      <div className="bg-white border-b border-gray-200">
        <div className="mx-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16">
          <nav className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Link to="/jobseeker/dashboard" className="hover:text-blue-600">Dashboard</Link>
              <span>/</span>
              <Link to="/find-job" className="hover:text-blue-600">Jobs</Link>
              <span>/</span>
              <span className="text-gray-900">View Job Details</span>
            </div>
            <Link
              to="/jobseeker/dashboard"
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Dashboard</span>
            </Link>
          </nav>
        </div>
      </div>

      <main className="flex-1 py-6 sm:py-8">
        <div className="mx-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16">
          {/* Mobile Back Button */}
          <div className="lg:hidden mb-4">
            <Link
              to="/jobseeker/dashboard"
              className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Dashboard</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {jobData.title}
                    </h1>
                    <Link 
                      to={`/company/${jobData.company}`}
                      className="text-lg text-blue-600 hover:text-blue-700 font-medium mb-2 inline-block"
                    >
                      {jobData.company}
                    </Link>
                    <div className="flex items-center text-gray-600 mb-3">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {jobData.location}
                    </div>
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

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {jobData.description}
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Responsibilities:</h3>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  {jobData.responsibilities.map((responsibility, index) => (
                    <li key={index} className="text-gray-700">{responsibility}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {jobData.requiredSkills.map((skill, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Accessibility Features & Accommodations</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {jobData.accessibilityFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Feedback & Reviews</h2>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Rating</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    {renderStars(3.0)}
                    <span className="text-gray-600">3.0 out of 5</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Review</h3>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience working with this freelancer..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="4"
                  />
                  <div className="flex justify-end space-x-3 mt-3">
                    <button 
                      onClick={() => setReviewText('')}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleReviewSubmit}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                    >
                      Submit
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-t border-gray-200 pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{review.name}</h4>
                          <p className="text-sm text-gray-600">{review.project}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-600 ml-1">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{review.comment}</p>
                      <span className="text-xs text-gray-500">Posted {review.postedDate}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Job Summary</h3>
                <div className="space-y-3 mb-6">
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
                    <span className="font-medium text-gray-900">Cebu City, Cebu, Philippines</span>
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
                    <span className="font-medium text-gray-900">{jobData.applications} applications received</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Application Deadline:</span>
                    <span className="font-medium text-gray-900">{jobData.deadline}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <button
                    onClick={handleApply}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Apply Now</span>
                  </button>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className={`flex-1 py-2 px-4 rounded-lg border font-medium transition-colors ${
                        isSaved 
                          ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <svg className={`w-4 h-4 mx-auto ${isSaved ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex-1 py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Date Posted:</span>
                    <span>{jobData.postedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span>{jobData.lastUpdated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Job ID:</span>
                    <span>{jobData.id}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">About {jobData.company}</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <img 
                    src={jobData.companyLogo} 
                    alt={`${jobData.company} logo`}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <Link 
                      to={`/company/${jobData.company}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {jobData.company}
                    </Link>
                    <div className="flex items-center space-x-1">
                      {renderStars(jobData.companyRating)}
                      <span className="text-sm text-gray-600 ml-1">
                        {jobData.companyRating} ({jobData.companyReviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-4">
                  {jobData.companyDescription}
                </p>
                {jobData.isAccessibilityCertified && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Accessibility Certified
                  </span>
                )}
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

export default JobDetails;
