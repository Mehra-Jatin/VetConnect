const bookingSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },

    date: { type: Date, required: true, default: Date.now },
    dayOfWeek: { type: String },
    dateOnly: { type: String },
    timeOnly: { type: String },

    completionDate: { type: Date },
    completionDayOfWeek: { type: String },
    completionDateOnly: { type: String },
    completionTimeOnly: { type: String },

    monthName: { type: String }, 

    amount: { type: Number, default: 0 },
    paymentId: { type: String },
    razorpayOrderId: { type: String, required: true },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
