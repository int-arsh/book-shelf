import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import BookCard from './BookCard';



// This component handles searching for books.
const BookSearch = ({ bookshelfBooks, onBookAdded, onBookRemoved, onSearchActive }) => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const searchRef = useRef(null);


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
      onBookAdded(response.data); // Call the parent function to update the bookshelf state
      // setSuggestions([]);
      // setSearchResults([]);
      // setSearchText('');
      // setHasSearched(false);
      return true;
          
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
      onSearchActive(false);
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
    onSearchActive(true);
    
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
    onSearchActive(false);
  };

  // NEW: useEffect hook to handle clicks outside of the search component.
  useEffect(() => {
    // This function will be called on every click in the window.
    const handleClickOutside = (event) => {
      // If the click is outside of our searchRef element, clear the suggestions.
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };

    // Add the event listener when the component mounts.
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up the event listener when the component unmounts.
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchRef]); // The dependency array ensures this effect runs only once on mount.
  


  return (
    <div className="book-search-container" ref={searchRef}>
      {/* <h2>Search for Books</h2> */}
      <div className='search-form-wrapper'>
        <form onSubmit={handleSearch} className="search-form">
          {/* <div className='search-input-container'> */}
            <input
              type="search"
              placeholder="Enter book title or author"
              value={searchText} // The input value is controlled by our state.
              onChange={handleChange} // Call handleChange whenever the input changes.
              className="search-input"
            />
            {searchText && (
              <span className="clear-input-button" onClick={handleClearInput}>
                &times; {/* This is a simple "X" icon */}
              </span>
            )}
          {/* </div> */}
          <button type="submit" className="search-button" disabled={loading || searchText.trim() === ''}>
            {loading ? 'Searching' : 'Search'}
          </button>
        </form>
        {/* Suggestions dropdown */}
        {searchText && suggestions.length > 0 && !hasSearched && (
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
        {loading && <p className='loading-text'>Loading...</p>}
        {error && <p className='error-message'>{error}</p>}
        { searchResults.length > 0 ? (
          <>
            <p className='search-results-title'>Search Results</p>
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
          </>
        ) : (
            hasSearched && !loading && <p>No books found. Try a different search.</p>
        )}
      </div>
    </div>
  );
};

export default BookSearch;