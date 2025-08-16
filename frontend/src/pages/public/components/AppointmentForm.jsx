import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/AuthStore";
import toast from "react-hot-toast";

export const AppointmentForm = ({ doctor }) => {
  const navigate = useNavigate();
  const { bookAppointment, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const userRole = user?.role || "patient";

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to book an appointment");
      return;
    }

    setIsLoading(true);
    try {
      await bookAppointment(doctor._id);
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectChat = () => {
     navigate(`/doctor/chats/doctor/${doctor._id}`);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 max-w-md mx-auto transition hover:shadow-2xl">
      {userRole === "doctor" ? (
        <>
          <h3 className="text-2xl font-bold text-green-700 mb-3">Direct Chat</h3>
          <p className="text-gray-600 mb-5">
            As a doctor, you can directly chat with other doctors without booking an appointment.
          </p>
          <button
            onClick={handleDirectChat}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all flex justify-center items-center gap-2"
          >
            Start Chat
          </button>
        </>
      ) : (
        <>
          <h3 className="text-2xl font-bold text-orange-700 mb-3">Book Appointment</h3>
          <p className="text-gray-600 mb-5">
            Chat with the doctor for{" "}
            <span className="font-semibold text-orange-600">48 hours</span> after your appointment.
          </p>
          <form onSubmit={handleBooking} className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-semibold text-white shadow-md transition-all flex justify-center items-center gap-2 ${
                isLoading
                  ? "bg-orange-400 cursor-not-allowed animate-pulse"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Book Appointment"
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
};
