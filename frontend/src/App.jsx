import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Loading from './components/Loading.jsx';

import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import Home from './pages/public/Home.jsx';
import Doctor from './pages/public/Doctor.jsx';
import Layout from './components/Layout.jsx';
import AboutUs from './pages/public/AboutUs.jsx';
import DoctorAppointments from './pages/Doctor/DoctorAppointments.jsx';
import DoctorFullProfile from './pages/Doctor/DoctorFullProfile.jsx';
import DoctorSettings from './pages/Doctor/DoctorSettings.jsx';
import DoctorPublicProfile from './pages/public/DoctorPublicProfile.jsx';
import UserSettings from './pages/User/UserSettings.jsx';
import NotFound from './components/NotFound.jsx';
import UserAppointments from './pages/User/UserAppointents.jsx';
import UserChat from './pages/User/UserChat.jsx';
import DoctorChat from './pages/Doctor/DoctorChat.jsx';

import { useAuthStore } from './store/AuthStore.js';

export default function App() {
  const { isCheckingAuth, user, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <Loading />;
  }

  // Role-based route wrapper
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!user) return <Navigate to="/auth/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <>
      {/* Hot Toast container */}
      <Toaster position="top-right" reverseOrder={false} />

      <Router>
        <Routes>
          {/* Auth pages */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />

          {/* Public pages */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/about" element={<Layout><AboutUs /></Layout>} />
          <Route path="/doctor" element={<Layout><Doctor /></Layout>} />
          <Route path="/doctor/:id" element={<Layout><DoctorPublicProfile /></Layout>} />

          {/* Doctor pages - only accessible by doctors */}
          <Route
            path="/doctor/profile"
            element={
              <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                <Layout><DoctorFullProfile /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/appointments"
            element={
              <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                <Layout><DoctorAppointments /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/settings"
            element={
              <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                <Layout><DoctorSettings /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/chats/*"
            element={
              <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                <Layout><DoctorChat /></Layout>
              </ProtectedRoute>
            }
          />

          {/* User pages - only accessible by patients */}
          <Route
            path="/user/settings"
            element={
              <ProtectedRoute allowedRoles={['patient', 'admin']}>
                <Layout><UserSettings /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/history"
            element={
              <ProtectedRoute allowedRoles={['patient', 'admin']}>
                <Layout><UserAppointments /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/chats/*"
            element={
              <ProtectedRoute allowedRoles={['patient', 'admin']}>
                <Layout><UserChat /></Layout>
              </ProtectedRoute>
            }
          />

          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
