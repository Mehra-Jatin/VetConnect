import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


import DoctorDetails from "../Doctor/components/DoctorDetails.jsx";
import AppointmentForm from "./components/AppointmentForm.jsx";
import DoctorReviews from "../Doctor/components/DoctorReviews.jsx";
import ReviewForm from "./components/ReviewForm.jsx";



export const dummyDoctor = {
  _id: "doc1",
  FirstName: "Dr. Radhika",
  LastName: "Sharma",
  image: "/doc1.png",
  email: "radhika@example.com",
  PhoneNo: "9999888877",
  gender: "Female",
  specialization: "Pediatrics",
  age: 42,
  experience: 15,
  fees: 600,
  rating: 4.5,
  isAvailable: true,
  isValidated: true,
  description:
    "Dr. Radhika Sharma is an experienced Pediatrician dedicated to child healthcare for over 15 years. She specializes in newborn care, vaccinations, and adolescent health.",
};

export const dummyReviews = [
  {
    _id: "rev1",
    userId: { FirstName: "Ravi", LastName: "Verma" },
    rating: 5,
    comment: "Dr. Radhika is amazing with kids. Highly recommended!",
    createdAt: "2025-08-01T10:30:00Z",
  },
  {
    _id: "rev2",
    userId: { FirstName: "Sneha", LastName: "Mehta" },
    rating: 4,
    comment: "Very knowledgeable and calm during consultation.",
    createdAt: "2025-07-25T12:00:00Z",
  },
];


const DoctorPublicProfile = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated API fetch
    setTimeout(() => {
      setDoctor(dummyDoctor);
      setReviews(dummyReviews);
      setLoading(false);
    }, 600);
  }, [id]);

  if (loading) {
    return <p className="text-center py-10 text-gray-500">Loading...</p>;
  }

return (
  <div className="bg-gray-50 min-h-screen py-10 px-4">
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Doctor Info + Appointment Form */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-3/4">
          <DoctorDetails doctor={doctor} />
        </div>
        <div className="lg:w-1/4">
          <AppointmentForm doctor={doctor} />
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <ReviewForm doctorId={doctor._id} />
        <DoctorReviews reviews={reviews} />
      
      </div>

    </div>
  </div>
);

};

export default DoctorPublicProfile;
