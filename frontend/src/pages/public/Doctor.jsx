import React, { useState, useEffect } from "react";
import { Eye, SearchX, RefreshCw, AlertTriangle } from "lucide-react";

const dummyDoctors = [
  {
    _id: "1",
    FirstName: "Aarav",
    LastName: "Sharma",
    specialization: "Cardiologist",
    rating: 4.5,
    numOfReviews: 28,
    experience: 10,
    fees: 500,
    isValidated: true,
    image: "doc1.png",
  },
  {
    _id: "2",
    FirstName: "Meera",
    LastName: "Iyer",
    specialization: "Dermatologist",
    rating: 4.2,
    numOfReviews: 18,
    experience: 7,
    fees: 400,
    isValidated: true,
    image: "doc1.png",
  },
  {
    _id: "3",
    FirstName: "Rahul",
    LastName: "Verma",
    specialization: "Orthopedic",
    rating: 4.0,
    numOfReviews: 12,
    experience: 5,
    fees: 600,
    isValidated: true,
    image: "doc1.png",
  },
  {
    _id: "4",
    FirstName: "Riya",
    LastName: "Singh",
    specialization: "Cardiologist",
    rating: 3.6,
    numOfReviews: 22,
    experience: 3,
    fees: 350,
    isValidated: true,
    image: "doc1.png",
  },
];

const DoctorCard = ({ doctor }) => (
  <div className="border rounded-lg shadow-sm hover:shadow-md transition p-6 mb-6">
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-600">
        {doctor.image ? (
          <img src={doctor.image} alt={`${doctor.FirstName} ${doctor.LastName}`} className="w-full h-full rounded-full object-cover" />
        ) : (
          <span className="text-gray-400"> {doctor.FirstName[0]}{doctor.LastName[0]}</span>
        )}
      </div>
      <div className="flex-1 space-y-2">
        <h3 className="text-xl font-semibold text-orange-900">Dr. {doctor.FirstName} {doctor.LastName}</h3>
        <p className="text-orange-500 font-medium">{doctor.specialization}</p>
        <div className="text-sm text-gray-600">⭐ {doctor.rating} ({doctor.numOfReviews} reviews)</div>
        <div className="text-sm text-gray-600">🕒 {doctor.experience} years experience</div>
        <div className="text-sm text-gray-600">💰 ₹{doctor.fees} per consultation</div>
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-orange-500 text-orange-500 rounded hover:bg-orange-50 transition">
            <Eye size={16} /> View Profile
          </button>
          <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition">
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  </div>
);

const Doctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    specializations: [],
    rating: "",
    experience: "",
    fees: "",
  });

  useEffect(() => {
    setTimeout(() => {
      setDoctors(dummyDoctors);
      setLoading(false);
    }, 800);
  }, []);

  const handleCheckboxChange = (type, value) => {
    setSearch(""); // clear search on filter change
    setFilters((prev) => {
      const currentValues = prev[type];
      if (Array.isArray(currentValues)) {
        return {
          ...prev,
          [type]: currentValues.includes(value)
            ? currentValues.filter((v) => v !== value)
            : [...currentValues, value],
        };
      }
      return { ...prev, [type]: prev[type] === value ? "" : value };
    });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setFilters({ specializations: [], rating: "", experience: "", fees: "" });
  };

  const handleClearAll = () => {
    setSearch("");
    setFilters({ specializations: [], rating: "", experience: "", fees: "" });
  };

  const specializationsList = [...new Set(doctors.map((d) => d.specialization))];

  const filteredDoctors = doctors.filter((doc) => {
    const nameMatch = `${doc.FirstName} ${doc.LastName}`.toLowerCase().includes(search.toLowerCase());

    const specializationMatch =
      filters.specializations.length === 0 || filters.specializations.includes(doc.specialization);

    const ratingMatch = filters.rating ? doc.rating >= parseFloat(filters.rating) : true;

    const experienceMatch = filters.experience ? doc.experience >= parseInt(filters.experience) : true;

    const feesMatch = filters.fees ? doc.fees <= parseInt(filters.fees) : true;

    return doc.isValidated && (search ? nameMatch : specializationMatch && ratingMatch && experienceMatch && feesMatch);
  });

  return (
    <div className="min-h-screen bg-white px-4 md:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-1/4 border rounded p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-700">Filters</h3>
              <button className="text-sm text-orange-600 hover:underline" onClick={handleClearAll}>
                Clear All
              </button>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-sm text-gray-700 mb-2">Specialty</h4>
              {specializationsList.map((spec) => (
                <label key={spec} className="block text-sm text-gray-600">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={filters.specializations.includes(spec)}
                    onChange={() => handleCheckboxChange("specializations", spec)}
                  />
                  {spec}
                </label>
              ))}
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-sm text-gray-700 mb-2">Rating</h4>
              {[4, 3, 2].map((rate) => (
                <label key={rate} className="block text-sm text-gray-600">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={filters.rating === `${rate}`}
                    onChange={() => handleCheckboxChange("rating", `${rate}`)}
                  />
                  {rate} Stars & Above
                </label>
              ))}
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-sm text-gray-700 mb-2">Experience</h4>
              {[2, 5, 10].map((exp) => (
                <label key={exp} className="block text-sm text-gray-600">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={filters.experience === `${exp}`}
                    onChange={() => handleCheckboxChange("experience", `${exp}`)}
                  />
                  {exp}+ years
                </label>
              ))}
            </div>

            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Fees</h4>
              {[400, 500, 600].map((fee) => (
                <label key={fee} className="block text-sm text-gray-600">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={filters.fees === `${fee}`}
                    onChange={() => handleCheckboxChange("fees", `${fee}`)}
                  />
                  ₹{fee} or less
                </label>
              ))}
            </div>
          </aside>

          {/* Right Section */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, specialty, or experience..."
              value={search}
              onChange={handleSearchChange}
              className="w-full border px-4 py-2 rounded shadow-sm mb-4"
            />

            {!loading && (
              <p className="text-sm text-gray-600 mb-3">
                {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? "s" : ""} found
              </p>
            )}

            {loading && (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-40 bg-gray-100 rounded-lg mb-4 animate-pulse" />
                ))}
              </>
            )}

            {!loading && filteredDoctors.length === 0 && (
              <div className="text-center text-gray-600 mt-20">
                <SearchX className="w-16 h-16 mx-auto mb-2 text-gray-400" />
                <h3 className="text-xl font-semibold">No Doctors Found</h3>
                <p className="text-sm mt-2">Try a different search or clear filters.</p>
              </div>
            )}

            {!loading && filteredDoctors.length > 0 && (
              <div className="space-y-6">
                {filteredDoctors.map((doc) => (
                  <DoctorCard key={doc._id} doctor={doc} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctor;
