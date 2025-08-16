import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { io } from 'socket.io-client';
import { useChatStore } from './ChatStore';

export const useAuthStore = create((set, get) => ({
  user: null,
  isCheckingAuth: true,
  doctors: [],
  doctorReviews: [],
  socket: null,
  
  // Initialize socket connection
  connectSocket: () => {
    const { user } = get();
    if (!user || get().socket?.connected) return;

    const socket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:3000', {
      query: {
        userId: user._id
      }
    });

    socket.connect();

    set({ socket });

    // Connect to chat store as well
    useChatStore.getState().connectSocket(socket);
  },

  // Disconnect socket
  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) {
      socket.disconnect();
    }
    set({ socket: null });
    
    // Disconnect from chat store as well
    useChatStore.getState().disconnectSocket();
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axiosInstance.get('/api/auth/check');
      if (response.status === 200) {
        set({ user: response.data });
        get().connectSocket();
      } else {
        set({ user: null });
        get().disconnectSocket();
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      set({ user: null });
      get().disconnectSocket();
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', credentials);
      if (response.status === 200) {
        set({ user: response.data.user });
        get().connectSocket();
      } else {
        set({ user: null });
        get().disconnectSocket();
      }
    } catch (error) {
      console.error('Login failed:', error);
      get().disconnectSocket();
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/api/auth/logout');
      set({ user: null });
      get().disconnectSocket();
      
      // Clear chat data on logout
      useChatStore.getState().clearChatData();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  },

  register: async (data) => {
    try {
      const res = await axiosInstance.post('/api/auth/register', data);
      if (res.status === 201 || res.status === 200) {
        return { success: true, message: 'Registration successful', user: res.data.user };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed',
      };
    }
  },

  getAllDoctors: async () => {
    try {
      const response = await axiosInstance.get('/doctors');
      if (response.status === 200) {
        set({ doctors: response.data });
      }
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      set({ doctors: [] });
    }
  },

  getDoctorById: async (id) => {
    try {
      const response = await axiosInstance.get(`/doctor/${id}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error('Failed to fetch doctor:', error);
      return null;
    }
  },

  bookAppointment: async (doctorId) => {
    try {
      console.log("Booking appointment for doctor:", doctorId);
      
      const { user } = get();
      if (!user) {
        alert("Please login to book an appointment");
        return;
      }

      const response = await axiosInstance.post("/api/user/book-appointment", { 
        doctorId 
      });

      const data = response.data;
      console.log("Booking response:", data);

      if (!window.Razorpay) {
        console.error("Razorpay is not loaded");
        alert("Payment gateway is not available. Please refresh and try again.");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "VetCare",
        description: "Doctor Appointment",
        order_id: data.orderId,
        handler: async function (response) {
          try {
            console.log("Payment successful:", response);
            
            const verifyResponse = await axiosInstance.post("/api/user/verify-payment", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              bookingId: data.bookingId,
            });

            if (verifyResponse.data.success) {
              const currentState = get();
              set({ 
                bookings: [
                  ...currentState.bookings, 
                  { 
                    ...data, 
                    paymentId: response.razorpay_payment_id,
                    paymentStatus: 'Completed'
                  }
                ]
              });
              
              alert("Booking confirmed successfully!");
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (verifyError) {
            console.error("Payment verification failed:", verifyError);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: `${user.FirstName || ''} ${user.LastName || ''}`.trim(),
          email: user.email || '',
          contact: user.PhoneNo || ''
        },
        theme: {
          color: "#ea580c"
        },
        modal: {
          ondismiss: function() {
            console.log("Payment dialog closed");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        console.error("Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description || 'Unknown error'}`);
      });

      rzp.open();

    } catch (error) {
      console.error("Booking error:", error);
      
      if (error.response?.status === 401) {
        alert("Please login to book an appointment");
      } else if (error.response?.status === 404) {
        alert("Doctor not found");
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Booking failed. Please try again later.");
      }
      
      throw error;
    }
  },

  getUserAppointments: async () => {
    try {
      const response = await axiosInstance.get("/api/user/get-appointments");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user appointments:", error);
      return [];
    }
  },

  getDoctorAppointments: async () => {
    try {
      const response = await axiosInstance.get(`/api/doctor/bookings`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch doctor appointments:", error);
      return [];
    }
  },

  updateUserImage: async (image) => {
    try {
      const response = await axiosInstance.put("/api/user/update-image", { image });
      return response.data;
    } catch (error) {
      console.error("Failed to update user image:", error);
      return null;
    }
  },

  updateUserProfile: async (profileData) => {
    try {
      const response = await axiosInstance.put("/api/user/update-profile", profileData);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("Failed to update user profile:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update password",
      };
    } finally {
      await get().checkAuth();
    }
  },

  updateUserPassword: async (passwordData) => {
    try {
      const response = await axiosInstance.put("/api/user/update-password", passwordData);
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update password",
      };
    }
  },

  deleteUserAccount: async () => {
    try {
      const response = await axiosInstance.delete("/api/user/delete-account");
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete account",
      };
    }
  },

  // Doctor-specific functions
  getDoctorProfile: async () => {
    try {
      const response = await axiosInstance.get("/api/doctor/profile");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch doctor profile:", error);
      return null;
    }
  },

  updateDoctorImage: async (image) => {
    try {
      const response = await axiosInstance.put("/api/doctor/update-image", { image });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("Failed to update doctor image:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update image",
      };
    }
  },

  updateDoctorProfile: async (profileData) => {
    try {
      const response = await axiosInstance.put("/api/doctor/update-profile", profileData);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("Failed to update doctor profile:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update profile",
      };
    } finally {
      await get().checkAuth();
    }
  },

  updateDoctorDescription: async (description) => {
    try {
      const response = await axiosInstance.put("/api/doctor/update-description", { description });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("Failed to update doctor description:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update description",
      };
    }
    finally{
      await get().checkAuth();
    }
  },

  setDoctorAvailability: async (isAvailable) => {
    try {
      const response = await axiosInstance.put("/api/doctor/set-availability", { isAvailable });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("Failed to update doctor availability:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update availability",
      };
    }
    finally{
      await get().checkAuth();
    }
  },

  deleteDoctorAccount: async () => {
    try {
      const response = await axiosInstance.delete("/api/doctor/delete-account");
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete account",
      };
    }
  },

  getDoctorReviews: async (doctorId) => {
    try {
      const response = await axiosInstance.get(`/doctor/ratings/${doctorId}`);
      if (response.status === 200) {
        set({ doctorReviews: response.data });
        return { success: true };
      }
    } catch (error) {
      console.error("Failed to fetch doctor reviews:", error);
      set({ doctorReviews: [] });
      return { success: false };
    }
  },

  submitDoctorReview: async (doctorId, rating, comment) => {
    try {
      const { user } = get();
      if (!user) {
        return { success: false, message: "Please login to submit a review" };
      }

      const response = await axiosInstance.post(`/api/user/rate-doctor`, {
        doctorId,
        rating,
        comment,
      });

      // Refresh reviews after submitting
      await get().getDoctorReviews(doctorId);

      return {
        success: true,
        message: response.data.message || "Review submitted successfully",
      };
    } catch (error) {
      console.error("Failed to submit review:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to submit review",
      };
    }
  },
}));