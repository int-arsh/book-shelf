import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from './components/Layout';
import BookSearch from './components/BookSearch';
import BookshelfSection from './components/BookshelfSection';
import './App.css'; 


function App() {
    // holds books from my database
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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







  return (
    <div className='centered-container'>
      <Layout>
        <BookSearch 
          bookshelfBooks={books}
          onBookAdded={handleBookAdded}
          onBookRemoved={handleBookRemoved}
        />

        <div className="bookshelf-sections">
          {loading && <p>Loading bookshelf...</p>}
          {error && <p className="error-message">{error}</p>}
          {!loading && !error && (
            <>
              <BookshelfSection title="Reading" books={readingBooks} onUpdate={handleBookUpdate} onBookRemoved={handleBookRemoved} />
              <BookshelfSection title="Completed" books={completedBooks} onUpdate={handleBookUpdate} onBookRemoved={handleBookRemoved} />
              <BookshelfSection title="Want to Read" books={wantToReadBooks} onUpdate={handleBookUpdate} onBookRemoved={handleBookRemoved} />
            </>
          )}
        </div>
      </Layout>
    </div>
  );
}

export default App;