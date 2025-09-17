import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/pwdelogo.png';

const Logo = ({ showText = false, to = '/', asLink = true }) => {
  const logoContent = (
    <>
      <img src={logo} alt="PWDe Logo" className="w-8 h-8" />
      {showText && <h1 className="text-md font-bold text-blue-700 ml-3">PWDe</h1>}
    </>
  );

  if (asLink) {
    return (
      <Link to={to} className="flex items-center space-x-1" aria-label="PWDe Home">
        {logoContent}
      </Link>
    );
  }

  return (
    <div className="flex items-center space-x-1" aria-label="PWDe Home">
      {logoContent}
    </div>
  );
}; 

export default Logo;