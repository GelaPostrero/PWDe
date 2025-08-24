import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

// Your actual Logo component
const Logo = ({ showText = false, to = '/' }) => {
  return (
    <Link to={to} className="flex items-center space-x-2" aria-label="PWDe Home">
      <img src={logo} alt="PWDe Logo" className="w-8 h-8" />
      {showText && <h1 className="text-xl font-bold text-blue-500">PWDe</h1>}
    </Link>
  );
};

const EmployerHeader = () => {
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
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Logo showText={true} to="/employer/dashboard" />
          
          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            {navigationLinks.map((link) => (
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
            ))}
          </nav>
          
          {/* Right Side Icons & Profile */}
          <div className="flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
            
            {/* Settings/Text Size */}
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </button>
            
            {/* Notifications with badge */}
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-5 5v-5z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center font-medium px-1">
                3
              </span>
            </button>
            
            {/* User Profile Image */}
            <div className="relative cursor-pointer">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold border-2 border-blue-100 hover:border-blue-300 transition-colors">
                EC
              </div>
              {/* Online status indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default EmployerHeader;