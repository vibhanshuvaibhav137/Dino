import api from './api';
import { generateBrowserFingerprint } from '../utils/browserFingerprint';
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';


//  Authentication service for user registration, login, and profile management
//  Handles token storage and API communication for auth operations

export const authService = {
  

  // Registers a new user with browser fingerprint
  // @returns {Promise<Object>} User data with token
   
  async registerUser() {
    try {
      const fingerprint = generateBrowserFingerprint();
      const response = await api.post(API_ENDPOINTS.REGISTER, { fingerprint });
      
      // Store authentication token if provided
      if (response.data.data.token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.data.token);
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },


  //  Authenticates existing user
  //  @returns {Promise<Object>} User data with token

  async loginUser() {
    try {
      const response = await api.post(API_ENDPOINTS.LOGIN);
      
      // Store authentication token if provided
      if (response.data.data.token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.data.token);
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },


  //  Fetches current user profile data
  //  @returns {Promise<Object>} User profile information

  async getUserProfile() {
    try {
      const response = await api.get(API_ENDPOINTS.PROFILE);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },


  //  Checks API server health status
  //  @returns {Promise<Object>} Health status response

 async checkHealth() {
    try {
      const response = await api.get(API_ENDPOINTS.HEALTH);
      console.log('✅ Health check response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Health check failed:', error.message);
      throw error;
    }
  },

  // Logs out user by clearing stored authentication token

  logout() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },
};