import Doctor from "../models/doctorModel.js";
import Rating from "../models/ratingModel.js";
import User from "../models/userModel.js";



export const getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().select("-password");
        return res.status(200).json(doctors);
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getDoctorById = async (req, res) => {
    const doctorId = req.params.id;
    try {
        const doctor = await Doctor.findById(doctorId).select("-password");
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        return res.status(200).json(doctor);
    } catch (error) {
        console.error("Error fetching doctor:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



export const getDoctorRatings = async (req, res) => {
    const doctorId = req.params.id;
    try {
        const ratings = await Rating.find({ doctorId })
            .populate('userId', 'FirstName LastName')
            .sort({ createdAt: -1 });

        if (!ratings || ratings.length === 0) {
            return res.status(404).json({ message: "No ratings found for this doctor" });
        }

        return res.status(200).json(ratings);
    } catch (error) {
        console.error("Error fetching doctor ratings:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

}


export const getUserDoctorById = async (req, res) => {
    const userId = req.params.id;
    try {
        let user;
        user = await Doctor.findById(userId).select("-password");
        if (!user) {
           user = await User.findById(userId).select("-password");
           if (!user) {
               return res.status(404).json({ message: "User not found" });
           }
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user doctor:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
