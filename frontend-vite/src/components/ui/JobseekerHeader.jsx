import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';

const NavLink = ({ to = '#', children, hasDropdown = false }) => (
  <Link
    to={to}
    className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium flex items-center gap-1"
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

const IconButton = ({
  label,
  children,
  hasNotification = false,
  notificationCount = 0,
}) => (
  <div className="relative">
    <button
      className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
      aria-label={label}
    >
      {children}
    </button>
    {hasNotification && notificationCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[10px] w-5 h-5 flex items-center justify-center font-medium">
        {notificationCount}
      </span>
    )}
  </div>
);

const JobseekerHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="mx-full px-6 sm:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <div className="flex items-center h-16">
          {/* Logo and Text group - positioned with more left margin */}
          <div className="flex items-center ml-4">
            <Link to="/" className="flex-shrink-0">
              <Logo showText={true} />
            </Link>
          </div>

          {/* Navigation links - centered/flexible positioning */}
          <nav className="hidden md:flex items-center gap-10 ml-32 flex-1">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/find-job" hasDropdown={true}>
              Find Job
            </NavLink>
            <NavLink to="/resume">Resume</NavLink>
            <NavLink to="/transactions">Transactions</NavLink>
            <NavLink to="/resources">Resources</NavLink>
            <NavLink to="/messages">Messages</NavLink>
          </nav>

          {/* Right side  */}
          <div className="flex items-center mr-4">
            {/* Action buttons group */}
            <div className="flex items-center gap-2 mr-4">
              {/* Theme toggle */}
              <IconButton label="Toggle theme">
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
              <IconButton label="Text size">
                <span className="font-bold text-sm">Tt</span>
              </IconButton>

              {/* Notifications */}
              <IconButton
                label="Notifications"
                hasNotification={true}
                notificationCount={3}
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

            {/* Profile Avatar - separated */}
            <div>
              <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <img
                  className="h-8 w-8 rounded-full object-cover border-2 border-gray-200"
                  src="https://i.pravatar.cc/64"
                  alt="Profile"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default JobseekerHeader;