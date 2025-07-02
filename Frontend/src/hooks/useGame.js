import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { GAME_STATES } from '../utils/constants';

export const useGame = () => {
  const gameLoopRef = useRef();
  const {
    gameState,
    score,
    highScore,
    startGame,
    pauseGame,
    resumeGame,
    gameOver,
    resetGame,
    jumpBall,
    updateGame,
  } = useGameStore();

  const handleKeyPress = useCallback((event) => {
    if (event.code === 'Space') {
      event.preventDefault();
      
      switch (gameState) {
        case GAME_STATES.MENU:
        case GAME_STATES.GAME_OVER:
          startGame();
          break;
        case GAME_STATES.PLAYING:
          jumpBall();
          break;
        case GAME_STATES.PAUSED:
          resumeGame();
          break;
        default:
          break;
      }
    } else if (event.code === 'Escape') {
      if (gameState === GAME_STATES.PLAYING) {
        pauseGame();
      } else if (gameState === GAME_STATES.PAUSED) {
        resumeGame();
      }
    }
  }, [gameState, startGame, jumpBall, pauseGame, resumeGame]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    const gameLoop = () => {
      if (gameState === GAME_STATES.PLAYING) {
        updateGame();
      }
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, updateGame]);

  return {
    gameState,
    score,
    highScore,
    startGame,
    pauseGame,
    resumeGame,
    gameOver,
    resetGame,
    jumpBall,
  };
};