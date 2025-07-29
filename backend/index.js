// backend/index.js

// Import the 'express' library.
// Express is a framework for Node.js that makes it easy to build web applications and APIs.
// Think of it as a set of tools that helps our server handle incoming requests.
const express = require('express');

// Import the 'dotenv' library.
// This library helps us load environment variables from a .env file into process.env.
// Environment variables are like secret keys or configuration settings that we don't want
// to hardcode directly into our code, especially sensitive ones like database credentials.
require('dotenv').config();

// Create an instance of the Express application.
// This 'app' object is the core of our server. It will handle all incoming network requests.
const app = express();

// Import the 'cors' middleware.
// CORS (Cross-Origin Resource Sharing) is a security feature that prevents web pages
// from making requests to a different domain than the one that served the web page.
// Since our frontend (React) will likely be running on a different port (e.g., 5173)
// than our backend (e.g., 5000), we need to explicitly allow our frontend to talk to our backend.
const cors = require('cors');

// Define the port number our server will listen on.
// We first try to get it from environment variables (process.env.PORT), which is good for production.
// If it's not set (e.g., in development), we default to 5000.
// This is like deciding which door number our post office will use.
const PORT = process.env.PORT || 5000;

// Middleware: express.json()
// This is a built-in Express middleware function.
// It tells our Express app to understand and parse incoming requests that have JSON payloads.
// When our frontend sends data (like a new book) to our backend, it often sends it in JSON format.
// This line makes sure our server can read that JSON data.
app.use(express.json());

// Middleware: cors()
// Use the cors middleware to allow cross-origin requests.
// By calling cors() with no arguments, it enables CORS for all routes and origins.
// For a beginner, this is fine, but in a real production app, you might want to restrict
// this to only allow requests from your specific frontend domain for better security.
app.use(cors());

// Define our first route (an API endpoint).
// This is like defining a specific counter at our post office.
// When someone makes a GET request to the root URL ('/'), our server will send back "Hello from Backend!".
// This is a simple test to ensure our server is running and responding.
app.get('/', (req, res) => {
    // 'req' (request) contains information about the incoming request.
    // 'res' (response) is what we use to send a reply back to the client.
    res.send('Hello from Backend!');
});

// Start the server.
// The app.listen() method makes our Express server start listening for incoming network requests
// on the specified PORT. Once it starts listening, a callback function is executed.
app.listen(PORT, () => {
    // This message will be logged to our terminal once the server successfully starts.
    // It's a good way to confirm that everything is up and running.
    console.log(`Server is running on port ${PORT}`);
});