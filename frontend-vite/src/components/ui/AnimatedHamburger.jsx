import React from 'react';

const AnimatedHamburger = ({ isOpen, onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative w-6 h-6 flex flex-col justify-center items-center transition-all duration-300 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      aria-label="Toggle mobile menu"
    >
      {/* Top line */}
      <span
        className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 ease-in-out ${
          isOpen ? 'rotate-45 translate-y-1.5' : ''
        }`}
      />
      
      {/* Middle line */}
      <span
        className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 ease-in-out mt-1 ${
          isOpen ? 'opacity-0' : ''
        }`}
      />
      
      {/* Bottom line */}
      <span
        className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 ease-in-out mt-1 ${
          isOpen ? '-rotate-45 -translate-y-1.5' : ''
        }`}
      />
    </button>
  );
};

export default AnimatedHamburger;
