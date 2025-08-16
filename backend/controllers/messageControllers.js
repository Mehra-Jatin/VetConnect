import Message from '../models/messageModel.js';
import User from '../models/userModel.js';
import Doctor from '../models/doctorModel.js';
import { getReciverSocketId, io } from '../config/socket.js';
import cloudinary from '../config/cloudinary.js';
import mongoose from 'mongoose';

// Get messages between two users
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user.id;

    // Find messages between the two users
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId }
      ]
    })
    .populate('senderId', 'FirstName LastName image email')
    .populate('receiverId', 'FirstName LastName image email')
    .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error in getMessages:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;

    const senderId = req.user.id;
    const senderRole = req.user.role; // 'doctor', 'patient', or 'admin'

    // Determine sender model
    const senderModel = senderRole === 'doctor' ? 'Doctor' : 'User';

    // Try finding receiver in both collections
    let receiver = await User.findById(receiverId);
    let receiverModel = 'User';
    let receiverRole = receiver?.role;

    if (!receiver) {
      receiver = await Doctor.findById(receiverId);
      receiverModel = 'Doctor';
      receiverRole = 'doctor';
    }

    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Role-based allowed recipients
    const allowedRecipients = {
      doctor: ['doctor', 'patient', 'admin'],
      patient: ['doctor', 'admin'],
      admin: ['admin', 'doctor', 'patient']
    };

    if (!allowedRecipients[senderRole]?.includes(receiverRole)) {
      return res.status(403).json({ message: `A ${senderRole} cannot send messages to a ${receiverRole}` });
    }

    // Upload image if provided
    let imageUrl = null;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    // Create and save message
    const newMessage = new Message({
      senderId,
      senderModel,
      receiverId,
      receiverModel,
      text,
      image: imageUrl
    });

    await newMessage.save();

    // Populate sender & receiver details
    await newMessage.populate('senderId', 'FirstName LastName image email');
    await newMessage.populate('receiverId', 'FirstName LastName image email');

    // Send via socket if online
    const receiverSocketId = getReciverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error in sendMessage:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};



const getChatPartnerIds = async (currentUserId) => {
  const messages = await Message.find({
    $or: [
      { senderId: currentUserId },
      { receiverId: currentUserId }
    ]
  }).select("senderId receiverId senderModel receiverModel");

  const ids = new Set();

  messages.forEach(msg => {
    if (msg.senderId.toString() !== currentUserId.toString()) {
      ids.add(msg.senderId.toString());
    }
    if (msg.receiverId.toString() !== currentUserId.toString()) {
      ids.add(msg.receiverId.toString());
    }
  });

  // Return as ObjectIds
return [...ids].map(id => new mongoose.Types.ObjectId(id));
};

// get all admins in the system
export const getAdmin = async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ["admin"] }
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUsers:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get doctors who have chatted with current user 
export const getDoctors = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const partnerIds = await getChatPartnerIds(currentUserId);

    const doctors = await Doctor.find({
      _id: { $in: partnerIds }
    }).select("-password");

    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error in getDoctors:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};



// get patients who have chatted with current user 
export const getPatients = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const partnerIds = await getChatPartnerIds(currentUserId);
    
    const patients = await User.find({
      _id: { $in: partnerIds },
      role: { $in: ["patient"] }
    }).select("-password");
    
    res.status(200).json(patients);
  } catch (error) {
    console.error("Error in getPatients:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


// get all doctors who have chatted with current user or system admin without chat
export const getChatUserForUser = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const currentUser = await User.findById(currentUserId).select("-password");

    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found" });
    }

    // Step 1: Get all partner IDs from messages
    const partnerIds = await getChatPartnerIds(currentUserId);

    // Step 2: Always get all admins
    const admins = await User.find({ role: "admin" }).select("-password");

    // Step 3: Get doctors from chat partners
    const doctors = await Doctor.find({
      _id: { $in: partnerIds }
    }).select("-password");


    let combined = [];

    combined.push(...admins, ...doctors);
    // Optional: remove duplicates
    const uniqueMap = new Map();
    combined.forEach(user => {
      uniqueMap.set(user._id.toString(), user);
    });

    res.status(200).json(Array.from(uniqueMap.values()));

  } catch (error) {
    console.error("Error in getChatUserForUser:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
