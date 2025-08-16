import express from 'express';
import {
  getMessages,
  sendMessage,
  getAdmin,
  getDoctors,
  getPatients,
  getChatUserForUser
} from '../controllers/messageControllers.js';

import { authMiddleware } from '../middleware/AuthMiddleware.js';

const router = express.Router();

// get messages between current user and specific user
router.get('/messages/:id', authMiddleware,getMessages);

// Send message to specific user 
router.post('/send/:id',authMiddleware, sendMessage);


// doctor or admin gets contacts 
router.get('/admin', authMiddleware, getAdmin);
router.get('/doctors', authMiddleware, getDoctors);
router.get('/user', authMiddleware, getPatients);


// user(patient) gets contacts
router.get('/get-user-chat', authMiddleware, getChatUserForUser);



export default router;