// src/components/skeletons/MessageSkeleton.jsx
import React from "react";

const MessageSkeleton = ({ count = 4 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
        >
          <div
            className={`h-10 rounded-lg animate-pulse ${
              i % 2 === 0 ? "bg-gray-200 w-32" : "bg-orange-200 w-40"
            }`}
          />
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
