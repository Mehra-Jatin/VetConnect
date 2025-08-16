import React, { useState } from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/AuthStore";

export const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();
  const { user, bookAppointment } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to book an appointment");
      return;
    }

    setIsLoading(true);
    try {
      await bookAppointment(doctor._id); // Razorpay checkout handled in store
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Failed to book appointment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectChat = () => {
     navigate(`/doctor/chats/doctor/${doctor._id}`);
  };

   if(user && user.email === doctor.email){
     return(
      <></>
     )
   }
  return (
    <div className="border rounded-lg shadow-sm hover:shadow-md transition p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-600">
          <img
            src={doctor.image || "/doc.jpg"}
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
            ⭐ {doctor.rating} Star
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

            {user?.role === "doctor" ? (
              <button
                onClick={handleDirectChat}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                Chat
              </button>
            ) : (
              <button
                onClick={handleBooking}
                disabled={isLoading}
                className={`px-4 py-2 rounded text-white transition ${
                  isLoading
                    ? "bg-orange-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {isLoading ? "Processing..." : "Book Appointment"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
