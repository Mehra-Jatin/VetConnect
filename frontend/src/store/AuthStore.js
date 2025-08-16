import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { io } from 'socket.io-client';
import { useChatStore } from './ChatStore';
import { toast } from 'react-hot-toast';

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
      query: { userId: user._id },
    });

    socket.connect();
    set({ socket });

    // Connect to chat store as well
    useChatStore.getState().connectSocket(socket);
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) socket.disconnect();
    set({ socket: null });

    // Disconnect from chat store
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
        toast.success("Logged in successfully!");
      } else {
        set({ user: null });
        get().disconnectSocket();
        toast.error("Login failed");
      }
    } catch (error) {
      console.error('Login failed:', error);
      get().disconnectSocket();
      toast.error(error.response?.data?.message || "Login failed");
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/api/auth/logout');
      set({ user: null });
      get().disconnectSocket();
      useChatStore.getState().clearChatData();
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error("Logout failed");
    }
  },

  register: async (data) => {
    try {
      const res = await axiosInstance.post('/api/auth/register', data);
      if (res.status === 201 || res.status === 200) {
        toast.success("Registration successful!");
        return { success: true, message: 'Registration successful', user: res.data.user };
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    }
  },

  getAllDoctors: async () => {
    try {
      const response = await axiosInstance.get('/doctors');
      if (response.status === 200) set({ doctors: response.data });
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      toast.error("Failed to fetch doctors");
      set({ doctors: [] });
    }
  },

  getDoctorById: async (id) => {
    try {
      const response = await axiosInstance.get(`/doctor/${id}`);
      if (response.status === 200) return response.data;
    } catch (error) {
      console.error('Failed to fetch doctor:', error);
      toast.error("Failed to fetch doctor");
      return null;
    }
  },

  bookAppointment: async (doctorId) => {
    try {
      const { user } = get();
      if (!user) return toast.error("Please login to book an appointment");

      const response = await axiosInstance.post("/api/user/book-appointment", { doctorId });
      const data = response.data;

      if (!window.Razorpay) {
        toast.error("Payment gateway unavailable. Refresh and try again.");
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
            const verifyResponse = await axiosInstance.post("/api/user/verify-payment", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              bookingId: data.bookingId,
            });

            if (verifyResponse.data.success) {
              const currentState = get();
              set({ 
                bookings: [...(currentState.bookings || []), { ...data, paymentId: response.razorpay_payment_id, paymentStatus: 'Completed' }]
              });
              toast.success("Booking confirmed successfully!");
            } else toast.error("Payment verification failed. Contact support.");
          } catch (verifyError) {
            console.error("Payment verification failed:", verifyError);
            toast.error("Payment verification failed. Contact support.");
          }
        },
        prefill: {
          name: `${user.FirstName || ''} ${user.LastName || ''}`.trim(),
          email: user.email || '',
          contact: user.PhoneNo || ''
        },
        theme: { color: "#ea580c" },
        modal: {
          ondismiss: () => console.log("Payment dialog closed")
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error(response.error?.description || "Payment failed");
      });
      rzp.open();

    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.response?.data?.message || "Booking failed");
    }
  },

  getUserAppointments: async () => {
    try {
      const response = await axiosInstance.get("/api/user/get-appointments");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
      toast.error("Failed to fetch appointments");
      return [];
    }
  },

  getDoctorAppointments: async () => {
    try {
      const response = await axiosInstance.get(`/api/doctor/bookings`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch doctor appointments:", error);
      toast.error("Failed to fetch doctor appointments");
      return [];
    }
  },

  // Profile update functions
  updateUserImage: async (image) => {
    try {
      const response = await axiosInstance.put("/api/user/update-image", { image });
      toast.success("Profile image updated!");
      return response.data;
    } catch (error) {
      console.error("Failed to update user image:", error);
      toast.error("Failed to update image");
      return null;
    }
  },

  updateUserProfile: async (profileData) => {
    try {
      const response = await axiosInstance.put("/api/user/update-profile", profileData);
      toast.success(response.data.message || "Profile updated successfully");
      return { success: true, message: response.data.message };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      return { success: false, message: error.response?.data?.message || "Failed to update profile" };
    } finally {
      await get().checkAuth();
    }
  },

  updateUserPassword: async (passwordData) => {
    try {
      const response = await axiosInstance.put("/api/user/update-password", passwordData);
      toast.success(response.data.message || "Password updated successfully");
      return { success: true, message: response.data.message };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
      return { success: false, message: error.response?.data?.message || "Failed to update password" };
    }
  },

  deleteUserAccount: async () => {
    try {
      const response = await axiosInstance.delete("/api/user/delete-account");
      toast.success(response.data.message || "Account deleted successfully");
      return { success: true, message: response.data.message };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
      return { success: false, message: error.response?.data?.message || "Failed to delete account" };
    }
  },

  // Doctor functions
  getDoctorProfile: async () => {
    try {
      const response = await axiosInstance.get("/api/doctor/profile");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch doctor profile:", error);
      toast.error("Failed to fetch doctor profile");
      return null;
    }
  },

  updateDoctorImage: async (image) => {
    try {
      const response = await axiosInstance.put("/api/doctor/update-image", { image });
      toast.success(response.data.message || "Doctor image updated");
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("Failed to update doctor image:", error);
      toast.error(error.response?.data?.message || "Failed to update doctor image");
      return { success: false, message: error.response?.data?.message || "Failed to update doctor image" };
    }
  },

  updateDoctorProfile: async (profileData) => {
    try {
      const response = await axiosInstance.put("/api/doctor/update-profile", profileData);
      toast.success(response.data.message || "Doctor profile updated");
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("Failed to update doctor profile:", error);
      toast.error(error.response?.data?.message || "Failed to update doctor profile");
      return { success: false, message: error.response?.data?.message || "Failed to update doctor profile" };
    } finally {
      await get().checkAuth();
    }
  },

  updateDoctorDescription: async (description) => {
    try {
      const response = await axiosInstance.put("/api/doctor/update-description", { description });
      toast.success(response.data.message || "Description updated");
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("Failed to update description:", error);
      toast.error(error.response?.data?.message || "Failed to update description");
      return { success: false, message: error.response?.data?.message || "Failed to update description" };
    } finally {
      await get().checkAuth();
    }
  },

  setDoctorAvailability: async (isAvailable) => {
    try {
      const response = await axiosInstance.put("/api/doctor/set-availability", { isAvailable });
      toast.success(response.data.message || "Availability updated");
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("Failed to update availability:", error);
      toast.error(error.response?.data?.message || "Failed to update availability");
      return { success: false, message: error.response?.data?.message || "Failed to update availability" };
    } finally {
      await get().checkAuth();
    }
  },

  deleteDoctorAccount: async () => {
    try {
      const response = await axiosInstance.delete("/api/doctor/delete-account");
      toast.success(response.data.message || "Doctor account deleted");
      return { success: true, message: response.data.message };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
      return { success: false, message: error.response?.data?.message || "Failed to delete account" };
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
      console.error("Failed to fetch reviews:", error);
      set({ doctorReviews: [] });
      return { success: false };
    }
  },

  submitDoctorReview: async (doctorId, rating, comment) => {
    try {
      const { user } = get();
      if (!user) return { success: false, message: "Please login to submit a review" };

      const response = await axiosInstance.post(`/api/user/rate-doctor`, { doctorId, rating, comment });
      await get().getDoctorReviews(doctorId);
      toast.success(response.data.message || "Review submitted successfully");
      return { success: true, message: response.data.message || "Review submitted successfully" };
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error(error.response?.data?.message || "Failed to submit review");
      return { success: false, message: error.response?.data?.message || "Failed to submit review" };
    }
  },
}));
