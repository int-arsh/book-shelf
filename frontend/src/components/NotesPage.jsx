// This component will display all notes from all books.
const NotesPage = ({ books }) => {
  // Filter for books that actually have notes.
  const booksWithNotes = books.filter(book => book.notes && book.notes.trim() !== '');

  return (
    <div className="notes-page-container">
      <p className="notes-page-title">All Your Notes</p>
      {booksWithNotes.length === 0 ? (
        <p className="no-notes-message">You haven't taken any notes yet. Go to your books and add some!</p>
      ) : (
        <div className="notes-list">
          {booksWithNotes.map(book => (
            <div key={book._id} className="note-card">
              <p className="note-book-title">{book.title}</p>
              <p className="note-book-author">by {book.author}</p>
              <div className="note-content">
                <p>{book.notes}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesPage;
