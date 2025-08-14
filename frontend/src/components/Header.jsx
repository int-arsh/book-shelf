import logo from '../assets/logoc.png'; 
const Header = () => {
  return (
    <header className="new-app-header">
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

      <div className="header-bottom-row">
        <nav className="bottom-nav">
          <a href="#" className="bottom-nav-link">Reading</a>
          <a href="#" className="bottom-nav-link">Completed</a>
          <a href="#" className="bottom-nav-link">Want to Read</a>
          <a href="#" className="bottom-nav-link">Notes</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
