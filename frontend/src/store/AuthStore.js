import {create} from 'zustand';

import { axiosInstance } from '../lib/axios';


export const useAuthStore = create((set,get) => ({
  user: null,
  isCheckingAuth: true,
  doctors: [],
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try{
        const response = await axiosInstance.get('/api/auth/check');
         if(response.status === 200){
             set({ user: response.data.user });
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
}



}));

