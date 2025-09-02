import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import logo from '../../assets/logo.png';


const Logo = ({ showText = false, to = '/', disabled = false }) => {
  return (
    <Link to={to} className="flex items-center space-x-2" aria-label="PWDe Home">
      <img src={logo} alt="PWDe Logo" className="w-8 h-8" />
      {showText && <h1 className="text-xl font-bold text-blue-500">PWDe</h1>}
    </Link>
  );
};

const EmployerHeader = ({ disabled = false }) => {
  const location = useLocation();

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
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="mx-full px-6 sm:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Logo showText={true} to="/employer/dashboard" disabled={disabled} />
          
          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            {navigationLinks.map((link) => {
              if (disabled) {
                return (
                  <span
                    key={link.name}
                    className="px-3 py-2 text-sm font-medium text-gray-400 cursor-not-allowed opacity-60"
                  >
                    {link.name}
                  </span>
                );
              }

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
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
          
          {/* Right Side Icons & Profile */}
          <div className="flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <button 
              className={`p-2 transition-all duration-200 rounded-lg ${
                disabled 
                  ? 'text-gray-300 cursor-not-allowed opacity-60' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              disabled={disabled}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
            
            {/* Settings/Text Size */}
            <button 
              className={`p-2 transition-all duration-200 rounded-lg ${
                disabled 
                  ? 'text-gray-300 cursor-not-allowed opacity-60' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              disabled={disabled}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </button>
            
            {/* Notifications with badge */}
            <button 
              className={`p-2 transition-all duration-200 rounded-lg relative ${
                disabled 
                  ? 'text-gray-300 cursor-not-allowed opacity-60' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              disabled={disabled}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-5 5v-5z" />
              </svg>
              {!disabled && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center font-medium px-1">
                  3
                </span>
              )}
            </button>
            
            {/* User Profile Image */}
            <div className={`relative ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
              <div className={`w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-purple-100 ${
                disabled ? '' : 'hover:border-purple-300'
              } transition-colors`}>
                TECH
              </div>
              {/* Online status indicator */}
              {!disabled && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default EmployerHeader;