import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import DoctorProfile from './pages/DoctorProfile.jsx';
import PatientProfile from './pages/PatientProfile.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Home from './pages/Home.jsx'; 

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />

                {/* After login redirects */}
                <Route path="/doctor-profile" element={<DoctorProfile />} />
                <Route path="/profile" element={<PatientProfile />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />

                {/* 404 fallback route */}
                <Route path="*" element={<div className="text-center mt-10 text-red-500 text-xl">404 - Page Not Found</div>} />
            </Routes>
        </Router>
    );
}
