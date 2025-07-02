import { create } from 'zustand';
import { authService } from '../services/auth';

export const useUserStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async () => {
    set({ isLoading: true, error: null });
    try {
      let response;
      
      // Try to login first
      try {
        response = await authService.loginUser();
      } catch (loginError) {
        // If login fails, try to register
        console.log('Login failed, attempting registration...');
        response = await authService.registerUser();
      }
      
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      return response;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },
  
  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.getUserProfile();
      set({
        user: response,
        isLoading: false,
        error: null,
      });
      return response;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
      throw error;
    }
  },
  
  updateUserStats: (stats) => {
    const { user } = get();
    if (user) {
      set({
        user: {
          ...user,
          ...stats,
        },
      });
    }
  },
  
  logout: () => {
    authService.logout();
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },
  
  clearError: () => {
    set({ error: null });
  },
}));