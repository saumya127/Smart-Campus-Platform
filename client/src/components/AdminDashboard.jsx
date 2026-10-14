import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileCheck, LogOut, CheckCircle, XCircle, Activity, Briefcase, PlusCircle, FileText } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending'); 
  const [pendingProfiles, setPendingProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adminId, setAdminId] = useState(null);

  const [postedJobs, setPostedJobs] = useState([]);
  const [applicationsDB, setApplicationsDB] = useState([]); // NAYI STATE

  const [jobData, setJobData] = useState({
    companyName: '', jobTitle: '', jobDescription: '', package: '', deadline: '',
    minCgpa: '7.0', allowedBatches: '2025', maxBacklogs: '0'
  });
  const [selectedBranches, setSelectedBranches] = useState({ CSE: true, IT: true, ECE: false, ME: false });

  const fetchPendingProfiles = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8080/api/admin/pending-profiles');
      if(response.ok) setPendingProfiles(await response.json());
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8080/api/jobs/active-jobs');
      if (response.ok) setPostedJobs(await response.json());
    } catch (error) { console.error(error); }
  };

  // NAYA FUNCTION: Applicants fetch karne ke liye
  const fetchApplicationsDB = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8080/api/jobs/job-applicants');
      if(res.ok) setApplicationsDB(await res.json());
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) { navigate('/login'); return; }
    
    const user = JSON.parse(storedUser);
    if (user.role !== 'Admin' && user.role !== 'TnP Coordinator') { navigate('/login'); return; }
    
    setAdminId(user._id || user.id);
    fetchPendingProfiles();
    fetchJobs();
    fetchApplicationsDB(); // Call kiya
  }, [navigate]);

  const handleVerification = async (profileId, status, message) => {
    if(!window.confirm(`Are you sure you want to ${status.toLowerCase()} this profile?`)) return;
    try {
      const response = await fetch(`http://127.0.0.1:8080/api/admin/verify-profile/${profileId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, message })
      });
      if (response.ok) {
        alert(`Profile has been ${status}!`);
        fetchPendingProfiles();
      }
    } catch (error) { alert('Error updating status'); }
  };

  const handleJobInputChange = (e) => setJobData({ ...jobData, [e.target.name]: e.target.value });
  const handleBranchChange = (branch) => setSelectedBranches({ ...selectedBranches, [branch]: !selectedBranches[branch] });

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const allowedBranches = Object.keys(selectedBranches).filter(branch => selectedBranches[branch]);
    const allowedBatches = jobData.allowedBatches.split(',').map(b => b.trim());

    try {
      const response = await fetch('http://127.0.0.1:8080/api/jobs/post-job', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...jobData, allowedBranches, allowedBatches, postedBy: adminId })
      });
      
      if (response.ok) {
        alert("Placement Drive posted successfully!");
        setJobData({ companyName: '', jobTitle: '', jobDescription: '', package: '', deadline: '', minCgpa: '7.0', allowedBatches: '2025', maxBacklogs: '0' });
        fetchJobs();
        fetchApplicationsDB(); // List update
      } else {
        const errorData = await response.json();
        alert("Backend Error: " + errorData.message);
      }
    } catch (error) { alert("Network Error"); } 
    finally { setLoading(false); }
  };

  const handleLogout = () => { localStorage.removeItem('user'); navigate('/login'); };
  const getDocUrl = (path) => `http://127.0.0.1:8080/${path.replace(/\\/g, "/")}`;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6">
          <h2 className="text-xl font-bold tracking-wider uppercase text-blue-400">Smart Campus</h2>
          <p className="text-xs text-slate-400 mt-1">Placement Cell</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button onClick={() => setActiveTab('pending')} className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition ${activeTab === 'pending' ? 'bg-amber-600/20 text-amber-400' : 'text-slate-400 hover:bg-slate-800'}`}>
            <FileCheck className="w-5 h-5" /> <span className="font-medium">Pending Verifications</span>
          </button>
          <button onClick={() => setActiveTab('postJob')} className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition ${activeTab === 'postJob' ? 'bg-green-600/20 text-green-400' : 'text-slate-400 hover:bg-slate-800'}`}>
            <PlusCircle className="w-5 h-5" /> <span className="font-medium">Post a Drive</span>
          </button>
          <button onClick={() => setActiveTab('verified')} className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition ${activeTab === 'verified' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Users className="w-5 h-5" /> <span className="font-medium">Eligible Students DB</span>
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center space-x-3 text-slate-400 hover:text-red-400 px-4 py-2 w-full"><LogOut className="w-5 h-5" /> <span className="font-medium">Logout</span></button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-slate-800">
            {activeTab === 'pending' && 'Document Verification Queue'}
            {activeTab === 'postJob' && 'Placement Drives Management'}
            {activeTab === 'verified' && 'Student Applications DB'}
          </h1>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-8">
          {loading ? ( <div className="flex justify-center h-64 items-center">Loading...</div> ) 
          : activeTab === 'pending' ? (
            /* PENDING PROFILES */
            <div className="space-y-6">
              {pendingProfiles.length === 0 ? <p className="text-center p-12 bg-white rounded-xl">No pending profiles.</p> : pendingProfiles.map((profile) => (
                <div key={profile._id} className="bg-white rounded-xl border p-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold">{profile.userId?.name}</h3>
                    <p className="text-sm text-slate-500">{profile.userId?.email} | CGPA: {profile.cgpa} | Branch: {profile.branch}</p>
                    <div className="mt-2 space-x-4">
                      <a href={getDocUrl(profile.documents.tenthMarksheet)} target="_blank" rel="noreferrer" className="text-blue-500 text-sm underline">10th Doc</a>
                      <a href={getDocUrl(profile.documents.twelfthMarksheet)} target="_blank" rel="noreferrer" className="text-blue-500 text-sm underline">12th Doc</a>
                      <a href={getDocUrl(profile.documents.collegeMarksheet)} target="_blank" rel="noreferrer" className="text-blue-500 text-sm underline">College Doc</a>
                    </div>
                  </div>
                  <div className="space-x-2">
                    <button onClick={() => handleVerification(profile._id, 'Verified', 'Success')} className="bg-green-600 text-white px-4 py-2 rounded-lg">Approve</button>
                    <button onClick={() => handleVerification(profile._id, 'Rejected', 'Failed')} className="bg-red-600 text-white px-4 py-2 rounded-lg">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          ) : activeTab === 'postJob' ? (
            /* POST JOB */
            <div>
              <div className="max-w-3xl mx-auto bg-white rounded-xl border shadow-sm overflow-hidden p-6">
                <h2 className="text-lg font-bold mb-4">Post a New Drive</h2>
                <form onSubmit={handleJobSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="companyName" value={jobData.companyName} onChange={handleJobInputChange} placeholder="Company" className="border p-2 rounded" required />
                    <input type="text" name="jobTitle" value={jobData.jobTitle} onChange={handleJobInputChange} placeholder="Job Title" className="border p-2 rounded" required />
                    <input type="text" name="package" value={jobData.package} onChange={handleJobInputChange} placeholder="Package (LPA)" className="border p-2 rounded" required />
                    <input type="date" name="deadline" value={jobData.deadline} onChange={handleJobInputChange} className="border p-2 rounded" required />
                  </div>
                  <textarea name="jobDescription" value={jobData.jobDescription} onChange={handleJobInputChange} placeholder="Description" className="border p-2 rounded w-full" required />
                  <div className="grid grid-cols-3 gap-4">
                    <input type="number" step="0.1" name="minCgpa" value={jobData.minCgpa} onChange={handleJobInputChange} placeholder="Min CGPA" className="border p-2 rounded" required />
                    <input type="number" name="maxBacklogs" value={jobData.maxBacklogs} onChange={handleJobInputChange} placeholder="Max Backlogs" className="border p-2 rounded" required />
                    <input type="text" name="allowedBatches" value={jobData.allowedBatches} onChange={handleJobInputChange} placeholder="Batches (e.g. 2025)" className="border p-2 rounded" required />
                  </div>
                  <div className="flex space-x-4">
                    {['CSE', 'IT', 'ECE', 'ME'].map(branch => (
                      <label key={branch} className="flex items-center space-x-2">
                        <input type="checkbox" checked={selectedBranches[branch]} onChange={() => handleBranchChange(branch)} /> <span>{branch}</span>
                      </label>
                    ))}
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded">Publish Drive</button>
                </form>
              </div>
            </div>
          ) : (
            /* YAHAN HAI APPLICANTS TABLE JO PEHLE MISSING THA */
            <div className="space-y-8 max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                <Users className="w-6 h-6 mr-3 text-blue-600"/> Student Applications DB
              </h2>
              
              {applicationsDB.length === 0 ? (
                <p className="text-slate-500 bg-white p-6 rounded-xl border">No jobs posted yet.</p>
              ) : (
                applicationsDB.map(job => (
                  <div key={job._id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
                    <div className="bg-slate-800 px-6 py-4 flex justify-between items-center text-white">
                      <div>
                        <h3 className="font-bold text-lg">{job.companyName} - {job.jobTitle}</h3>
                        <p className="text-sm text-slate-300">Total Applicants: {job.applicants?.length || 0}</p>
                      </div>
                      <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold border border-blue-400/30">
                        {job.package} LPA
                      </span>
                    </div>
                    
                    <div className="p-0">
                      {!job.applicants || job.applicants.length === 0 ? (
                        <p className="p-6 text-slate-500 italic text-center">No students have applied for this drive yet.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                              <tr>
                                <th className="px-6 py-4 font-semibold">Student Name</th>
                                <th className="px-6 py-4 font-semibold">Email ID</th>
                                <th className="px-6 py-4 font-semibold">Branch</th>
                                <th className="px-6 py-4 font-semibold">CGPA</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {job.applicants.map(applicant => (
                                <tr key={applicant._id} className="hover:bg-slate-50 transition">
                                  <td className="px-6 py-4 font-bold text-slate-800">{applicant.userId?.name || 'N/A'}</td>
                                  <td className="px-6 py-4">{applicant.userId?.email || 'N/A'}</td>
                                  <td className="px-6 py-4 font-medium">{applicant.branch} ({applicant.passingYear})</td>
                                  <td className="px-6 py-4 font-bold text-blue-600">{applicant.cgpa}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;