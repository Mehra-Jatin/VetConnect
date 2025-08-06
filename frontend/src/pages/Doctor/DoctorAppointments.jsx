import React, { useEffect, useState } from "react";
import { CalendarX, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const dummyAppointments = [
  {
    _id: "booking1",
    userId: {
      _id: "user1",
      FirstName: "Anjali",
      LastName: "Mehta",
      email: "anjali@example.com",
      PhoneNo: "9876543210",
      age: 29,
      gender: "Female",
    },
    dateOnly: "2025-08-01",
    timeOnly: "10:00 AM",
    dayOfWeek: "Friday",
    completionDateOnly: "2025-08-03",
    completionTimeOnly: "10:00 AM",
    completionDayOfWeek: "Sunday",
    monthName: "August",
    amount: 500,
    paymentStatus: "Completed",
  },
  {
    _id: "booking2",
    userId: {
      _id: "user2",
      FirstName: "Rohan",
      LastName: "Kapoor",
      email: "rohan@example.com",
      PhoneNo: "9123456780",
      age: 34,
      gender: "Male",
    },
    dateOnly: "2025-08-03",
    timeOnly: "2:30 PM",
    dayOfWeek: "Sunday",
    completionDateOnly: "2025-08-05",
    completionTimeOnly: "2:30 PM",
    completionDayOfWeek: "Tuesday",
    monthName: "August",
    amount: 700,
    paymentStatus: "Completed",
  },
  {
    _id: "booking3",
    userId: {
      _id: "user3",
      FirstName: "Test",
      LastName: "Failed",
      email: "fail@example.com",
      PhoneNo: "9112345678",
      age: 22,
      gender: "Male",
    },
    dateOnly: "0000-00-00",
    timeOnly: "N/A",
    dayOfWeek: "N/A",
    completionDateOnly: "0000-00-00",
    completionTimeOnly: "N/A",
    completionDayOfWeek: "N/A",
    monthName: "April",
    amount: 500,
    paymentStatus: "Failed",
  },
];

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setAppointments(dummyAppointments);
      setLoading(false);
    }, 800);
  }, []);

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

  const grouped = filtered.reduce((acc, apt) => {
    const key = apt.monthName || "Others";
    if (!acc[key]) acc[key] = [];
    acc[key].push(apt);
    return acc;
  }, {});

  if (loading)
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="h-8 w-40 bg-gray-200 rounded mb-6 animate-pulse" />
        <div className="h-10 w-full bg-gray-200 rounded mb-6 animate-pulse" />

        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white border rounded-lg p-4 mb-4 flex items-stretch animate-pulse"
          >
            {/* Date section */}
            <div className="w-1/6 flex flex-col items-center justify-center space-y-2">
              <div className="w-10 h-6 bg-gray-200 rounded" />
              <div className="w-12 h-4 bg-gray-100 rounded" />
            </div>

            <div className="w-px bg-gray-300 mx-4" />

            {/* User + Booking info */}
            <div className="w-4/6 flex">
              {/* User Info */}
              <div className="w-1/2 pr-4 border-r border-gray-300 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-gray-300 rounded-full" />
                  <div className="w-20 h-4 bg-gray-200 rounded" />
                </div>
                <div className="space-y-1">
                  <div className="w-32 h-3 bg-gray-100 rounded" />
                  <div className="w-28 h-3 bg-gray-100 rounded" />
                </div>
              </div>

              {/* Booking Info */}
              <div className="w-1/2 pl-4 space-y-2">
                <div className="w-24 h-3 bg-gray-100 rounded" />
                <div className="w-44 h-3 bg-gray-100 rounded" />
                <div className="w-52 h-3 bg-gray-100 rounded" />
                <div className="w-36 h-3 bg-gray-100 rounded" />
              </div>
            </div>

            {/* Chat Button */}
            <div className="w-1/6 flex items-center justify-end">
              <div className="w-20 h-8 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (appointments.length === 0) {
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

        {/* 🔍 Search */}
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
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                {month}
              </h2>

              {grouped[month].map((apt) => {
                const user = apt.userId;

                return (
                  <div
                    key={apt._id}
                    className="bg-white border shadow-sm rounded-lg p-4 mb-4 flex items-stretch"
                  >
                    {/* Section 1: Date */}
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

                    {/* Vertical Divider */}
                    <div className="w-px bg-gray-300 mx-4" />

                    {/* Section 2: User Info + Booking Info */}
                    <div className="w-4/6 flex">
                      {/* User Info */}
                      <div className="w-1/2 pr-4 border-r border-gray-300">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 bg-orange-500 rounded-full text-white text-sm flex items-center justify-center">
                            {user.FirstName[0]}
                          </div>
                          <div className="text-lg font-semibold text-gray-800">
                            {user.FirstName}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>📧 {user.email}</p>
                          <p>📱 {user.PhoneNo}</p>
                        </div>
                      </div>

                      {/* Booking Info */}
                      <div className="w-1/2 ">
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>📍 Online</p>
                          <p>
                            📅 Booking: {apt.dayOfWeek}, {apt.dateOnly} at{" "}
                            {apt.timeOnly}
                          </p>
                          {apt.paymentStatus === "Completed" && (
                            <p>
                              ✅ Completion: {apt.completionDayOfWeek},{" "}
                              {apt.completionDateOnly} at{" "}
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
                      </div>
                    </div>

                  
                    {/* Section 3: Chat */}
                    <div className="w-1/6 flex flex-col items-end justify-center">
                      <button
                        onClick={() => navigate(`/chat/user/${user._id}`)}
                        className="text-sm text-white bg-orange-500 px-4 py-2 rounded hover:bg-orange-600"
                      >
                        <MessageSquare size={16} className="inline mr-1" />
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
