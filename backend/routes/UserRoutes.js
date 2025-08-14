import express from 'express';
import { bookAppointment, getUsersBookings, rateDoctor, verifyPayment , updateUserImage , updateUserProfile, changePassword, deleteUserAccount } from '../controllers/userControlers.js';
import { authMiddleware } from '../middleware/AuthMiddleware.js';
import { authorizeRoles } from '../middleware/RoleMiddleware.js';

const router = express.Router();

router.post('/book-appointment',authMiddleware,authorizeRoles('patient'), bookAppointment);
router.post('/verify-payment',authMiddleware,authorizeRoles('patient'), verifyPayment);

router.get('/get-appointments',authMiddleware,authorizeRoles('patient'), getUsersBookings);

router.post('/rate-doctor', authMiddleware, authorizeRoles('patient'), rateDoctor);

router.put('/update-profile', authMiddleware, authorizeRoles('patient'), updateUserProfile);
router.put('/update-image', authMiddleware, authorizeRoles('patient'), updateUserImage);
router.put('/update-password', authMiddleware, authorizeRoles('patient'), changePassword);
router.delete('/delete-account', authMiddleware, authorizeRoles('patient'), deleteUserAccount);

export default router;
