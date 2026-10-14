import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Agar koi seedha website khole, toh use Login par bhej do */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Login Page ka route */}
        <Route path="/login" element={<Login />} />
        
        {/* Register Page ka route */}
        <Route path="/register" element={<Register />} />

        {/* Admin Dashboard ka route */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* Student Dashboard ka route */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;