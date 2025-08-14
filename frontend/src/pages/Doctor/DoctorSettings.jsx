import React, { useState } from "react";
import { AlertTriangle, Upload, X, Pencil } from "lucide-react";
import { useAuthStore } from "../../store/AuthStore.js";

export default function DoctorSetting() {
  const {
    user,
    updateDoctorImage,
    updateDoctorProfile,
    updateDoctorDescription,
    setDoctorAvailability,
    deleteDoctorAccount,
    checkAuth,
  } = useAuthStore();

  // States
  const [isAvailable, setIsAvailable] = useState(user?.isAvailable || false);
  const [imageFile, setImageFile] = useState(null);
  const [dbImage, setDbImage] = useState(user?.image || "");
  const [editImageMode, setEditImageMode] = useState(false);

  const [formData, setFormData] = useState({
    FirstName: user?.FirstName || "",
    LastName: user?.LastName || "",
    specialization: user?.specialization || "",
    experience: user?.experience || "",
    age: user?.age || "",
    gender: user?.gender || "",
  });

  const [description, setDescription] = useState(user?.description || "");

  // Loading states
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [loadingDescription, setLoadingDescription] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // Handle text change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image select
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  const cancelImageEdit = () => {
    setImageFile(null);
    setEditImageMode(false);
  };

  // Upload image
  const handleImageUpload = async () => {
    if (!imageFile) return;
    setLoadingImage(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      const res = await updateDoctorImage(base64Image);
      if (res?.success) {
        setDbImage(base64Image);
        setImageFile(null);
        setEditImageMode(false);
        await checkAuth();
        alert("Profile image updated!");
      } else {
        alert(res?.message || "Failed to update image");
      }
      setLoadingImage(false);
    };
    reader.readAsDataURL(imageFile);
  };

  // Update profile
  const handleProfileUpdate = async () => {
    setLoadingProfile(true);
    const res = await updateDoctorProfile(formData);
    if (res?.success) {
      await checkAuth();
      alert("Profile updated successfully!");
    } else {
      alert(res?.message || "Failed to update profile");
    }
    setLoadingProfile(false);
  };

const handleAvailabilityChange = async (checked) => {
  const prevValue = isAvailable; // Save the previous state
  setIsAvailable(checked); // Optimistically update UI

  setLoadingAvailability(true);
  const res = await setDoctorAvailability(checked);

  if (!res?.success) {
    alert(res?.message || "Failed to update availability");
    setIsAvailable(prevValue); // Revert back if failed
  } else {
    await checkAuth(); // Refresh data if successful
  }

  setLoadingAvailability(false);
};

// Update description
const handleDescriptionUpdate = async () => {
  setLoadingDescription(true);
  const res = await updateDoctorDescription(description);
  if (res?.success) {
      await checkAuth();
      alert("Description updated successfully!");
    } else {
      alert(res?.message || "Failed to update description");
    }
    setLoadingDescription(false);
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    setLoadingDelete(true);
    const res = await deleteDoctorAccount();
    if (res?.success) {
      alert("Account deleted successfully!");
      window.location.href = "/";
    } else {
      alert(res?.message || "Failed to delete account");
    }
    setLoadingDelete(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Availability */}
      <section className="bg-white shadow p-5 rounded-xl flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Availability</h3>
          <p className="text-sm text-gray-500">
            Toggle your availability for new bookings.
          </p>
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => handleAvailabilityChange(e.target.checked)}
            disabled={loadingAvailability}
            className="w-5 h-5"
          />
          {loadingAvailability ? "Updating..." : "Available"}
        </label>
      </section>

      {/* Profile Image */}
      <section className="bg-white shadow p-5 rounded-xl space-y-4">
        <h3 className="text-lg font-semibold">Profile Picture</h3>
        <div className="flex items-center gap-4">
          {editImageMode ? (
            <>
              {imageFile ? (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Profile Preview"
                    className="w-20 h-20 rounded-full object-cover border"
                  />
                  <button
                    onClick={() => setImageFile(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border cursor-pointer hover:bg-gray-200">
                  <Upload className="text-gray-400" size={22} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleImageUpload}
                  disabled={!imageFile || loadingImage}
                  className="px-3 py-1 bg-orange-500 text-white rounded-lg border border-orange-500 hover:bg-gray-50 hover:text-orange-600 transition"
                >
                  {loadingImage ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={cancelImageEdit}
                  className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <div
              className="relative cursor-pointer group"
              onClick={() => setEditImageMode(true)}
            >
              <img
                src={dbImage || "/default-avatar.png"}
                alt="Current Profile"
                className="w-20 h-20 rounded-full object-cover border"
              />
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <Pencil className="text-white" size={18} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Basic Info */}
      <section className="bg-white shadow p-5 rounded-xl space-y-3">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <input name="FirstName" value={formData.FirstName} onChange={handleChange} placeholder="First Name" className="border rounded-lg p-2" />
          <input name="LastName" value={formData.LastName} onChange={handleChange} placeholder="Last Name" className="border rounded-lg p-2" />
          <input name="specialization" value={formData.specialization} onChange={handleChange} placeholder="Specialization" className="border rounded-lg p-2" />
          <input name="experience" value={formData.experience} onChange={handleChange} placeholder="Years of Experience" type="number" className="border rounded-lg p-2" />
          <input name="age" value={formData.age} onChange={handleChange} placeholder="Age" type="number" className="border rounded-lg p-2" />
          <select name="gender" value={formData.gender} onChange={handleChange} className="border rounded-lg p-2">
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>other</option>
          </select>
        </div>
        <button
          onClick={handleProfileUpdate}
          disabled={loadingProfile}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-gray-50 hover:text-orange-600 border border-orange-500 transition"
        >
          {loadingProfile ? "Updating..." : "Update Profile"}
        </button>
      </section>

      {/* Fees Section */}
      <section className="bg-white shadow p-5 rounded-xl space-y-3">
        <h3 className="text-lg font-semibold">Consultation Fees</h3>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg flex items-start gap-3">
          <AlertTriangle className="text-yellow-700 mt-1" />
          <div>
            <h2 className="font-bold text-yellow-800">Fees Managed by Admin</h2>
            <p className="text-yellow-700 text-sm">
              Consultation fees cannot be updated from here. Please contact the admin.
            </p>
            <p className="text-yellow-700 text-sm">
              10% of the Consultation fees is deducted as service charge. For any inquiries, reach out to info@vetconnect.com
            </p>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="bg-white shadow p-5 rounded-xl space-y-3">
        <h3 className="text-lg font-semibold">About You</h3>
        <textarea
          name="description"
          placeholder="Write a short description about yourself"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded-lg p-2 w-full"
          rows={4}
        />
        <button
          onClick={handleDescriptionUpdate}
          disabled={loadingDescription}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-gray-50 hover:text-orange-600 border border-orange-500 transition"
        >
          {loadingDescription ? "Updating..." : "Update Description"}
        </button>
      </section>

      {/* Delete Account */}
      <section className="bg-red-50 shadow p-5 rounded-xl space-y-3 border border-red-200">
        <h3 className="text-lg font-semibold text-red-700">Delete Account</h3>
        <p className="text-sm text-red-600">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={loadingDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          {loadingDelete ? "Deleting..." : "Delete Account"}
        </button>
      </section>
    </div>
  );
}
