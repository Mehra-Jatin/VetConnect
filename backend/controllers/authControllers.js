import User from "../models/userModel.js";
import Doctor from "../models/doctorModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



export const register = async (req, res) => {
  const {
    FirstName,
    LastName,
    email,
    password,
    age,
    gender,
    role,
    specialization,
    experience,
    PhoneNo,
  } = req.body;

  try {
    // Validate required fields
    if (!FirstName || !email || !password || !PhoneNo) {
      return res.status(400).json({
        success: false,
        message: "FirstName, email, password, and PhoneNo are required.",
      });
    }

    // Check if the email already exists
     const existingDoctor = await Doctor.findOne({ $or: [{ email }, { PhoneNo }] });
     const existingUser = await User.findOne({ $or: [{ email }, { PhoneNo }] });

    if (existingUser || existingDoctor) {
      return res.status(400).json({
        success: false,
        message: `A ${role} with this email or PhoneNO already exists.`,
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the appropriate user or doctor
    if (role === "doctor") {
      const newDoctor = new Doctor({
        FirstName,
        LastName,
        email,
        age,
        gender,
        password: hashedPassword,
        specialization,
        experience,
        PhoneNo,
      });

      await newDoctor.save();

      return res.status(201).json({
        success: true,
        message: "Doctor registered successfully.",
      });
 
    } else {
      const newUser = new User({
        FirstName,
        LastName,
        email,
        age,
        gender,
        password: hashedPassword,
        PhoneNo,
      });
      await newUser.save();
      return res.status(201).json({
        success: true,
        message: "User registered successfully.",
      });
    }
  } catch (error) {
    console.error("Error registering user/doctor:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Find user or doctor by email
    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      user = await Doctor.findOne({ email }).select("+password");
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User or Doctor not found.",
        });
      }
    }

    // Compare provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials.",
      });
    }
   
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY, 
      { expiresIn: "12h" }
    );
    
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 12 * 60 * 60 * 1000,
    });

    user.password = undefined; 

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};


export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};


export const getProfile = async (req, res) => {
    const id = req.userId;

    try {
        let user;
        user = await User.findById(id).select("-password");
        if (!user) {
            user = await Doctor.findById(id).select("-password");
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User or Doctor not found.",
                });
            }
        }
        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};

