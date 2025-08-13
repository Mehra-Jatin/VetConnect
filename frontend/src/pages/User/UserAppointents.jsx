import React, { useEffect, useState } from "react";
import { CalendarX, MessageSquare, Repeat } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/AuthStore";

const UserAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { getUserAppointments } = useAuthStore();

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const data = await getUserAppointments();
        setAppointments(data.bookings || []);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [getUserAppointments]);

  const filtered = appointments.filter((apt) => {
    const val = searchTerm.toLowerCase();
    const doc = apt.doctorId;
    return (
      doc.FirstName.toLowerCase().includes(val) ||
      doc.LastName.toLowerCase().includes(val) ||
      doc.email.toLowerCase().includes(val) ||
      doc.PhoneNo.toLowerCase().includes(val)
    );
  });

  const grouped = filtered.reduce((acc, apt) => {
    const key = apt.monthName || "Others";
    if (!acc[key]) acc[key] = [];
    acc[key].push(apt);
    return acc;
  }, {});

  const isPastDate = (dateStr) => {
    if (!dateStr || dateStr === "0000-00-00") return false;
    return new Date(dateStr) < new Date();
  };

  if (loading)
    return (
       <div className="bg-gray-50 min-h-screen py-8">


        <div className="max-w-5xl mx-auto px-4">
          <div className="h-8 w-40 bg-gray-200 rounded mb-6 animate-pulse" />
          <div className="h-10 w-full bg-gray-200 rounded mb-6 animate-pulse" />
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white h-24 border rounded-lg p-4 mb-4 flex items-stretch animate-pulse"
            />
          ))}
        </div>
      </div>
    );

  if (appointments.length === 0)
    return (
      <div className="flex flex-col items-center justify-center text-center h-[70vh] text-orange-700">
        <CalendarX size={60} className="text-orange-500 mb-4" />
        <h2 className="text-2xl font-bold">No Appointments Found</h2>
        <p className="mt-2 text-sm text-orange-600">
          You don’t have any appointments scheduled.
        </p>
        <button
          onClick={() => navigate("/doctor")}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Find a Doctor
        </button>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-fit py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-orange-700 mb-4">
          My Appointments
        </h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by doctor name, email, phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        {Object.keys(grouped).map((month) => (
          <div key={month} className="mb-10">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">{month}</h2>

            {grouped[month].map((apt) => {
              const doc = apt.doctorId;
              const isFailed = apt.paymentStatus === "Failed";
              const isOver = isPastDate(apt.completionDateOnly);

              return (
                <div
                  key={apt._id}
                  className="bg-white border shadow-sm rounded-lg p-4 mb-4 flex items-stretch"
                >
                  {/* Date */}
                  <div className="w-1/6 flex flex-col items-center justify-center">
                    <div className="text-orange-600 font-bold text-3xl">
                      {apt.dateOnly && apt.dateOnly !== "0000-00-00"
                        ? new Date(apt.dateOnly).getDate()
                        : "--"}
                    </div>
                    <div className="text-lg text-gray-500 font-semibold">
                      {apt.dayOfWeek !== "N/A" ? apt.dayOfWeek : "--"}
                    </div>
                  </div>

                  <div className="w-px bg-gray-300 mx-4" />

                  {/* Doctor Info + Booking Info */}
                  <div className="w-4/6 flex">
                    {/* Doctor Info */}
                    <div className="w-1/2 pr-4 border-r border-gray-300">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 bg-orange-500 rounded-full text-white text-sm flex items-center justify-center">
                          {doc.FirstName[0]}
                        </div>
                        <div className="text-lg font-semibold text-gray-800">
                          {doc.FirstName} {doc.LastName}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>📧 {doc.email}</p>
                        <p>📱 {doc.PhoneNo}</p>
                      </div>
                    </div>

                    {/* Booking Info */}
                    <div className="w-1/2">
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>📍 Online</p>
                        <p>
                          📅 Booking: {apt.dayOfWeek}, {apt.dateOnly} at {apt.timeOnly}
                        </p>
                        <p>
                          ✅ Completion: {apt.completionDayOfWeek}, {apt.completionDateOnly} at{" "}
                          {apt.completionTimeOnly}
                        </p>
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
                        <p className="text-gray-500 font-bold">
                          Payment ID: {apt.paymentId}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="w-1/6 flex flex-col items-end justify-center">
                    {isFailed || isOver ? (
                      <button
                        onClick={() => navigate(`/doctor/${doc._id}`)}
                        className="text-sm text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-1"
                      >
                        <Repeat size={16} /> Book Again
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/user/chats/${doc._id}`)}
                        className="text-sm text-white bg-orange-500 px-4 py-2 rounded hover:bg-orange-600 flex items-center gap-1"
                      >
                        <MessageSquare size={16} /> Chat
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserAppointments;
