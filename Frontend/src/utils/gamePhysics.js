import { GAME_CONFIG } from './constants';

export const updateBallPhysics = (ball) => {
  const groundY = GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.GROUND_HEIGHT - GAME_CONFIG.BALL_SIZE;
  
  // Apply gravity
  let newVelocityY = ball.velocityY + GAME_CONFIG.GRAVITY;
  let newY = ball.y + newVelocityY;
  let isJumping = ball.isJumping;
  
  // Check ground collision
  if (newY >= groundY) {
    newY = groundY;
    newVelocityY = 0;
    isJumping = false;
  }
  
  return {
    ...ball,
    y: newY,
    velocityY: newVelocityY,
    isJumping,
  };
};

export const generateObstacle = (canvasWidth, lastObstacleX = 0) => {
  // Ensure proper spacing between obstacles
  const minDistance = GAME_CONFIG.MIN_OBSTACLE_DISTANCE;
  const maxDistance = GAME_CONFIG.MAX_OBSTACLE_DISTANCE;
  const distance = Math.random() * (maxDistance - minDistance) + minDistance;
  
  const x = Math.max(canvasWidth, lastObstacleX + distance);
  
  // Generate obstacle height that's always jumpable
  const height = Math.random() * 
    (GAME_CONFIG.OBSTACLE_MAX_HEIGHT - GAME_CONFIG.OBSTACLE_MIN_HEIGHT) + 
    GAME_CONFIG.OBSTACLE_MIN_HEIGHT;
  
  return {
    x: x,
    y: GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.GROUND_HEIGHT - height,
    width: GAME_CONFIG.OBSTACLE_WIDTH,
    height: height,
    id: Date.now() + Math.random(),
    scored: false,
  };
};

export const updateObstacles = (obstacles, currentSpeed = GAME_CONFIG.OBSTACLE_SPEED) => {
  return obstacles
    .map(obstacle => ({
      ...obstacle,
      x: obstacle.x - currentSpeed,
    }))
    .filter(obstacle => obstacle.x + obstacle.width > -100);
};

export const calculateScore = (distanceTraveled, jumps, timeAlive) => {
  const distanceScore = Math.floor(distanceTraveled * GAME_CONFIG.DISTANCE_SCORE_MULTIPLIER);
  const jumpBonus = jumps * GAME_CONFIG.JUMP_SCORE_BONUS;
  const timeBonus = Math.floor(timeAlive / 100); // 1 point per 100ms alive
  
  return distanceScore + jumpBonus + timeBonus;
};

export const getCurrentSpeed = (score) => {
  const speedIncrease = Math.floor(score / GAME_CONFIG.SPEED_INCREASE_INTERVAL);
  return Math.min(
    GAME_CONFIG.OBSTACLE_SPEED + speedIncrease * 0.5,
    GAME_CONFIG.MAX_SPEED
  );
};