import express from 'express';
import { getProfile, login, logout, register } from '../controllers/authControllers.js';
import { authMiddleware } from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.post('/register',register);
router.post('/login', login );
router.post('/logout',logout);

router.get('/profile', authMiddleware, getProfile);

export default router;

