import Doctor from "../models/doctorModel.js";
import Booking from "../models/bookingModel.js";
import cloudinary from "../config/cloudinary.js";

// Update doctor profile image
export const updateImage = async (req, res) => {
  const doctorId = req.user.id;
  const { image } = req.body;

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    let imageUrl;
    if (image) {
      const upload = await cloudinary.uploader.upload(image);
      imageUrl = upload.secure_url;
      if (!imageUrl) {
        return res.status(400).json({ message: "Image upload failed" });
      }
    }
    doctor.image = imageUrl || doctor.image;
    await doctor.save();
    return res.status(200).json({ message: "Image updated successfully" });
  } catch (error) {
    console.error("Error updating image:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update profile (excluding fees)
export const updateProfile = async (req, res) => {
  const doctorId = req.user.id;
  const { FirstName, LastName, specialization, experience, age, gender } =
    req.body;

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    doctor.FirstName = FirstName ?? doctor.FirstName;
    doctor.LastName = LastName ?? doctor.LastName;
    doctor.specialization = specialization ?? doctor.specialization;
    doctor.experience = experience ?? doctor.experience;
    doctor.age = age ?? doctor.age;
    doctor.gender = gender ?? doctor.gender;

    await doctor.save();
    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update doctor description
export const updateDescription = async (req, res) => {
  const doctorId = req.user.id;
  const { description } = req.body;

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    doctor.description = description || doctor.description;
    await doctor.save();
    return res
      .status(200)
      .json({ message: "Description updated successfully" });
  } catch (error) {
    console.error("Error updating description:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Toggle availability
export const setAvailability = async (req, res) => {
  const doctorId = req.user.id;
  const { isAvailable } = req.body;

  try {
   
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    doctor.isAvailable = isAvailable;
    await doctor.save();
    return res
      .status(200)
      .json({ message: "Availability updated successfully" });
  } catch (error) {
    console.error("Error updating availability:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get doctor bookings (only completed payments)
export const getBookings = async (req, res) => {
  const doctorId = req.user.id;

  try {
    const bookings = await Booking.find({
      doctorId: doctorId,
      paymentStatus: "Completed",
    })
      .populate("userId", "FirstName LastName email PhoneNo age gender")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
