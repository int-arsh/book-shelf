// backend/controllers/bookController.js

// Import our Mongoose Book model.
// This gives us access to all the functions we need to interact with the 'books' collection
// in our MongoDB database (e.g., Book.find(), Book.create()).
const Book = require('../models/Book');

// --- Controller Function 1: Get All Books ---
// This function will be triggered when a GET request is made to the '/api/books' endpoint.
// The 'async' keyword is important because we will be using 'await' to wait for database operations.
const getBooks = async (req, res) => {
    try {
        // Find all documents in the 'books' collection.
        // Book.find({}) is a Mongoose method that returns all documents.
        // We use 'await' to pause the function until Mongoose has finished retrieving the data.
        const books = await Book.find({});

        // Send a success response (status 200) and the found books as a JSON array.
        // The 'res.status(200).json()' is our server's way of saying, "Here's what you asked for."
        res.status(200).json(books);
    } catch (error) {
        // If an error occurs during the database query, we catch it here.
        // We send a 500 status code (Internal Server Error) and a descriptive error message.
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// --- Controller Function 2: Add a New Book ---
// This function will be triggered when a POST request is made to the '/api/books' endpoint.
const addBook = async (req, res) => {
    // The book data will be sent in the request body (req.body).
    // Thanks to 'express.json()' middleware in our index.js, we can directly access this data.
    // We use object destructuring to pull out the fields we expect from the request body.
    const { title, author, googleBookId, posterUrl, totalPages, status } = req.body;

    // A simple validation check to make sure required fields are present.
    // If these are missing, we send back a 400 status code (Bad Request).
    if (!title || !author || !googleBookId) {
        return res.status(400).json({ message: 'Please include all required fields: title, author, and googleBookId' });
    }

    try {
        // Create a new book document in our database.
        // The 'Book.create()' method creates and saves a new document in one step.
        // Mongoose will automatically validate the data against our 'bookSchema'.
        const newBook = await Book.create({
            title,
            author,
            googleBookId,
            posterUrl,
            totalPages,
            status,
            // 'currentPage' and 'notes' have default values in our schema, so we don't need to pass them here.
        });

        // If the creation is successful, send a 201 status code (Created) and the newly created book object.
        res.status(201).json(newBook);
    } catch (error) {
        // If an error occurs, for example, if the 'googleBookId' is not unique (due to our schema),
        // we catch it here and send a 500 status code with an error message.
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Export the controller functions so they can be used in our routes file.
module.exports = {
    getBooks,
    addBook,
};