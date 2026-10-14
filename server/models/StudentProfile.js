const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
    // User ID se link (Taaki pata chale kis student ki profile hai)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // College Details
    branch: { type: String, required: true },
    passingYear: { type: String, required: true },
    
    // Academic Details
    tenthMarks: { type: Number, required: true },
    twelfthMarks: { type: Number, required: true },
    cgpa: { type: Number, required: true },
    activeBacklogs: { type: Number, default: 0 },
    
    // Uploaded Document Links (Backend mein save hone ke baad ka path)
    documents: {
        tenthMarksheet: { type: String, required: true },
        twelfthMarksheet: { type: String, required: true },
        collegeMarksheet: { type: String, required: true },
        resume: { type: String } // Resume verify hone ke baad ya sath me daal sakte hain
    },
    
    // System Verification Status
    verificationStatus: {
        type: String,
        enum: ['Not Started', 'Pending', 'Verified', 'Rejected'],
        default: 'Not Started'
    },
    verificationMessage: { type: String, default: '' } // Agar fail hua toh reason (e.g., "CGPA mismatch")

}, { timestamps: true });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);