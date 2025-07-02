import React, { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { GAME_CONFIG, GAME_STATES, COLORS } from '../../utils/constants';

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(0);
  
  const {
    gameState,
    ball,
    obstacles,
    score,
    highScore,
    distanceTraveled,
    currentSpeed,
    updateGame,
  } = useGameStore();

  const draw = useCallback((ctx) => {
    // Clear canvas
    ctx.clearRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
    
    // Draw background
    ctx.fillStyle = COLORS.SKY;
    ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
    
    // Draw moving ground pattern 
    const groundY = GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.GROUND_HEIGHT;
    ctx.strokeStyle = COLORS.GROUND;
    ctx.lineWidth = 2;
    
    // Ground line
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(GAME_CONFIG.CANVAS_WIDTH, groundY);
    ctx.stroke();
    
    // Moving ground dots/dashes
    const groundOffset = (distanceTraveled * 0.5) % 40;
    for (let i = -groundOffset; i < GAME_CONFIG.CANVAS_WIDTH; i += 40) {
      ctx.fillStyle = COLORS.GROUND;
      ctx.fillRect(i, groundY + 5, 4, 2);
    }
    
    // Draw clouds
    const cloudOffset = (distanceTraveled * 0.2) % 200;
    const clouds = [
      { x: 100 - cloudOffset, y: 80 },
      { x: 300 - cloudOffset, y: 60 },
      { x: 500 - cloudOffset, y: 90 },
      { x: 700 - cloudOffset, y: 70 },
    ];
    
    ctx.fillStyle = COLORS.GROUND;
    clouds.forEach(cloud => {
      if (cloud.x > -50 && cloud.x < GAME_CONFIG.CANVAS_WIDTH + 50) {
        // Simple cloud shape
        ctx.fillRect(cloud.x, cloud.y, 20, 4);
        ctx.fillRect(cloud.x + 8, cloud.y - 4, 16, 4);
        ctx.fillRect(cloud.x + 4, cloud.y + 4, 24, 4);
      }
    });
    
    // Draw ball (simple rectangle with legs)
    const ballX = ball.x;
    const ballY = ball.y;
    
    ctx.fillStyle = COLORS.BALL;
    
    // Ball body (main rectangle)
    ctx.fillRect(ballX, ballY, ball.size, ball.size);
    
    // Ball legs (simple lines at bottom)
    if (!ball.isJumping) {
      const legOffset = Math.floor(distanceTraveled / 10) % 2; // Running animation
      ctx.fillRect(ballX + 3 + legOffset, ballY + ball.size, 3, 4);
      ctx.fillRect(ballX + ball.size - 6 + legOffset, ballY + ball.size, 3, 4);
    }
    
    // Ball eye
    ctx.fillStyle = COLORS.SKY;
    ctx.fillRect(ballX + ball.size - 6, ballY + 3, 3, 3);
    
    // Draw obstacles 
    ctx.fillStyle = COLORS.OBSTACLE;
    obstacles.forEach(obstacle => {
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
    
    // Draw HUD 
    ctx.fillStyle = COLORS.TEXT;
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'right';
    
    // Current score 
    const scoreText = score.toString().padStart(5, '0');
    ctx.fillText(scoreText, GAME_CONFIG.CANVAS_WIDTH - 20, 30);
    
    // High score
    if (highScore > 0) {
      ctx.font = 'bold 12px monospace';
      const hiText = `HI ${highScore.toString().padStart(5, '0')}`;
      ctx.fillText(hiText, GAME_CONFIG.CANVAS_WIDTH - 20, 50);
    }
    
    // Speed indicator 
    if (import.meta.env.DEV) {
      ctx.font = '10px monospace';
      ctx.fillText(`Speed: ${currentSpeed.toFixed(1)}`, GAME_CONFIG.CANVAS_WIDTH - 20, GAME_CONFIG.CANVAS_HEIGHT - 10);
      ctx.fillText(`Distance: ${Math.floor(distanceTraveled)}`, GAME_CONFIG.CANVAS_WIDTH - 120, GAME_CONFIG.CANVAS_HEIGHT - 10);
    }
    
    ctx.textAlign = 'left';
    
    // Draw game over message
    if (gameState === GAME_STATES.GAME_OVER) {
      ctx.fillStyle = COLORS.TEXT;
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', GAME_CONFIG.CANVAS_WIDTH / 2, GAME_CONFIG.CANVAS_HEIGHT / 2 - 20);
      
      ctx.font = '16px monospace';
      ctx.fillText('Press SPACE to restart', GAME_CONFIG.CANVAS_WIDTH / 2, GAME_CONFIG.CANVAS_HEIGHT / 2 + 10);
      ctx.textAlign = 'left';
    }
    
    // Draw paused indicator
    if (gameState === GAME_STATES.PAUSED) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
      
      ctx.fillStyle = COLORS.TEXT;
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', GAME_CONFIG.CANVAS_WIDTH / 2, GAME_CONFIG.CANVAS_HEIGHT / 2);
      ctx.textAlign = 'left';
    }
  }, [gameState, ball, obstacles, score, highScore, distanceTraveled, currentSpeed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const gameLoop = (currentTime) => {
      // Throttle to ~60fps
      if (currentTime - lastTimeRef.current >= 16) {
        // Update game logic
        if (gameState === GAME_STATES.PLAYING) {
          updateGame();
        }
        
        // Draw frame
        draw(ctx);
        
        lastTimeRef.current = currentTime;
      }
      
      animationRef.current = requestAnimationFrame(gameLoop);
    };
    
    animationRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw, gameState, updateGame]);

  return (
    <div className="flex justify-center items-center p-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={GAME_CONFIG.CANVAS_WIDTH}
          height={GAME_CONFIG.CANVAS_HEIGHT}
          className="border-2 border-gray-400 bg-white cursor-pointer"
          style={{ 
            maxWidth: '100%', 
            height: 'auto',
            imageRendering: 'pixelated',
            fontFamily: 'monospace',
          }}
          onClick={() => {
            // Allow clicking canvas to jump on mobile
            if (gameState === GAME_STATES.PLAYING) {
              useGameStore.getState().jumpBall();
            } else if (gameState === GAME_STATES.MENU || gameState === GAME_STATES.GAME_OVER) {
              useGameStore.getState().startGame();
            }
          }}
        />
        
        {/* Canvas overlay for mobile touch */}
        <div 
          className="absolute inset-0 md:hidden"
          onTouchStart={(e) => {
            e.preventDefault();
            if (gameState === GAME_STATES.PLAYING) {
              useGameStore.getState().jumpBall();
            } else if (gameState === GAME_STATES.MENU || gameState === GAME_STATES.GAME_OVER) {
              useGameStore.getState().startGame();
            }
          }}
        />
      </div>
    </div>
  );
};

export default GameCanvas;