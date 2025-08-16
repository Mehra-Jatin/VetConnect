import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './AuthStore';
import { toast } from 'react-hot-toast';

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
      toast.error("Failed to fetch user info");
      return null;
    }
  },

  connectSocket: (socket) => {
    set({ socket });

    socket.on('getOnlineUsers', (userIds) => {
      set({ onlineUsers: userIds });
    });

    socket.on('newMessage', (message) => {
      const { selectedUser, messages } = get();
      const currentUser = get().getCurrentUser();

      if (selectedUser &&
          currentUser &&
          ((message.senderId === selectedUser._id && message.receiverId === currentUser._id) ||
           (message.senderId === currentUser._id && message.receiverId === selectedUser._id))) {
        const messageExists = messages.some(msg => msg._id === message._id);
        if (!messageExists) set({ messages: [...messages, message] });
      }
    });
  },

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

  getContacts: async (role) => {
    set({ isContactsLoading: true });
    try {
      let endpoint = '';
      switch (role) {
        case 'admin': endpoint = '/api/chat/admin'; break;
        case 'doctor': endpoint = '/api/chat/doctors'; break;
        case 'patient': endpoint = '/api/chat/user'; break;
        default: endpoint = '/api/chat/get-user-chat';
      }

      const response = await axiosInstance.get(endpoint);
      set({ contacts: response.data });
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      toast.error("Failed to fetch contacts");
      set({ contacts: [] });
    } finally {
      set({ isContactsLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const response = await axiosInstance.get(`/api/chat/messages/${userId}`);
      set({ messages: response.data });
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error("Failed to fetch messages");
      set({ messages: [] });
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, socket, messages, getMessages, getContacts } = get();
    if (!selectedUser) {
      toast.error("No user selected to send message");
      return { success: false };
    }

    try {
      const response = await axiosInstance.post(`/api/chat/send/${selectedUser._id}`, {
        receiverId: selectedUser._id,
        text: messageData.text,
        image: messageData.image
      });

      const newMessage = response.data;
      set({ messages: [...messages, newMessage] });

      if (socket) socket.emit('sendMessage', newMessage);

      await getMessages(selectedUser._id);

      const role = selectedUser.role || "patient";
      await getContacts(role);

      toast.success("Message sent successfully");
      return { success: true };
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error(error.response?.data?.message || "Failed to send message");
      return { success: false, message: error.response?.data?.message || 'Failed to send message' };
    }
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },

  clearChatData: () => {
    set({ messages: [], contacts: [], selectedUser: null, onlineUsers: [] });
  },

  subscribeToMessages: () => {
    const { socket } = get();
    if (!socket) return;

    socket.on('newMessage', (message) => {
      const { selectedUser, messages } = get();
      const currentUser = get().getCurrentUser();

      if (selectedUser && currentUser &&
          ((message.senderId === selectedUser._id && message.receiverId === currentUser._id) ||
           (message.senderId === currentUser._id && message.receiverId === selectedUser._id))) {
        const messageExists = messages.some(msg => msg._id === message._id);
        if (!messageExists) {
          set({ messages: [...messages, message] });
          toast.success("New message received");
        }
      }
    });
  },

  unsubscribeFromMessages: () => {
    const { socket } = get();
    if (socket) socket.off('newMessage');
  },
}));
