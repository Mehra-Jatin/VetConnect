
const DoctorSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6">
      {/* Doctor Card */}
      <div className="bg-white p-6 rounded-lg shadow flex gap-4">
        <div className="w-28 h-28 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>

      {/* Reviews Placeholder */}
      <div className="space-y-4 pt-8">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default DoctorSkeleton;