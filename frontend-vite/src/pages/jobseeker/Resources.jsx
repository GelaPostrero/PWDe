import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import JobseekerHeader from '../../components/ui/JobseekerHeader.jsx';
import Footer from '../../components/ui/Footer.jsx';
import Chatbot from '../../components/ui/Chatbot.jsx';

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [currentPage, setCurrentPage] = useState(1);

  // Mock resource data matching the image
  const resources = [
    {
      id: 1,
      title: 'Complete PWD Hiring Handbook',
      description: 'Comprehensive guide for employers on hiring and supporting persons with disabilities in the workplace.',
      type: 'Hiring Guide',
      fileType: 'PDF',
      fileSize: '2.4 MB',
      date: 'Aug 22, 2025',
      icon: '📄'
    },
    {
      id: 2,
      title: 'Workplace Inclusion Training',
      description: 'Interactive training module on creating inclusive work environments for all employees.',
      type: 'Training',
      fileType: 'Video',
      fileSize: '22 MB',
      date: 'Aug 22, 2025',
      icon: '🎥'
    },
    {
      id: 3,
      title: 'Office Accessibility Checklist',
      description: 'Detailed checklist for ensuring office spaces meet accessibility standards and requirements.',
      type: 'Accessibility',
      fileType: 'Word',
      fileSize: '1.8 MB',
      date: 'Aug 22, 2025',
      icon: '📋'
    },
    {
      id: 4,
      title: 'ADA Compliance Guidelines',
      description: 'Essential guidelines for maintaining ADA compliance in workplace practices and policies.',
      type: 'Legal',
      fileType: 'PDF',
      fileSize: '3.1 MB',
      date: 'Aug 22, 2025',
      icon: '⚖️'
    },
    {
      id: 5,
      title: 'Inclusive Team Management',
      description: 'Best practices for managing diverse teams and fostering inclusive leadership.',
      type: 'Best Practices',
      fileType: 'PDF',
      fileSize: '1.9 MB',
      date: 'Aug 22, 2025',
      icon: '👥'
    },
    {
      id: 6,
      title: 'Accessibility Technology Guide',
      description: 'Guide to assistive technologies and tools for workplace accessibility.',
      type: 'Technology',
      fileType: 'PDF',
      fileSize: '4.2 MB',
      date: 'Aug 22, 2025',
      icon: '💻'
    },
    {
      id: 7,
      title: 'Communication Strategies',
      description: 'Effective communication strategies for inclusive workplace interactions.',
      type: 'Communication',
      fileType: 'Video',
      fileSize: '18 MB',
      date: 'Aug 22, 2025',
      icon: '💬'
    },
    {
      id: 8,
      title: 'Emergency Preparedness Plan',
      description: 'Emergency response plans that account for accessibility needs and PWD considerations.',
      type: 'Safety',
      fileType: 'PDF',
      fileSize: '2.7 MB',
      date: 'Aug 22, 2025',
      icon: '🚨'
    }
  ];

  // Pagination
  const totalPages = 8;
  const resourcesPerPage = 6;
  const startIndex = (currentPage - 1) * resourcesPerPage;
  const endIndex = startIndex + resourcesPerPage;
  const currentResources = resources.slice(startIndex, endIndex);

  const getTypeColor = (type) => {
    switch (type) {
      case 'Hiring Guide':
        return 'bg-red-100 text-red-800';
      case 'Training':
        return 'bg-green-100 text-green-800';
      case 'Accessibility':
        return 'bg-orange-100 text-orange-800';
      case 'Legal':
        return 'bg-red-100 text-red-800';
      case 'Best Practices':
        return 'bg-green-100 text-green-800';
      case 'Technology':
        return 'bg-blue-100 text-blue-800';
      case 'Communication':
        return 'bg-purple-100 text-purple-800';
      case 'Safety':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = (resourceId) => {
    console.log('Downloading resource:', resourceId);
  };

  const handlePreview = (resourceId) => {
    console.log('Previewing resource:', resourceId);
  };

  const handleWatch = (resourceId) => {
    console.log('Watching resource:', resourceId);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <JobseekerHeader disabled={false} />

      <main className="flex-1 py-6 sm:py-8">
        <div className="mx-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16">
          
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Resource Library
            </h1>
            <p className="text-lg text-gray-600">
              Comprehensive educational materials, hiring guides, inclusion resources, and accessibility information.
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              
              {/* Search Bar */}
              <div className="flex-1 lg:max-w-4xl">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search resumes by title, content, skills..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* View Toggle and Filters */}
              <div className="flex items-center space-x-3">

                {/* View Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>

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

          {/* Resource Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {currentResources.map((resource) => (
              <div key={resource.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200">
                <div className="p-4">
                  {/* Type Indicator */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-2xl">{resource.icon}</div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                      {resource.type}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {resource.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {resource.description}
                  </p>

                  {/* Date and File Size */}
                  <div className="text-xs text-gray-500 space-y-1 mb-4">
                    <p>{resource.date}</p>
                    <p>{resource.fileSize}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {resource.fileType === 'Video' ? (
                      <button
                        onClick={() => handleWatch(resource.id)}
                        className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        Watch
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleDownload(resource.id)}
                          className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => handlePreview(resource.id)}
                          className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Preview
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

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
                      className={`px-3 py-2 text-sm font-medium rounded-md ${pageNum === currentPage
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

export default Resources;
