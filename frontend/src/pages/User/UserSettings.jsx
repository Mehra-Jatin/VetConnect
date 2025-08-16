import React, { useState, useEffect } from "react";
import {
  FaCamera,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { AiOutlineLock } from "react-icons/ai";
import { BsShieldLock } from "react-icons/bs";
import { useAuthStore } from "../../store/AuthStore";
import toast from "react-hot-toast";

const UserSettings = () => {
  const {
    user,
    updateUserProfile,
    updateUserImage,
    updateUserPassword,
    deleteUserAccount,
  } = useAuthStore();

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true); // initial load
  const [loadingAction, setLoadingAction] = useState(null); // track specific API calls
  const [showPasswordSection, setShowPasswordSection] = useState(false);

 const [formData, setFormData] = useState({
  FirstName: "",
  LastName: "",
  email: "",
  PhoneNo: "",
  age: "",
  gender: "",
  profileImage: "",
});

  const [previewImage, setPreviewImage] = useState(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        FirstName: user.FirstName || "",
        LastName: user.LastName || "",
        email: user.email || "",
        PhoneNo: user.PhoneNo || "",
        age: user.age || "",
        gender: user.gender || "",
        profileImage: user.image || "",
      });
    }
    setLoading(false);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async () => {
    if (!previewImage) return;
    setLoadingAction("uploadImage");
    const res = await updateUserImage(previewImage);
    setLoadingAction(null);
    if (res) {
      setFormData((prev) => ({
        ...prev,
        profileImage: res.imageUrl || previewImage,
      }));
      setPreviewImage(null);
    } 
  };

  const handleCancelPreview = () => {
    setPreviewImage(null);
  };

  const handleSave = async () => {
    setLoadingAction("updateProfile");
    const res = await updateUserProfile(formData);
    setLoadingAction(null);
    if (res.success) {
      setEditMode(false);
    } 
  };

  const handleDelete = async () => {
      setLoadingAction("deleteAccount");
      const res = await deleteUserAccount();
      setLoadingAction(null);
      if (res.success) {
        window.location.href = "/";
      }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }
    setLoadingAction("updatePassword");
    const res = await updateUserPassword(passwordData);
    setLoadingAction(null);
    if (res.success) {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordSection(false);
    }
  };

  if (loading) return <div className="p-6">Loading user data...</div>;

  return (
    <div className="bg-gray-50 min-h-fit py-6 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Image Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">Profile Image</h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-32 h-32 rounded-full border-2 border-orange-500 overflow-hidden bg-gray-100 flex items-center justify-center">
              <img
                src={previewImage || formData.profileImage || ""}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col gap-3">
              {!previewImage && (
                <label className="bg-orange-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-orange-600">
                  <FaCamera className="inline mr-2" /> Select Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              )}

              {previewImage && (
                <div className="flex gap-3">
                  <button
                    onClick={handleImageUpload}
                    disabled={loadingAction === "uploadImage"}
                    className={`bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 ${
                      loadingAction === "uploadImage" &&
                      "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    {loadingAction === "uploadImage"
                      ? "Uploading..."
                      : "Upload"}
                  </button>
                  <button
                    onClick={handleCancelPreview}
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Profile Information</h2>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="text-orange-500 hover:text-orange-600"
              >
                ✏️ Edit
              </button>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "FirstName", label: "First Name" },
              { name: "LastName", label: "Last Name" },
              { name: "email", label: "Email" },
              { name: "PhoneNo", label: "Phone" },
              { name: "age", label: "Age" },
              { name: "gender", label: "Gender" },
            ].map((field) => (
              <div key={field.name}>
                {editMode ? (
                  <input
                    type="text"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="border rounded px-3 py-2 w-full"
                  />
                ) : (
                  <p>{formData[field.name]}</p>
                )}
              </div>
            ))}
          </div>

          {editMode && (
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSave}
                disabled={loadingAction === "updateProfile"}
                className={`bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 ${
                  loadingAction === "updateProfile" &&
                  "opacity-50 cursor-not-allowed"
                }`}
              >
                {loadingAction === "updateProfile"
                  ? "Saving..."
                  : "Save Changes"}
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h2 className="flex items-center space-x-2 text-lg font-semibold">
            <BsShieldLock className="text-orange-500" />
            <span>Security</span>
          </h2>
          <button
            onClick={() => setShowPasswordSection(!showPasswordSection)}
            className="mt-3 flex items-center gap-2 text-orange-500"
          >
            <AiOutlineLock /> Change Password
          </button>
          {showPasswordSection && (
            <div className="mt-4 space-y-3">
              {["currentPassword", "newPassword", "confirmPassword"].map(
                (name) => (
                  <input
                    key={name}
                    type="password"
                    name={name}
                    placeholder={name.replace(/([A-Z])/g, " $1")}
                    value={passwordData[name]}
                    onChange={handlePasswordChange}
                    className="border rounded px-3 py-2 w-full"
                  />
                )
              )}
              <button
                onClick={handlePasswordUpdate}
                disabled={loadingAction === "updatePassword"}
                className={`bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 ${
                  loadingAction === "updatePassword" &&
                  "opacity-50 cursor-not-allowed"
                }`}
              >
                {loadingAction === "updatePassword"
                  ? "Updating..."
                  : "Update Password"}
              </button>
            </div>
          )}
        </div>

        {/* Delete */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h2 className="flex items-center space-x-2 text-red-600 text-lg font-semibold">
            <MdDelete /> <span>Delete Account</span>
          </h2>
          <button
            onClick={handleDelete}
            disabled={loadingAction === "deleteAccount"}
            className={`bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 ${
              loadingAction === "deleteAccount" &&
              "opacity-50 cursor-not-allowed"
            }`}
          >
            {loadingAction === "deleteAccount"
              ? "Deleting..."
              : "Delete My Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
