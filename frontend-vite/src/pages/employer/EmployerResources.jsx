import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EmployerHeader from '../../components/ui/EmployerHeader.jsx';
import Footer from '../../components/ui/Footer.jsx';
import Chatbot from '../../components/ui/Chatbot.jsx';

const EmployerResources = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState('all');

  // Mock resource data matching the image
  const resources = [
    {
      id: 1,
      title: 'Complete PWD Hiring Handbook',
      description: 'Comprehensive guide covering legal requirements, best practices, and inclusive hiring strategies for employers.',
      type: 'Hiring Guide',
      fileType: 'PDF',
      fileSize: '2.4 MB',
      date: 'Aug 22, 2025',
      icon: 'pdf',
      category: 'hiring'
    },
    {
      id: 2,
      title: 'Workplace Inclusion Training',
      description: 'Interactive video series on creating inclusive workplace environments and fostering diversity awareness.',
      type: 'Training',
      fileType: 'Video',
      fileSize: '22 MB',
      date: 'Aug 22, 2025',
      icon: 'video',
      category: 'training'
    },
    {
      id: 3,
      title: 'Office Accessibility Checklist',
      description: 'Essential checklist for ensuring workplace accessibility compliance and creating barrier-free environments.',
      type: 'Accessibility',
      fileType: 'Word',
      fileSize: '22 MB',
      date: 'Aug 22, 2025',
      icon: 'word',
      category: 'accessibility'
    },
    {
      id: 4,
      title: 'Inclusive Team Management',
      description: 'Best practices guide for managers leading diverse teams with PWD members and creating supportive environments.',
      type: 'Best Practices',
      fileType: 'PDF',
      fileSize: '2.4 MB',
      date: 'Aug 22, 2025',
      icon: 'pdf',
      category: 'management'
    },
    {
      id: 5,
      title: 'Office Accessibility Checklist',
      description: 'Essential checklist for ensuring workplace accessibility compliance and creating barrier-free environments.',
      type: 'Accessibility',
      fileType: 'Word',
      fileSize: '22 MB',
      date: 'Aug 22, 2025',
      icon: 'word',
      category: 'accessibility'
    },
    {
      id: 6,
      title: 'ADA Compliance Guidelines',
      description: 'Updated legal requirements and compliance guidelines for ADA accommodation in the workplace.',
      type: 'Legal',
      fileType: 'PDF',
      fileSize: '2.4 MB',
      date: 'Aug 22, 2025',
      icon: 'pdf',
      category: 'legal'
    },
    {
      id: 7,
      title: 'Workplace Inclusion Training',
      description: 'Interactive video series on creating inclusive workplace environments and fostering diversity awareness.',
      type: 'Training',
      fileType: 'Video',
      fileSize: '22 MB',
      date: 'Aug 22, 2025',
      icon: 'video',
      category: 'training'
    },
    {
      id: 8,
      title: 'Emergency Preparedness Plan',
      description: 'Emergency response plans that account for accessibility needs and PWD considerations.',
      type: 'Safety',
      fileType: 'PDF',
      fileSize: '2.7 MB',
      date: 'Aug 22, 2025',
      icon: 'pdf',
      category: 'safety'
    }
  ];

  // Filter and sort resources
  const filteredAndSortedResources = resources
    .filter(resource => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.type.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const matchesCategory = selectedCategory === 'all' || 
        resource.category === selectedCategory;
      
      // File type filter
      const matchesFileType = selectedFileType === 'all' || 
        resource.fileType.toLowerCase() === selectedFileType.toLowerCase();
      
      return matchesSearch && matchesCategory && matchesFileType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'size':
          return parseFloat(b.fileSize) - parseFloat(a.fileSize);
        default:
          return 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedResources.length / 6);
  const resourcesPerPage = 6;
  const startIndex = (currentPage - 1) * resourcesPerPage;
  const endIndex = startIndex + resourcesPerPage;
  const currentResources = filteredAndSortedResources.slice(startIndex, endIndex);

  // Get unique categories and file types for filters
  const categories = ['all', ...new Set(resources.map(r => r.category))];
  const fileTypes = ['all', ...new Set(resources.map(r => r.fileType))];
  const sortOptions = [
    { value: 'date', label: 'Date (Newest)' },
    { value: 'title', label: 'Title (A-Z)' },
    { value: 'type', label: 'Type' },
    { value: 'size', label: 'File Size' }
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case 'Hiring Guide':
        return 'bg-blue-100 text-blue-800';
      case 'Training':
        return 'bg-blue-100 text-blue-800';
      case 'Accessibility':
        return 'bg-yellow-100 text-yellow-800';
      case 'Best Practices':
        return 'bg-green-100 text-green-800';
      case 'Legal':
        return 'bg-red-100 text-red-800';
      case 'Safety':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFileIcon = (iconType) => {
    switch (iconType) {
      case 'pdf':
        return (
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'video':
        return (
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
          </div>
        );
      case 'word':
        return (
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  const handleDownload = (resourceId) => {
    console.log('Downloading resource:', resourceId);
    //Implement actual download functionality later na guru after admin para ma view jud?idk
  };

  const handlePreview = (resourceId) => {
    console.log('Previewing resource:', resourceId);
    //Implement preview functionality
  };

  const handleWatch = (resourceId) => {
    console.log('Watching resource:', resourceId);
    //Implement watch functionality
  };

  // Filter and sort handlers
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setShowFilters(false);
  };

  const handleFileTypeChange = (fileType) => {
    setSelectedFileType(fileType);
    setCurrentPage(1);
    setShowFilters(false);
  };

  const handleSortChange = (sortValue) => {
    setSortBy(sortValue);
    setCurrentPage(1);
    setShowSort(false);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedFileType('all');
    setSortBy('date');
    setCurrentPage(1);
    setShowFilters(false);
  };

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedFileType, sortBy]);

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.filter-dropdown') && !event.target.closest('.sort-dropdown')) {
        setShowFilters(false);
        setShowSort(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <EmployerHeader disabled={false} />

      <main className="flex-1 py-6 sm:py-8">
        <div className="mx-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16">
          
          {/* Page Header */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
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
                    onChange={handleSearchChange}
                    placeholder="Search resources by title, content, category..."
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
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>

                {/* Filters Button */}
                <div className="relative filter-dropdown">
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                      showFilters || selectedCategory !== 'all' || selectedFileType !== 'all'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="text-sm font-medium">Filters</span>
                    {(selectedCategory !== 'all' || selectedFileType !== 'all') && (
                      <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                        {[selectedCategory !== 'all' ? 1 : 0, selectedFileType !== 'all' ? 1 : 0].reduce((a, b) => a + b, 0)}
                      </span>
                    )}
                  </button>

                  {/* Filters Dropdown */}
                  {showFilters && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                          <select
                            value={selectedCategory}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {categories.map(category => (
                              <option key={category} value={category}>
                                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">File Type</label>
                          <select
                            value={selectedFileType}
                            onChange={(e) => handleFileTypeChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {fileTypes.map(fileType => (
                              <option key={fileType} value={fileType}>
                                {fileType === 'all' ? 'All File Types' : fileType}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={clearFilters}
                            className="flex-1 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            Clear All
                          </button>
                          <button
                            onClick={() => setShowFilters(false)}
                            className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sort Button */}
                <div className="relative sort-dropdown">
                  <button 
                    onClick={() => setShowSort(!showSort)}
                    className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                      showSort || sortBy !== 'date'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    <span className="text-sm font-medium">Sort</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Sort Dropdown */}
                  {showSort && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      {sortOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => handleSortChange(option.value)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                            sortBy === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Results Counter */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {currentResources.length} of {filteredAndSortedResources.length} resources
              {(searchQuery || selectedCategory !== 'all' || selectedFileType !== 'all') && (
                <span className="ml-2 text-blue-600">
                  (filtered)
                </span>
              )}
            </p>
            {totalPages > 1 && (
              <p className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>

          {/* Resource Grid/List */}
          {currentResources.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || selectedCategory !== 'all' || selectedFileType !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No resources are available at the moment.'
                }
              </p>
              {(searchQuery || selectedCategory !== 'all' || selectedFileType !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            // Grid View
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {currentResources.map((resource) => (
                <div key={resource.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200">
                  <div className="p-6">
                    {/* File Icon and Category */}
                    <div className="flex items-center justify-between mb-4">
                      {getFileIcon(resource.icon)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                        {resource.type}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg overflow-hidden" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {resource.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 overflow-hidden" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}>
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
                          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 5v10l8-5-8-5z" />
                          </svg>
                          <span>Watch</span>
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleDownload(resource.id)}
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Download
                          </button>
                          <button
                            onClick={() => handlePreview(resource.id)}
                            className="flex-1 border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
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
          ) : (
            // List View
            <div className="space-y-4">
              {currentResources.map((resource) => (
                <div key={resource.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200">
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* File Icon */}
                      <div className="flex-shrink-0">
                        {getFileIcon(resource.icon)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {/* Title and Category */}
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 overflow-hidden" style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical'
                              }}>
                                {resource.title}
                              </h3>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                                {resource.type}
                              </span>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-gray-600 mb-3 overflow-hidden" style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}>
                              {resource.description}
                            </p>

                            {/* Metadata */}
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{resource.date}</span>
                              <span>•</span>
                              <span>{resource.fileSize}</span>
                              <span>•</span>
                              <span>{resource.fileType}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex-shrink-0 ml-4">
                            <div className="flex space-x-2">
                              {resource.fileType === 'Video' ? (
                                <button
                                  onClick={() => handleWatch(resource.id)}
                                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8 5v10l8-5-8-5z" />
                                  </svg>
                                  <span>Watch</span>
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleDownload(resource.id)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                  >
                                    Download
                                  </button>
                                  <button
                                    onClick={() => handlePreview(resource.id)}
                                    className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                                  >
                                    Preview
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-center mt-8">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 3 && (
                  <>
                    <span className="px-2 text-gray-500">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        currentPage === totalPages
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
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

export default EmployerResources;
