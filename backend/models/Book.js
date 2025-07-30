// backend/models/Book.js

// Import the 'mongoose' library.
// Mongoose is our ODM (Object Data Modeling) tool that helps us interact with MongoDB.
const mongoose = require('mongoose');

// Define the schema for our Book model.
// A Mongoose Schema defines the structure of the documents within a MongoDB collection.
// It's like drawing the blueprint for our "book card" in the filing cabinet.
const bookSchema = mongoose.Schema(
    {
        // Field 1: 'title'
        // This will store the title of the book.
        title: {
            type: String, // Data type is String (text).
            required: true, // This field is mandatory; a book must have a title.
            trim: true, // Removes whitespace from both ends of the string.
        },
        // Field 2: 'author'
        // This will store the author's name(s).
        author: {
            type: String,
            required: true,
            trim: true,
        },
        // Field 3: 'googleBookId'
        // This is crucial. When we search using the Google Books API, each book has a unique ID.
        // We'll store this ID so we can easily retrieve full details later if needed,
        // and also to prevent adding the same book multiple times.
        googleBookId: {
            type: String,
            required: true,
            unique: true, // Ensures that no two books in our database have the same Google Book ID.
        },
        // Field 4: 'posterUrl' (or 'coverImageUrl')
        // This will store the URL to the book's cover image.
        posterUrl: {
            type: String,
            required: false, // It's possible a book might not have a cover image from the API.
            default: 'https://via.placeholder.com/150x200?text=No+Cover', // A placeholder if no cover is found.
        },
        // Field 5: 'totalPages'
        // This will store the total number of pages in the book.
        totalPages: {
            type: Number, // Data type is Number.
            required: false, // Not all books from Google Books API might have this.
            default: 0, // Default to 0 pages if not provided.
        },
        // Field 6: 'currentPage'
        // This will track the user's current page read.
        currentPage: {
            type: Number,
            required: true, // We want to track this for every book the user adds.
            default: 0, // Starts at page 0 when added.
            min: 0, // Cannot be a negative page number.
            // Custom validator to ensure currentPage doesn't exceed totalPages.
            // This is an advanced feature but good to include.
            
        },
        // Field 7: 'notes'
        // A section for the user to add personal notes about the book.
        notes: {
            type: String,
            required: false, // Notes are optional.
            default: '', // Default to an empty string.
        },
        // Field 8: 'status'
        // This defines which section the book belongs to: 'reading', 'completed', or 'want-to-read'.
        status: {
            type: String,
            required: true,
            enum: ['reading', 'completed', 'want-to-read'], // Restricts the values to these three options only.
            default: 'want-to-read', // When a book is first added, it usually goes here.
        },
        // Field 9: 'userId' (Optional for now, but good for future multi-user support)
        // If we were building a system for multiple users, each book would belong to a specific user.
        // We'll add this now for future planning, but won't fully implement multi-user until later.
        // For now, it could be a hardcoded ID or left out if we strictly stick to single-user.
        // For simplicity for a beginner project, let's omit this for now.
        // We can add it later if we decide to expand to multiple users.

    },
    {
        // Schema Options: These are extra settings for our schema.
        timestamps: true, // Adds 'createdAt' and 'updatedAt' fields automatically.
                          // These are useful for knowing when a book record was created and last modified.
    }
);

// Create the Mongoose Model.
// A Mongoose Model is a class with which we construct documents in MongoDB.
// 'Book' will be the name of our collection in MongoDB (it will automatically be pluralized to 'books').
// This 'Book' model will be used to perform all our database operations (create, read, update, delete).
const Book = mongoose.model('Book', bookSchema);

// Export the Book model so it can be imported and used in our controllers/routes.
module.exports = Book;