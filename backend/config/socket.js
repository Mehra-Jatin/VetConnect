import {Server} from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

const allowedOrigins = ['http://localhost:5173', process.env.CLIENT_URL];

const io = new Server(server, {
  cors: {
     origin: allowedOrigins,
     credentials: true, // Allow cookies to be sent with requests
  },
});

export function getReciverSocketId(userId) {
  return userSocketMap[userId] || null; // Return the socket ID for the user or null if not found
}

const userSocketMap = {}; // userId: socketId mapping

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    const userId = socket.handshake.query.userId; // Get userId from query parameters
    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id; // Store the socket ID for the user
        console.log(`User ${userId} connected with socket ID: ${socket.id}`);
        
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Emit online users to all clients
    }

    // Handle sending messages
    socket.on('sendMessage', (message) => {
        const receiverSocketId = getReciverSocketId(message.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', message);
        }
    });


    // Handle typing indicators
    socket.on('typing', (data) => {
        const receiverSocketId = getReciverSocketId(data.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('userTyping', {
                senderId: data.senderId,
                isTyping: data.isTyping
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Find and remove the user from the map
        for (const [id, socketId] of Object.entries(userSocketMap)) {
            if (socketId === socket.id) {
                delete userSocketMap[id];
                break;
            }
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Emit updated online users
    });
});

export {io, server, app};