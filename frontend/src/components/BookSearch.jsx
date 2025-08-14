import { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from './BookCard';



// This component handles searching for books.
const BookSearch = ({ bookshelfBooks, onBookAdded, onBookRemoved }) => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);


  // A helper function to check if a book is already on the bookshelf.
  const isBookOnBookshelf = (googleBookId) => {
    return bookshelfBooks.some(book => book.googleBookId === googleBookId);
  };

  // adding a book to database
  const handleAddBook = async (bookData) => {
    try{
        // Post request to backend api to add book
        const response = await axios.post('http://localhost:5000/api/books', {
            ...bookData,
            status: 'want-to-read', // Set the initial status
        });
        console.log('book added successfully:', response.data);
        // alert(`${bookData.title} was added to ypur bookshelf!`);
        onBookAdded(response.data); // Call the parent function to update the bookshelf state
        
    } catch (err) {
        console.log('Error adding book:', err);
        // book already on the bookshelf
        if (err.response && err.response.data.message && err.response.data.message.includes('duplicates')) {
            alert('This book is already on your bookshelf!')
        } else {
            alert('Failed to add book. Please try again');
        }
        // throw an error so the bookcard can catch it
        throw err;
    }
  };

  const handleRemoveBook = async (googleBookId) => {
    // Find the book's database ID from the bookshelfBooks array.
    const bookToRemove = bookshelfBooks.find(b => b.googleBookId === googleBookId);
    if (!bookToRemove) return; // Should not happen

    try {
      await axios.delete(`http://localhost:5000/api/books/${bookToRemove._id}`);
    //   alert(`${bookToRemove.title} was removed from your bookshelf.`);
      // Call the parent's function with the book's database ID.
      onBookRemoved(bookToRemove._id);
    } catch (err) {
        console.error('Error removing book:', err);
        alert('Failed to remove book. Please try again.');
    }
};


  // Function to handle changes in the input field.
  // It updates the `searchText` state whenever the user types.
  const handleChange = (e) => {
    const query = e.target.value;
    setSearchText(query);
    // If the input is cleared, clear everything.
    if (query.trim() === '') {
      setSuggestions([]);
      setSearchResults([]);
      setHasSearched(false);
    }
  };
  
  // NEW: Debouncing logic for suggestions.
  useEffect(() => {
      // We only want to search for suggestions if the search text is not empty.
      if (searchText.trim() === '') {
          setSuggestions([]);
          return; // Stop here if the query is empty.
        }
        setSuggestionsLoading(true);
        // Set a timer to wait for 300ms after the user stops typing.
        const timer = setTimeout(async () => {
            try {
        const response = await axios.get(`http://localhost:5000/api/googlebooks/search?q=${searchText}&maxResults=5`);
        // Take the top 4 suggestions.
        const topSuggestions = response.data.items ? response.data.items.slice(0, 4) : [];
        setSuggestions(topSuggestions);
    } catch (err) {
        console.error('Error fetching suggestions:', err);
    } finally {
        setSuggestionsLoading(false);
      }
    }, 300);
    
    // This is the cleanup function. It runs every time the useEffect runs again,
    // which means it clears the timer if the user types another letter before 300ms.
    return () => clearTimeout(timer);
  }, [searchText]); // The effect runs whenever `searchText` changes.


  // Function to handle the search button click or form submission.

  const handleSearch = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    setError(null);
    setSuggestions([]); // Clear suggestions when a search is made
    setHasSearched(true); // Set this to true to indicate a search has been made
    
    try {
      // Use our backend proxy route to search for books
      const response = await axios.get(`http://localhost:5000/api/googlebooks/search?q=${searchText}`);
      // We only care about the `items` array, which contains the books
      setSearchResults(response.data.items || []);
      console.log(response.data)

    } catch (err) {
      console.error('Error searching for books:', err);
      setError('Failed to fetch books. Please try again.');
    } finally {
      setLoading(false); // Set loading back to false when the request is complete
    }    
  };

  // NEW: Function to clear the input field and results.
  const handleClearInput = () => {
    setSearchText('');
    setSuggestions([]);
    setSearchResults([]);
    setHasSearched(false);
  };


  return (
    <div className="book-search-container">
      {/* <h2>Search for Books</h2> */}
      <div className='search-form-wrapper'>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Enter book title or author"
            value={searchText} // The input value is controlled by our state.
            onChange={handleChange} // Call handleChange whenever the input changes.
            className="search-input"
          />
          {searchText && (
            <button type="button" className="clear-input-button" onClick={handleClearInput}>
              &times; {/* This is a simple "X" icon */}
            </button>
          )}
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
        {/* Suggestions dropdown */}
        {searchText && suggestions.length > 0 && (
          <ul className="search-suggestions">
            {suggestions.map((book) => (
              <li key={book.id} className="suggestion-item" onClick={() => {
                setSearchText(book.volumeInfo.title);
                handleSearch({ preventDefault: () => {} }); // Call handleSearch without an event
              }}>
                {book.volumeInfo.title}
              </li>
            ))}
            </ul>
        )}
      </div>

      <div className="search-results">
        {hasSearched && !suggestionsLoading && searchResults.length > 0 ? (
            <div className='search-results-grid'>
                {searchResults.map((book) => (
                    <BookCard
                        key={book.id}
                        book={book}
                        isBookOnShelf={isBookOnBookshelf(book.id)}
                        onAdd={handleAddBook}
                        onRemove={handleRemoveBook}
                    />
                ))}
            </div>
        ) : (
            hasSearched && !loading && <p>No books found. Try a different search.</p>
        )}
      </div>
    </div>
  );
};

export default BookSearch;