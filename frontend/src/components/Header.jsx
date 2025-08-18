import logo from '../assets/logoc.png'; 
import { useAuth } from '../context/AuthContext';


const Header = ({ onSectionSelect, selectedSection }) => {
  const handleNavClick = (e, sectionName) => {
    e.preventDefault();
    onSectionSelect(sectionName);
  };

  // NEW: get the user and logout function from the context.
  const { user, logout } = useAuth();
  
  return (
    <header className="new-app-header">
      <div className="header-top-row">
        <div className="logo-container">
          <a href="#" onClick={(e) => handleNavClick(e, 'Search')}>
            <img src={logo} alt="Logo" className="logo" />
          </a>
        </div>
        <div className="search-and-nav">
          <a 
            href="#" 
            className="nav-link"
            onClick={(e) => handleNavClick(e, 'Search')}
          >
            Search
          </a>

          {/* NEW: Conditionally render auth links based on user state. */}
          {user ? (
            <>
              <a href="#" className="nav-link" onClick={logout}>Logout</a>
            </>
          ):(
            <>
              <a href="#" className="nav-link" onClick={(e) => handleNavClick(e, 'Login')}>Login</a>
              <a href="#" className="nav-link" onClick={(e) => handleNavClick(e, 'Register')}>Register</a>
            </>
          )}
        </div>
      </div>

      <div className="header-bottom-row">
        <nav className="bottom-nav">
          <a 
            href="#" 
            className={`bottom-nav-link ${selectedSection === 'Reading' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'Reading')}
          >
            Reading
          </a>
          <a 
            href="#" 
            className={`bottom-nav-link ${selectedSection === 'Completed' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'Completed')}
          >
            Completed
          </a>
          <a 
            href="#" 
            className={`bottom-nav-link ${selectedSection === 'Want to Read' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'Want to Read')}
          >
            Want to Read
          </a>
          <a 
            href="#" 
            className={`bottom-nav-link ${selectedSection === 'Notes' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'Notes')}
          >
            Notes
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
