const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// 1. Job Post karne ki API
router.post('/post-job', async (req, res) => {
    try {
        const { companyName, jobTitle, jobDescription, package, deadline, minCgpa, allowedBranches, allowedBatches, maxBacklogs, postedBy } = req.body;
        const newJob = new Job({ companyName, jobTitle, jobDescription, package, deadline, eligibilityCriteria: { minCgpa, allowedBranches, allowedBatches, maxBacklogs }, postedBy });
        await newJob.save();
        res.status(201).json({ message: "Job posted successfully!", job: newJob });
    } catch (error) {
        res.status(500).json({ message: "Failed to post job" });
    }
});

// 2. Active Jobs dekhne ki API
router.get('/active-jobs', async (req, res) => {
    try {
        const activeJobs = await Job.find({ status: 'Active' }).sort({ createdAt: -1 });
        res.status(200).json(activeJobs);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch jobs" });
    }
});

// 3. NAYI API: Student Apply Karega
router.post('/apply/:jobId', async (req, res) => {
    try {
        const { profileId } = req.body;
        const job = await Job.findById(req.params.jobId);
        
        if (!job) return res.status(404).json({ message: "Job not found" });
        if (job.applicants.includes(profileId)) return res.status(400).json({ message: "Already applied" });

        job.applicants.push(profileId);
        await job.save();
        res.status(200).json({ message: "Applied successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error applying for job" });
    }
});

// 4. NAYI API: Admin ke liye Jobs aur uske Applicants lana
router.get('/job-applicants', async (req, res) => {
    try {
        // Yahan magic ho raha hai: Jobs ke sath un bachhon ki details (.populate) nikal rahe hain
        const jobs = await Job.find()
            .populate({
                path: 'applicants',
                populate: { path: 'userId', select: 'name email' }
            }).sort({ createdAt: -1 });
            
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching applicants" });
    }
});

module.exports = router;