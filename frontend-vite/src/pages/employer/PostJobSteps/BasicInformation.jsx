import React, { useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../../utils/api.js';
import Spinner from '../../../components/ui/Spinner.jsx';

const BasicInformation = ({ data, onDataChange, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    jobTitle: data.jobTitle || '',
    jobCategory: data.jobCategory || '',
    employmentType: data.employmentType || '',
    workArrangement: data.workArrangement || '',
    city: data.city || '',
    province: data.province || '',
    country: data.country || '',
    salaryType: data.salaryType || '',
    minimumSalary: data.minimumSalary || 0,
    maximumSalary: data.maximumSalary || 0,
    experienceLevel: data.experienceLevel || ''
  });

  const handleInputChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onDataChange(newData);
  };

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    setIsLoading(true);
    
    // Add minimum loading time to see spinner (remove this in production)
    const minLoadingTime = new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const response = await api.post('/create/basic-information', formData);

      await minLoadingTime;
      
      if (response.data.success) {
        onNext();
      }
    } catch (error) {
      Swal.fire({
        icon: 'warning',
        title: error.response.data.error,
        toast: true,
        position: 'bottom-end',
        timer: 3000,
        showConfirmButton: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  const jobCategories = [
    'Programming',
    'Design',
    'Marketing',
    'Sales',
    'Customer Service',
    'Human Resources',
    'Finance',
    'Operations',
    'Management',
    'Other'
  ];

  const employmentTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Freelance',
    'Internship'
  ];

  const workArrangements = [
    'Remote',
    'Hybrid',
    'On-Site'
  ];

  const cities = [
    'Manila',
    'Cebu City',
    'Davao City',
    'Quezon City',
    'Makati City',
    'Taguig City',
    'Pasig City',
    'Parañaque City',
    'Las Piñas City',
    'Muntinlupa City'
  ];

  const provinces = [
    'Metro Manila',
    'Cebu',
    'Davao del Sur',
    'Laguna',
    'Cavite',
    'Rizal',
    'Bulacan',
    'Pampanga',
    'Batangas',
    'Quezon'
  ];

  const countries = [
    'Philippines',
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'Singapore',
    'Malaysia',
    'Thailand',
    'Vietnam',
    'Indonesia'
  ];

  const salaryTypes = [
    'Weekly',
    'Bi-weekly',
    'Monthly',
    'Yearly',
    'Hourly'
  ];

  const experienceLevels = [
    'Entry Level',
    'Mid Level',
    'Senior Level',
    'Executive Level'
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
        <p className="text-gray-600">Enter the fundamental details about this position</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Title */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Title
          </label>
          <input
            type="text"
            value={formData.jobTitle}
            onChange={(e) => handleInputChange('jobTitle', e.target.value)}
            placeholder="Enter Job Title (e.g., Project Manager, UX Designer, Data Analyst)"
            className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 appearance-none"
          />
        </div>

        {/* Job Category */}
        <div className='md:col-span-2'>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Category
          </label>
          <div className="relative">
            <select
              value={formData.jobCategory}
              onChange={(e) => handleInputChange('jobCategory', e.target.value)}
              className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 appearance-none"
            >
              <option value="">Choose job category</option>
              {jobCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Employment Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employment Type
          </label>
          <div className="relative">
            <select
              value={formData.employmentType}
              onChange={(e) => handleInputChange('employmentType', e.target.value)}
              className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 appearance-none"
            >
              <option value="">Choose employment type</option>
              {employmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Work Arrangement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Work Arrangement
          </label>
          <div className="relative">
            <select
              value={formData.workArrangement}
              onChange={(e) => handleInputChange('workArrangement', e.target.value)}
              className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 appearance-none"
            >
              <option value="">Choose work arrangement</option>
              {workArrangements.map((arrangement) => (
                <option key={arrangement} value={arrangement}>
                  {arrangement}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <div className="relative">
            <select
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 appearance-none"
            >
              <option value="">Choose city</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Province */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Province
          </label>
          <div className="relative">
            <select
              value={formData.province}
              onChange={(e) => handleInputChange('province', e.target.value)}
              className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 appearance-none"
            >
              <option value="">Choose Province</option>
              {provinces.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <div className="relative">
            <select
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 appearance-none"
            >
              <option value="">Choose Country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Salary Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Salary Type
          </label>
          <div className="relative">
            <select
              value={formData.salaryType}
              onChange={(e) => handleInputChange('salaryType', e.target.value)}
              className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 appearance-none"
            >
              <option value="">Choose salary type</option>
              {salaryTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Minimum Salary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Salary
          </label>
          <input
            type="number"
            value={formData.minimumSalary}
            onChange={(e) => handleInputChange('minimumSalary', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 appearance-none"
          />
        </div>

        {/* Maximum Salary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Salary
          </label>
          <input
            type="number"
            value={formData.maximumSalary}
            onChange={(e) => handleInputChange('maximumSalary', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 appearance-none"
          />
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience Level
          </label>
          <div className="relative">
            <select
              value={formData.experienceLevel}
              onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
              className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 appearance-none"
            >
              <option value="">Choose experience level</option>
              {experienceLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          disabled={isLoading}
          className={`px-6 py-3 border border-gray-300 rounded-lg transition-colors ${
            isLoading 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          disabled={isLoading}
          className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 ${
            isLoading
              ? 'bg-gray-400 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isLoading ? (
            <>
              <Spinner size="sm" color="white" />
              <span>Processing...</span>
            </>
          ) : (
            'Next →'
          )}
        </button>
      </div>
    </div>
  );
};

export default BasicInformation;
