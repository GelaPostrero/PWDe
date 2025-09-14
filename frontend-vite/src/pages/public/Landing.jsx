import React, { useState, useEffect } from 'react';
import logo from '../../assets/pwdelogo.png';
  import { Link } from 'react-router-dom';
import AnimatedHamburger from '../../components/ui/AnimatedHamburger.jsx';
import Footer from '../../components/ui/Footer.jsx';

import frame1 from '../../assets/Frame.png';        
import frame2 from '../../assets/Frame (1).png';
import frame4 from '../../assets/Frame (3).png';
import heroImg from '../../assets/img.png';

const Landing = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock data 
  const mockData = {
    howItWorks: [
      {
        id: 1,
        step: "01",
        title: "Create Your Profile",
        description: "Build a comprehensive profile highlighting your skills, experience, and accessibility needs.",
        icon: "👤"
      },
      {
        id: 2,
        step: "02", 
        title: "Find Opportunities",
        description: "Browse job listings from inclusive employers who value diversity and accessibility.",
        icon: "🔍"
      },
      {
        id: 3,
        step: "03",
        title: "Get Matched",
        description: "Our AI-powered matching system connects you with the perfect opportunities.",
        icon: "🤝"
      },
      {
        id: 4,
        step: "04",
        title: "Start Your Career",
        description: "Begin your journey with employers who understand and support your needs.",
        icon: "🚀"
      }
    ],
    whyChoose: [
      {
        id: 1,
        title: "Inclusive Matching",
        description: "Our AI understands accessibility needs and matches you with employers who truly value diversity.",
        icon: "🎯",
        color: "blue"
      },
      {
        id: 2,
        title: "Accessibility First",
        description: "Built to WCAG standards, our platform supports screen readers, keyboard navigation, and custom accessibility settings for everyone.",
        icon: "♿",
        color: "green"
      },
      {
        id: 3,
        title: "Career Support",
        description: "Get personalized career guidance, resume tips, and interview preparation tailored to your needs.",
        icon: "💼",
        color: "purple"
      }
    ],
    testimonials: [
      {
        id: 1,
        name: "Sarah Chen",
        role: "Software Developer",
        company: "TechCorp",
        content: "PWDe helped me find a role where my skills are valued and my accessibility needs are fully supported. The matching process was incredible!",
        rating: 5,
        avatar: "SC"
      },
      {
        id: 2,
        name: "Marcus Johnson",
        role: "Marketing Specialist", 
        company: "Inclusive Marketing Co.",
        content: "The platform's accessibility features made job searching so much easier. I felt confident and supported throughout the entire process.",
        rating: 5,
        avatar: "MJ"
      },
      {
        id: 3,
        name: "Elena Rodriguez",
        role: "UX Designer",
        company: "Design Studio Pro",
        content: "Finally, a platform that understands that disability doesn't limit potential. I found my dream job through PWDe!",
        rating: 5,
        avatar: "ER"
      }
    ],
    employerFeatures: [
      {
        id: 1,
        title: "Accessible Job Postings",
        description: "Create inclusive job descriptions that attract diverse talent",
        icon: "📝"
      },
      {
        id: 2,
        title: "Smart Matching",
        description: "AI-powered candidate matching based on skills and accessibility needs",
        icon: "🧠"
      },
      {
        id: 3,
        title: "Inclusive Hiring Tools",
        description: "Accessibility-compliant interview and assessment tools",
        icon: "🛠️"
      },
      {
        id: 4,
        title: "Diversity Analytics",
        description: "Track your inclusive hiring progress and impact",
        icon: "📊"
      }
    ]
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Smooth scroll function
  const smoothScrollTo = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      const headerHeight = 100; // Increased for better visibility
      const elementPosition = element.offsetTop - headerHeight;
      
      // Cross-browser smooth scrolling
      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      } else {
        // Fallback for older browsers
        const startPosition = window.pageYOffset;
        const distance = elementPosition - startPosition;
        const duration = 800;
        let start = null;
        
        function animation(currentTime) {
          if (start === null) start = currentTime;
          const timeElapsed = currentTime - start;
          const run = ease(timeElapsed, startPosition, distance, duration);
          window.scrollTo(0, run);
          if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        function ease(t, b, c, d) {
          t /= d / 2;
          if (t < 1) return c / 2 * t * t + b;
          t--;
          return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
      }
    }
  };

  // Handle navigation click
  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    smoothScrollTo(sectionId);
    closeMobileMenu();
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

  // Scroll animation observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe all sections with scroll-section class
    const sections = document.querySelectorAll('.scroll-section');
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
      <div className="w-full" style={{ scrollBehavior: 'smooth', WebkitScrollBehavior: 'smooth' }}>
      <style>{`
        /* Universal Margin System */
        .container-padding {
          padding-left: 1rem;    /* 16px - Mobile */
          padding-right: 1rem;   /* 16px - Mobile */
        }
        
        @media (min-width: 640px) {
          .container-padding {
            padding-left: 2rem;    /* 32px - Small */
            padding-right: 2rem;   /* 32px - Small */
          }
        }
        
        @media (min-width: 768px) {
          .container-padding {
            padding-left: 3rem;    /* 48px - Medium */
            padding-right: 3rem;   /* 48px - Medium */
          }
        }
        
        @media (min-width: 1024px) {
          .container-padding {
            padding-left: 4rem;    /* 64px - Large */
            padding-right: 4rem;   /* 64px - Large */
          }
        }
        
        @media (min-width: 1280px) {
          .container-padding {
            padding-left: 5rem;    /* 80px - XL */
            padding-right: 5rem;   /* 80px - XL */
          }
        }
        
        @media (min-width: 1536px) {
          .container-padding {
            padding-left: 6rem;    /* 96px - 2XL */
            padding-right: 6rem;   /* 96px - 2XL */
          }
        }
        
        /* Hero Section - Slightly more padding */
        .hero-padding {
          padding-left: 1.5rem;   /* 24px - Mobile */
          padding-right: 1.5rem;  /* 24px - Mobile */
        }
        
        @media (min-width: 640px) {
          .hero-padding {
            padding-left: 2.5rem;   /* 40px - Small */
            padding-right: 2.5rem;  /* 40px - Small */
          }
        }
        
        @media (min-width: 1024px) {
          .hero-padding {
            padding-left: 4rem;     /* 64px - Large */
            padding-right: 4rem;    /* 64px - Large */
          }
        }
        
        @media (min-width: 1280px) {
          .hero-padding {
            padding-left: 5rem;     /* 80px - XL */
            padding-right: 5rem;    /* 80px - XL */
          }
        }
        
        @media (min-width: 1536px) {
          .hero-padding {
            padding-left: 6rem;     /* 96px - 2XL */
            padding-right: 6rem;    /* 96px - 2XL */
          }
        }
        @-webkit-keyframes fadeInUp {
          from {
            opacity: 0;
            -webkit-transform: translateY(30px);
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            -webkit-transform: translateY(0);
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            -webkit-transform: translateY(30px);
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            -webkit-transform: translateY(0);
            transform: translateY(0);
          }
        }
        
        .fade-in-up {
          -webkit-animation: fadeInUp 0.6s ease-out forwards;
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .scroll-section {
          opacity: 0;
          -webkit-transform: translateY(30px);
          transform: translateY(30px);
          -webkit-transition: all 0.6s ease-out;
          transition: all 0.6s ease-out;
        }
        
        .scroll-section.visible {
          opacity: 1;
          -webkit-transform: translateY(0);
          transform: translateY(0);
        }
      `}</style>
      {/* Sticky Navigation Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <nav className="flex justify-between items-center container-padding py-4 w-full">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <img src={logo} alt="PWDe Logo" className="w-8 h-8" />
          <div className="text-xl font-bold text-blue-700">PWDe</div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-10">
          <button 
            onClick={(e) => handleNavClick(e, 'home')} 
            className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium text-sm hover:scale-105"
          >
            Home
          </button>
          <button 
            onClick={(e) => handleNavClick(e, 'how-it-works')} 
            className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium text-sm hover:scale-105"
          >
            Features
          </button>
          <button 
            onClick={(e) => handleNavClick(e, 'testimonials')} 
            className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium text-sm hover:scale-105"
          >
            Testimonials
          </button>
          <button 
            onClick={(e) => handleNavClick(e, 'why-choose')} 
            className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium text-sm hover:scale-105"
          >
            About Us
          </button>
          <button 
            onClick={(e) => handleNavClick(e, 'footer')} 
            className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium text-sm hover:scale-105"
          >
            Contact Us
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
              <Link to="/signin" className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm">
              Sign In
            </Link>
            <Link to="/chooseuser" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors shadow-lg">
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
          <nav className="space-y-2 container-padding">
            <button 
              onClick={(e) => handleNavClick(e, 'home')} 
              className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-300 hover:scale-105"
            >
              Home
            </button>
            <button 
              onClick={(e) => handleNavClick(e, 'how-it-works')} 
              className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-300 hover:scale-105"
            >
              Features
            </button>
            <button 
              onClick={(e) => handleNavClick(e, 'testimonials')} 
              className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-300 hover:scale-105"
            >
              Testimonials
            </button>
            <button 
              onClick={(e) => handleNavClick(e, 'why-choose')} 
              className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-300 hover:scale-105"
            >
              About Us
            </button>
            <button 
              onClick={(e) => handleNavClick(e, 'footer')} 
              className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-300 hover:scale-105"
            >
              Contact Us
            </button>
          </nav>
          
          {/* Mobile Action Buttons */}
          <div className="mt-4 pt-4 border-t border-gray-200 container-padding">
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
      </header>

      {/* Hero Section */}
      <div id="home" className="w-full min-h-screen flex items-start bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 hero-padding pt-24 pb-20 scroll-section visible">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start w-full">
          
          {/* Left Side - Text Content */}
          <div className="space-y-8 flex flex-col justify-start w-full">
            <h1 className="text-3xl lg:text-5xl font-bold leading-tight">
              <span className="text-gray-900 block">Empowering</span>
              <span className="text-gray-900 block">Connections</span>
              <span className="text-green-600 block">for All Abilities</span>
            </h1>

            <p className="text-base lg:text-lg text-gray-700 leading-relaxed max-w-2xl">
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
              <img src={logo} alt="Accessibility Icon 3" className="w-8 h-8" />
              <img src={frame4} alt="Accessibility Icon 4" className="w-8 h-8" />
            </div>
          </div>

          {/* Right Side */}
          <div className="relative flex items-start justify-end w-full -mr-10 lg:-mr-20">
            <img 
              src={heroImg} 
              alt="Hero Illustration" 
              className="w-full max-w-lg rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* How PWDe Works Section */}
      <div id="how-it-works" className="w-full min-h-screen bg-gray-50 scroll-section">
        <div className="pt-5 pb-20 min-h-screen flex flex-col justify-center">
          <div className="w-full mx-auto container-padding">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
              How PWDe Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mockData.howItWorks.map((step, index) => {
              const colorClasses = [
                'bg-green-600 from-green-100 to-green-200',
                'bg-blue-600 from-blue-100 to-blue-200', 
                'bg-purple-600 from-purple-100 to-purple-200',
                'bg-orange-600 from-orange-100 to-orange-200'
              ];
              const colorClass = colorClasses[index] || 'bg-blue-600 from-blue-100 to-blue-200';
              const [badgeColor, gradientFrom, gradientTo] = colorClass.split(' ');
              
              return (
                <div key={step.id} className="group relative bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 h-full">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className={`w-8 h-8 ${badgeColor} text-white rounded-full flex items-center justify-center font-bold text-sm`}>
                      {step.step}
                    </div>
                  </div>
                  <div className={`w-20 h-20 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-3xl">{step.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-center">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
          </div>
        </div>
      </div>

      {/* Stories of Empowerment Section */}
      <div id="testimonials" className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 scroll-section">
        <div className="pt-5 pb-20 min-h-screen flex flex-col justify-center">
          <div className="w-full mx-auto container-padding">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
              Stories of Empowerment
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockData.testimonials.map((testimonial, index) => {
              const colors = ['blue', 'green', 'purple'];
              const color = colors[index] || 'blue';
              return (
                <div key={testimonial.id} className="group bg-white rounded-2xl border border-gray-200 p-10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                  <div className="flex items-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-2xl flex items-center justify-center mr-4 shadow-md`}>
                      <span className="text-white font-bold text-xl">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500 font-medium">{testimonial.role} • {testimonial.company}</p>
                    </div>
                  </div>
                  <div className="mb-6">
                    <svg className={`w-8 h-8 text-${color}-500 mb-4`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                    </svg>
                    <p className="text-gray-700 leading-relaxed italic text-lg">
                      "{testimonial.content}"
                    </p>
                  </div>
                  <div className="flex text-yellow-400">
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          </div>
        </div>
      </div>

      {/* Why Choose PWDe Section */}
      <div id="why-choose" className="w-full min-h-screen bg-white-100 scroll-section">
        <div className="pt-5 pb-20 min-h-screen flex flex-col justify-center">
          <div className="w-full mx-auto container-padding">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
              Why Choose PWDe?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockData.whyChoose.map((feature) => (
              <div key={feature.id} className="group bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 h-full bg-white">
                <div className={`w-20 h-20 bg-gradient-to-br from-${feature.color}-100 to-${feature.color}-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>

      {/* For Employers Section */}
      <div id="employers" className="w-full min-h-screen bg-gradient-to-r from-blue-50 to-green-50 scroll-section">
        <div className="pt-5 pb-20 min-h-screen flex flex-col justify-center">
          <div className="w-full mx-auto container-padding">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-5xl font-bold text-gray-900 leading-tight">
                  For Employers
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Ready to diversify your team? PWDe connects you with talented candidates with a 
                  wide range of abilities. We provide resources to help you create accessible 
                  workplaces that benefit everyone on your team.
                </p>
              </div>
              
              <div className="space-y-6">
                {mockData.employerFeatures.map((feature) => (
                  <div key={feature.id} className="flex items-start group">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mt-1 mr-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">{feature.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-10 py-4 rounded-2xl text-lg font-bold transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl">
                Post a Job
              </button>
            </div>

            {/* Right Side - Enhanced Image placeholder */}
            <div className="relative flex items-center justify-center">
              <div className="w-full max-w-lg h-96 bg-gradient-to-br from-blue-100 via-green-100 to-purple-100 rounded-3xl shadow-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-green-500/10"></div>
                <div className="text-center relative z-10">
                  <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Employer Dashboard</h3>
                  <p className="text-gray-600 font-medium">Manage candidates and track your inclusive hiring progress</p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Join PWDe Today Section */}
      <div className="w-full py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600">
        <div className="w-full mx-auto hero-padding text-center">
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
      <div id="footer">
        <Footer />
      </div>
    </div>
  );
};

export default Landing;