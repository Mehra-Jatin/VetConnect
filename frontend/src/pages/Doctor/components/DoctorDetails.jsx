import React from "react";
import { Star, HeartPulse, ShieldCheck } from "lucide-react";

const DoctorDetails = ({ doctor }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      {/* Profile Section */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left - Doctor Profile */}
        <div className="flex flex-col items-center text-center">
          <img
            src={doctor.image}
            alt={`${doctor.FirstName} ${doctor.LastName}`}
            className="w-40 h-40 rounded-full object-cover shadow-md border-4 border-orange-500"
          />
          <h2 className="text-2xl font-bold text-gray-800 mt-4">
            {doctor.FirstName} {doctor.LastName}
          </h2>
          <p className="text-orange-600 font-medium flex items-center gap-1 mt-1">
            <HeartPulse size={16} /> {doctor.specialization}
          </p>

          {/* Availability */}
          <span
            className={`mt-3 px-3 py-1 text-sm rounded-full font-medium ${
              doctor.isAvailable
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            ● {doctor.isAvailable ? "Available" : "Not Available"}
          </span>

          {/* Verified */}
          {doctor.isValidated && (
            <span className="mt-2 px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-full flex items-center gap-1">
              <ShieldCheck size={14} /> Verified
            </span>
          )}
        </div>

        {/* Right - About & Details */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              About Doctor
            </h3>
            <p className="text-gray-600">{doctor.description || "No description provided."}</p>
          </div>

          {/* Doctor Info Grid */}
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p className="text-gray-500">📧 Email</p>
              <p className="font-medium">{doctor.email}</p>
            </div>
            <div>
              <p className="text-gray-500">📞 Phone</p>
              <p className="font-medium">{doctor.PhoneNo}</p>
            </div>
            <div>
              <p className="text-gray-500">👤 Gender</p>
              <p className="font-medium">{doctor.gender}</p>
            </div>
            <div>
              <p className="text-gray-500">🎓 Experience</p>
              <p className="font-medium">{doctor.experience} years</p>
            </div>
            <div>
              <p className="text-gray-500">💰 Fees</p>
              <p className="font-medium">₹{doctor.fees}</p>
            </div>
            <div>
              <p className="text-gray-500">⭐ Rating</p>
              <p className="font-medium flex items-center gap-1">
                {doctor.rating} <Star className="text-yellow-500" size={16} />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
