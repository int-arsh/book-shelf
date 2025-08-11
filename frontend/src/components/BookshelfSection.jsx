import BookDetails from './BookDetails'; // We'll create this component in the next step

// The BookshelfSection component takes a title and an array of books as props.
const BookshelfSection = ({ title, books, onUpdate }) => {
  return (
    <div className="bookshelf-section-container">
      <h2 className="bookshelf-section-title">{title}</h2>
      
      {/* If there are no books in this section, display a message */}
      {books.length === 0 ? (
        <p className="no-books-message">No books in this section yet.</p>
      ) : (
        // Otherwise, map over the books and display a BookCard for each.
        <div className="book-grid">
          {books.map(book => (
            // We'll create a new component for the bookshelf view later.
            // For now, let's just display the book details directly.
            // The BookDetails component will have the notes and page tracker.
            <BookDetails key={book._id} book={book} onUpdate={onUpdate} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookshelfSection;