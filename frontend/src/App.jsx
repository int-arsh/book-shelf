import React, { useState } from 'react';
import axios from 'axios';

const BookSearch = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [coverUrl, setCoverUrl] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(0);

  const fetchSuggestions = async (searchText) => {
    try {
      const res = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchText)}`
      );

      const items = res.data.items || [];
      setSuggestions(items.slice(0, 5)); // top 5 suggestions
    } catch (err) {
      console.error("Google Books fetch error:", err);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setCoverUrl(null);
    if (typingTimeout) clearTimeout(typingTimeout);

    setTypingTimeout(
      setTimeout(() => {
        if (value.trim()) fetchSuggestions(value);
      }, 300)
    );
  };

  const handleSelect = (book) => {
    setQuery(book.volumeInfo.title);
    setSuggestions([]);

    const thumbnail = book.volumeInfo.imageLinks?.thumbnail?.replace("http:", "https:");
    if (thumbnail) {
      setCoverUrl(thumbnail);
    } else {
      setCoverUrl(null);
      alert("Cover not found");
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h2>Book Cover Finder (Google Books)</h2>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Type book title..."
        style={{ padding: '0.5rem', width: '300px' }}
      />
      
      {suggestions.length > 0 && (
        <ul style={{
          listStyle: 'none',
          marginTop: '0.5rem',
          padding: '0',
          width: '300px',
          margin: '0 auto',
          background: '#f0f0f0',
          border: '1px solid #ccc'
        }}>
          {suggestions.map((book, index) => {
            const info = book.volumeInfo;
            return (
              <li
                key={index}
                onClick={() => handleSelect(book)}
                style={{
                  padding: '0.5rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid #ddd'
                }}
              >
                {info.title} {info.authors ? `– ${info.authors.join(", ")}` : ''}
              </li>
            );
          })}
        </ul>
      )}

      {coverUrl && (
        <div style={{ marginTop: '2rem' }}>
          <img src={coverUrl} alt="Book Cover" style={{ maxHeight: '400px' }} />
        </div>
      )}
    </div>
  );
};

export default BookSearch;
