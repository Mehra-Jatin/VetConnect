import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import DoctorProfile from './pages/DoctorProfile.jsx';
import PatientProfile from './pages/PatientProfile.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Home from './pages/public/Home.jsx'; 
import Doctor from './pages/public/Doctor.jsx';
import Layout from './components/Layout.jsx';
import AboutUs from './pages/public/AboutUs.jsx';
import DoctorAppointments from './pages/Doctor/DoctorAppointments.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Auth pages without layout */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
 
        {/* Pages with Navbar & Footer */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><AboutUs /></Layout>} />
        
        {/* Doctor and Profile pages */}
        <Route path="/doctor" element={<Layout><Doctor /></Layout>} />
        <Route path="/doctor-profile" element={<Layout><DoctorProfile /></Layout>} />
        <Route path="/doctor/appointments" element={<Layout><DoctorAppointments /></Layout>} />
        <Route path="/profile" element={<Layout><PatientProfile /></Layout>} />
        <Route path="/admin-dashboard" element={<Layout><AdminDashboard /></Layout>} />

        {/* 404 fallback route */}
        <Route path="*" element={<div className="text-center mt-10 text-red-500 text-xl">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}
