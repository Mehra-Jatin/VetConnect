import {create} from 'zustand';

import { axiosInstance } from '../lib/axios';


export const useAuthStore = create((set,get) => ({
  user: null,
  isCheckingAuth: true,
  doctors: [],
  bookings: [],
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try{
        const response = await axiosInstance.get('/api/auth/check');
         if(response.status === 200){
             set({ user: response.data });
         }
         else{
            set({ user: null });
         }
    } catch (error) {
        console.error('Authentication check failed:', error);
        set({ user: null });
    } finally {
        set({ isCheckingAuth: false });
    }
  },



  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', credentials);
        if(response.status === 200){
            set({ user: response.data.user });
        }
        else{
            set({ user: null });
        }
    } catch (error) {
      console.error('Login failed:', error);
    }
    
  },



  logout: async () => {
    try {
      await axiosInstance.post('/api/auth/logout');
      set({ user: null });
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

getDoctorRatings: async (id) => {
  try {
    const response = await axiosInstance.get(`/doctor/ratings/${id}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error('Failed to fetch doctor ratings:', error);
    return null;
  }
},

 bookAppointment: async (doctorId) => {
    try {
      console.log("Booking appointment for doctor:", doctorId);
      
      // Make sure user is logged in
      const { user } = get();
      if (!user) {
        alert("Please login to book an appointment");
        return;
      }

      // Create the booking order
      const response = await axiosInstance.post("/api/user/book-appointment", { 
        doctorId 
      });

      const data = response.data;
      console.log("Booking response:", data);

      // Check if Razorpay is available
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
            
            // Verify payment
            const verifyResponse = await axiosInstance.post("/api/user/verify-payment", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              bookingId: data.bookingId,
            });

            if (verifyResponse.data.success) {
              // Update local state
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
          color: "#ea580c" // Orange theme
        },
        modal: {
          ondismiss: function() {
            console.log("Payment dialog closed");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      
      // Handle payment errors
      rzp.on('payment.failed', function (response) {
        console.error("Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description || 'Unknown error'}`);
      });

      rzp.open();

    } catch (error) {
      console.error("Booking error:", error);
      
      // More specific error messages
      if (error.response?.status === 401) {
        alert("Please login to book an appointment");
      } else if (error.response?.status === 404) {
        alert("Doctor not found");
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Booking failed. Please try again later.");
      }
      
      throw error; // Re-throw for component error handling
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
  }
}));

