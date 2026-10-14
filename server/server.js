const express = require('express');
const path = require('path');
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
// uploaded marksheet dekhne ke liye
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Auth Route
app.use('/api/auth', require('./routes/auth'));

//student route
const studentRoutes = require('./routes/student');
app.use('/api/student', studentRoutes);

//admin route
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

//job route
const jobRoutes = require('./routes/jobs');
app.use('/api/jobs', jobRoutes);


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