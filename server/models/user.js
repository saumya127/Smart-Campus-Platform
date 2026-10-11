const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ek email se ek hi account banega
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Student', 'Recruiter', 'Admin'], // Tumhare project ke 3 users
        default: 'Student'
    }
}, { timestamps: true }); // timestamps kab account bana wo time record karega

module.exports = mongoose.model('User', userSchema);