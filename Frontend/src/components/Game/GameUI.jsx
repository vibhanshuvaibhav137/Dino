import React, { useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useUserStore } from '../../stores/userStore';
import { gameService } from '../../services/gameService';
import { GAME_STATES } from '../../utils/constants';
import Button from '../UI/Button';

const GameUI = () => {
  const {
    gameState,
    score,
    highScore,
    currentGame,
    gameStats,
    distanceTraveled,
    currentSpeed,
    startGame,
    resetGame,
    jumpBall,
    getGameData,
  } = useGameStore();
  
  const { user } = useUserStore();

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event) => {
      event.preventDefault();
      
      console.log('🔑 Key pressed:', event.code, 'Game state:', gameState);
      
      if (event.code === 'Space' || event.code === 'ArrowUp') {
        if (gameState === GAME_STATES.MENU || gameState === GAME_STATES.GAME_OVER) {
          console.log('🚀 Starting game from key press');
          startGame();
        } else if (gameState === GAME_STATES.PLAYING) {
          jumpBall();
        }
      } else if (event.code === 'Escape') {
        if (gameState === GAME_STATES.PLAYING || gameState === GAME_STATES.PAUSED) {
          resetGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, startGame, jumpBall, resetGame]);

  // Submit score on game over
  useEffect(() => {
    if (gameState === GAME_STATES.GAME_OVER && currentGame) {
      const gameData = getGameData();
      if (gameData) {
        gameService.submitScore(score, gameData).catch(error => {
          console.error('Failed to submit score:', error);
        });
      }
    }
  }, [gameState, score, currentGame, getGameData]);

  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDistance = (distance) => {
    return `${Math.floor(distance)}m`;
  };

  console.log('🎮 GameUI render - State:', gameState);

  // Menu Screen 
  if (gameState === GAME_STATES.MENU) {
    return (
      <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20">
        <div className="bg-white p-8 rounded-lg text-center shadow-2xl max-w-md mx-4 border-2 border-gray-300" style={{fontFamily: 'monospace'}}>
          <div className="mb-6">
            <div className="text-6xl mb-4">🏀</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-wider">
              BALL RUNNER
            </h1>
            <p className="text-gray-600 text-sm">
              Press SPACE or ↑ to jump over obstacles
            </p>
          </div>
          
          <div className="bg-gray-100 rounded p-4 mb-6 text-left text-sm">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <span className="text-gray-500">HIGH SCORE</span>
                <div className="text-xl font-bold text-gray-800">{highScore.toString().padStart(5, '0')}</div>
              </div>
              <div>
                <span className="text-gray-500">GAMES</span>
                <div className="text-xl font-bold text-gray-800">{gameStats.totalGames}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-500">TOTAL JUMPS</span>
                <div className="font-bold">{gameStats.totalJumps.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-500">DISTANCE</span>
                <div className="font-bold">{formatDistance(gameStats.totalDistance)}</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={() => {
                console.log('🎯 Start button clicked');
                startGame();
              }}
              size="lg"
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-mono tracking-wider"
            >
              START GAME
            </Button>
            
            <div className="text-xs text-gray-500 space-y-1">
              <div>Press <kbd className="px-2 py-1 bg-gray-200 rounded font-mono text-xs">SPACE</kbd> or <kbd className="px-2 py-1 bg-gray-200 rounded font-mono text-xs">↑</kbd> to jump</div>
              <div>Avoid obstacles • Score based on distance & jumps</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game Over Screen 
  if (gameState === GAME_STATES.GAME_OVER) {
    return (
      <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20">
        <div className="bg-white p-8 rounded-lg text-center shadow-2xl max-w-md mx-4 border-2 border-gray-300" style={{fontFamily: 'monospace'}}>
          <div className="mb-6">
            <div className="text-6xl mb-4">💀</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 tracking-wider">
              GAME OVER
            </h2>
            <p className="text-gray-600 text-sm">You hit an obstacle!</p>
          </div>
          
          <div className="bg-gray-100 rounded p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-gray-500 text-xs">YOUR SCORE</span>
                <div className="text-2xl font-bold text-gray-800">{score.toString().padStart(5, '0')}</div>
              </div>
              <div>
                <span className="text-gray-500 text-xs">HIGH SCORE</span>
                <div className="text-2xl font-bold text-gray-800">{highScore.toString().padStart(5, '0')}</div>
                {score === highScore && score > 0 && (
                  <div className="text-xs text-yellow-600 font-bold">NEW RECORD!</div>
                )}
              </div>
            </div>
            
            {currentGame && (
              <div className="grid grid-cols-3 gap-2 text-xs pt-3 border-t border-gray-300">
                <div>
                  <span className="text-gray-500">TIME</span>
                  <div className="font-bold">{formatTime(Date.now() - currentGame.startTime)}</div>
                </div>
                <div>
                  <span className="text-gray-500">JUMPS</span>
                  <div className="font-bold">{currentGame.jumps}</div>
                </div>
                <div>
                  <span className="text-gray-500">DISTANCE</span>
                  <div className="font-bold">{formatDistance(distanceTraveled)}</div>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={() => {
                console.log('🔄 Play Again clicked');
                startGame();
              }}
              size="lg"
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-mono tracking-wider"
            >
              PLAY AGAIN
            </Button>
            
            <Button
              onClick={() => {
                console.log('🏠 Main Menu clicked');
                resetGame();
              }}
              variant="outline"
              size="md"
              className="w-full font-mono tracking-wider"
            >
              MAIN MENU
            </Button>
            
            <div className="text-xs text-gray-500">
              Press <kbd className="px-2 py-1 bg-gray-200 rounded font-mono text-xs">SPACE</kbd> to restart
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Paused Screen
  if (gameState === GAME_STATES.PAUSED) {
    return (
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
        <div className="bg-white p-6 rounded text-center shadow-xl font-mono">
          <h3 className="text-xl font-bold text-gray-800 mb-4 tracking-wider">PAUSED</h3>
          <p className="text-gray-600 mb-4 text-sm">
            Press <kbd className="px-2 py-1 bg-gray-200 rounded">ESC</kbd> to exit
          </p>
          <Button 
            onClick={() => {
              console.log('🚪 Exit Game clicked');
              resetGame();
            }} 
            variant="outline" 
            size="sm"
            className="font-mono"
          >
            EXIT GAME
          </Button>
        </div>
      </div>
    );
  }

  // Playing Screen Controls
  if (gameState === GAME_STATES.PLAYING) {
    return (
      <div className="mt-6 text-center space-y-4">
        {/* Current game stats */}
        <div className="bg-white rounded-lg p-4 shadow-md max-w-md mx-auto font-mono text-sm">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="text-gray-500 text-xs">DISTANCE</span>
              <div className="font-bold text-lg">{formatDistance(distanceTraveled)}</div>
            </div>
            <div>
              <span className="text-gray-500 text-xs">SPEED</span>
              <div className="font-bold text-lg">{currentSpeed.toFixed(1)}</div>
            </div>
            <div>
              <span className="text-gray-500 text-xs">JUMPS</span>
              <div className="font-bold text-lg">{currentGame?.jumps || 0}</div>
            </div>
          </div>
        </div>
        
        {/* Mobile jump button */}
        <div className="md:hidden">
          <Button
            onClick={() => {
              console.log('📱 Mobile jump button pressed');
              jumpBall();
            }}
            size="xl"
            className="w-32 h-16 rounded-full bg-gray-800 hover:bg-gray-900 active:bg-gray-700 shadow-lg transform active:scale-95 transition-all font-mono"
          >
            <span className="text-2xl">⬆️</span>
          </Button>
          <p className="text-sm text-gray-600 mt-2 font-mono">TAP TO JUMP</p>
        </div>
        
        {/* Desktop controls */}
        <div className="hidden md:block">
          <p className="text-sm text-gray-600 font-mono">
            Press <kbd className="px-2 py-1 bg-gray-200 rounded font-mono">SPACE</kbd> or <kbd className="px-2 py-1 bg-gray-200 rounded font-mono">↑</kbd> to jump
          </p>
          <p className="text-xs text-gray-500 mt-1 font-mono">
            Press <kbd className="px-2 py-1 bg-gray-200 rounded font-mono">ESC</kbd> to exit
          </p>
        </div>
        
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => {
              console.log('🏠 Menu button clicked');
              resetGame();
            }}
            variant="outline"
            size="sm"
            className="flex items-center space-x-1 font-mono"
          >
            <span>🏠</span>
            <span>MENU</span>
          </Button>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="mt-6 text-center">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded font-mono">
        <p>Unknown game state: {gameState}</p>
        <Button onClick={resetGame} className="mt-2 font-mono">RESET GAME</Button>
      </div>
    </div>
  );
};

export default GameUI;