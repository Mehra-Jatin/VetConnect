import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DoctorDetails from "../Doctor/components/DoctorDetails.jsx";
import { AppointmentForm } from "./components/AppointmentForm.jsx";
import DoctorReviews from "../Doctor/components/DoctorReviews.jsx";
import ReviewForm from "./components/ReviewForm.jsx";
import DoctorSkeleton from "../Doctor/components/DoctorSkeleton.jsx";
import { useAuthStore } from "../../store/AuthStore.js";
import NoDoctorFound from "./components/NoDoctorFound.jsx";

const DoctorPublicProfile = () => {
  const { id } = useParams();
  const { getDoctorById } = useAuthStore();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      try {
        const fetchedDoctor = await getDoctorById(id);
        setDoctor(fetchedDoctor);
      } catch (err) {
        console.error("Failed to fetch doctor profile:", err);
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id, getDoctorById]);

  if (loading) return <div className="max-w-6xl mx-auto space-y-8"><DoctorSkeleton /></div>;
  if (!doctor) return <NoDoctorFound />;

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
          <DoctorReviews doctorId={doctor._id} />
        </div>
      </div>
    </div>
  );
};

export default DoctorPublicProfile;
