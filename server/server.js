const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Ek simple test route taaki browser me check kar sakein
app.get('/', (req, res) => {
    res.send('Backend is 100% working on Port 8080!');
});

// Aapka Auth Route
app.use('/api/auth', require('./routes/auth'));

// .env ko bypass karke direct 8080 use kar rahe hain
const PORT = 8080;

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB successfully connected!'))
    .catch((error) => console.log('Database error:', error));

// Server ko sab networks ('0.0.0.0') par sunne ko bol rahe hain
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});