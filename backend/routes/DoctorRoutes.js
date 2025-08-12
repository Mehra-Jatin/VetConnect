import express from 'express';
import { updateImage, updateProfile, updateDescription , setAvailability, getBookings } from '../controllers/doctorControllers.js';
import { authMiddleware } from '../middleware/AuthMiddleware.js';
import { authorizeRoles} from '../middleware/RoleMiddleware.js'
const router = express.Router();


router.put('/update-image',authMiddleware ,authorizeRoles('doctor','admin'),updateImage);
router.put('/update-profile',authMiddleware ,authorizeRoles('doctor','admin'), updateProfile);
router.put('/update-description',authMiddleware ,authorizeRoles('doctor','admin'), updateDescription);
router.put('/set-availability',authMiddleware ,authorizeRoles('doctor','admin'), setAvailability);
router.get('/bookings',authMiddleware ,authorizeRoles('doctor','admin'), getBookings);


export default router;
