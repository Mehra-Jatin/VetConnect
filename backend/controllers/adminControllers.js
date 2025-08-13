
import Doctor from "../models/doctorModel.js";


// use this function after creating linked Account for a doctor from Razorpay dashboard 
export const updatelinkedRazorPayAccountId = async (req, res) => {
     const { accountId , doctorId } = req.body;
    try {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        doctor.razorpayLinkedAccountId = accountId;
        await doctor.save();
        return res.status(200).json({ message: "RazorPay account linked successfully" });
    } catch (error) {
        console.error("Error linking RazorPay account:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

