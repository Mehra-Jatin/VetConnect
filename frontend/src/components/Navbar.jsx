import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ChevronRight,
  User,
  History,
  LogOut,
  Settings,
  MessageSquareText,
  CalendarCheck,
} from 'lucide-react';

import { useAuthStore } from '../store/AuthStore';

const Navbar = () => {
  const navigate = useNavigate();

  const user = useAuthStore.getState().user; // get user from auth store
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [chatSubmenuOpen, setChatSubmenuOpen] = useState(false);

  const {logout} = useAuthStore();

  const handleLogout = async () => {
    setDropdownOpen(false);
    setChatSubmenuOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm px-4 md:px-8 py-4 sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-orange-600">
          VetConnect
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-6 relative">
          <Link to="/doctor" className="text-gray-700 hover:text-orange-600">
            Doctors
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-orange-600">
            About Us
          </Link>

          {!user ? (
            <button
              onClick={() => navigate('/auth/login')}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Login
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => {
                  setDropdownOpen((prev) => !prev);
                  setChatSubmenuOpen(false);
                }}
                className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-gray-800"
              >
                <User size={18} /> {user.name} <ChevronDown size={16} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border shadow-lg rounded-lg z-50">
                  <div className="px-4 py-2 border-b text-sm text-gray-600 font-semibold">
                    My Account
                  </div>

                  <div className="py-2">
                    {/* Profile */}


  
                    {user.role === 'doctor' && (
                      <Link
                        to="/doctor/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 text-gray-800"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User size={16} /> Profile
                      </Link>
                    )}


                    {user.role === 'patient' && (
                      <Link
                        to="/user/chats"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 text-gray-800"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <MessageSquareText size={16} /> My Chats
                      </Link>
                    )}

                    {user.role === 'doctor' && (
                      <>
                        {/* Chats with embedded submenu */}
                        <div>
                          <button
                            onClick={() => setChatSubmenuOpen(!chatSubmenuOpen)}
                            className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 text-gray-800"
                          >
                            <span className="flex items-center gap-2">
                              <MessageSquareText size={16} /> Chats
                            </span>
                            <ChevronRight size={16} />
                          </button>

                          {chatSubmenuOpen && (
                            <div className="pl-10 pr-4 space-y-1 py-1 text-sm text-gray-700">
                              <Link
                                to="/doctor/chats/admin"
                                onClick={() => setDropdownOpen(false)}
                                className="block hover:text-orange-600"
                              >
                                Admin Chat
                              </Link>
                              <Link
                                to="/doctor/chats/patient"
                                onClick={() => setDropdownOpen(false)}
                                className="block hover:text-orange-600"
                              >
                                Patient Chat
                              </Link>
                              <Link
                                to="/doctor/chats/doctor"
                                onClick={() => setDropdownOpen(false)}
                                className="block hover:text-orange-600"
                              >
                                Doctor Chat
                              </Link>
                            </div>
                          )}
                        </div>

                        {/* Appointments (only for doctor) */}
                        <Link
                          to="/doctor/appointments"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 text-gray-800"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <CalendarCheck size={16} /> Appointments
                        </Link>
                      </>
                    )}

                    {/* Patient-only history */}
                    {user.role === 'patient' && (
                      <Link
                        to="/user/history"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 text-gray-800"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <History size={16} /> My History
                      </Link>
                    )}

                    {/* Settings */}
                    {user.role === 'patient' && (
                      <Link
                        to="/user/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 text-gray-800"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Settings size={16} /> Settings
                      </Link>
                    )}

                    {/* Doctor Settings */}
                    {user.role === 'doctor' && (
                      <Link
                        to="/doctor/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 text-gray-800"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Settings size={16} /> Settings
                      </Link>
                    )}


                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                    >
                      <LogOut size={16} /> Logout 
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
