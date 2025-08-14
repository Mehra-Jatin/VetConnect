import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Doctor from '../models/doctorModel.js';

export const authMiddleware =async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized, no token provided" });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decoded.userId);
      const doctor = await Doctor.findById(decoded.userId);
      if (!user && !doctor) {
        return res.status(404).json({ message: 'User or Doctor not found.' });
      }

      
      if (user) {
        req.user = user;
      }

      if (doctor) {
        req.user = doctor;
      }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ message: "Unauthorized, invalid token" });
    }
}
