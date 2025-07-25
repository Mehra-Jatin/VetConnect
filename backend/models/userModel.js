import mongoose from 'mongoose';


const userSchema = mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: true,
    },
    LastName: {
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
    age: {
      type: Number,
      default: 18,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'other'],
      default: '',
    },    
    role: {
      type: String,
      enum: ['patient', 'admin'],
      default: 'patient',
    },
    PhoneNo: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;