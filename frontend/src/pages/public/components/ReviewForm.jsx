import React, { useState } from "react";
import { Star } from "lucide-react";
import { useAuthStore } from "../../../store/AuthStore";
import toast from "react-hot-toast";

const ReviewForm = ({ doctorId }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const { submitDoctorReview,user } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return toast.error("Please select a rating");
    if (!comment.trim()) return toast.error("Please write a comment");

    setLoading(true);
     await submitDoctorReview(doctorId, rating, comment);
    setLoading(false);
    setRating(0);
    setComment("");
  };

  if(user &&user.role === "doctor"){
    return(
      <></>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mt-8">
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium mb-2">Rating</label>
          <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, index) => {
              const starValue = index + 1;
              return (
                <button
                  key={starValue}
                  type="button"
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHover(starValue)}
                  onMouseLeave={() => setHover(null)}
                  className="focus:outline-none"
                >
                  <Star
                    size={28}
                    className={
                      starValue <= (hover || rating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium mb-1">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="border p-2 rounded w-full"
            placeholder="Share your experience..."
          ></textarea>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
