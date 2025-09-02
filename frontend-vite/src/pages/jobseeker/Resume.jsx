import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import JobseekerHeader from '../../components/ui/JobseekerHeader.jsx';
import Footer from '../../components/ui/Footer.jsx';
import Chatbot from '../../components/ui/Chatbot.jsx';

const Resume = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [showSort, setShowSort] = useState(false);
    const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'title', 'type'
    const [filterType, setFilterType] = useState('all'); // 'all', 'created', 'uploaded'

    // Mock resume data - in real app, fetch this from backend
    const resumeData = [
        {
            id: 1,
            title: "UX Designer Portfolio",
            type: "Creative Template",
            thumbnail: "https://via.placeholder.com/200x280/3B82F6/FFFFFF?text=UX+Designer",
            createdDate: "Jul 28, 2023",
            modifiedDate: "1 week ago",
            isCreated: true
        },
        {
            id: 2,
            title: "Project Manager Resume",
            type: "Uploads",
            thumbnail: "https://via.placeholder.com/200x280/10B981/FFFFFF?text=Project+Manager",
            createdDate: "Aug 21, 2023",
            modifiedDate: null,
            isCreated: false
        },
        {
            id: 3,
            title: "Customer Service Specialist",
            type: "Accessible Template",
            thumbnail: "https://via.placeholder.com/200x280/F59E0B/FFFFFF?text=Customer+Service",
            createdDate: "Jun 12, 2023",
            modifiedDate: "3 days ago",
            isCreated: true
        },
        {
            id: 4,
            title: "Marketing Coordinator",
            type: "Professional Template",
            thumbnail: "https://via.placeholder.com/200x280/8B5CF6/FFFFFF?text=Marketing",
            createdDate: "Jul 05, 2023",
            modifiedDate: "2 weeks ago",
            isCreated: true
        },
        {
            id: 5,
            title: "Administrative Assistant",
            type: "Uploads",
            thumbnail: "https://via.placeholder.com/200x280/EF4444/FFFFFF?text=Admin+Assistant",
            createdDate: "Aug 18, 2023",
            modifiedDate: null,
            isCreated: false
        },
        {
            id: 6,
            title: "Data Analyst Resume",
            type: "Hybrid Template",
            thumbnail: "https://via.placeholder.com/200x280/06B6D4/FFFFFF?text=Data+Analyst",
            createdDate: "Jul 29, 2023",
            modifiedDate: "5 days ago",
            isCreated: true
        },
        {
            id: 7,
            title: "Technical Support Specialist",
            type: "Minimalist Template",
            thumbnail: "https://via.placeholder.com/200x280/84CC16/FFFFFF?text=Tech+Support",
            createdDate: "Jun 30, 2023",
            modifiedDate: "1 month ago",
            isCreated: true
        },
        {
            id: 8,
            title: "Administrative Assistant",
            type: "Uploads",
            thumbnail: "https://via.placeholder.com/200x280/EC4899/FFFFFF?text=Admin+Assistant",
            createdDate: "Aug 18, 2023",
            modifiedDate: null,
            isCreated: false
        }
    ];

    // Filter and sort resumes
    const filteredAndSortedResumes = resumeData
        .filter(resume => {
            const matchesSearch = resume.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                resume.type.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = filterType === 'all' || 
                                (filterType === 'created' && resume.isCreated) ||
                                (filterType === 'uploaded' && !resume.isCreated);
            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'oldest':
                    return new Date(a.createdDate) - new Date(b.createdDate);
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'type':
                    return a.type.localeCompare(b.type);
                case 'newest':
                default:
                    return new Date(b.createdDate) - new Date(a.createdDate);
            }
        });

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedResumes.length / 8);
    const resumesPerPage = 8;
    const startIndex = (currentPage - 1) * resumesPerPage;
    const endIndex = startIndex + resumesPerPage;
    const currentResumes = filteredAndSortedResumes.slice(startIndex, endIndex);

    const handleUploadResume = () => {
        console.log('Uploading resume');
    };

    const handleCreateResume = () => {
        console.log('Creating new resume');
    };

    const handleResumeAction = (action, resumeId) => {
        console.log(`${action} resume:`, resumeId);
    };

    // Click outside handler for dropdowns
    const filtersRef = useRef(null);
    const sortRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filtersRef.current && !filtersRef.current.contains(event.target)) {
                setShowFilters(false);
            }
            if (sortRef.current && !sortRef.current.contains(event.target)) {
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
            <JobseekerHeader disabled={false} />

            <main className="flex-1 py-6 sm:py-8">
                <div className="mx-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16">

                    {/* Page Header */}
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                    My Resume Library
                                </h1>
                                <p className="text-lg text-gray-600">
                                    Manage all your resumes in one place
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
                                <button
                                    onClick={handleUploadResume}
                                    className="px-4 py-2 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium text-sm rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <span>Upload Resume</span>
                                </button>
                                <Link
                                    to="/resume-builder"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span>Create New Resume</span>
                                </Link>
                            </div>
                        </div>
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
                                <div className="relative" ref={filtersRef}>
                                    <button 
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                                        </svg>
                                        <span>Filters</span>
                                        <svg className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    
                                    {/* Filters Dropdown */}
                                    {showFilters && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                            <div className="p-3">
                                                <h3 className="text-sm font-medium text-gray-900 mb-2">Filter by Type</h3>
                                                <div className="space-y-2">
                                                    {[
                                                        { value: 'all', label: 'All Resumes' },
                                                        { value: 'created', label: 'Created Resumes' },
                                                        { value: 'uploaded', label: 'Uploaded Resumes' }
                                                    ].map((option) => (
                                                        <label key={option.value} className="flex items-center">
                                                            <input
                                                                type="radio"
                                                                name="filterType"
                                                                value={option.value}
                                                                checked={filterType === option.value}
                                                                onChange={(e) => setFilterType(e.target.value)}
                                                                className="mr-2 text-blue-600 focus:ring-blue-500"
                                                            />
                                                            <span className="text-sm text-gray-700">{option.label}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Sort Button */}
                                <div className="relative" ref={sortRef}>
                                    <button 
                                        onClick={() => setShowSort(!showSort)}
                                        className="px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                        </svg>
                                        <span>Sort</span>
                                        <svg className={`w-4 h-4 transition-transform ${showSort ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    
                                    {/* Sort Dropdown */}
                                    {showSort && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                            <div className="p-3">
                                                <h3 className="text-sm font-medium text-gray-900 mb-2">Sort by</h3>
                                                <div className="space-y-2">
                                                    {[
                                                        { value: 'newest', label: 'Newest First' },
                                                        { value: 'oldest', label: 'Oldest First' },
                                                        { value: 'title', label: 'Title A-Z' },
                                                        { value: 'type', label: 'Type A-Z' }
                                                    ].map((option) => (
                                                        <label key={option.value} className="flex items-center">
                                                            <input
                                                                type="radio"
                                                                name="sortBy"
                                                                value={option.value}
                                                                checked={sortBy === option.value}
                                                                onChange={(e) => setSortBy(e.target.value)}
                                                                className="mr-2 text-blue-600 focus:ring-blue-500"
                                                            />
                                                            <span className="text-sm text-gray-700">{option.label}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resume Grid/List */}
                    <div className={viewMode === 'grid' 
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
                        : "space-y-4"
                    }>
                        {currentResumes.map((resume) => (
                            <div key={resume.id} className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 ${
                                viewMode === 'list' ? 'flex items-center p-4' : ''
                            }`}>

                                {/* Resume Thumbnail */}
                                <div className={`relative ${viewMode === 'list' ? 'flex-shrink-0 mr-4' : ''}`}>
                                    <img
                                        src={resume.thumbnail}
                                        alt={resume.title}
                                        className={viewMode === 'list' 
                                            ? "w-16 h-20 object-cover rounded-lg"
                                            : "w-full h-48 object-cover rounded-t-lg"
                                        }
                                    />
                                    {viewMode === 'grid' && (
                                        <div className="absolute top-2 right-2">
                                            <button className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Resume Info */}
                                <div className={`${viewMode === 'list' ? 'flex-1' : 'p-4'}`}>
                                    <div className={viewMode === 'list' ? '' : 'p-4'}>
                                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                                            {resume.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-2">
                                            {resume.type}
                                        </p>
                                        <div className="text-xs text-gray-500 space-y-1">
                                            <p>
                                                {resume.isCreated ? 'Created:' : 'Uploaded:'} {resume.createdDate}
                                            </p>
                                            {resume.modifiedDate && (
                                                <p>Modified: {resume.modifiedDate}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className={`${viewMode === 'list' ? 'flex-shrink-0 ml-4' : 'px-4 pb-4'}`}>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleResumeAction('view', resume.id)}
                                                className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleResumeAction('edit', resume.id)}
                                                className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                Edit
                                            </button>
                                        </div>
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

export default Resume;
