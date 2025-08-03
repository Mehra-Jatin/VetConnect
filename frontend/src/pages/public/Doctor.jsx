import React, { useState, useEffect } from "react";
import { Eye, RefreshCw, AlertTriangle } from "lucide-react";

const dummyDoctors = [
  {
    _id: '1',
    FirstName: 'Aarav',
    LastName: 'Sharma',
    specialization: 'Cardiologist',
    rating: 4.5,
    numOfReviews: 28,
    experience: 10,
    fees: 500,
    isValidated: true,
    image: '',
  },
  {
    _id: '2',
    FirstName: 'Meera',
    LastName: 'Iyer',
    specialization: 'Dermatologist',
    rating: 4.2,
    numOfReviews: 18,
    experience: 7,
    fees: 400,
    isValidated: true,
    image: '',
  },
  {
    _id: '3',
    FirstName: 'Rahul',
    LastName: 'Verma',
    specialization: 'Orthopedic',
    rating: 4.0,
    numOfReviews: 12,
    experience: 5,
    fees: 600,
    isValidated: true,
    image: '',
  },
];
const StarRating = ({ rating }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${
            star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const DoctorCard = ({ doctor }) => {
  return (
    <div className="border rounded-lg shadow-sm hover:shadow-lg hover:border-orange-300 transition p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <img
            src={doctor.image || "/doc1.png"}
            alt="doctor avatar"
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-xl font-semibold text-orange-900">
              Dr. {doctor.FirstName} {doctor.LastName}
            </h3>
            <p className="text-orange-500 font-medium">
              {doctor.specialization}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <StarRating rating={doctor.rating} />
            <span className="text-sm text-gray-500">
              ({doctor.numOfReviews} reviews)
            </span>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {doctor.experience} years experience
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c.837 0 1.65-.163 2.414-.464A4.978 4.978 0 0015 4a5 5 0 00-9.9.8A5.001 5.001 0 005 10h7z"
                />
              </svg>
              ₹{doctor.fees} per consultation
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-orange-500 text-orange-500 rounded hover:bg-orange-50 transition">
              <Eye size={16} /> View Profile
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DoctorSkeleton = () => (
  <div className="border rounded-lg shadow-sm p-6 mb-6 animate-pulse">
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-32 h-32 bg-gray-300 rounded-full" />
      <div className="flex-1 space-y-3">
        <div className="h-5 bg-gray-300 rounded w-1/2" />
        <div className="h-4 bg-gray-300 rounded w-1/3" />
        <div className="h-4 bg-gray-300 rounded w-full" />
        <div className="h-4 bg-gray-300 rounded w-full" />
        <div className="flex gap-4">
          <div className="h-10 w-1/2 bg-gray-300 rounded" />
          <div className="h-10 w-1/2 bg-gray-300 rounded" />
        </div>
      </div>
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="min-h-[80vh] flex items-center justify-center p-4">
    <div className="max-w-md w-full border p-6 text-center rounded-lg shadow">
      <AlertTriangle className="w-16 h-16 mx-auto text-red-500 mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 mb-3">
        Unable to Load Doctors
      </h2>
      <p className="text-gray-600 mb-4">
        We're experiencing difficulties connecting to our doctors database.
        Please check your internet connection and try again.
      </p>
      {error && (
        <p className="text-sm text-red-500 bg-red-100 p-2 rounded mb-4">
          {error.toString()}
        </p>
      )}
      <button
        onClick={onRetry}
        className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded"
      >
        <RefreshCw className="w-4 h-4" /> Try Again
      </button>
    </div>
  </div>
);

const Doctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      try {
        setDoctors(dummyDoctors); // Try change to [] or real data
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }, 1000);
  }, []);

  const retry = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setDoctors(dummyDoctors);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-800 mb-6">
          Find Your Doctor
        </h1>

        {loading && (
          <>
            {[1, 2, 3].map((s) => (
              <DoctorSkeleton key={s} />
            ))}
          </>
        )}

        {!loading && error && <ErrorState error={error} onRetry={retry} />}

        {!loading && !error && doctors.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <svg
              className="w-20 h-20 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12h.01M9 12h.01M12 12h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800">
              No Doctors Found
            </h3>
            <p className="text-sm text-gray-500 mt-2 max-w-sm">
              We couldn’t find any doctors matching your search or filters. Try
              adjusting your search query or reset the filters.
            </p>
            <button
              onClick={retry}
              className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded transition"
            >
              Reset & Retry
            </button>
          </div>
        )}

        {!loading && !error && doctors.length > 0 && (
          <div className="space-y-6">
            {doctors.map((doc) => (
              <DoctorCard key={doc._id} doctor={doc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctor;
