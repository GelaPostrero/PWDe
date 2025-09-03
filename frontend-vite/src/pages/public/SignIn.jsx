import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/dist/sweetalert2.css';
import Logo from '../../components/ui/Logo.jsx';

// Add your image import here - replace with your actual file name
import signInImg from '../../assets/div.png'; // Replace with your actual image file name

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // Get user role from location state (passed from ChooseUser component)
  useEffect(() => {
    if (location.state?.role) {
      setUserRole(location.state.role);
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, rememberMe } = formData;
    console.log("Data: ", formData);
    try {
      var url = 'http://localhost:4000/accounts/users/login';
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe })
      });

      const data = await response.json();

      if (data.success) {
        switch(data.role) {
          case 'PWD':
            setUserRole('jobseeker');
            navigate('/jobseeker/dashboard');
            break;
          case 'Employer':
            setUserRole('employer');
            navigate('/employer/dashboard');
            break;
          default:
            setUserRole('administrator');
            break;
        }
        console.log('Sign in successful:', data);
        console.log('User role:', data.role);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Sign in successful!',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        })

        if(rememberMe) {
          localStorage.setItem('authToken', data.token);
        } else {
          sessionStorage.setItem('authToken', data.token);
        }
      } else if (data.message.includes('Email not found in database.')) {
        Swal.fire({
          icon: 'error',
          html: `
            <p>The Email <b>${email}</b> is not exist in our database.</p>\n
            <p>Sign up and try again.</p>
          `,
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'bottom-end'  
        })
        setFormData({
          email: '',
          password: '',
          rememberMe: false
        })
      } else if (data.message.includes('Password did not match.')) {
        Swal.fire({
          icon: 'error',
          html: `
            <p><b>Incorrect password.</b></p>\n
            <p>Please try again with the correct password.</p>
          `,
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'bottom-end'  
        })
        setFormData({
          email: '',
          password: '',
          rememberMe: false
        })
      } else {
        console.error('Sign in failed:', data.message);
        alert(`Sign in failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Sign in failed: ', error);
    }
  };

  const handleSignUp = () => {
    // Navigate to sign up page
    console.log('Navigate to sign up');
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password page with user role
    navigate('/forgot-password', { state: { role: userRole } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo size="default" showText={true} />
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              
              {/* Left Side - Sign In Form */}
              <div className="px-8 py-12 sm:px-12 lg:px-16">
                <div className="max-w-md mx-auto">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Welcome Back to PWDe
                    </h1>
                    <p className="text-gray-600">
                      {userRole === 'employer' ? 'Access your employer dashboard.' : 'Access your inclusive opportunities dashboard.'}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter your email"
                      />
                    </div>

                    {/* Password Field */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter your password"
                      />
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          name="rememberMe"
                          type="checkbox"
                          checked={formData.rememberMe}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Remember Me</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    {/* Sign In Button */}
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors shadow-lg"
                    >
                      Sign In
                    </button>

                    {/* Sign Up Link */}
                    <div className="text-center">
                      <span className="text-gray-600">Already have an account? </span>
                      <button
                        type="button"
                        onClick={handleSignUp}
                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        Sign Up
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Side - Illustration */}
              <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 px-8 py-12 lg:px-12 flex flex-col justify-center items-center relative">
                <div className="text-center mb-8">
                  <img 
                    src={signInImg} 
                    alt="Diverse workplace illustration showing people with disabilities working together" 
                    className="w-full max-w-md mx-auto rounded-lg"
                  />
                </div>
                
                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-blue-600 mb-2">
                    Empowering potential. Enabling opportunities.
                  </h3>
                </div>

                {/* Decorative dots */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
            <p>© 2025 PWDe. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-700 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gray-700 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SignIn;