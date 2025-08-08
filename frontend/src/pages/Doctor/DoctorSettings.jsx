import React, { useState, useEffect } from "react";
import { AlertTriangle, Upload, X } from "lucide-react";

export default function DoctorSettings({ doctorData }) {
  const [isAvailable, setIsAvailable] = useState(doctorData?.isAvailable || false);
  const [imageFile, setImageFile] = useState(null);
  const [dbImage, setDbImage] = useState(doctorData?.image || "");

  const [formData, setFormData] = useState({
    firstName: doctorData?.FirstName || "",
    lastName: doctorData?.LastName || "",
    specialization: doctorData?.specialization || "",
    experience: doctorData?.experience || "",
    age: doctorData?.age || "",
    gender: doctorData?.gender || "",
  });

  const [description, setDescription] = useState(doctorData?.description || "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  const removeSelectedImage = () => {
    setImageFile(null);
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
            onChange={(e) => setIsAvailable(e.target.checked)}
            className="w-5 h-5"
          />
          Available
        </label>
      </section>

      {/* Profile Image */}
      <section className="bg-white shadow p-5 rounded-xl space-y-4">
        <h3 className="text-lg font-semibold">Profile Picture</h3>

        <div className="flex items-center gap-4">
          {imageFile ? (
            <div className="relative">
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Profile Preview"
                className="w-20 h-20 rounded-full object-cover border"
              />
              <button
                onClick={removeSelectedImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
              >
                <X size={14} />
              </button>
            </div>
          ) : dbImage ? (
            <img
              src={dbImage}
              alt="Current Profile"
              className="w-20 h-20 rounded-full object-cover border"
            />
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
        </div>

        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-gray-50 hover:text-orange-600 border border-orange-500 transition">
          {imageFile ? "Update Image" : "Upload Image"}
        </button>
      </section>

      {/* Basic Info */}
      <section className="bg-white shadow p-5 rounded-xl space-y-3">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="border rounded-lg p-2" />
          <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="border rounded-lg p-2" />
          <input name="specialization" value={formData.specialization} onChange={handleChange} placeholder="Specialization" className="border rounded-lg p-2" />
          <input name="experience" value={formData.experience} onChange={handleChange} placeholder="Years of Experience" type="number" className="border rounded-lg p-2" />
          <input name="age" value={formData.age} onChange={handleChange} placeholder="Age" type="number" className="border rounded-lg p-2" />
          <select name="gender" value={formData.gender} onChange={handleChange} className="border rounded-lg p-2">
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-gray-50 hover:text-orange-600 border border-orange-500 transition">
          Update Profile
        </button>
      </section>

      {/* Fees Section - Notice */}
      <section className="bg-white shadow p-5 rounded-xl space-y-3">
        <h3 className="text-lg font-semibold">Consultation Fees</h3>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg flex items-start gap-3">
          <AlertTriangle className="text-yellow-700 mt-1" />
          <div>
            <h2 className="font-bold text-yellow-800">Fees Managed by Admin</h2>
            <p className="text-yellow-700 text-sm">
              Consultation fees cannot be updated from here. Please contact the admin via{" "}
              <a href="mailto:admin@example.com" className="underline">email</a> or{" "}
              <span className="underline cursor-pointer">chat message</span> to update your fees.
              <br />
              <strong>Note:</strong> 10% of your fees will be deducted from each booking as platform fees.
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
        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-gray-50 hover:text-orange-600 border border-orange-500 transition">
          Update Description
        </button>
      </section>

      {/* Delete Account */}
      <section className="bg-red-50 shadow p-5 rounded-xl space-y-3 border border-red-200">
        <h3 className="text-lg font-semibold text-red-700">Delete Account</h3>
        <p className="text-sm text-red-600">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Delete Account
        </button>
      </section>
    </div>
  );
}
