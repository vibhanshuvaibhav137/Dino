import api from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';

export const gameService = {
  async submitScore(score, gameData) {
    try {
      const response = await api.post(API_ENDPOINTS.SUBMIT_SCORE, {
        score,
        gameData,
      });
      return response.data.data;
    } catch (error) {
      console.error('Failed to submit score:', error);
      // Store offline if submission fails
      this.storeOfflineScore(score, gameData);
      throw new Error(error.response?.data?.message || 'Failed to submit score');
    }
  },

  async syncOfflineScores() {
    try {
      const offlineScores = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.OFFLINE_SCORES) || '[]'
      );
      
      if (offlineScores.length === 0) {
        return { syncedCount: 0 };
      }

      const response = await api.post(API_ENDPOINTS.SYNC_SCORES, {
        scores: offlineScores,
      });

      // Clear offline scores after successful sync
      localStorage.removeItem(STORAGE_KEYS.OFFLINE_SCORES);
      
      console.log(`Synced ${offlineScores.length} offline scores`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to sync offline scores:', error);
      throw new Error(error.response?.data?.message || 'Failed to sync offline scores');
    }
  },

  storeOfflineScore(score, gameData) {
    try {
      const offlineScores = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.OFFLINE_SCORES) || '[]'
      );
      
      offlineScores.push({
        score,
        gameData,
        timestamp: new Date().toISOString(),
      });
      
      localStorage.setItem(STORAGE_KEYS.OFFLINE_SCORES, JSON.stringify(offlineScores));
      console.log('Score stored offline:', { score, gameData });
    } catch (error) {
      console.error('Failed to store offline score:', error);
    }
  },

  async getLeaderboard(page = 1, limit = 10) {
    try {
      const response = await api.get(
        `${API_ENDPOINTS.LEADERBOARD}?page=${page}&limit=${limit}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch leaderboard');
    }
  },

  async getUserScores(page = 1, limit = 20) {
    try {
      const response = await api.get(
        `${API_ENDPOINTS.USER_SCORES}?page=${page}&limit=${limit}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch user scores:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch user scores');
    }
  },

  getOfflineScores() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFLINE_SCORES) || '[]');
    } catch (error) {
      console.error('Failed to get offline scores:', error);
      return [];
    }
  },

  clearOfflineScores() {
    try {
      localStorage.removeItem(STORAGE_KEYS.OFFLINE_SCORES);
    } catch (error) {
      console.error('Failed to clear offline scores:', error);
    }
  },
};