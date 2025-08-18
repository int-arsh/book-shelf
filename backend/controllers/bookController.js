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
        const books = await Book.find({ user: req.user.id });

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
    // NEW: Explicitly check if the user is authenticated.
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Not authorized, please log in' });
    }
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
            user: req.user.id,
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


// --- Controller Function 3: Update an Existing Book ---
// This function will be triggered when a PUT request is made to '/api/books/:id'.
const updateBook = async (req, res) => {
    try {
        // The book's unique ID is passed in the URL parameters.
        // We can access it using 'req.params.id'.
        const { id } = req.params;

        // Find the book by its ID. We use 'findById' to ensure the book exists first.
        const book = await Book.findById(id);

        // If no book is found with the given ID, return a 404 Not Found error.
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // NEW: add an ownership check.
        if (book.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Update the book in the database.
        // We use 'findByIdAndUpdate' which is a Mongoose method that finds and updates a document.
        // The first argument is the ID of the document to update.
        // The second argument is the data to update with. 'req.body' contains the new data.
        // The third argument, `{ new: true, runValidators: true }`, is important:
        // - `new: true` tells Mongoose to return the *updated* document, not the original one.
        // - `runValidators: true` ensures that any update data is checked against the schema's validation rules
        //   (e.g., ensuring currentPage is not greater than totalPages).
        const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        // Send back a success response (status 200) with the updated book object.
        res.status(200).json(updatedBook);
    } catch (error) {
        // If an error occurs (e.g., invalid ID format or validation fails), handle it here.
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// --- Controller Function 4: Delete an Existing Book ---
// This function will be triggered when a DELETE request is made to '/api/books/:id'.
const deleteBook = async (req, res) => {
    try {
        // Get the book's ID from the URL parameters.
        const { id } = req.params;

        // Find the book by its ID.
        const book = await Book.findById(id);

        // If no book is found, return a 404 Not Found error.
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // NEW: add an ownership check.
        if (book.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Delete the book from the database.
        // 'deleteOne' is a Mongoose method to remove a single document.
        // We could also use 'findByIdAndDelete(id)'.
        await Book.deleteOne({ _id: id });

        // Send a success response (status 200) with a confirmation message.
        res.status(200).json({ message: 'Book removed' });
    } catch (error) {
        // Handle any errors that occur.
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Make sure to update the 'module.exports' at the end to include our new functions.
module.exports = {
    getBooks,
    addBook,
    updateBook,
    deleteBook,
};

