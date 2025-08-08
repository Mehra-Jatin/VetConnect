import React from "react";
import { Star } from "lucide-react";

const DoctorReviews = ({ reviews }) => {
  return (
    <div>
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
  );
};

export default DoctorReviews;
