import React from 'react';
import { Link } from 'react-router-dom';
import pwdelogo from '../../assets/pwdelogo.png';

const Footer = ({ 
  showLogo = true, 
  showSocials = true, 
  customLinks = null,
  className = "" 
}) => {
  const defaultLinks = {
    "About PWDe": [
      { name: "About Us", href: "/about" },
      { name: "Success Stories", href: "/success-stories" }
    ],
    "For Job Seekers": [
      { name: "Find Jobs", href: "/find-jobs" },
      { name: "Career Resources", href: "/career-resources" },
      { name: "Resume Builder", href: "/resume-builder" }
    ],
    "For Employers": [
      { name: "Post Jobs", href: "/employer/post-jobs" },
      { name: "Pricing Plans", href: "/employer/pricing" },
      { name: "Hiring Resources", href: "/employer/resources" }
    ],
    "Support": [
      { name: "Help Center", href: "/help" },
      { name: "Contact Us", href: "/contact" }
    ]
  };

  const links = customLinks || defaultLinks;

  return (
    <footer className={`bg-white border-t border-gray-200 py-12 ${className}`}>
      <div className="mx-full px-6 sm:px-8 lg:px-10 xl:px-12 2xl:px-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
        
          {showLogo && (
            <div className="lg:col-span-1 flex flex-col items-start">
              <div className="flex flex-col items-start">
                <img src={pwdelogo} alt="PWDe Logo" className="w-16 h-16 mb-2" />
                <div className="text-lg font-bold text-blue-700">PWDe</div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          {Object.entries(links).map(([section, sectionLinks]) => (
            <div key={section}>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                {section}
              </h3>
              <ul className="space-y-3">
                {sectionLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Media Section - Now inline with others */}
          {showSocials && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Follow Us
              </h3>
              <div className="flex flex-col space-y-3">
                <a
                  href="#"
                  className="flex items-center space-x-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="text-sm">Facebook</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.49.49-1.141.807-1.892.807-.751 0-1.402-.317-1.892-.807-.49-.49-.807-1.141-.807-1.892s.317-1.402.807-1.892c.49-.49 1.141-.807 1.892-.807s1.402.317 1.892.807c.49.49.807 1.141.807 1.892s-.317 1.402-.807 1.892z"/>
                  </svg>
                  <span className="text-sm">Instagram</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  <span className="text-sm">Twitter</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span className="text-sm">LinkedIn</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2025 PWDe. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Terms of Service
              </Link>
              <Link to="/support" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;