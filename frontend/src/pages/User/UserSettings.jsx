import React, { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaUser,
  FaCamera,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { AiOutlineLock } from "react-icons/ai";
import { BsShieldLock } from "react-icons/bs";

const UserSettings = () => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    profileImage: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFormData({
        firstName: "JATIN",
        lastName: "MEHRA",
        email: "jatinmehra@gmail.com",
        phone: "1234567896",
        age: "18",
        gender: "Male",
        profileImage: "",
      });
      setLoading(false);
    }, 600);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profileImage: URL.createObjectURL(file) });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSave = () => {
    setEditMode(false);
    alert("Changes saved successfully!");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      alert("Account deleted successfully!");
    }
  };

  const handlePasswordUpdate = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
    alert("Password updated successfully!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPasswordSection(false);
  };

  // Skeleton loader for loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto min-h-screen p-4 sm:p-6 space-y-8 animate-pulse">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 space-y-4 sm:space-y-0">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-3">
              <div className="w-40 h-6 bg-gray-200 rounded" />
              <div className="w-28 h-4 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-gray-200 rounded" />
                <div className="flex-1 h-4 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 space-y-3">
          <div className="w-40 h-5 bg-gray-200 rounded" />
          <div className="w-64 h-4 bg-gray-200 rounded" />
          <div className="w-32 h-10 bg-gray-200 rounded" />
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 space-y-3">
          <div className="w-40 h-5 bg-gray-200 rounded" />
          <div className="w-64 h-4 bg-gray-200 rounded" />
          <div className="w-32 h-10 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-fit py-6 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 space-y-4 sm:space-y-0">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-orange-500 overflow-hidden flex items-center justify-center bg-gray-100">
                {formData.profileImage ? (
                  <img
                    src={formData.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-xs sm:text-sm text-center">
                    Upload Profile Image
                  </span>
                )}
              </div>
              {editMode && (
                <label className="absolute bottom-2 right-2 bg-orange-500 p-2 rounded-full cursor-pointer text-white">
                  <FaCamera />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            {/* Profile Info */}
            <div className="flex-1 w-full">
              {editMode ? (
                <div className="flex flex-col sm:flex-row gap-2 sm:space-x-4 w-full">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="border rounded px-3 py-2 w-full sm:w-40"
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="border rounded px-3 py-2 w-full sm:w-40"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold">
                    {formData.firstName} {formData.lastName}
                  </h1>
                  <button
                    onClick={() => setEditMode(true)}
                    className="text-orange-500 hover:text-orange-600"
                  >
                    ✏️
                  </button>
                </div>
              )}
              <p className="text-gray-500">Patient Profile</p>
            </div>
          </div>
          {/* Info Fields */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: <FaEnvelope />, name: "email", type: "email" },
              { icon: <FaPhone />, name: "phone", type: "text" },
              { icon: <FaBirthdayCake />, name: "age", type: "number" },
              { icon: <FaUser />, name: "gender", type: "text" },
            ].map((field, i) => (
              <div key={i} className="flex items-center space-x-2">
                <span className="text-gray-500">{field.icon}</span>
                {editMode ? (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="border rounded px-3 py-2 w-full"
                  />
                ) : (
                  <span>{formData[field.name]}</span>
                )}
              </div>
            ))}
          </div>
          {/* Save / Cancel Buttons */}
          {editMode && (
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSave}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 w-full sm:w-auto"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="text-gray-500 hover:text-gray-700 w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h2 className="flex items-center space-x-2 text-lg font-semibold">
            <BsShieldLock className="text-orange-500" />
            <span>Security</span>
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            Manage your account security settings
          </p>
          <div>
            <button
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className="flex items-center justify-between w-full text-left font-medium text-gray-700 hover:text-orange-500"
            >
              <span className="flex items-center space-x-2">
                <AiOutlineLock /> <span>Change Password</span>
              </span>
              <span>{showPasswordSection ? "▲" : "▼"}</span>
            </button>
            {showPasswordSection && (
              <div className="mt-4 space-y-3">
                {["currentPassword", "newPassword", "confirmPassword"].map(
                  (name, i) => (
                    <input
                      key={i}
                      type="password"
                      name={name}
                      placeholder={
                        name === "currentPassword"
                          ? "Current Password"
                          : name === "newPassword"
                          ? "New Password"
                          : "Confirm New Password"
                      }
                      value={passwordData[name]}
                      onChange={handlePasswordChange}
                      className="border rounded px-3 py-2 w-full"
                    />
                  )
                )}
                <button
                  onClick={handlePasswordUpdate}
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 w-full sm:w-auto"
                >
                  Update Password
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Delete Account Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h2 className="flex items-center space-x-2 text-red-600 text-lg font-semibold">
            <MdDelete /> <span>Delete Account</span>
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            Permanently remove your account and all associated data.
          </p>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 w-full sm:w-auto"
          >
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
