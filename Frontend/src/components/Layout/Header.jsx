import React, { useState } from 'react';
import { useUserStore } from '../../stores/userStore';
import { useGameStore } from '../../stores/gameStore';
import Button from '../UI/Button';

/**
 * Header component for Ball Runner game
 * Displays game branding, statistics dropdown, and optional leaderboard button
 */
const Header = ({ onShowLeaderboard }) => {
  const { user, isAuthenticated } = useUserStore();
  const { highScore, gameStats } = useGameStore();
  const [showStats, setShowStats] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="text-3xl">🏀</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-game">
                Ball Runner
              </h1>
              <p className="text-sm text-gray-500">Jump and avoid obstacles!</p>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center space-x-4">
            
            {/* Stats Dropdown */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowStats(!showStats)}
                className="flex items-center space-x-2 font-mono"
              >
                <span>📊</span>
                <span className="hidden sm:inline">STATS</span>
              </Button>
              
              {showStats && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowStats(false)}
                  />
                  
                  {/* Stats Panel */}
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 font-mono">
                    <div className="p-4">
                      
                      <h3 className="font-bold mb-4 text-gray-900 tracking-wider">
                        📈 STATISTICS
                      </h3>
                      
                      {/* Primary Stats Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-100 p-3 rounded">
                          <p className="text-xs text-gray-600">HIGH SCORE</p>
                          <p className="text-xl font-bold text-gray-800">
                            {highScore.toString().padStart(5, '0')}
                          </p>
                        </div>
                        <div className="bg-gray-100 p-3 rounded">
                          <p className="text-xs text-gray-600">GAMES</p>
                          <p className="text-xl font-bold text-gray-800">
                            {gameStats.totalGames}
                          </p>
                        </div>
                      </div>
                      
                      {/* Detailed Statistics */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">TOTAL SCORE:</span>
                          <span className="font-bold">{gameStats.totalScore.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">TOTAL JUMPS:</span>
                          <span className="font-bold">{gameStats.totalJumps.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">DISTANCE:</span>
                          <span className="font-bold">{gameStats.totalDistance.toLocaleString()}m</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">BEST STREAK:</span>
                          <span className="font-bold">{gameStats.bestStreak}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">AVG SCORE:</span>
                          <span className="font-bold">
                            {gameStats.totalGames > 0 
                              ? Math.round(gameStats.totalScore / gameStats.totalGames)
                              : 0
                            }
                          </span>
                        </div>
                      </div>
                      
                      {/* User Info */}
                      {user && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">BROWSER ID:</span>
                            <span className="text-xs font-mono bg-gray-200 px-2 py-1 rounded">
                              {user.browserId?.slice(0, 12)}...
                            </span>
                          </div>
                        </div>
                      )}
                      
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Leaderboard Button */}
            {onShowLeaderboard && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onShowLeaderboard}
                className="flex items-center space-x-2 font-mono"
              >
                <span>🏆</span>
                <span className="hidden sm:inline">BOARD</span>
              </Button>
            )}
            
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;