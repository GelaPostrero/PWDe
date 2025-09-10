import React, { useState } from 'react';
import Spinner from '../../../components/ui/Spinner.jsx';

const AccessibilityFeatures = ({ data, onDataChange, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    accessibilityFeatures: data.accessibilityFeatures || []
  });

  const [featureSearch, setFeatureSearch] = useState('');
  const [additionalFeature, setAdditionalFeature] = useState('');

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
      await minLoadingTime;
      onNext();
    } catch (error) {
      console.error('Error proceeding to next step:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedFeatures = [
    'Wheelchair accessible facilities',
    'Screen reader compatible systems',
    'Assistive technology support',
    'Flexible work arrangements',
    'Sign language interpretation',
    'Adjustable desk setup',
    'Ergonomic equipment',
    'Quiet workspace options',
    'Visual impairment accommodations',
    'Hearing impairment accommodations',
    'Mobility assistance',
    'Mental health support',
    'Accessible parking',
    'Elevator access',
    'Accessible restrooms',
    'Service animal friendly',
    'Remote work options',
    'Flexible scheduling',
    'Accessible communication tools',
    'Training and development support'
  ];

  const filteredFeatures = suggestedFeatures.filter(feature =>
    feature.toLowerCase().includes(featureSearch.toLowerCase()) &&
    !formData.accessibilityFeatures.includes(feature)
  );

  const addFeature = (feature) => {
    const newFeatures = [...formData.accessibilityFeatures, feature];
    handleInputChange('accessibilityFeatures', newFeatures);
  };

  const removeFeature = (featureToRemove) => {
    const newFeatures = formData.accessibilityFeatures.filter(feature => feature !== featureToRemove);
    handleInputChange('accessibilityFeatures', newFeatures);
  };

  const addCustomFeature = () => {
    if (additionalFeature.trim()) {
      addFeature(additionalFeature.trim());
      setAdditionalFeature('');
    }
  };

  const isFeatureSelected = (featureName) => {
    return formData.accessibilityFeatures.includes(featureName);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Accessibility & Inclusion Features</h2>
        <p className="text-gray-600">Select the accessibility features and accommodations your workplace provides to ensure an inclusive environment for all employees.</p>
      </div>

      {/* Workplace Accessibility Features */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Workplace Accessibility Features</h3>

        {/* Feature Search */}
        <div className="relative mb-4">
          <input
            type="text"
            value={featureSearch}
            onChange={(e) => setFeatureSearch(e.target.value)}
            placeholder="Search for accessibility infrastructure/features"
            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Selected Features */}
        {formData.accessibilityFeatures.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {formData.accessibilityFeatures.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {feature}
                  <button
                    onClick={() => removeFeature(feature)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Feature Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {filteredFeatures.map((feature, index) => (
            <button
              key={index}
              onClick={() => addFeature(feature)}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <span className="text-sm font-medium text-gray-900">{feature}</span>
              <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          ))}
        </div>

        {/* Add Additional Feature */}
        <div className="flex gap-2">
          <input
            type="text"
            value={additionalFeature}
            onChange={(e) => setAdditionalFeature(e.target.value)}
            placeholder="Add additional accessibility infrastructure/features"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && addCustomFeature()}
          />
          <button
            onClick={addCustomFeature}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
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

export default AccessibilityFeatures;
