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

// LOGIN API

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check karo ki email database me hai ya nahi
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found! Please register first.' });
        }

        // 2. Password verify karna (Kyunki password encrypted hai, hum bcrypt ka use karenge)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Wrong Password! Please enter correct password.' });
        }

        // 3. Login Successful! User ki details (Role ke sath) frontend ko bhej di
        res.status(200).json({
            message: 'Login successful!',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// ADMIN API

router.get('/users', async (req, res) => {
    try {
        // Database se saare users nikal rahe hain, par password hata kar (security ke liye)
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});
module.exports = router;