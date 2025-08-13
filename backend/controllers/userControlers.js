import Razorpay from "razorpay";
import Doctor from "../models/doctorModel.js";
import User from "../models/userModel.js";
import Booking from "../models/bookingModel.js";
import crypto from "crypto";
import Rating from "../models/ratingModel.js";
import cloudinary from "../config/cloudinary.js";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});

export const bookAppointment = async (req, res) => {
  const { doctorId } = req.body;
  const userId = req.user.id; 

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const amount = doctor.fees; // Define amount variable
    const doctorShare = Math.floor(amount * 0.9 * 100); // 90% to doctor in paise

  const order = await razorpay.orders.create({
      amount: amount * 100, // Full amount in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      transfers: [
        {
          account: doctor.razorpayLinkedAccountId, // Only doctor's linked account
          amount: doctorShare, // 90% goes to doctor
          currency: "INR",
          notes: { 
            purpose: "Doctor consultation fees",
            doctorId: doctorId,
            patientId: userId 
          },
          on_hold: false,
        }
        // remaining 10% stays in your main account
      ]
    });

    if (!order) {
      return res.status(500).json({ message: "Failed to create payment order" });
    }


       const now = new Date();
    const dayOfWeek = now.toLocaleString("en-US", { weekday: "long" });
    const dateOnly = now.toISOString().split("T")[0];
    const timeOnly = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const monthName = now.toLocaleString("en-US", { month: "long" });
    const booking = new Booking({
      userId,
      doctorId,
      amount: doctor.fees,
      razorpayOrderId: order.id, // Fixed: was razorpayOrder.id
      paymentStatus: "Failed",
      paymentId: null,
      date: now,
      dayOfWeek: dayOfWeek,
      dateOnly: dateOnly,
      timeOnly: timeOnly,
      monthName: monthName,
    });

    await booking.save();

    return res.status(201).json({
      message: "Appointment created, proceed to payment",
      orderId: order.id, // Fixed: was razorpayOrder.id
      amount: amount * 100, // Fixed: was feesInPaise
      currency: "INR",
      bookingId: booking._id,
    });

  } catch (error) {
    console.error("Error booking appointment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      bookingId,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    const isValid = generatedSignature === razorpaySignature;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const now = new Date();

    if (isValid) {
      const completion = new Date(now.getTime() + 48 * 60 * 60 * 1000);
      const completionDayOfWeek = completion.toLocaleString("en-US", { weekday: "long" });
      const completionDateOnly = completion.toISOString().split("T")[0];
      const completionTimeOnly = completion.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      booking.paymentStatus = "Completed";
      booking.paymentId = razorpayPaymentId;
      booking.completionDate = completion;
      booking.completionDayOfWeek = completionDayOfWeek;
      booking.completionDateOnly = completionDateOnly;
      booking.completionTimeOnly = completionTimeOnly;

      await booking.save();
      return res.status(200).json({ success: true });

    } else {
      // Payment failed — clear appointment info
      booking.paymentStatus = "Failed";
      booking.paymentId = razorpayPaymentId;
      booking.completionDate = null;
      booking.completionDayOfWeek = "N/A";
      booking.completionDateOnly = "0000-00-00";
      booking.completionTimeOnly = "N/A";

      await booking.save();
      return res.status(400).json({ success: false });
    }

  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({ error: "Payment verification failed" });
  }
};

export const getUsersBookings = async (req, res) => {
  const userId = req.user.id;

  try {
    const bookings = await Booking.find({ userId })
      .populate("doctorId", "FirstName LastName specialization PhoneNo email")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const rateDoctor = async (req, res) => {
  const { doctorId, rating, comment } = req.body;
  const userId = req.user.id;

  try {
    // Check if booking exists for this user and doctor
    const booking = await Booking.findOne({ userId, doctorId });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const newRating = new Rating({
      userId,
      doctorId,
      rating,
      comment,
    });
    await newRating.save();

    // Calculate the updated average rating for the doctor
    const ratings = await Rating.find({ doctorId });
    const avgRating =
      ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    await Doctor.findByIdAndUpdate(doctorId, { rating: avgRating });

    return res.status(200).json({ message: "Doctor rated successfully" });
  } catch (error) {
    console.error("Error rating doctor:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const { FirstName, LastName, PhoneNo, age, gender } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.FirstName = FirstName || user.FirstName;
    user.LastName = LastName || user.LastName;
    user.PhoneNo = PhoneNo || user.PhoneNo;
    user.age = age || user.age;
    user.gender = gender || user.gender;

    await user.save();

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserImage = async (req, res) => {
  const userId = req.user.id;
  const { image } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  
    let imageUrl;
    if (image) {
      const upload = await cloudinary.uploader.upload(image);
      imageUrl = upload.secure_url;
      if (!imageUrl) {
        return res.status(400).json({ message: "Image upload failed" });
      }
    }
    user.image = imageUrl || user.image;

    await user.save();

    return res.status(200).json({ message: "Profile image updated successfully" });
  } catch (error) {
    console.error("Error updating user profile image:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};