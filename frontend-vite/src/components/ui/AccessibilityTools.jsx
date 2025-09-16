import React, { useState, useEffect } from 'react';

const AccessibilityTools = ({ disabled = false }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [textSize, setTextSize] = useState('normal');
  const [screenReader, setScreenReader] = useState(false);
  const [keyboardNavigation, setKeyboardNavigation] = useState(false);
  const [focusIndicators, setFocusIndicators] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [showTools, setShowTools] = useState(false);

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedTextSize = localStorage.getItem('textSize') || 'normal';
    const savedScreenReader = localStorage.getItem('screenReader') === 'true';
    const savedKeyboardNavigation = localStorage.getItem('keyboardNavigation') === 'true';
    const savedFocusIndicators = localStorage.getItem('focusIndicators') !== 'false';
    const savedReducedMotion = localStorage.getItem('reducedMotion') === 'true';

    setIsDarkMode(savedDarkMode);
    setTextSize(savedTextSize);
    setScreenReader(savedScreenReader);
    setKeyboardNavigation(savedKeyboardNavigation);
    setFocusIndicators(savedFocusIndicators);
    setReducedMotion(savedReducedMotion);

    // Apply initial styles
    applyAccessibilityStyles(savedDarkMode, savedTextSize, savedScreenReader, savedKeyboardNavigation, savedFocusIndicators, savedReducedMotion);
  }, []);

  // Apply accessibility styles to the document
  const applyAccessibilityStyles = (darkMode, size, screenReader, keyboardNav, focusInd, reducedMotion) => {
    const root = document.documentElement;
    
    // Dark mode
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Text size
    root.classList.remove('text-small', 'text-normal', 'text-large', 'text-extra-large');
    root.classList.add(`text-${size}`);

    // Screen reader optimizations
    if (screenReader) {
      root.classList.add('screen-reader-optimized');
    } else {
      root.classList.remove('screen-reader-optimized');
    }

    // Keyboard navigation
    if (keyboardNav) {
      root.classList.add('keyboard-navigation');
    } else {
      root.classList.remove('keyboard-navigation');
    }

    // Focus indicators
    if (focusInd) {
      root.classList.add('focus-indicators');
    } else {
      root.classList.remove('focus-indicators');
    }

    // Reduced motion
    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    applyAccessibilityStyles(newDarkMode, textSize, screenReader, keyboardNavigation, focusIndicators, reducedMotion);
  };

  // Change text size
  const changeTextSize = (size) => {
    setTextSize(size);
    localStorage.setItem('textSize', size);
    applyAccessibilityStyles(isDarkMode, size, screenReader, keyboardNavigation, focusIndicators, reducedMotion);
  };

  // Toggle screen reader optimizations
  const toggleScreenReader = () => {
    const newScreenReader = !screenReader;
    setScreenReader(newScreenReader);
    localStorage.setItem('screenReader', newScreenReader.toString());
    applyAccessibilityStyles(isDarkMode, textSize, newScreenReader, keyboardNavigation, focusIndicators, reducedMotion);
  };

  // Toggle keyboard navigation
  const toggleKeyboardNavigation = () => {
    const newKeyboardNavigation = !keyboardNavigation;
    setKeyboardNavigation(newKeyboardNavigation);
    localStorage.setItem('keyboardNavigation', newKeyboardNavigation.toString());
    applyAccessibilityStyles(isDarkMode, textSize, screenReader, newKeyboardNavigation, focusIndicators, reducedMotion);
  };

  // Toggle focus indicators
  const toggleFocusIndicators = () => {
    const newFocusIndicators = !focusIndicators;
    setFocusIndicators(newFocusIndicators);
    localStorage.setItem('focusIndicators', newFocusIndicators.toString());
    applyAccessibilityStyles(isDarkMode, textSize, screenReader, keyboardNavigation, newFocusIndicators, reducedMotion);
  };

  // Toggle reduced motion
  const toggleReducedMotion = () => {
    const newReducedMotion = !reducedMotion;
    setReducedMotion(newReducedMotion);
    localStorage.setItem('reducedMotion', newReducedMotion.toString());
    applyAccessibilityStyles(isDarkMode, textSize, screenReader, keyboardNavigation, focusIndicators, newReducedMotion);
  };

  // Reset all accessibility settings
  const resetAccessibility = () => {
    setIsDarkMode(false);
    setTextSize('normal');
    setScreenReader(false);
    setKeyboardNavigation(false);
    setFocusIndicators(true);
    setReducedMotion(false);
    localStorage.removeItem('darkMode');
    localStorage.removeItem('textSize');
    localStorage.removeItem('screenReader');
    localStorage.removeItem('keyboardNavigation');
    localStorage.removeItem('focusIndicators');
    localStorage.removeItem('reducedMotion');
    applyAccessibilityStyles(false, 'normal', false, false, true, false);
  };

  return (
    <div className="relative">
      {/* Accessibility Tools Toggle Button */}
      <button
        onClick={() => setShowTools(!showTools)}
        disabled={disabled}
        className={`p-2 transition-colors rounded-lg ${
          disabled 
            ? 'text-gray-300 cursor-not-allowed opacity-60' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700'
        }`}
        aria-label="Accessibility tools"
        title="Accessibility Tools"
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
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
          />
        </svg>
      </button>

      {/* Accessibility Tools Panel */}
      {showTools && !disabled && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-4 z-50">
          <div className="px-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Accessibility Tools
            </h3>
            
            {/* Dark Mode Toggle */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-gray-600 dark:text-gray-300"
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
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Dark Mode
                  </span>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Text Size Controls */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <svg
                  className="w-5 h-5 text-gray-600 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Text Size
                </span>
              </div>
              <div className="flex space-x-2">
                {[
                  { size: 'small', label: 'A' },
                  { size: 'normal', label: 'A' },
                  { size: 'large', label: 'A' },
                  { size: 'extra-large', label: 'A' }
                ].map(({ size, label }) => (
                  <button
                    key={size}
                    onClick={() => changeTextSize(size)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      textSize === size
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    style={{
                      fontSize: size === 'small' ? '12px' : 
                               size === 'normal' ? '14px' : 
                               size === 'large' ? '16px' : '18px'
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Screen Reader Optimizations */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-gray-600 dark:text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Screen Reader Optimized
                  </span>
                </div>
                <button
                  onClick={toggleScreenReader}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    screenReader ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      screenReader ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Keyboard Navigation */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-gray-600 dark:text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enhanced Keyboard Navigation
                  </span>
                </div>
                <button
                  onClick={toggleKeyboardNavigation}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    keyboardNavigation ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      keyboardNavigation ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Focus Indicators */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-gray-600 dark:text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enhanced Focus Indicators
                  </span>
                </div>
                <button
                  onClick={toggleFocusIndicators}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    focusIndicators ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      focusIndicators ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Reduced Motion */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-gray-600 dark:text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Reduced Motion
                  </span>
                </div>
                <button
                  onClick={toggleReducedMotion}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    reducedMotion ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      reducedMotion ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Reset Button */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={resetAccessibility}
                className="w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
              >
                Reset All Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showTools && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowTools(false)}
        />
      )}
    </div>
  );
};

export default AccessibilityTools;
