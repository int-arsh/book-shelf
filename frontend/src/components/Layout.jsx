import Header from "./Header";

// The Layout component acts as a wrapper for our main application content.
// It takes 'children' as a prop, which means whatever components we render
// inside <Layout>...</Layout> will be displayed here.
const Layout = ({ children, onSectionSelect, selectedSection  }) => {
  return (
    <div className="layout-container">
      <Header onSectionSelect={onSectionSelect} selectedSection={selectedSection} />
      <main className="app-main">
        {children} {/* This is where the actual page content will go */}
      </main>
    </div>
  );
};

export default Layout;