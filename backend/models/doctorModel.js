import mongoose from 'mongoose';

const doctorSchema = mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: true,
      default: '',
    },
    LastName: {
      type: String,
      default: '',
    },
    Image: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'doctor',
    },
    age: {
      type: Number,
      default: 18,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'other'],
      default: '',
    },
    specialization: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      default: 0,
    },
    PhoneNo: {
      type: Number,
      required: true,
    },
    isValidated: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    fees: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
        default: 0,
    },
    razorpayLinkedAccountId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;