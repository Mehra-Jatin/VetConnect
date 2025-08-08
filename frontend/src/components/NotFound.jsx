import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen mx-auto flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-9xl font-bold text-gray-800">404</h1>
      <h2 className="mt-4 text-3xl font-semibold text-gray-700">
        Page Not Found
      </h2>
      <p className="mt-2 text-gray-500 text-center max-w-md">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-3 bg-orange-600 text-white rounded-lg shadow hover:bg-orange-700 transition"
      >
        Go Back Home
      </button>
    </div>
  );
}
