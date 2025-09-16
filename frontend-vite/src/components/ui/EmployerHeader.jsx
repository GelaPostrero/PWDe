import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

import AnimatedHamburger from './AnimatedHamburger.jsx';
import Logo from './Logo.jsx';


const IconButton = ({
  label,
  children,
  hasNotification = false,
  notificationCount = 0,
  disabled = false,
}) => (
  <div className="relative">
    <button
      className={`p-2 transition-colors rounded-lg ${disabled
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

const EmployerHeader = ({ disabled = false }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const navigationLinks = [
    { name: 'Dashboard', path: '/employer/dashboard' },
    { name: 'Jobs', path: '/employer/jobs' },
    { name: 'Analytics', path: '/employer/analytics' },
    { name: 'Transactions', path: '/employer/transactions' },
    { name: 'Resources', path: '/employer/resources' },
    { name: 'Messages', path: '/employer/messages' }
  ];

  const isActiveLink = (path) => {
    if (path === '/employer/jobs') {
      return location.pathname === '/employer/jobs' ||
        location.pathname === '/employer/post-job' ||
        location.pathname.startsWith('/employer/job/') ||
        location.pathname.startsWith('/employer/edit-job/');
    }
    if (path === '/employer/analytics') {
      return location.pathname === '/employer/analytics';
    }
    if (path === '/employer/transactions') {
      return location.pathname === '/employer/transactions';
    }
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
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
      <div className="mx-full ml-8 mr-8 px-6 h-15 sm:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <div className="flex justify-between items-center h-full py-2">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/employer/dashboard" className="flex-shrink-0">
              <Logo showText={true} />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            {navigationLinks.map((link) => {
              if (disabled) {
                return (
                  <span
                    key={link.name}
                    className="text-gray-400 cursor-not-allowed text-xs font-medium flex items-center gap-1 opacity-60"
                  >
                    {link.name}
                  </span>
                );
              }

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-1 text-xs font-medium transition-colors flex items-center gap-1 ${
                    isActiveLink(link.path)
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
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

            {/* User Profile Image */}
            <div className="relative profile-dropdown-container">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className={`flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:ring-2 hover:ring-blue-300 transition-all ${disabled ? 'cursor-not-allowed opacity-60' : ''
                  }`}
                disabled={disabled}
              >
                <div className={`w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-purple-100 ${disabled ? '' : 'hover:border-purple-300'
                  } transition-colors`}>
                  TECH
                </div>
                <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && !disabled && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    to="/employer/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    View Profile
                  </Link>
                  <Link
                    to="/employer/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    Account Settings
                  </Link>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={() => {
                      // Handle logout
                      setIsProfileDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}

              {/* Online status indicator */}
              {!disabled && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
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
              {navigationLinks.map((link) => {
                if (disabled) {
                  return (
                    <span
                      key={link.name}
                      className="block px-3 py-2 text-sm font-medium text-gray-400 cursor-not-allowed opacity-60 rounded-lg"
                    >
                      {link.name}
                    </span>
                  );
                }

                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={closeMobileMenu}
                    className={`block px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg cursor-pointer ${isActiveLink(link.path)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default EmployerHeader;