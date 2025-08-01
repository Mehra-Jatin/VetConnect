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

        // Split: 90% to doctor, 10% to admin
        const doctorShare = Math.floor(feesInPaise * 0.9);
        const adminShare = feesInPaise - doctorShare;

        // Razorpay Order with Transfers (Split Payment)
        const razorpayOrder = await razorpay.orders.create({
            amount: feesInPaise,
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
            transfers: [
                {
                    account: doctor.razorpayLinkedAccountId, // stored in DB
                    amount: doctorShare,
                    currency: "INR",
                    notes: {
                        purpose: "Doctor Fees",
                    },
                },
                {
                    account: process.env.ADMIN_RAZORPAY_ACCOUNT_ID, // your admin Razorpay linked account ID
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

        // Create a new booking with paymentStatus = 'Pending'
        const booking = new Booking({
            userId,
            doctorId,
            date: new Date(),
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
  try{
    const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    bookingId, 
  } = req.body;

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  const isValid = generatedSignature === razorpaySignature;

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  if (isValid) {
    booking.paymentStatus = 'Completed';
    booking.paymentId = razorpayPaymentId;
    await booking.save();
    return res.status(200).json({ success: true });
  } else {
    booking.paymentStatus = 'Failed';
    await booking.save();
    return res.status(400).json({ success: false });
  }
  }
  catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({ error: 'Payment verification failed' });
  }
};


export const rateDoctor = async (req, res) => {
  const { doctorId, rating, comment } = req.body;
  const userId = res.user.id;

  try {
    // Check if the user has completed a booking with this doctor
    const booking = await Booking.findOne({ userId, doctorId, paymentStatus: "Completed" });
    if (!booking) {
      return res.status(400).json({ message: "You can only rate a doctor after a completed appointment." });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Create new rating
    await Rating.create({
      userId,
      doctorId,
      rating,
      comment: comment || "",
    });

    // Recalculate the doctor's average rating
    const allRatings = await Rating.find({ doctorId });
    const total = allRatings.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = total / allRatings.length;

    doctor.rating = parseFloat(avgRating.toFixed(1)); // rounded to 1 decimal
    await doctor.save();

    return res.status(200).json({ message: "Rating submitted successfully" });
  } catch (error) {
    console.error("Error rating doctor:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



