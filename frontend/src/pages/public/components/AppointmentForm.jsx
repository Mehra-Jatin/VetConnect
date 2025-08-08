import React from "react";

const userRole = "patient"; // This should be dynamically set based on logged-in user

const AppointmentForm = ({ doctor}) => {
  const handleBooking = (e) => {
    e.preventDefault();
    console.log("Booking appointment", { doctorId: doctor._id });
    // API call for booking could go here
  };

  const handleDirectChat = () => {
    console.log("Opening chat with patient/doctor...");
    // Redirect to chat room
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      {userRole === "doctor" ? (
       <>
          <h3 className="text-lg font-semibold mb-4">Direct Chat</h3>
          <p className="text-sm text-gray-600 mb-4">
            As a doctor, you can directly chat without booking an appointment.
          </p>
          <button
            onClick={handleDirectChat}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
          >
            Start Chat
          </button>
        </>
      ) : (
         <>
          <h3 className="text-lg font-semibold mb-4">Book Appointment</h3>
          <p className="text-sm text-gray-600 mb-4">
            You can chat with our virtual veterinarians for{" "}
            <span className="font-semibold text-orange-600">48 hours</span> after your appointment.
          </p>
          <form onSubmit={handleBooking} className="space-y-4">
            <button
              type="submit"
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 w-full"
            >
              Book Appointment
            </button>
          </form>
        </>
        
      )}
    </div>
  );
};

export default AppointmentForm;
