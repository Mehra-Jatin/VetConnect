import Doctor from "../models/doctorModel.js";
import Booking from "../models/bookingModel.js";



export const updateImage = async (req, res) => {
    const doctorId = res.user.id;
    const { image } = req.body;
    try {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        doctor.image = image;
        await doctor.save();
        return res.status(200).json({ message: "Image updated successfully" });
    } catch (error) {
        console.error("Error updating image:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProfile = async (req, res) => {
    const doctorId = res.user.id;
    const { FirstName, LastName, specialization, experience, age, gender, fees } = req.body;

    try {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        doctor.FirstName = FirstName;
        doctor.LastName = LastName;
        doctor.specialization = specialization;
        doctor.experience = experience;
        doctor.age = age;
        doctor.gender = gender;
        doctor.fees = fees;
        await doctor.save();
        return res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const setAvailability = async (req, res) => {

    const doctorId = res.user.id;
    const {isAvailable } = req.body;
   try{
       const doctor = await Doctor.findById(doctorId);
       if (!doctor) {
           return res.status(404).json({ message: "Doctor not found" });
       }
       doctor.isAvailable = isAvailable;
       await doctor.save();
       return res.status(200).json({ message: "Availability updated successfully" });
   } catch (error) {
       console.error("Error updating availability:", error);
       return res.status(500).json({ message: "Internal server error" });
   }
}


export const getBookings = async (req, res) => {
    const doctorId = res.user.id;

    try {
        const bookings = await Booking.find({ 
            doctorId: doctorId,
            paymentStatus: "Completed" 
        })
        .populate("userId", "FirstName LastName email PhoneNo")
        .sort({ createdAt: -1 }); // Newest first

        return res.status(200).json({ bookings });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};










