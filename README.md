# Smart Campus Placement Portal

A full-stack MERN (MongoDB, Express, React, Node.js) web application designed to automate and streamline the campus placement process. It features a Smart Eligibility Engine that filters job opportunities for students based on their verified academic credentials.

##  Key Features

###  For Students:
* **Academic Profile Management:** Upload 10th, 12th, and College marksheets.
* **Real-time Verification Tracking:** Track document verification status (Pending/Verified/Rejected).
* **Smart Dashboard:** View active placement drives only when eligible (matching CGPA, Branch, Batch, and Backlogs).
* **One-Click Apply:** Seamlessly apply for eligible campus drives.

### For Admins / TnP Cell:
* **Document Verification Queue:** View student profiles and securely access uploaded marksheets to approve or reject them.
* **Placement Drive Management:** Post new job opportunities with strict eligibility rules (Min CGPA, Allowed Branches, Allowed Batches, Max Backlogs).
* **Application Tracking:** Dedicated dashboard to view a structured list of students who have applied for specific drives.

## Tech Stack
* **Frontend:** React.js, Tailwind CSS, Lucide Icons
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose

## Installation & Setup

**1. Clone the repository:**
```bash

git clone https://github.com/saumya127/Smart-Campus-Platform.git
cd Smart-Campus-Platform