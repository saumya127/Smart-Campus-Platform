import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, CheckCircle2, TrendingUp, Compass, AlertCircle } from 'lucide-react';

const Login = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Purana error clear kar rahe hain
    
    try {
      const response = await fetch('http://127.0.0.1:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        localStorage.setItem('user', JSON.stringify(data.user)); // User data save kar rahe hain
        
        // SMART REDIRECTION LOGIC 
        const userRole = data.user.role;
        
        if (userRole === 'TnP Coordinator' || userRole === 'Admin') {
            navigate('/admin-dashboard');
        } 
        else if (userRole === 'Student') {
            navigate('/student-dashboard');
        } 

      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError("Not Connected to the server, please check whether your server is running or not.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Panel - Theme matching with Register */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-10 md:p-14 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/3 translate-y-1/3 blur-2xl"></div>

          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">Welcome Back</h1>
            <h2 className="text-xl md:text-2xl font-light text-blue-200 mb-4 uppercase tracking-widest">Smart Campus Portal</h2>
            <p className="text-sm text-blue-100 mb-12 opacity-80">Log in to continue your placement and training journey.</p>

            <div className="space-y-4">
              <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 transition hover:bg-white/20">
                <div className="bg-blue-500/30 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-200" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Track Progress</h3>
                  <p className="text-xs text-blue-200">View real-time updates on your applications</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full md:w-1/2 p-10 md:p-12 bg-white flex flex-col justify-center">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Sign In</h2>
            <p className="text-sm text-slate-500 mt-1">Enter your email and password to access your dashboard</p>
          </div>

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center text-green-700">
              <CheckCircle2 className="w-5 h-5 mr-3 text-green-600" />
              <p className="font-medium text-sm">Successfully logged in! Loading dashboard...</p>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700">
              <AlertCircle className="w-5 h-5 mr-3 text-red-600" />
              <p className="font-medium text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 rounded-lg shadow-md text-sm font-bold text-white transition-all mt-6
                ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 active:scale-[0.98]'}`}
            >
              {loading ? 'Verifying...' : 'Sign In'}
            </button>
          </form>
          
          <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account? <span 
              onClick={() => navigate('/register')} // Click karne par /register par jayega
              className="font-bold text-slate-900 cursor-pointer hover:underline"
          >
            Register here
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;