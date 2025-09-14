import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/pwdelogo.png';

const Logo = ({ showText = false, to = '/' }) => {
  return (
    <Link to={to} className="flex items-center space-x-1" aria-label="PWDe Home">
      <img src={logo} alt="PWDe Logo" className="w-8 h-8" />
      {showText && <h1 className="text-xl font-bold text-blue-700">PWDe</h1>}
    </Link>
  );
};

export default Logo;