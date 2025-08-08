import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DoctorDetails from "./components/DoctorDetails.jsx";
import DoctorReviews from "./components/DoctorReviews.jsx";
import DoctorSkeleton from "./components/DoctorSkeleton.jsx";

// Dummy data (replace with API later)
const dummyDoctor = {
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

const dummyReviews = [
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

const DoctorFullProfile = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API
    setTimeout(() => {
      setDoctor(dummyDoctor);
      setReviews(dummyReviews);
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading) {
    return <div className="max-w-6xl mx-auto"><DoctorSkeleton /></div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <DoctorDetails doctor={doctor} />
        <DoctorReviews reviews={reviews} />
      </div>
    </div>
  );
};

export default DoctorFullProfile;
