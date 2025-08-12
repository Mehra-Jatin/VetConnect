import express from 'express';
import { bookAppointment, getUsersBookings, rateDoctor, verifyPayment , updateUserImage , updateUserProfile } from '../controllers/userControlers.js';
import { authMiddleware } from '../middleware/AuthMiddleware.js';
import { authorizeRoles } from '../middleware/RoleMiddleware.js';

const router = express.Router();

router.post('/book-appointment',authMiddleware,authorizeRoles('patient'), bookAppointment);
router.post('/verify-appointment',authMiddleware,authorizeRoles('patient'), verifyPayment);

router.get('/get-appointments',authMiddleware,authorizeRoles('patient'), getUsersBookings);

router.post('/rate-doctor', authMiddleware, authorizeRoles('patient'), rateDoctor);

router.put('/update-profile', authMiddleware, authorizeRoles('patient'), updateUserProfile);
router.put('/update-image', authMiddleware, authorizeRoles('patient'), updateUserImage);

export default router;
