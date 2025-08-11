// backend/routes/apiRoutes.js

const express = require('express');
const router = express.Router();
const axios = require('axios'); // We'll need a library to make HTTP requests
require('dotenv').config();

// The Google Books API key is loaded from our .env file
const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

// Route to search for books using Google Books API
router.get('/search', async (req, res) => {
  // Get the search query from the URL parameters (e.g., /api/googlebooks/search?q=dune)
  const { q } = req.query;

  // If no search query is provided, send a bad request error
  if (!q) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try { 
    // Construct the Google Books API URL
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&key=${GOOGLE_BOOKS_API_KEY}`;
    
    // Make the request to the Google Books API using axios
    const response = await axios.get(apiUrl);

    // Send the data from Google Books API back to our frontend
    res.status(200).json(response.data);
  } catch (error) {
    // If there's an error with the API request, log it and send a server error response
    console.error('Error fetching from Google Books API:', error.message);
    res.status(500).json({ message: 'Error fetching from external API' });
  }
});

module.exports = router;