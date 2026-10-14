const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    jobDescription: { type: String, required: true },
    package: { type: String, required: true },
    deadline: { type: Date, required: true },
    
    eligibilityCriteria: {
        minCgpa: { type: Number, required: true },
        allowedBranches: [{ type: String }],
        allowedBatches: [{ type: String }],
        maxBacklogs: { type: Number, default: 0 }
    },
    
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Active', 'Closed'], default: 'Active' },
    
    // NAYA: Jo bachhe apply karenge unki ID yahan save hogi
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile' }]
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);