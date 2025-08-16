import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import {useAuthStore} from './AuthStore';

export const useChatStore = create((set, get) => ({
  messages: [],
  contacts: [],
  onlineUsers: [],
  selectedUser: null,
  isMessagesLoading: false,
  isContactsLoading: false,
  socket: null,



  getUserById: async (userId) => {
    try {
      const response = await axiosInstance.get(`/get-user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user by ID:", error);
      return null;
    }
  },

  // Socket connection
  connectSocket: (socket) => {
    set({ socket });
    
    // Listen for online users updates
    socket.on('getOnlineUsers', (userIds) => {
      set({ onlineUsers: userIds });
    });

    // Listen for new messages
    socket.on('newMessage', (message) => {
      const { selectedUser, messages } = get();
      
      // Only add message if it's for the current chat
      if (selectedUser && 
          ((message.senderId === selectedUser._id && message.receiverId === get().getCurrentUser()?._id) ||
           (message.senderId === get().getCurrentUser()?._id && message.receiverId === selectedUser._id))) {
        set({ messages: [...messages, message] });
      }
    });
  },

  // Disconnect socket
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, onlineUsers: [] });
    }
  },

  getCurrentUser: () => {
     return useAuthStore.getState().user;
  },

  // Get contacts based on user role
  getContacts: async (role) => {
    set({ isContactsLoading: true });
    try {
      let endpoint = '';
      
      switch (role) {
        case 'admin':
          endpoint = '/api/chat/admin'; // get admin chat for doctor
          break;
        case 'doctor':
          endpoint = '/api/chat/doctors'; // get doctor chat for doctor
          break;
        case 'patient':
          endpoint = '/api/chat/user'; // get user(patient) chat for doctor
          break;
        default:
          endpoint = '/api/chat/get-user-chat';
      }

      const response = await axiosInstance.get(endpoint);
      set({ contacts: response.data });
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      set({ contacts: [] });
    } finally {
      set({ isContactsLoading: false });
    }
  },

  // Get messages for a specific chat
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const response = await axiosInstance.get(`/api/chat/messages/${userId}`);
      set({ messages: response.data });
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      set({ messages: [] });
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
  const { selectedUser, socket, messages, getMessages, getContacts } = get();

  if (!selectedUser) return;

  try {
    const response = await axiosInstance.post(`/api/chat/send/${selectedUser._id}`, {
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image
    });

    const newMessage = response.data;
    set({ messages: [...messages, newMessage] });

    // Emit over socket for real-time updates
    if (socket) {
      socket.emit('sendMessage', newMessage);
    }

    // Refresh messages from server to ensure perfect sync
    await getMessages(selectedUser._id);

    // Detect chat role so contacts update correctly
    let role = "";
    if (selectedUser.role) {
      role = selectedUser.role; 
    } else {
      role = "patient";
    }

    // Detect chat role so contacts update correctly (if chatted with patient the patient sidebar updated)
    await getContacts(role);

    return { success: true };
  } catch (error) {
    console.error('Failed to send message:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to send message' 
    };
  }
},


  // Set selected user for chat
  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },

  // Clear chat data
  clearChatData: () => {
    set({
      messages: [],
      contacts: [],
      selectedUser: null,
      onlineUsers: []
    });
  },

  // Subscribe to messages (for real-time updates)
  subscribeToMessages: () => {
    const { socket } = get();
    if (!socket) return;

    socket.on('newMessage', (message) => {
      const { selectedUser, messages } = get();
      const currentUser = get().getCurrentUser();
      
      if (selectedUser && currentUser &&
          ((message.senderId === selectedUser._id && message.receiverId === currentUser._id) ||
           (message.senderId === currentUser._id && message.receiverId === selectedUser._id))) {
        
        // Check if message already exists to avoid duplicates
        const messageExists = messages.some(msg => msg._id === message._id);
        if (!messageExists) {
          set({ messages: [...messages, message] });
        }
      }
    });
  },

  // Unsubscribe from messages
  unsubscribeFromMessages: () => {
    const { socket } = get();
    if (socket) {
      socket.off('newMessage');
    }
  }
}));