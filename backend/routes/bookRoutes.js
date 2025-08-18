// backend/routes/bookRoutes.js

// Import the 'express' library.
const express = require('express');
// Create a new router object. This is a mini-application that can handle its own routing.
const router = express.Router();

// Import the controller functions we just created.
const { getBooks, addBook, updateBook, deleteBook } = require('../controllers/bookController');

// NEW: Import our authentication middleware.
const { protect } = require('../middleware/authMiddleware');

// NEW: we apply the protect middleware to the routes.
// run before the controller functions. 
// ACTION: Apply the 'protect' middleware to all routes in this router at once.
router.use(protect);

// NEW: we apply the protect middleware to the routes.
// run before the controller functions.
// Define the routes.
// We are chaining the methods for the same URL for cleaner code.
router.route('/')
    // A GET request to '/api/books' will call the getBooks function.
    .get(getBooks)
    // A POST request to '/api/books' will call the addBook function.
    .post(addBook);

// New route for updating and deleting a specific book.
// The ':id' is a URL parameter that Mongoose will use to find the book.
// For example, a request to `/api/books/60d5ec49f1a2e7001c8c459c` will use '60d5ec49f1a2e7001c8c459c' as the ID.
router.route('/:id')
    .put(updateBook) // A PUT request will update the book.
    .delete(deleteBook); // A DELETE request will delete the book.

// Alternatively, you could write it like this (less common but same result):
// router.get('/', getBooks);
// router.post('/', addBook);

// Export the router so it can be used in our main server file (index.js).
module.exports = router;