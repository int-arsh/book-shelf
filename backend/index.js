
const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const connectDB = require('./config/db');

// Import our book routes.
// This line brings in our 'router' object from the 'routes/bookRoutes.js' file.
const bookRoutes = require('./routes/bookRoutes');


// Import our new Google Books API route
const apiRoutes = require('./routes/apiRoutes');

// Import our user routes.
const userRoutes = require('./routes/userRoutes');

// Define the port number our server will listen on.
// We first try to get it from environment variables (process.env.PORT), which is good for production.
// If it's not set (e.g., in development), we default to 5000.
// This is like deciding which door number our post office will use.
const PORT = process.env.PORT || 5000;

// Connect to the database.
// Call our connectDB function. This will establish the connection to MongoDB
// as soon as our server starts.
connectDB();

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

const whitelist = ['https://your-frontend-url.vercel.app']; // REPLACE WITH YOUR VERCEL URL
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

app.use(cors(corsOptions));

// Define the base route for our book API.
// Any request that starts with '/api/books' will be handled by our bookRoutes.
// For example, a GET request to http://localhost:5000/api/books will be directed to our getBooks controller.
app.use('/api/books', bookRoutes);


// Use our Google Books API proxy route
// All requests to /api/googlebooks will be handled by apiRoutes
app.use('/api/googlebooks', apiRoutes);

// Use our user routes
// All requests to /api/users will be handled by userRoutes
app.use('/api/users', userRoutes);

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