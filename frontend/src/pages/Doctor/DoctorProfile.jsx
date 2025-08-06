import React, { useEffect, useState } from "react";
import {
  Star,
  User,
  Mail,
  Phone,
  MessageCircle,
  HeartPulse,
  ShieldCheck,
} from "lucide-react";
import { useParams } from "react-router-dom";

// Dummy Doctor & Reviews Data
const dummyDoctor = {
  _id: "doc1",
  FirstName: "Dr. Radhika",
  LastName: "Sharma",
  Image: "/doc1.png",
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
  const { id } = useParams(); // for future API fetch
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDoctor(dummyDoctor);
      setReviews(dummyReviews);
      setLoading(false);
    }, 800);
  }, []);

  if (loading)
  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 animate-pulse">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Skeleton Doctor Info */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200 grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-40 h-40 bg-gray-200 rounded-full mb-4" />
            <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="h-5 w-40 bg-gray-200 rounded" />
            <div className="h-3 w-full bg-gray-200 rounded" />
            <div className="h-3 w-4/5 bg-gray-200 rounded" />
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <div className="h-3 w-24 bg-gray-200 rounded mb-1" />
                  <div className="h-4 w-32 bg-gray-300 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skeleton Reviews */}
        <div className="space-y-3">
          <div className="h-5 w-40 bg-gray-200 rounded" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="bg-white p-4 border rounded-lg shadow-sm space-y-2"
            >
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-3 w-full bg-gray-200 rounded" />
              <div className="h-3 w-1/2 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Doctor Info */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200 grid md:grid-cols-3 gap-8">
          {/* Image */}
          <div className="flex flex-col items-center text-center">
            <img
              src={doctor.Image}
              alt={doctor.FirstName}
              className="w-40 h-40 rounded-full object-cover shadow-md border-4 border-orange-500"
            />
            <h2 className="text-2xl font-bold text-gray-800 mt-4">
              {doctor.FirstName} {doctor.LastName}
            </h2>
            <p className="text-orange-600 font-medium flex items-center gap-1 mt-1">
              <HeartPulse size={16} /> {doctor.specialization}
            </p>
            <span
              className={`mt-3 px-3 py-1 text-sm rounded-full font-medium flex items-center gap-1 ${
                doctor.isAvailable
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              ● {doctor.isAvailable ? "Available" : "Not Available"}
            </span>
            {doctor.isValidated && (
              <span className="mt-2 px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-full flex items-center gap-1">
                <ShieldCheck size={14} /> Verified
              </span>
            )}
          </div>

          {/* Description & Info */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              About Doctor
            </h3>
            <p className="text-gray-600 mb-4">{doctor.description}</p>

            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p className="text-gray-500">📧 Email</p>
                <p className="font-medium">{doctor.email}</p>
              </div>
              <div>
                <p className="text-gray-500">📞 Phone</p>
                <p className="font-medium">{doctor.PhoneNo}</p>
              </div>
              <div>
                <p className="text-gray-500">👤 Gender</p>
                <p className="font-medium">{doctor.gender}</p>
              </div>
              <div>
                <p className="text-gray-500">🎓 Experience</p>
                <p className="font-medium">{doctor.experience} years</p>
              </div>
              <div>
                <p className="text-gray-500">💰 Fees</p>
                <p className="font-medium">₹{doctor.fees}</p>
              </div>
              <div>
                <p className="text-gray-500">⭐ Average Rating</p>
                <p className="font-medium flex items-center gap-1">
                  {doctor.rating} <Star className="text-yellow-500" size={16} />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-10">
          <h3 className="text-xl font-bold text-orange-700 mb-4">Patient Reviews</h3>
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white border rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-800">
                      {review.userId.FirstName} {review.userId.LastName}
                    </p>
                    <span className="flex items-center text-yellow-500 font-bold text-sm">
                      <Star size={16} className="mr-1" /> {review.rating}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{review.comment}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorFullProfile;
