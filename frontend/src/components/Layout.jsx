// frontend/src/components/Layout.jsx

import React from 'react';

// The Layout component acts as a wrapper for our main application content.
// It takes 'children' as a prop, which means whatever components we render
// inside <Layout>...</Layout> will be displayed here.
const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      {/* Header section of our bookshelf */}
      <header className="app-header">
        {/* Our main application title */}
        <h1>My Personal Bookshelf</h1>
        {/* You could add navigation links here later, e.g., to different sections */}
      </header>

      {/* Main content area, where other components (like search, book lists) will be rendered */}
      <main className="app-main">
        {children} {/* This is where the actual page content will go */}
      </main>

      {/* Optional: Footer section (can be added later if needed) */}
      {/* <footer className="app-footer">
        <p>&copy; 2024 My Bookshelf App</p>
      </footer> */}
    </div>
  );
};

export default Layout;