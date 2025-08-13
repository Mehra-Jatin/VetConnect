import React from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

  return (
    <div className="border rounded-lg shadow-sm hover:shadow-md transition p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-600">

            <img
             src={doctor.image !== "" ? doctor.image : "/doc.jpg"}
              alt={`${doctor.FirstName} ${doctor.LastName}`}
              className="w-full h-full rounded-full object-cover"
            />

        </div>
        <div className="flex-1 space-y-2">
          <h3 className="text-xl font-semibold text-orange-900">
            Dr. {doctor.FirstName} {doctor.LastName}
          </h3>
          <p className="text-orange-500 font-medium">{doctor.specialization}</p>
          <div className="text-sm text-gray-600">
            ⭐ {doctor.rating} ({doctor.numOfReviews} reviews)
          </div>
          <div className="text-sm text-gray-600">
            🕒 {doctor.experience} years experience
          </div>
          <div className="text-sm text-gray-600">
            💰 ₹{doctor.fees} per consultation
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={() => navigate(`/doctor/${doctor._id}`)}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-orange-500 text-orange-500 rounded hover:bg-orange-50 transition"
            >
              <Eye size={16} /> View Profile
            </button>
            <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition">
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
