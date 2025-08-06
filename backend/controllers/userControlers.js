import Razorpay from "razorpay";
import Doctor from "../models/Doctor.js";
import Booking from "../models/Booking.js";
import crypto from "crypto";
import Rating from "../models/ratingModel.js";

// Razorpay instance (Admin credentials)
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


export const bookAppointment = async (req, res) => {
  const { doctorId } = req.body;
  const userId = res.user.id;

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (!doctor.isAvailable) {
      return res.status(400).json({ message: "Doctor is not available" });
    }

    const feesInPaise = doctor.fees * 100;

    const doctorShare = Math.floor(feesInPaise * 0.9);
    const adminShare = feesInPaise - doctorShare;

    const razorpayOrder = await razorpay.orders.create({
      amount: feesInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      transfers: [
        {
          account: doctor.razorpayLinkedAccountId,
          amount: doctorShare,
          currency: "INR",
          notes: {
            purpose: "Doctor Fees",
          },
        },
        {
          account: process.env.ADMIN_RAZORPAY_ACCOUNT_ID,
          amount: adminShare,
          currency: "INR",
          notes: {
            purpose: "Platform Commission",
          },
        },
      ],
    });

    if (!razorpayOrder) {
      return res.status(500).json({ message: "Failed to create payment order" });
    }

    const booking = new Booking({
      userId,
      doctorId,
      amount: doctor.fees,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: "Pending",
    });

    await booking.save();

    return res.status(201).json({
      message: "Appointment created, proceed to payment",
      orderId: razorpayOrder.id,
      amount: feesInPaise,
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

    if (isValid) {
      const now = new Date();
      const completion = new Date(now.getTime() + 48 * 60 * 60 * 1000);

      const dayOfWeek = now.toLocaleString("en-US", { weekday: "long" });
      const dateOnly = now.toISOString().split("T")[0];
      const timeOnly = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const completionDayOfWeek = completion.toLocaleString("en-US", { weekday: "long" });
      const completionDateOnly = completion.toISOString().split("T")[0];
      const completionTimeOnly = completion.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const monthName = now.toLocaleString("en-US", { month: "long" });

      booking.paymentStatus = "Completed";
      booking.paymentId = razorpayPaymentId;

      booking.date = now;
      booking.dayOfWeek = dayOfWeek;
      booking.dateOnly = dateOnly;
      booking.timeOnly = timeOnly;

      booking.completionDate = completion;
      booking.completionDayOfWeek = completionDayOfWeek;
      booking.completionDateOnly = completionDateOnly;
      booking.completionTimeOnly = completionTimeOnly;

      booking.monthName = monthName;

      await booking.save();

      return res.status(200).json({ success: true });

    } else {
      // Payment failed — clear appointment info
      booking.paymentStatus = "Failed";
      booking.paymentId = null;

      booking.date = null;
      booking.dayOfWeek = "N/A";
      booking.dateOnly = "0000-00-00";
      booking.timeOnly = "N/A";

      booking.completionDate = null;
      booking.completionDayOfWeek = "N/A";
      booking.completionDateOnly = "0000-00-00";
      booking.completionTimeOnly = "N/A";
      
       const monthName = now.toLocaleString("en-US", { month: "long" });
      booking.monthName = monthName;

      await booking.save();

      return res.status(400).json({ success: false });
    }

  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({ error: "Payment verification failed" });
  }
};


