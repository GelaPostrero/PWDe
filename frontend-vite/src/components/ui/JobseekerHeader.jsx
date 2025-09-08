import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo.jsx';
import AnimatedHamburger from './AnimatedHamburger.jsx';

const NavLink = ({ to = '#', children, hasDropdown = false, disabled = false, isActive = false, onClick = null }) => {
  if (disabled) {
    return (
      <span className="text-gray-400 cursor-not-allowed text-sm font-medium flex items-center gap-1 opacity-60">
        {children}
        {hasDropdown && (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </span>
    );
  }

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`px-3 py-2 text-sm font-medium transition-colors ${
        isActive 
          ? 'text-blue-600 border-b-2 border-blue-600' 
          : 'text-gray-600 hover:text-blue-600'
      }`}
    >
      {children}
      {hasDropdown && (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      )}
    </Link>
  );
};

const IconButton = ({
  label,
  children,
  hasNotification = false,
  notificationCount = 0,
  disabled = false,
}) => (
  <div className="relative">
    <button
      className={`p-2 transition-colors rounded-lg ${
        disabled 
          ? 'text-gray-300 cursor-not-allowed opacity-60' 
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
      }`}
      aria-label={label}
      disabled={disabled}
    >
      {children}
    </button>
    {hasNotification && notificationCount > 0 && !disabled && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[10px] w-5 h-5 flex items-center justify-center font-medium">
        {notificationCount}
      </span>
    )}
  </div>
);

const JobseekerHeader = ({ disabled = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFindJobsOpen, setIsFindJobsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Function to check if a nav link is active
  const isNavActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/jobseeker/dashboard';
    }
    if (path === '/find-job') {
      return location.pathname.startsWith('/find-job') || location.pathname.startsWith('/jobseeker/job/') || location.pathname.startsWith('/jobseeker/submit-application/');
    }
    if (path === '/resume') {
      return location.pathname === '/resume' || location.pathname === '/resume-builder';
    }
    if (path === '/transactions') {
      return location.pathname === '/transactions';
    }
    if (path === '/resources') {
      return location.pathname === '/resources';
    }
    if (path === '/messages') {
      return location.pathname === '/messages';
    }
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleFindJobs = () => {
    setIsFindJobsOpen(!isFindJobsOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsFindJobsOpen(false);
  };

  // handle signout
  const signOut = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    navigate('/signin');
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFindJobsOpen(false);
      }
      // Close profile dropdown when clicking outside
      if (!event.target.closest('.profile-dropdown-container')) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="mx-full px-6 sm:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/jobseeker/dashboard" className="flex-shrink-0">
              <Logo showText={true} />
            </Link>
          </div>

          {/* Navigation links */}
          <nav className="hidden md:flex space-x-8">
            <NavLink to="/jobseeker/dashboard" disabled={disabled} isActive={isNavActive('/dashboard')}>Dashboard</NavLink>
            
            {/* Find Jobs Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleFindJobs}
                disabled={disabled}
                className={`px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${
                  isFindJobsOpen || isNavActive('/find-job')
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                } ${disabled ? 'text-gray-400 cursor-not-allowed opacity-60' : ''}`}
              >
                Find Jobs
                <svg
                  className={`w-4 h-4 transition-transform ${isFindJobsOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {isFindJobsOpen && !disabled && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    to="/find-job"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    onClick={() => setIsFindJobsOpen(false)}
                  >
                    Browse All Jobs
                  </Link>
                  <Link
                    to="/find-job/recommended"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    onClick={() => setIsFindJobsOpen(false)}
                  >
                    AI Recommended
                  </Link>
                  <Link
                    to="/find-job/saved"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    onClick={() => setIsFindJobsOpen(false)}
                  >
                    Saved Jobs
                  </Link>
                  <Link
                    to="/find-job/applied"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    onClick={() => setIsFindJobsOpen(false)}
                  >
                    Applied Jobs
                  </Link>
                </div>
              )}
            </div>
            
            <NavLink to="/resume" disabled={disabled} isActive={isNavActive('/resume')}>Resume</NavLink>
            <NavLink to="/transactions" disabled={disabled} isActive={isNavActive('/transactions')}>Transactions</NavLink>
            <NavLink to="/resources" disabled={disabled} isActive={isNavActive('/resources')}>Resources</NavLink>
            <NavLink to="/messages" disabled={disabled} isActive={isNavActive('/messages')}>Messages</NavLink>
          </nav>

          {/* Right Side Icons & Menu */}
          <div className="flex items-center space-x-4">
            {/* Icons - Always visible */}
            <div className="flex items-center space-x-3">
              {/* Theme toggle */}
              <IconButton label="Toggle theme" disabled={disabled}>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              </IconButton>

              {/* Text size */}
              <IconButton label="Text size" disabled={disabled}>
                <span className="font-bold text-sm">Tt</span>
              </IconButton>

              {/* Notifications */}
              <IconButton
                label="Notifications"
                hasNotification={true}
                notificationCount={3}
                disabled={disabled}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </IconButton>
            </div>

            {/* Profile Avatar */}
            <div className="relative profile-dropdown-container">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className={`flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:ring-2 hover:ring-blue-300 transition-all ${
                  disabled ? 'cursor-not-allowed opacity-60' : ''
                }`}
                disabled={disabled}
              >
                <img
                  className="h-8 w-8 rounded-full object-cover border-2 border-gray-200"
                  src="https://i.pravatar.cc/64"
                  alt="Profile"
                />
                <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Profile Dropdown */}
              {isProfileDropdownOpen && !disabled && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    to="/jobseeker/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    View Profile
                  </Link>
                  <Link
                    to="/jobseeker/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    Account Settings
                  </Link>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={() => {
                      // Handle logout
                      signOut();
                      setIsProfileDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden mobile-menu-container">
              <AnimatedHamburger 
                isOpen={isMobileMenuOpen} 
                onClick={toggleMobileMenu}
                disabled={disabled}
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 mobile-menu-container relative z-50">
            <nav className="space-y-2 px-6">
              {/* Dashboard Link */}
              <Link
                to="/jobseeker/dashboard"
                onClick={closeMobileMenu}
                className={`block px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg cursor-pointer ${
                  isNavActive('/dashboard')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                } ${disabled ? 'text-gray-400 cursor-not-allowed opacity-60' : ''}`}
              >
                Dashboard
              </Link>
              
              {/* Mobile Find Jobs Section */}
              <div>
                <button
                  onClick={toggleFindJobs}
                  disabled={disabled}
                  className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors flex items-center justify-between rounded-lg ${
                    isFindJobsOpen || isNavActive('/find-job')
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  } ${disabled ? 'text-gray-400 cursor-not-allowed opacity-60' : ''}`}
                >
                  Find Jobs
                  <svg
                    className={`w-4 h-4 transition-transform ${isFindJobsOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                
                {/* Mobile Dropdown Menu */}
                {isFindJobsOpen && !disabled && (
                  <div className="ml-4 mt-2 space-y-1" ref={dropdownRef}>
                    <Link
                      to="/find-job"
                      className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      Browse All Jobs
                    </Link>
                    <Link
                      to="/find-job/recommended"
                      className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      AI Recommended
                    </Link>
                    <Link
                      to="/find-job/saved"
                      className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      Saved Jobs
                    </Link>
                    <Link
                      to="/find-job/applied"
                      className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      Applied Jobs
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Resume Link */}
              <Link
                to="/resume"
                onClick={closeMobileMenu}
                className={`block px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg cursor-pointer ${
                  isNavActive('/resume')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                } ${disabled ? 'text-gray-400 cursor-not-allowed opacity-60' : ''}`}
              >
                Resume
              </Link>
              
              {/* Transactions Link */}
              <Link
                to="/transactions"
                onClick={closeMobileMenu}
                className={`block px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg cursor-pointer ${
                  isNavActive('/transactions')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                } ${disabled ? 'text-gray-400 cursor-not-allowed opacity-60' : ''}`}
              >
                Transactions
              </Link>
              
              {/* Resources Link */}
              <Link
                to="/resources"
                onClick={closeMobileMenu}
                className={`block px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg cursor-pointer ${
                  isNavActive('/resources')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                } ${disabled ? 'text-gray-400 cursor-not-allowed opacity-60' : ''}`}
              >
                Resources
              </Link>
              
              {/* Messages Link */}
              <Link
                to="/messages"
                onClick={closeMobileMenu}
                className={`block px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg cursor-pointer ${
                  isNavActive('/messages')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                } ${disabled ? 'text-gray-400 cursor-not-allowed opacity-60' : ''}`}
              >
                Messages
              </Link>
            </nav>
          </div>
        )}
      </div>
      
      {/* Click outside to close dropdowns - only for desktop dropdowns */}
      {(isFindJobsOpen || isProfileDropdownOpen) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setIsFindJobsOpen(false);
            setIsProfileDropdownOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default JobseekerHeader;