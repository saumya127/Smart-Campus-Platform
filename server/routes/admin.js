const express = require('express');
const router = express.Router();
const StudentProfile = require('../models/StudentProfile');

// 1. Pending Profiles lane ki API (Yahan hum .populate ka magic use karenge)
router.get('/pending-profiles', async (req, res) => {
    try {
        // Sirf 'Pending' wale profiles dhoondh rahe hain
        // .populate('userId', 'name email') automatically User table se name aur email nikal layega
        const pendingProfiles = await StudentProfile.find({ verificationStatus: 'Pending' })
            .populate('userId', 'name email'); 
            
        res.status(200).json(pendingProfiles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error fetching profiles" });
    }
});

// 2. Profile ko Approve ya Reject karne ki API
router.put('/verify-profile/:id', async (req, res) => {
    try {
        const profileId = req.params.id;
        const { status, message } = req.body; // status hoga 'Verified' ya 'Rejected'

        const updatedProfile = await StudentProfile.findByIdAndUpdate(
            profileId,
            { 
                verificationStatus: status,
                verificationMessage: message 
            },
            { new: true } // Update hone ke baad naya data return karega
        );

        res.status(200).json({ message: `Profile successfully ${status}`, profile: updatedProfile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating verification status" });
    }
});

module.exports = router;