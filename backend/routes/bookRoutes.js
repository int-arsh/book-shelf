// backend/routes/bookRoutes.js

// Import the 'express' library.
const express = require('express');
// Create a new router object. This is a mini-application that can handle its own routing.
const router = express.Router();

// Import the controller functions we just created.
const { getBooks, addBook } = require('../controllers/bookController');

// Define the routes.
// We are chaining the methods for the same URL for cleaner code.
router.route('/')
    // A GET request to '/api/books' will call the getBooks function.
    .get(getBooks)
    // A POST request to '/api/books' will call the addBook function.
    .post(addBook);

// Alternatively, you could write it like this (less common but same result):
// router.get('/', getBooks);
// router.post('/', addBook);

// Export the router so it can be used in our main server file (index.js).
module.exports = router;