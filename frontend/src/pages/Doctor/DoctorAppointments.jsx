import React, { useEffect, useState } from "react";
import { CalendarX, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/AuthStore";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { getDoctorAppointments } = useAuthStore();

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const data = await getDoctorAppointments();
        setAppointments(data.bookings || []); // Ensure correct path
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [getDoctorAppointments]);

  // Search filtering
  const filtered = appointments.filter((apt) => {
    const val = searchTerm.toLowerCase();
    const user = apt.userId;
    return (
      user.FirstName.toLowerCase().includes(val) ||
      user.LastName.toLowerCase().includes(val) ||
      user.email.toLowerCase().includes(val) ||
      user.PhoneNo.toLowerCase().includes(val)
    );
  });

  // Group appointments by month
  const grouped = filtered.reduce((acc, apt) => {
    const key = apt.monthName || "Others";
    if (!acc[key]) acc[key] = [];
    acc[key].push(apt);
    return acc;
  }, {});

  if (loading) {
    // Skeleton loader
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-5xl mx-auto px-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white border rounded-lg p-4 mb-4 flex animate-pulse"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-full" />
              <div className="ml-4 flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!appointments.length) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-[70vh] text-orange-700">
        <CalendarX size={60} className="text-orange-500 mb-4" />
        <h2 className="text-2xl font-bold">No Appointments Found</h2>
        <p className="mt-2 text-sm text-orange-600">
          You don’t have any appointments scheduled.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-orange-700 mb-4">
          Appointments
        </h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name, email, phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        {Object.keys(grouped).length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-[70vh] text-orange-700">
            <CalendarX size={60} className="text-orange-500 mb-4" />
            <h2 className="text-2xl font-bold">No Appointments Found</h2>
            <p className="mt-2 text-sm text-orange-600">
              You don’t have any appointments scheduled.
            </p>
          </div>
        ) : (
          Object.keys(grouped).map((month) => (
            <div key={month} className="mb-10">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">{month}</h2>
              {grouped[month].map((apt) => {
                const user = apt.userId;

                return (
                  <div
                    key={apt._id}
                    className="bg-white border shadow-sm rounded-lg p-4 mb-4 flex flex-col md:flex-row items-stretch md:items-center justify-between"
                  >
                    {/* User Info */}
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.FirstName[0]}
                      </div>
                      <div>
                        <p className="text-gray-800 font-semibold">
                          {user.FirstName} {user.LastName}
                        </p>
                        <p className="text-sm text-gray-600">📧 {user.email}</p>
                        <p className="text-sm text-gray-600">📱 {user.PhoneNo}</p>
                      </div>
                    </div>

                    {/* Booking Info */}
                    <div className="text-sm text-gray-600 space-y-1 mb-4 md:mb-0">
                      <p>📍 Online</p>
                      <p>
                        📅 Booking: {apt.dayOfWeek}, {apt.dateOnly} at {apt.timeOnly}
                      </p>
                      {apt.paymentStatus === "Completed" && (
                        <p>
                          ✅ Completion: {apt.completionDayOfWeek}, {apt.completionDateOnly} at{" "}
                          {apt.completionTimeOnly}
                        </p>
                      )}
                      <p>
                        💳 ₹{apt.amount} -{" "}
                        <span
                          className={`font-semibold ${
                            apt.paymentStatus === "Completed"
                              ? "text-green-600"
                              : apt.paymentStatus === "Failed"
                              ? "text-red-500"
                              : "text-yellow-500"
                          }`}
                        >
                          {apt.paymentStatus}
                        </span>
                      </p>
                    </div>

                    {/* Chat Button */}
                    <div className="flex justify-end md:justify-center">
                      <button
                        onClick={() => navigate(`/chat/user/${user._id}`)}
                        className="text-sm text-white bg-orange-500 px-4 py-2 rounded hover:bg-orange-600 flex items-center gap-1"
                      >
                        <MessageSquare size={16} />
                        Chat
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;
