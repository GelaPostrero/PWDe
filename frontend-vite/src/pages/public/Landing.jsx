import React, { useState, useEffect } from 'react';
import Logo from '../../components/ui/Logo.jsx';
import { Link } from 'react-router-dom';
import AnimatedHamburger from '../../components/ui/AnimatedHamburger.jsx';

// CORRECTED PATHS - From src/pages/public/ to src/assets/
import frame1 from '../../assets/Frame.png';        
import frame2 from '../../assets/Frame (1).png';
import frame3 from '../../assets/Frame (2).png';
import frame4 from '../../assets/Frame (3).png';
import heroImg from '../../assets/img.png';

const Landing = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center px-6 sm:px-12 lg:px-24 py-6 w-full">
        {/* Logo */}
        <Logo size="default" showText={true} />

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-10">
          <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Home</a>
          <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Features</a>
          <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Testimonials</a>
          <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">About Us</a>
          <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Contact Us</a>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          {/* Desktop Action Buttons */}
          <div className="hidden sm:flex items-center space-x-4">
            <Link to="/signin" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Sign In
            </Link>
            <Link to="/chooseuser" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg">
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden mobile-menu-container">
            <AnimatedHamburger 
              isOpen={isMobileMenuOpen} 
              onClick={toggleMobileMenu}
            />
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 py-4 mobile-menu-container">
          <nav className="space-y-2 px-6">
            <a 
              href="#home" 
              className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg"
              onClick={closeMobileMenu}
            >
              Home
            </a>
            <a 
              href="#features" 
              className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg"
              onClick={closeMobileMenu}
            >
              Features
            </a>
            <a 
              href="#testimonials" 
              className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg"
              onClick={closeMobileMenu}
            >
              Testimonials
            </a>
            <a 
              href="#about" 
              className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg"
              onClick={closeMobileMenu}
            >
              About Us
            </a>
            <a 
              href="#contact" 
              className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg"
              onClick={closeMobileMenu}
            >
              Contact Us
            </a>
          </nav>
          
          {/* Mobile Action Buttons */}
          <div className="mt-4 pt-4 border-t border-gray-200 px-6">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/signin" 
                className="text-center text-gray-700 hover:text-blue-600 transition-colors font-medium py-2"
                onClick={closeMobileMenu}
              >
                Sign In
              </Link>
              <Link 
                to="/chooseuser" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg text-center"
                onClick={closeMobileMenu}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="w-full min-h-screen flex items-start bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 px-10 lg:px-20 pt-40 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start w-full">
          
          {/* Left Side - Text Content */}
          <div className="space-y-8 flex flex-col justify-start w-full">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-gray-900 block">Empowering</span>
              <span className="text-gray-900 block">Connections</span>
              <span className="text-green-600 block">for All Abilities</span>
            </h1>

            <p className="text-lg lg:text-xl text-gray-700 leading-relaxed max-w-2xl">
              PWDe leverages AI to bridge Persons With Disabilities with trusted, inclusive employers. 
              Discover opportunities designed with your strengths and needs in mind.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
                Find Jobs
              </button>
              <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105">
                For Employers
              </button>
            </div>

            {/* Accessibility Icons - Horizontal Row */}
            <div className="flex flex-row gap-6 mt-6">
              <img src={frame1} alt="Accessibility Icon 1" className="w-8 h-8" />
              <img src={frame2} alt="Accessibility Icon 2" className="w-8 h-8" />
              <img src={frame3} alt="Accessibility Icon 3" className="w-8 h-8" />
              <img src={frame4} alt="Accessibility Icon 4" className="w-8 h-8" />
            </div>
          </div>

          {/* Right Side */}
          <div className="relative flex items-start justify-end w-full -mr-10 lg:-mr-20">
            <img 
              src={heroImg} 
              alt="Hero Illustration" 
              className="w-full max-w-xl rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* How PWDe Works Section */}
      <div className="w-full py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-10 lg:px-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            How PWDe Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                1. Sign Up & Personalize
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Create your free profile and share your strengths, skills, and needs. Our platform is accessible and easy for everyone.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                2. AI Matching
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI matches you to inclusive roles and employers based on your profile, preferences, and accessibility requirements.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                3. Apply & Connect
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Explore opportunities, apply easily, and connect with employers committed to building accessible workplaces.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose PWDe Section */}
      <div className="w-full py-20 bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 ">
        <div className="max-w-6xl mx-auto px-10 lg:px-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Why Choose PWDe?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="text-center bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Accessible by Design
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Built to WCAG standards, our platform supports screen readers, keyboard navigation, and custom accessibility settings.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Verified Inclusive Employers
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Every employer is vetted for their commitment to accessibility, diversity, and meaningful inclusion practices.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                AI-Powered Recommendations
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Smart, unbiased job matching that goes beyond keywords—factoring in your strengths and accessibility needs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stories of Empowerment Section */}
      <div className="w-full py-20 bg-white">
        <div className="max-w-6xl mx-auto px-10 lg:px-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Stories of Empowerment
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold text-lg">A</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Anna L.</h4>
                  <p className="text-sm text-gray-500">Web Designer • Visual Impairment</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                "PWDe made job searching feel possible again. The platform just works for me and I finally found an employer who values my talents!"
              </p>
              <div className="flex text-yellow-400">
                {[1,2,3,4,5].map((star) => (
                  <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold text-lg">J</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Jason T.</h4>
                  <p className="text-sm text-gray-500">Software Developer • Mobility Disability</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                "The AI suggestions felt personalized and real. For the first time, I felt seen by a job platform."
              </p>
              <div className="flex text-yellow-400">
                {[1,2,3,4,5].map((star) => (
                  <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold text-lg">P</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Priya N.</h4>
                  <p className="text-sm text-gray-500">Manager • Deaf/Blindness</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                "PWDe helped us connect with brilliant, diverse candidates. It's a must-have for any company serious about inclusion."
              </p>
              <div className="flex text-yellow-400">
                {[1,2,3,4,5].map((star) => (
                  <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* For Employers Section */}
      <div className="w-full py-20 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="max-w-6xl mx-auto px-10 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Content */}
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-gray-900">
                For Employers
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Ready to diversify your team? PWDe connects you with talented candidates with a 
                wide range of abilities. We provide resources to help you create accessible 
                workplaces that benefit everyone on your team.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mt-1 mr-4 flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="text-gray-700">Access a diverse talent pool</span>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mt-1 mr-4 flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="text-gray-700">Guidance on inclusive hiring & onboarding</span>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mt-1 mr-4 flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="text-gray-700">Showcase your commitment to accessibility</span>
                </div>
              </div>

              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
                Post a Job
              </button>
            </div>

            {/* Right Side - Image placeholder */}
            <div className="relative flex items-center justify-center">
              <div className="w-full max-w-lg h-80 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl shadow-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">Employer Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Join PWDe Today Section */}
      <div className="w-full py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600">
        <div className="max-w-4xl mx-auto px-10 lg:px-20 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Join PWDe Today
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Empowering job seekers and employers to build a more accessible, inclusive future—together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
              Start Your Journey
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-white text-white py-16">
        <div className="max-w-6xl mx-auto px-10 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Logo and Description */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <Logo size="default" showText={true} />
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Empowering connections between talented individuals with disabilities and inclusive employers.
              </p>
              <p className="text-sm text-gray-500">
                © 2025 PWDe. All rights reserved.
              </p>
            </div>

            {/* About PWDe */}
            <div>
              <h4 className="text-lg font-semibold mb-4">About PWDe</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Our Mission</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
              </ul>
            </div>

            {/* For Job Seekers */}
            <div>
              <h4 className="text-lg font-semibold mb-4">For Job Seekers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Find Jobs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Profile</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Career Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resume Builder</a></li>
              </ul>
            </div>

            {/* For Employers & Support */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Post Jobs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing Plans</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Hiring Resources</a></li>
              </ul>
            </div>
          </div>

          {/* Social Media & Legal */}
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
            
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;