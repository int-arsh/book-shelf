// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// This is our main authentication middleware function.
const protect = async (req, res, next) => {
    let token;

    // Check if the request has an 'Authorization' header and if it starts with 'Bearer'.
    // The JWT is typically sent in this format: "Bearer <token>".
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get the token from the header (remove 'Bearer' prefix).
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using our secret key.
            // jwt.verify() returns the payload of the token (the user ID we embedded).
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user in the database based on the ID from the token's payload.
            // We use .select('-password') to exclude the password hash from the user object.
            const user = await User.findById(decoded.id).select('-password');

            // If the user is not found, throw an error.
            if (!user) {
                res.status(401).json({ message: 'Not authorized, user not found' });
                return;
            }

            // Attach the user object to the request.
            // This is the key step! Our protected routes will now have access to `req.user`.
            req.user = user;
            
            // Call `next()` to pass control to the next middleware or the route handler.
            next();
        } catch (error) {
            // If the token is invalid, expired, or something else goes wrong,
            // we catch the error and send an unauthorized response.
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // If there is no token at all, send an unauthorized response.
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };