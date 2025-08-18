import { useState, useEffect } from 'react';
// import axios from 'axios';
import api from './api';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import BookSearch from './components/BookSearch';
import BookshelfSection from './components/BookshelfSection';
import Login from './components/Login';
import Register from './components/Register';
import NotesPage from './components/NotesPage';
import './App.css'; 


function App() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [isSearchActive, setIsSearchActive] = useState(false);
    // NEW: get the user from the context.
    const { user } = useAuth();

    // // New: set up a default authorization header for all axios requests.
    // useEffect(() => {
    //   if (user && user.token) {
    //     axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    //   } else {
    //     delete axios.defaults.headers.common['Authorization'];
    //   }
    // }, [user]);

    // fetch all books from backend
    const initialFetchBooks = async () => {
        setLoading(true);
        try {
            const response = await api.get('/books');
            setBooks(response.data);
        } catch (err) {
            console.log('Eroor fetching book:', err);
            // if the user is logged in, still show the error message.it might be token issue.
            setError(err.response?.data?.message || 'Failed to load your bookshelf. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // NEW: A function to add a single book to the state without a full re-fetch.
    const handleBookAdded = (newBook) => {
        setBooks(prevBooks => [...prevBooks, newBook]);
    };

    // NEW: A function to remove a single book from the state.
    const handleBookRemoved = (bookId) => {
        setBooks(prevBooks => prevBooks.filter(book => book._id !== bookId));
    };

    /// A targeted update function for when a book's page count or notes change.
    const handleBookUpdate = (updatedBook) => {
        setBooks(prevBooks => 
        prevBooks.map(book => 
            book._id === updatedBook._id ? updatedBook : book)
        );
    };

    // render on mount
    useEffect(() => {
      // only fetch books if the user is logged in.
      if (user) {
          initialFetchBooks();
      } else {
        setBooks([]);
        setLoading(false);
      }
    }, [user]);

    // NEW: This useEffect listens for logout and changes the view.
  useEffect(() => {
    if (!user) {
      // If the user is logged out, navigate to the Login page.
      setSelectedSection('Login');
    }
  }, [user]);

    // filter books based on status
    const readingBooks = books.filter(book => book.status === 'reading');
    const completedBooks = books.filter(book => book.status === 'completed');
    const wantToReadBooks = books.filter(book => book.status === 'want-to-read');

    // A function to set the selected section from the Header component.
    const handleSectionSelect = (sectionName) => {
        setSelectedSection(sectionName);
        if (sectionName !== 'Home') {
          setIsSearchActive(false);
        }
    };


    const renderSelectedSection = () => {
      // if the user is not logged in, render the login or register component.
      if (!user) {
        switch (selectedSection) {
          case 'Login':
            return <Login onNavigate={handleSectionSelect} />;
          case 'Register':
            return <Register onNavigate={handleSectionSelect} />;
          default:
            return <p className='homepage-content'>Please login to view your bookshelf.</p>;
        } 
      }

      if (loading) {
        return <p className='homepage-content'>Loading your bookshelf...</p>;
      }
      if (error) {
        return <p className="error-message">{error}</p>;
      }
      
      
      switch (selectedSection) {
        case 'Reading':
          return <BookshelfSection title="Reading" books={readingBooks} onUpdate={handleBookUpdate} onBookRemoved={handleBookRemoved} />;
        case 'Completed':
          return <BookshelfSection title="Completed" books={completedBooks} onUpdate={handleBookUpdate} onBookRemoved={handleBookRemoved} />;
        case 'Want to Read':
          return <BookshelfSection title="Want to Read" books={wantToReadBooks} onUpdate={handleBookUpdate} onBookRemoved={handleBookRemoved} />;
        case 'Notes':
          return <NotesPage books={books} />;
        case 'Home':
          default:
            // This is the blank homepage with the search bar.
            return (
              <>
                {/* NEW: Conditionally render the homepage content */}
                <BookSearch 
                  bookshelfBooks={books} 
                  onBookAdded={handleBookAdded} 
                  onBookRemoved={handleBookRemoved}
                  onSearchActive={setIsSearchActive}
                />
                {!isSearchActive && (
                  <div className="homepage-content">
                    <p>Welcome to Your Personal <br></br>
                      Bookshelf !
                    </p>
                    <p>Find books using the search bar above or navigate to your sections in the header.</p>
                  </div>
                )}
                
              </>
          );
      }
    };    

  return (
    <div className="centered-container">
      <Layout onSectionSelect={handleSectionSelect} selectedSection={selectedSection}>
        {renderSelectedSection()}
      </Layout>
    </div>
  );
}

export default App;