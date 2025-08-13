import React, { useEffect, useState } from "react";
import DoctorDetails from "./components/DoctorDetails.jsx";
import DoctorReviews from "./components/DoctorReviews.jsx";
import DoctorSkeleton from "./components/DoctorSkeleton.jsx";
import { useAuthStore } from "../../store/AuthStore.js";

const DoctorFullProfile = () => {
  const { user, getDoctorRatings } = useAuthStore();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!user?._id) return;
      setLoading(true);
      const ratings = await getDoctorRatings(user._id);
      setReviews(ratings || []);
      setLoading(false);
    };

    fetchDoctorData();
  }, [user, getDoctorRatings]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <DoctorSkeleton />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 text-gray-600">
        Doctor profile not found.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <DoctorDetails doctor={user} />
        <DoctorReviews reviews={reviews} />
      </div>
    </div>
  );
};

export default DoctorFullProfile;
