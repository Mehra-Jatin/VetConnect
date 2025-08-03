import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import useAuthStore from '@/store/useAuthStore'; // Adjust path based on your folder structure

const Navbar = () => {
  const navigate = useNavigate();
  const user = {
    id: 1,
    name: 'John Doe',
    role: 'doctor', // or 'patient', 'admin'
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm px-4 md:px-8 py-4 sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-orange-600">
          MediConnect
        </Link>

        {/* Right Menu */}
        <div className="flex items-center gap-6">
          {!user ? (
            <button
              onClick={() => navigate('/auth/login')}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Login
            </button>
          ) : (
            <>
              {/* Doctor Menu */}
              {user.role === 'doctor' ? (
                <>
                  <Link to="/doctor/chats" className="text-gray-700 hover:text-orange-600">
                    Chats
                  </Link>
                  <Link to="/doctor/bookings" className="text-gray-700 hover:text-orange-600">
                    Bookings
                  </Link>
                  <Link to="/doctor-profile" className="text-gray-700 hover:text-orange-600">
                    Profile
                  </Link>
                </>
              ) : (
                /* User Menu */
                <>
                  <Link to="/doctor" className="text-gray-700 hover:text-orange-600">
                    Find Doctors
                  </Link>
                  <Link to="/user/appointments" className="text-gray-700 hover:text-orange-600">
                    My Appointments
                  </Link>
                  <Link to="/profile" className="text-gray-700 hover:text-orange-600">
                    Profile
                  </Link>
                </>
              )}

              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
