const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = express.Router();

// REGISTRATION API
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check karo ki user pehle se toh nahi hai
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Password ko secure (Hash) karna
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Naya User create karna
        user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await user.save(); // Database me save
        res.status(201).json({ message: 'User registered successfully!', user });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;