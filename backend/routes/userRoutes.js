// backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');

// Define our user routes.
// POST to /api/users/register will create a new user.
router.post('/register', registerUser);

// POST to /api/users/login will authenticate a user.
router.post('/login', loginUser);

module.exports = router;