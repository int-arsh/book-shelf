// frontend/src/components/Header.jsx

import React from 'react';
import logo from '../assets/logoc.png'; // Assuming logo is still here
const Header = () => {
  return (
    <header className="new-app-header">
      {/* Top tier of the header */}
      <div className="header-top-row">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="search-and-nav">
          <a href="#" className="nav-link">Login</a>
          <a href="#" className="nav-link">Register</a>
          <a href="#" className="nav-link">Help</a>
        </div>
      </div>

      {/* Bottom tier with horizontal navigation and branch image */}
      <div className="header-bottom-row">
        <nav className="bottom-nav">
          <a href="#" className="bottom-nav-link">Reading</a>
          <a href="#" className="bottom-nav-link">Completed</a>
          <a href="#" className="bottom-nav-link">Want to Read</a>
          <a href="#" className="bottom-nav-link">Notes</a>
          {/* <a href="#" className="bottom-nav-link">Publish</a> */}
          {/* <a href="#" className="bottom-nav-link">Store</a> */}
        </nav>
      </div>
    </header>
  );
};

export default Header;
