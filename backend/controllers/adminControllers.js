import Doctor from "../models/doctorModel.js";
import Booking from "../models/bookingModel.js";
import axios from "axios";



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


// use this function to create a Razorpay linked account for the doctor in test mode 
export const createRazorpayLinkedAccount = async (req, res) => {
    const { doctorId } = req.body;

    try {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        if (doctor.razorpayLinkedAccountId) {
            return res.status(400).json({ message: "Razorpay account already linked" });
        }

        const response = await axios.post(
            "https://api.razorpay.com/v1/accounts",
            {
                name: doctor.name,
                email: doctor.email,
                contact: doctor.phone,
                type: "individual",
                legal_business_name: doctor.name,
                business_type: "freelancer",
                customer_facing_business_name: doctor.name,
                profile: {
                    category: "healthcare",
                    subcategory: "doctor",
                    addresses: {
                        registered: {
                            street: "Doctor Street",
                            city: "CityName",
                            state: "StateName",
                            postal_code: "123456",
                            country: "IN",
                        },
                    },
                },
            },
            {
                auth: {
                    username: process.env.RAZORPAY_API_KEY,
                    password: process.env.RAZORPAY_API_SECRET,
                },
            }
        );

        const linkedAccountId = response.data.id;

        doctor.razorpayLinkedAccountId = linkedAccountId;
        await doctor.save();

        return res.status(200).json({
            message: "Linked account created",
            linkedAccountId,
        });
    } catch (error) {
        console.error("Error creating linked account:", error.response?.data || error.message);
        return res.status(500).json({ message: "Failed to create Razorpay linked account" });
    }
};




