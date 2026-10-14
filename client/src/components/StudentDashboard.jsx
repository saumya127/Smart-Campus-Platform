import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, CheckCircle2, Briefcase, XCircle, ChevronRight } from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('Loading'); 
  const [activeJobs, setActiveJobs] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) { navigate('/login'); return; }
    
    const user = JSON.parse(storedUser);
    if (user.role !== 'Student') { navigate('/login'); return; }
    
    setStudentData(user);

    const fetchData = async () => {
      try {
        const profileRes = await fetch(`http://127.0.0.1:8080/api/student/profile/${user._id || user.id}`);
        if (profileRes.ok) {
          const pData = await profileRes.json();
          setProfileData(pData);
          setVerificationStatus(pData.verificationStatus);
        } else {
          setVerificationStatus('Not Started');
        }

        const jobsRes = await fetch('http://127.0.0.1:8080/api/jobs/active-jobs');
        if (jobsRes.ok) setActiveJobs(await jobsRes.json());
      } catch (error) { setVerificationStatus('Not Started'); }
    };
    fetchData();
  }, [navigate]);

  const handleApply = async (jobId) => {
    if(!profileData) return;
    try {
      const response = await fetch(`http://127.0.0.1:8080/api/jobs/apply/${jobId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId: profileData._id }) // Profile ID bhej rahe hain
      });
      if (response.ok) {
        alert("Success! You have applied for this drive.");
        window.location.reload(); 
      } else {
        const err = await response.json();
        alert("Wait: " + err.message);
      }
    } catch (error) { alert("Network Error"); }
  };

  const checkEligibility = (job) => {
    if (!profileData) return { isEligible: false, reason: "Loading..." };
    const { minCgpa, allowedBranches, allowedBatches, maxBacklogs } = job.eligibilityCriteria;
    
    if (profileData.cgpa < minCgpa) return { isEligible: false, reason: `Requires ${minCgpa} CGPA` };
    if (profileData.activeBacklogs > maxBacklogs) return { isEligible: false, reason: `Max ${maxBacklogs} backlogs allowed` };
    if (!allowedBranches.includes(profileData.branch)) return { isEligible: false, reason: `Branch not allowed` };
    if (!allowedBatches.includes(profileData.passingYear.toString())) return { isEligible: false, reason: `Batch not eligible` };
    return { isEligible: true, reason: "Eligible" };
  };

  if (!studentData || verificationStatus === 'Loading') return <div className="p-10 text-center font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 shadow-sm">
        <h1 className="text-xl font-bold text-slate-800 flex items-center"><BookOpen className="w-5 h-5 mr-2 text-blue-600"/> Smart Campus</h1>
        <div className="flex items-center space-x-4">
          <p className="font-semibold">{studentData.name}</p>
          <button onClick={() => {localStorage.removeItem('user'); navigate('/login');}} className="text-red-500"><LogOut className="w-5 h-5"/></button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 mt-4">
        {verificationStatus !== 'Verified' ? (
          <div className="text-center p-12 bg-white rounded-xl shadow-sm border">
            <h2 className="text-xl font-bold">Your Status: {verificationStatus}</h2>
            <p className="mt-2 text-slate-500">Wait for Admin approval to view jobs.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3 shadow-sm">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <div>
                 <p className="text-green-800 font-bold">Profile Verified!</p>
                 <p className="text-sm text-green-700">CGPA: {profileData?.cgpa} | Branch: {profileData?.branch}</p>
              </div>
            </div>

            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b bg-slate-50"><h3 className="text-lg font-bold flex items-center"><Briefcase className="w-5 h-5 mr-2"/> Upcoming Drives</h3></div>
              <div className="p-6 space-y-4">
                {activeJobs.length === 0 ? <p className="text-center">No drives active.</p> : activeJobs.map((job) => {
                  const eligibility = checkEligibility(job);
                  
                  // Check if student has applied
                  const hasApplied = job.applicants && profileData && job.applicants.includes(profileData._id);

                  return (
                    <div key={job._id} className="border rounded-xl p-5 hover:border-blue-300">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-bold">{job.companyName}</h4>
                          <p className="text-sm">{job.jobTitle} • {job.package} LPA</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t flex justify-between items-center">
                        <div className="text-xs text-slate-500 font-medium">Req CGPA: {job.eligibilityCriteria.minCgpa}</div>
                        
                        {hasApplied ? (
                           <button disabled className="bg-green-100 text-green-700 text-sm font-bold px-4 py-2 rounded-lg flex items-center cursor-not-allowed">
                             <CheckCircle2 className="w-4 h-4 mr-1"/> Applied
                           </button>
                        ) : eligibility.isEligible ? (
                           <button onClick={() => handleApply(job._id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">
                             Apply Now
                           </button>
                        ) : (
                           <button disabled className="bg-slate-100 text-slate-400 px-4 py-2 rounded-lg font-bold flex items-center">
                             <XCircle className="w-4 h-4 mr-1"/> Not Eligible
                           </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;