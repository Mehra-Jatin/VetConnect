import express from 'express';
import { getDoctorById, getDoctorRatings, getDoctors, getUserDoctorById } from '../controllers/publicControllers.js';

const router = express.Router();


router.get('/doctors', getDoctors);
router.get('/doctor/:id', getDoctorById);
router.get('/doctor/ratings/:id', getDoctorRatings);
router.get('/get-user/:id', getUserDoctorById);


export default router;