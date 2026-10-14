import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Briefcase, CheckCircle2, TrendingUp, Compass } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 100% REAL BACKEND CONNECTION
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    console.log("ASLI BUTTON DAB GAYA! Data backend ko ja raha hai...");
    
    try {
      const response = await fetch('http://127.0.0.1:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        alert("Success! Data added to the database!"); 
        setFormData({ name: '', email: '', password: '', role: 'Student' });
        setTimeout(() => setSuccess(false), 4000);
      } else {
        alert("Backend Error: " + data.message);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("Error: Backend connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Panel */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-10 md:p-14 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/3 translate-y-1/3 blur-2xl"></div>

          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">Smart Campus</h1>
            <h2 className="text-xl md:text-2xl font-light text-blue-200 mb-4 uppercase tracking-widest">Recruitment Platform</h2>
            <p className="text-sm text-blue-100 mb-12 opacity-80">Bridging the gap between dreams and careers.</p>

            <div className="space-y-4">
              <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 transition hover:bg-white/20">
                <div className="bg-blue-500/30 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-200" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Empowering Careers</h3>
                  <p className="text-xs text-blue-200">Unlock your true potential today</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 transition hover:bg-white/20">
                <div className="bg-indigo-500/30 p-3 rounded-lg">
                  <Compass className="w-6 h-6 text-indigo-200" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Track Your Journey</h3>
                  <p className="text-xs text-blue-200">Navigate your professional path seamlessly</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 p-10 md:p-12 bg-white flex flex-col justify-center">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-full mb-4 border border-slate-200">
              <Briefcase className="w-6 h-6 text-slate-800" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Create Your Account</h2>
            <p className="text-sm text-slate-500 mt-1">Register to start your placement & training journey</p>
          </div>

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center text-green-700 animate-pulse">
              <CheckCircle2 className="w-5 h-5 mr-3 text-green-600" />
              <p className="font-medium text-sm">Account created successfully!</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 text-sm outline-none transition-all"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 text-sm outline-none transition-all"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 text-sm outline-none transition-all"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Register As</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-slate-400" />
                </div>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-8 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 text-sm outline-none transition-all appearance-none bg-white cursor-pointer"
                >
                  <option value="Student">Student</option>
                  <option value="TnP Coordinator">TnP Coordinator</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 rounded-lg shadow-md text-sm font-bold text-white transition-all mt-6
                ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 active:scale-[0.98]'}`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Register Account'
              )}
            </button>
          </form>
          
          <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account? <span 
    onClick={() => navigate('/login')} // Click karne par /login par jayega
    className="font-bold text-slate-900 cursor-pointer hover:underline"
  >
    Sign in
  </span>
</p>
        </div>
      </div>
    </div>
  );
};

export default Register;