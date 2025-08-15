import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from './components/Layout';
import BookSearch from './components/BookSearch';
import BookshelfSection from './components/BookshelfSection';
import './App.css'; 


function App() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);

    // fetch all books from backend
    const initialFetchBooks = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/books');
            setBooks(response.data);
        } catch (err) {
            console.log('Eroor fetching book:', err);
            setError('Failed to load your bookshelf. Please try again.')
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
        initialFetchBooks();
    }, []);

    // filter books based on status
    const readingBooks = books.filter(book => book.status === 'reading');
    const completedBooks = books.filter(book => book.status === 'completed');
    const wantToReadBooks = books.filter(book => book.status === 'want-to-read');

    // A function to set the selected section from the Header component.
    const handleSectionSelect = (sectionName) => {
        setSelectedSection(sectionName);
    };


    const renderSelectedSection = () => {
      if (loading) {
        return <p>Loading your bookshelf...</p>;
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
          // The notes section is a bit different, it might be an aggregation of all notes.
          // For simplicity, we can have a placeholder here for now.
          return <div className="notes-page"><h1>All Notes</h1><p>Notes functionality will be built here.</p></div>;
        case 'Home':
          default:
            // This is the blank homepage with the search bar.
            return (
              <>
                <BookSearch 
                  bookshelfBooks={books} 
                  onBookAdded={handleBookAdded} 
                  onBookRemoved={handleBookRemoved}
                />
                <div className="homepage-content">
                  <p>Welcome to Your Personal <br></br>
                    Bookshelf !
                  </p>
                  <p>Find books using the search bar above or navigate to your sections in the header.</p>
                </div>
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