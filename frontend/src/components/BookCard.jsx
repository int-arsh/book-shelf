import { useState } from "react";

// The BookCard component takes a `book` object as a prop.
// It also takes an optional `onAdd` prop, which is a function that will be called
// when the user clicks the "Add" button.
const BookCard = ({ book, isBookOnShelf, onAdd, onRemove }) => {
  const title = book.volumeInfo.title || 'No Title Available';
  const author = book.volumeInfo.authors?.join(', ') || 'Unknown Author';
  const posterUrl = book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150x200?text=No+Cover';
  const totalPages = book.volumeInfo.pageCount || 0;
  const googleBookId = book.id;

  // The `handleAdd` function checks if the `onAdd` prop was provided and calls it
  // With the relevant book data.
  const handleAdd = async () => {
    try {
      await onAdd({title, author, posterUrl, totalPages, googleBookId });
    } catch (err) {
      // The error is already handled by the parent, so we don't need to do anything here.
    }
  };

  const handleRemove = async () => {
    if (window.confirm(`Are you sure you want to remove "${title}" from your bookshelf?`)) {
        await onRemove(googleBookId);
    }
  };

  return (
    <div className="book-card">
      <img src={posterUrl} alt={`${title} cover`} className="book-poster" />
      <div className="book-details">
        <h3 className="book-title">{title}</h3>
        <p className="book-author">by {author}</p>
        <p className="book-pages">{totalPages} pages</p>
        
        {/* We only show the Add button if the `onAdd` prop is provided.
            This makes the component reusable for both search results and the bookshelf. */}
        {onAdd && (
            isBookOnShelf ? (
              <button className="remove-button" onClick={handleRemove}>
                Remove from Bookshelf
              </button>
            ) : (
              <button className="add-button" onClick={handleAdd}>
                Add to Bookshelf
              </button>
            )
        )}  
      </div>
    </div>
  );
};

export default BookCard;