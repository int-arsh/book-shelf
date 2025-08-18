// backend/controllers/userController.js

const jwt = require('jsonwebtoken'); // To create JWTs
const User = require('../models/User'); // Import the User model

// --- Helper function to generate a JWT ---
// This function takes a user ID and creates a JWT.
const generateToken = (id) => {
    // jwt.sign() creates a new token.
    // The first argument is the payload (the data we want to embed, like the user's ID).
    // The second argument is our secret key from the .env file.
    // The third argument is an options object, specifying when the token expires.
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // The token will be valid for 30 days.
    });
};

// --- Controller Function 1: Register a New User ---
// Route: POST /api/users/register
const registerUser = async (req, res) => {
    // Extract the name, email, and password from the request body.
    const { name, email, password } = req.body;

    // Simple validation to ensure all fields are provided.
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        // Check if a user with that email already exists.
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user in the database.
        // The password will be automatically hashed thanks to the `pre('save')` middleware we wrote.
        const newUser = await User.create({
            name,
            email,
            password,
        });

        // If the user was created successfully, send a success response with user data and a token.
        if (newUser) {
            res.status(201).json({
                _id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                token: generateToken(newUser._id), // Generate and send the JWT
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        // If an error occurs (e.g., database error), send a server error response.
        res.status(500).json({ message: 'Server error' });
    }
};

// --- Controller Function 2: Authenticate a User (Login) ---
// Route: POST /api/users/login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Check for user email in the database.
    const user = await User.findOne({ email });

    // If the user exists and the password is correct, send a success response.
    // The `matchPassword` method is the custom one we added to our User model.
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id), // Generate and send the JWT
        });
    } else {
        // If the email or password is wrong, send an unauthorized error.
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// Export the controller functions so they can be used in our routes file.
module.exports = {
    registerUser,
    loginUser,
};