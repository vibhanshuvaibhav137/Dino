export const GAME_CONFIG = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 400,
  BALL_SIZE: 20,
  BALL_JUMP_FORCE: -14, // Stronger jump for higher obstacles
  GRAVITY: 0.8,
  GROUND_HEIGHT: 60,
  OBSTACLE_WIDTH: 20,
  OBSTACLE_SPEED: 4,
  OBSTACLE_SPAWN_RATE: 0.012,
  OBSTACLE_MIN_HEIGHT: 30, // Reduced minimum height
  OBSTACLE_MAX_HEIGHT: 80, // Reduced maximum height to be jumpable
  
  // Chrome Dino-style scoring
  DISTANCE_SCORE_MULTIPLIER: 0.1, // Points per pixel traveled
  JUMP_SCORE_BONUS: 5, // Bonus points per jump
  SPEED_INCREASE_INTERVAL: 1000, // Increase speed every 1000 points
  MAX_SPEED: 8,
  
  // Game mechanics
  INITIAL_OBSTACLE_DISTANCE: 800, // First obstacle distance
  MIN_OBSTACLE_DISTANCE: 300, // Minimum distance between obstacles
  MAX_OBSTACLE_DISTANCE: 600, // Maximum distance between obstacles
};

export const GAME_STATES = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'game_over',
};

export const API_ENDPOINTS = {
  REGISTER: '/api/v1/auth/register',
  LOGIN: '/api/v1/auth/login',
  PROFILE: '/api/v1/user/profile',
  SUBMIT_SCORE: '/api/v1/scores',
  SYNC_SCORES: '/api/v1/scores/sync',
  LEADERBOARD: '/api/v1/scores/leaderboard',
  USER_SCORES: '/api/v1/scores/user-score',
  HEALTH: '/api/v1/health',
};

export const COLORS = {
  SKY: '#f7f7f7',
  GROUND: '#535353',
  BALL: '#535353',
  BALL_SHADOW: '#2a2a2a',
  OBSTACLE: '#535353',
  TEXT: '#535353',
  SUCCESS: '#10B981',
  ERROR: '#EF4444',
  WARNING: '#F59E0B',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  OFFLINE_SCORES: 'offlineScores',
  HIGH_SCORE: 'highScore',
  SETTINGS: 'gameSettings',
};

// Backend configuration
export const BACKEND_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL ,
  TIMEOUT: 15000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};