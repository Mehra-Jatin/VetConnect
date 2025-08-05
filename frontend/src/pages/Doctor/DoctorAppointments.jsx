import React, { useEffect, useState } from "react";
import { CalendarX, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Dummy data
const dummyAppointments = [
  {
    _id: "booking1",
    userId: {
      _id: "user1",
      FirstName: "Anjali",
      LastName: "Mehta",
      email: "anjali.mehta@example.com",
      age: 29,
      gender: "Female",
      PhoneNo: 9876543210,
    },
    doctorId: "doctor1",
    date: "2025-08-01T10:00:00Z",
    amount: 500,
    paymentId: "pay_ABC123",
    razorpayOrderId: "order_123abc",
    paymentStatus: "Completed",
  },
  {
    _id: "booking2",
    userId: {
      _id: "user2",
      FirstName: "Rohan",
      LastName: "Kapoor",
      email: "rohan.kapoor@example.com",
      age: 34,
      gender: "Male",
      PhoneNo: 9123456780,
    },
    doctorId: "doctor1",
    date: "2025-08-03T14:30:00Z",
    amount: 700,
    paymentId: "pay_XYZ456",
    razorpayOrderId: "order_456xyz",
    paymentStatus: "Completed",
  },
  {
    _id: "booking3",
    userId: {
      _id: "user3",
      FirstName: "Test",
      LastName: "Failed",
      email: "fail@example.com",
      age: 22,
      gender: "Male",
      PhoneNo: 9112345678,
    },
    doctorId: "doctor1",
    date: "2025-08-05T14:30:00Z",
    amount: 500,
    paymentId: "pay_FAILED",
    razorpayOrderId: "order_fail123",
    paymentStatus: "Pending",
  },
];

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching confirmed appointments
    setTimeout(() => {
      setAppointments(dummyAppointments);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-gray-600">
        Loading...
      </div>
    );
  }

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
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-orange-700">
        Confirmed Appointments
      </h1>

      <div className="space-y-6">
        {appointments.map((apt) => (
          <div
            key={apt._id}
            className="border rounded-lg p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-orange-800">
                  {apt.userId.FirstName} {apt.userId.LastName}
                </h3>
                <p className="text-gray-600 text-sm">
                  📧 {apt.userId.email}
                </p>
                <p className="text-gray-600 text-sm">
                  📞 {apt.userId.PhoneNo}
                </p>
                <p className="text-gray-600 text-sm">
                  🧬 Age: {apt.userId.age}, Gender: {apt.userId.gender}
                </p>
                <p className="text-sm text-gray-500">
                  Appointment Date: {new Date(apt.date).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  Payment: ₹{apt.amount}
                </p>
              </div>

              <button
                onClick={() => navigate(`/chat/user/${apt.userId._id}`)}
                className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
              >
                <MessageSquare size={18} /> Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointments;
