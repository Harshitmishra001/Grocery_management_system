// backend/routes/auth.js
const express = require('express');
const router = express.Router();

// Dummy login endpoint with robust error handling
router.post('/login', async(req, res, next) => {
    try {
        const { email, password } = req.body;
        // Placeholder: Validate email and password (to be replaced with real auth logic)
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Simulate authentication process
        // In a real app, query your database, verify password, and generate a token.
        const user = { id: 1, email, name: 'Test User' }; // Dummy user object

        // Respond with user details and token (dummy token here)
        res.status(200).json({ message: 'User logged in', user, token: 'dummy-token' });
    } catch (error) {
        next(error);
    }
});

// Dummy register endpoint for future implementation
router.post('/register', async(req, res, next) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        // Simulate user registration process
        const newUser = { id: 2, email, name };
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        next(error);
    }
});

module.exports = router;