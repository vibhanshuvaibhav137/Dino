import { create } from 'zustand';
import { GAME_STATES, GAME_CONFIG } from '../utils/constants';
import { updateBallPhysics, generateObstacle, updateObstacles, calculateScore, getCurrentSpeed } from '../utils/gamePhysics';
import { checkCollision } from '../utils/collision';

const initialBallState = {
  x: 100,
  y: GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.GROUND_HEIGHT - GAME_CONFIG.BALL_SIZE,
  velocityY: 0,
  size: GAME_CONFIG.BALL_SIZE,
  isJumping: false,
};

export const useGameStore = create((set, get) => ({
  // Game state
  gameState: GAME_STATES.MENU,
  score: 0,
  highScore: parseInt(localStorage.getItem('highScore') || '0'),
  currentGame: null,
  
  // Chrome Dino style metrics
  distanceTraveled: 0,
  currentSpeed: GAME_CONFIG.OBSTACLE_SPEED,
  lastObstacleX: 0,
  
  // Game objects
  ball: { ...initialBallState },
  obstacles: [],
  
  // Game statistics
  gameStats: {
    totalGames: parseInt(localStorage.getItem('totalGames') || '0'),
    totalScore: parseInt(localStorage.getItem('totalScore') || '0'),
    totalJumps: parseInt(localStorage.getItem('totalJumps') || '0'),
    bestStreak: parseInt(localStorage.getItem('bestStreak') || '0'),
    totalDistance: parseInt(localStorage.getItem('totalDistance') || '0'),
  },
  
  // Game controls
  startGame: () => {
    console.log('🎮 Starting Chrome Dino style game...');
    const { gameStats } = get();
    
    set({
      gameState: GAME_STATES.PLAYING,
      score: 0,
      distanceTraveled: 0,
      currentSpeed: GAME_CONFIG.OBSTACLE_SPEED,
      lastObstacleX: 0,
      obstacles: [],
      ball: { ...initialBallState },
      currentGame: {
        startTime: Date.now(),
        jumps: 0,
        obstaclesHit: 0,
        obstaclesPassed: 0,
        maxSpeed: GAME_CONFIG.OBSTACLE_SPEED,
      },
      gameStats: {
        ...gameStats,
        totalGames: gameStats.totalGames + 1,
      },
    });
    
    localStorage.setItem('totalGames', (gameStats.totalGames + 1).toString());
  },
  
  pauseGame: () => {
    const { gameState } = get();
    if (gameState === GAME_STATES.PLAYING) {
      console.log('⏸️ Pausing game...');
      set({ gameState: GAME_STATES.PAUSED });
    }
  },
  
  resumeGame: () => {
    const { gameState } = get();
    if (gameState === GAME_STATES.PAUSED) {
      console.log('▶️ Resuming game...');
      set({ gameState: GAME_STATES.PLAYING });
    }
  },
  
  gameOver: () => {
    console.log('💥 Game over!');
    const { score, highScore, gameStats, currentGame, distanceTraveled } = get();
    const newHighScore = Math.max(score, highScore);
    const newStats = {
      ...gameStats,
      totalScore: gameStats.totalScore + score,
      totalJumps: gameStats.totalJumps + (currentGame?.jumps || 0),
      totalDistance: gameStats.totalDistance + Math.floor(distanceTraveled),
      bestStreak: Math.max(gameStats.bestStreak, currentGame?.obstaclesPassed || 0),
    };
    
    // Save to localStorage
    localStorage.setItem('highScore', newHighScore.toString());
    localStorage.setItem('totalScore', newStats.totalScore.toString());
    localStorage.setItem('totalJumps', newStats.totalJumps.toString());
    localStorage.setItem('totalDistance', newStats.totalDistance.toString());
    localStorage.setItem('bestStreak', newStats.bestStreak.toString());
    
    set({
      gameState: GAME_STATES.GAME_OVER,
      highScore: newHighScore,
      gameStats: newStats,
    });
  },
  
  resetGame: () => {
    console.log('🔄 Resetting to menu...');
    set({
      gameState: GAME_STATES.MENU,
      score: 0,
      distanceTraveled: 0,
      currentSpeed: GAME_CONFIG.OBSTACLE_SPEED,
      lastObstacleX: 0,
      obstacles: [],
      currentGame: null,
      ball: { ...initialBallState },
    });
  },
  
  // Game mechanics
  jumpBall: () => {
    const { ball, gameState, currentGame } = get();
    if (gameState === GAME_STATES.PLAYING) {
      const groundY = GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.GROUND_HEIGHT - GAME_CONFIG.BALL_SIZE;
      
      // Allow jumping when close to ground
      if (Math.abs(ball.y - groundY) < 10) {
        console.log('🦘 Ball jumping!');
        set(state => ({
          ball: {
            ...state.ball,
            velocityY: GAME_CONFIG.BALL_JUMP_FORCE,
            isJumping: true,
          },
          currentGame: {
            ...state.currentGame,
            jumps: (state.currentGame?.jumps || 0) + 1,
          },
        }));
      }
    }
  },
  
  updateGame: () => {
    const { ball, obstacles, score, currentGame, gameState, distanceTraveled, currentSpeed, lastObstacleX } = get();
    
    // Only update if game is playing
    if (gameState !== GAME_STATES.PLAYING || !currentGame) return;
    
    // Update distance traveled
    const newDistanceTraveled = distanceTraveled + currentSpeed;
    
    // Calculate new speed (increases over time like Chrome Dino)
    const newCurrentSpeed = getCurrentSpeed(score);
    
    // Update ball physics
    const updatedBall = updateBallPhysics(ball);
    
    // Update obstacles with current speed
    let updatedObstacles = updateObstacles(obstacles, currentSpeed);
    
    // Generate new obstacles with proper spacing
    const shouldSpawnObstacle = () => {
      if (updatedObstacles.length === 0) {
        return newDistanceTraveled > GAME_CONFIG.INITIAL_OBSTACLE_DISTANCE;
      }
      
      const lastObstacle = updatedObstacles[updatedObstacles.length - 1];
      const distanceFromLast = GAME_CONFIG.CANVAS_WIDTH - lastObstacle.x;
      
      return distanceFromLast > GAME_CONFIG.MIN_OBSTACLE_DISTANCE && 
             Math.random() < 0.02; // 2% chance per frame when minimum distance is met
    };
    
    let newLastObstacleX = lastObstacleX;
    
    if (shouldSpawnObstacle()) {
      const newObstacle = generateObstacle(GAME_CONFIG.CANVAS_WIDTH, newLastObstacleX);
      updatedObstacles.push(newObstacle);
      newLastObstacleX = newObstacle.x;
      console.log('🚧 New obstacle spawned at X:', newObstacle.x, 'Height:', newObstacle.height);
    }
    
    // Calculate new score based on distance, jumps, and time
    const timeAlive = Date.now() - currentGame.startTime;
    const newScore = calculateScore(newDistanceTraveled, currentGame.jumps, timeAlive);
    
    // Update obstacles passed counter
    let obstaclesPassed = currentGame.obstaclesPassed || 0;
    updatedObstacles.forEach(obstacle => {
      if (obstacle.x + obstacle.width < updatedBall.x && !obstacle.scored) {
        obstacle.scored = true;
        obstaclesPassed++;
        console.log('🎯 Obstacle passed! Total passed:', obstaclesPassed);
      }
    });
    
    // Check collisions
    const collision = updatedObstacles.some(obstacle => {
      const hit = checkCollision(updatedBall, obstacle);
      if (hit) {
        console.log('💥 Collision detected!', {
          ball: { x: updatedBall.x, y: updatedBall.y, size: updatedBall.size },
          obstacle: { x: obstacle.x, y: obstacle.y, width: obstacle.width, height: obstacle.height }
        });
      }
      return hit;
    });
    
    if (collision) {
      get().gameOver();
      return;
    }
    
    // Log game state periodically
    if (Math.floor(timeAlive / 1000) !== Math.floor((timeAlive - 16) / 1000)) {
      console.log(`🏃 Game update - Score: ${newScore}, Distance: ${Math.floor(newDistanceTraveled)}, Speed: ${newCurrentSpeed.toFixed(1)}, Jumps: ${currentGame.jumps}`);
    }
    
    set({
      ball: updatedBall,
      obstacles: updatedObstacles,
      score: newScore,
      distanceTraveled: newDistanceTraveled,
      currentSpeed: newCurrentSpeed,
      lastObstacleX: newLastObstacleX,
      currentGame: {
        ...currentGame,
        obstaclesPassed,
        maxSpeed: Math.max(currentGame.maxSpeed, newCurrentSpeed),
      },
    });
  },
  
  // Utility functions
  getGameData: () => {
    const { currentGame, distanceTraveled } = get();
    if (!currentGame) return null;
    
    return {
      duration: Date.now() - currentGame.startTime,
      jumps: currentGame.jumps || 0,
      obstaclesHit: currentGame.obstaclesHit || 0,
      obstaclesPassed: currentGame.obstaclesPassed || 0,
      distanceTraveled: Math.floor(distanceTraveled),
      maxSpeed: currentGame.maxSpeed || GAME_CONFIG.OBSTACLE_SPEED,
    };
  },
}));