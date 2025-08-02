import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaUserMd, FaUserInjured, FaEye, FaEyeSlash, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

export default function Register() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    FirstName: '', LastName: '', email: '', password: '', confirmPassword: '', gender: '', PhoneNo: '', specialization: '', experience: ''
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [isNewDoctor, setIsNewDoctor] = useState(false);
  const navigate = useNavigate();

  const register = async (data) => {
    if (data.email === 'existing@example.com') return { success: false, message: 'Email already exists' };
    return { success: true, message: 'Registration successful' };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.FirstName) newErrors.FirstName = 'First name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password too short';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.PhoneNo) newErrors.PhoneNo = 'Phone is required';
    if (!/^\d+$/.test(formData.PhoneNo)) newErrors.PhoneNo = 'Phone must be digits only';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 2 && validateStep2()) {
      const result = await register({ ...formData, role });
      if (result.success) {
        if (role === 'doctor') setIsNewDoctor(true);
        else navigate('/auth/login');
      } else {
        setError(result.message.includes('exists') ? 'This email is already registered.' : result.message);
      }
    }
  };

  if (isNewDoctor) return <div className="min-h-screen flex items-center justify-center text-center text-xl font-semibold">Registration complete. Await admin approval.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2">
          Create Your Account
        </h2>
        <p className="text-sm text-center text-gray-600 mb-4">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/auth/login")}
            className="text-orange-600 font-medium hover:underline"
          >
            Sign in
          </button>
        </p>

        <div className="flex items-center justify-center gap-3 mb-6">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
              step === 1
                ? "bg-orange-600 text-white"
                : "bg-orange-200 text-orange-600"
            }`}
          >
            1
          </div>
          <div className="w-10 h-1 bg-orange-300 rounded"></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
              step === 2
                ? "bg-orange-600 text-white"
                : "bg-orange-200 text-orange-600"
            }`}
          >
            2
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              <h3 className="text-lg font-semibold text-center mb-4">
                Choose Your Role
              </h3>
              <div className="flex justify-center gap-4 mb-4">
                {["patient", "doctor"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setRole(opt)}
                    className={`flex flex-col items-center justify-center w-32 h-32 rounded-md border ${
                      role === opt
                        ? "bg-orange-500 text-white shadow-lg"
                        : "bg-white text-gray-700"
                    } transition`}
                  >
                    {opt === "patient" ? (
                      <FaUserInjured className="text-3xl mb-2" />
                    ) : (
                      <FaUserMd className="text-3xl mb-2" />
                    )}
                    <span className="capitalize font-medium">{opt}</span>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="FirstName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      First Name
                    </label>
                    <InputField
                      icon={<FaUser />}
                      name="FirstName"
                      placeholder="First Name"
                      value={formData.FirstName}
                      onChange={handleInputChange}
                      error={errors.FirstName}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="LastName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Last Name
                    </label>
                    <InputField
                      icon={<FaUser />}
                      name="LastName"
                      placeholder="Last Name"
                      value={formData.LastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <InputField
                    icon={<FaEnvelope />}
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <InputField
                    icon={<FaLock />}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={errors.password}
                    showToggle
                    toggleShow={() => setShowPassword(!showPassword)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm Password
                  </label>
                  <InputField
                    icon={<FaLock />}
                    name="confirmPassword"
                    type="password"
                    placeholder="********"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    error={errors.confirmPassword}
                  />
                </div>
              </div>{" "}
            </>
          )}

          {step === 2 && (
            <>
              <select
                name="gender"
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <InputField
                name="PhoneNo"
                placeholder="Phone Number"
                value={formData.PhoneNo}
                onChange={handleInputChange}
                error={errors.PhoneNo}
              />
              {role === "doctor" && (
                <>
                  <InputField
                    name="specialization"
                    placeholder="Specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                  />
                  <InputField
                    name="experience"
                    type="number"
                    placeholder="Years of Experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                  />
                </>
              )}
            </>
          )}

          <div className="flex justify-between gap-4">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 border rounded p-2 flex items-center justify-center gap-1"
              >
                <FaArrowLeft /> Back
              </button>
            )}
            <button
              type={step === 2 ? "submit" : "button"}
              onClick={
                step === 1 ? () => validateStep1() && setStep(2) : undefined
              }
              className="flex-1 bg-orange-600 text-white rounded p-2 flex items-center justify-center gap-2"
            >
              {step === 1 ? (
                <>
                  Next <FaArrowRight />
                </>
              ) : (
                "Complete Registration"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const InputField = ({ name, type = "text", placeholder, value, onChange, error, icon, showToggle, toggleShow }) => (
  <div className="relative">
    {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">{icon}</div>}
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`pl-10 pr-10 w-full border rounded p-2 ${error ? 'border-red-500' : 'border-gray-300'} bg-gray-50`}
    />
    {showToggle && (
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400" onClick={toggleShow}>
        {type === 'password' ? <FaEyeSlash /> : <FaEye />}
      </div>
    )}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);