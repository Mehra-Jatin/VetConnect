import express from 'express';
import { getDoctorById, getDoctorRatings, getDoctors } from '../controllers/publicControllers.js';

const router = express.Router();


router.get('/doctors', getDoctors);
router.get('/doctor/:id', getDoctorById);
router.get('/doctor/ratings/:id', getDoctorRatings);


export default router;