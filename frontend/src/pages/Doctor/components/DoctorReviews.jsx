import React, { useEffect } from "react";
import { Star } from "lucide-react";
import { useAuthStore } from "../../../store/AuthStore";

const DoctorReviews = ({ doctorId }) => {
  const { doctorReviews, getDoctorReviews, isLoadingReviews } = useAuthStore();

  useEffect(() => {
    if (doctorId) {
      getDoctorReviews(doctorId);
    }
  }, [doctorId, getDoctorReviews]);

  return (
    <div>
      <h3 className="text-xl font-bold text-orange-700 mb-4">
        Patient Reviews
      </h3>

      {isLoadingReviews ? (
        <p className="text-gray-500">Loading reviews...</p>
      ) : doctorReviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {doctorReviews.map((review) => (
            <div
              key={review._id}
              className="bg-white border rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-800">
                  {review.userId?.FirstName} {review.userId?.LastName}
                </p>
                <span className="flex items-center text-yellow-500 font-bold text-sm">
                  <Star
                    size={16}
                    className="mr-1 text-yellow-400"
                    fill="currentColor"
                    stroke="none"
                  />{" "}
                  {review.rating}
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
  );
};

export default DoctorReviews;
