import express from 'express';
import { updateImage, updateProfile, updateDescription , setAvailability, getBookings, deleteDoctorAccount } from '../controllers/doctorControllers.js';
import { authMiddleware } from '../middleware/AuthMiddleware.js';
import { authorizeRoles} from '../middleware/RoleMiddleware.js'
const router = express.Router();


router.put('/update-image',authMiddleware ,authorizeRoles('doctor','admin'),updateImage);
router.put('/update-profile',authMiddleware ,authorizeRoles('doctor','admin'), updateProfile);
router.put('/update-description',authMiddleware ,authorizeRoles('doctor','admin'), updateDescription);
router.put('/set-availability',authMiddleware ,authorizeRoles('doctor','admin'), setAvailability);
router.get('/bookings',authMiddleware ,authorizeRoles('doctor','admin'), getBookings);
router.delete('/delete-account', authMiddleware, authorizeRoles('doctor','admin'), deleteDoctorAccount);


export default router;
