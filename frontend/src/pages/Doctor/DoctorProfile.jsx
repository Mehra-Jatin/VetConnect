import React from "react";
import DoctorDetails from "./components/DoctorDetails.jsx";
import DoctorReviews from "./components/DoctorReviews.jsx";
import DoctorSkeleton from "./components/DoctorSkeleton.jsx";
import { useAuthStore } from "../../store/AuthStore.js";

const DoctorFullProfile = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <div className="text-center py-20 text-gray-600">Doctor profile not found.</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <DoctorDetails doctor={user} />
        <DoctorReviews doctorId={user._id} />
      </div>
    </div>
  );
};

export default DoctorFullProfile;
