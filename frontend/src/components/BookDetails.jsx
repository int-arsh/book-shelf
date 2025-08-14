// frontend/src/components/BookDetails.jsx

import React, { useState } from 'react';
import axios from 'axios';

// This component displays a single book on the bookshelf with notes and page tracking.
const BookDetails = ({ book, onUpdate }) => {
  // State for the notes and currentPage, so we can update them locally.
  const [notes, setNotes] = useState(book.notes || '');
  const [currentPage, setCurrentPage] = useState(book.currentPage);
  
  // State to track if we're currently updating the page count or notes.
  const [isUpdating, setIsUpdating] = useState(false);

  // A local variable to determine the book's status based on page count.
  let currentStatus = book.status;
  if (currentPage > 0 && currentPage < book.totalPages) {
    currentStatus = 'reading';
  } else if (currentPage >= book.totalPages && book.totalPages > 0) {
    currentStatus = 'completed';
  } else {
    currentStatus = 'want-to-read';
  }

  // Function to handle updating a book in the database.
  const handleUpdate = async (updatedData) => {
    setIsUpdating(true);
    try {

      // Check if the status needs to be updated based on the new page count.
      // This is the core of our new logic.
      if (updatedData.currentPage !== undefined) {
        let newStatus = 'want-to-read';
        if (updatedData.currentPage > 0 && updatedData.currentPage < book.totalPages) {
          newStatus = 'reading';
        } else if (updatedData.currentPage >= book.totalPages && book.totalPages > 0) {
          newStatus = 'completed';
        }
        
        // If the new status is different from the old one, include it in the update data.
        if (newStatus !== book.status) {
          updatedData.status = newStatus;
        }
      }

      const response = await axios.put(`http://localhost:5000/api/books/${book._id}`, updatedData);
      console.log('Book updated successfully!');

      // The key change: After a successful update, we call the onUpdate function
      // passed from the parent. This will cause the bookshelf to re-render.
      if (onUpdate) {
        onUpdate(response.data);
      }

    } catch (err) {
      console.error('Error updating book:', err);
      alert('Failed to update book. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePageChange = (newPage) => {
    // Ensure the new page count is within a valid range.
    if(newPage >= 0 && newPage <= book.totalPages) {
        setCurrentPage(newPage);
        handleUpdate({ currentPage: newPage });
    }
  };



  // Function to handle changes in the notes textarea.
  const handleNotesChange = (e) => {
    setNotes(e.target.value);
    // You could save this automatically after a short delay (debouncing) or on blur.
    // For simplicity, we'll save it on a blur event.
  };

  const handleNotesBlur = () => {
    handleUpdate({ notes: notes });
  };
  
  const progressBarWidth = (currentPage / book.totalPages) * 100;

  return (
    <div className="book-card-on-shelf">
      <img src={book.posterUrl} alt={`${book.title} cover`} className="book-poster-shelf" />
      <div className="book-details-shelf">
        <p className="book-title">{book.title}</p>
        <p className="book-author">by {book.author}</p>

        {/* Page progress bar */}
        {book.totalPages > 0 && (
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${progressBarWidth}%` }}></div>
              <div className='progress-controls'>
              <p className="progress-text">
                {currentPage} / {book.totalPages} pages
              </p>
              <div className="page-buttons">
                <button 
                  onClick={() => handlePageChange(currentPage - 10)} 
                  disabled={isUpdating || currentPage <= 0} 
                  className="page-button"
                >-10</button>
                <button 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={isUpdating || currentPage <= 0} 
                  className="page-button"
                >-1</button>
                <button 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={isUpdating || currentPage >= book.totalPages} 
                  className="page-button"
                >+1</button>
                <button 
                  onClick={() => handlePageChange(currentPage + 10)} 
                  disabled={isUpdating || currentPage >= book.totalPages} 
                  className="page-button"
                >+10</button>
              </div>
            </div>

            {/* Slider for more precise control */}
            <input
              type="range"
              min="0"
              max={book.totalPages}
              value={currentPage}
              onChange={(e) => handlePageChange(Number(e.target.value))}
              className="page-slider"
              disabled={isUpdating}
            />
            </div>
        )}

        {/* Notes section */}
        <div className="notes-container">
          <p>Your Notes</p>
          <textarea
            value={notes}
            onChange={handleNotesChange}
            onBlur={handleNotesBlur} // Save notes when the user clicks away
            placeholder="Add your notes here..."
            className="notes-textarea"
            rows="10"
            cols="20"
            
          />
        </div>
      </div>
    </div>
  );
};

export default BookDetails;