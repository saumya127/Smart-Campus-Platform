const express = require('express');
const router = express.Router();
const multer = require('multer');
const StudentProfile = require('../models/StudentProfile');

// 1. Multer Configuration (Files kahan aur kis naam se save hongi)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Jo folder humne banaya hai wahan save hogi
    },
    filename: function (req, file, cb) {
        // File ke naam ke aage time lagayenge taaki same naam ki files clash na hon
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// 2. Profile Upload API
// .fields() ka use karke hum 3 alag-alag files ek sath receive kar rahe hain
router.post('/upload-profile', upload.fields([
    { name: 'tenthMarksheet', maxCount: 1 },
    { name: 'twelfthMarksheet', maxCount: 1 },
    { name: 'collegeMarksheet', maxCount: 1 }
]), async (req, res) => {
    try {
        // Text data nikal rahe hain
        const { userId, branch, passingYear, tenthMarks, twelfthMarks, cgpa, activeBacklogs } = req.body;
        
        // Database me save karne ke liye naya profile object
        const newProfile = new StudentProfile({
            userId,
            branch,
            passingYear,
            tenthMarks,
            twelfthMarks,
            cgpa,
            activeBacklogs,
            documents: {
                // req.files se file ka path nikal kar save kar rahe hain
                tenthMarksheet: req.files['tenthMarksheet'][0].path,
                twelfthMarksheet: req.files['twelfthMarksheet'][0].path,
                collegeMarksheet: req.files['collegeMarksheet'][0].path
            },
            verificationStatus: 'Pending', // Default status Pending rakhenge
            verificationMessage: 'Documents uploaded successfully. Verification in progress.'
        });

        await newProfile.save();
        res.status(200).json({ message: "Profile submitted for verification!", profile: newProfile });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during file upload" });
    }
});


// 3. Student ki khud ki profile fetch karne ki API (FIXED)
router.get('/profile/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log("👉 Dashboard ke liye Profile dhoondh rahe hain. User ID:", userId);
        
        // Find by userId
        const profile = await StudentProfile.findOne({ userId: userId });
        
        if (!profile) {
            console.log("❌ Is user ki profile database me nahi mili.");
            return res.status(404).json({ message: "Profile not found" });
        }
        
        console.log("✅ Profile mil gayi! Status:", profile.verificationStatus);
        res.status(200).json(profile);
        
    } catch (error) {
        console.error("Server Error in Fetching Profile:", error);
        res.status(500).json({ message: "Server error fetching profile" });
    }
});


module.exports = router;