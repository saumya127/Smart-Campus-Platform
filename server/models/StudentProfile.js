const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Ye User.js se link ho jayega
        required: true
    },
    aktuRollNumber: {
        type: String,
        required: true,
        unique: true
    },
    branch: {
        type: String,
        required: true
    },
    cgpa: {
        type: Number,
        required: true
    },
    activeBacklogs: {
        type: Number,
        default: 0
    },
    links: {
        github: { type: String },
        linkedin: { type: String }
    },
    documents: {
        resumeUrl: { type: String }, // Jab file upload hogi tab yaha link aayegi
        marksheetUrl: { type: String }
    },
    experience: [{
        company: String,
        role: String,
        stipend: String,
        duration: String
    }],
    isVerifiedByTnP: {
        type: Boolean,
        default: false // Jab tak TnP verify nahi karega, ye false rahega
    },
    discrepancyReported: {
        type: String,
        default: null // Agar TnP koi mistake dekhta hai, toh yaha reason aayega
    }
}, { timestamps: true });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);