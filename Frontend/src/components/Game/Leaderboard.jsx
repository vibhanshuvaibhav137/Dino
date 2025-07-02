import React, { useState, useEffect } from 'react';
import { gameService } from '../../services/gameService';
import LoadingSpinner from '../UI/LoadingSpinner';
import Button from '../UI/Button';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userScores, setUserScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('global');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchLeaderboard();
  }, [page]);

  useEffect(() => {
    if (activeTab === 'personal') {
      fetchUserScores();
    }
  }, [activeTab]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await gameService.getLeaderboard(page, 10);
      setLeaderboard(response.leaderboard || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserScores = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await gameService.getUserScores(1, 20);
      setUserScores(response.scores || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRankEmoji = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Failed to Load Leaderboard
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={activeTab === 'global' ? fetchLeaderboard : fetchUserScores}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
        <button
          onClick={() => setActiveTab('global')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'global'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          🌍 Global Leaderboard
        </button>
        <button
          onClick={() => setActiveTab('personal')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'personal'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          📊 Your Scores
        </button>
      </div>

      {/* Global Leaderboard */}
      {activeTab === 'global' && (
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Top Players
              </h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {leaderboard.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="text-gray-400 text-4xl mb-4">🏆</div>
                  <p className="text-gray-500">No scores yet. Be the first!</p>
                </div>
              ) : (
                leaderboard.map((entry, index) => (
                  <div key={entry._id} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold text-gray-400 w-12 text-center">
                        {getRankEmoji(index + 1)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {entry.user?.browserId?.slice(0, 8) || 'Anonymous'}...
                        </p>
                        <p className="text-sm text-gray-500">
                          {entry.totalGames} games • Avg: {entry.avgScore}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-600">
                        {entry.maxScore}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Personal Scores */}
      {activeTab === 'personal' && (
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Your Recent Scores
              </h3>
            </div>
            
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {userScores.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="text-gray-400 text-4xl mb-4">🎮</div>
                  <p className="text-gray-500">No scores yet. Start playing!</p>
                </div>
              ) : (
                userScores.map((score, index) => (
                  <div key={score._id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        Score: {score.score}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(score.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        {score.gameData?.jumps && (
                          <p>{score.gameData.jumps} jumps</p>
                        )}
                        {score.gameData?.duration && (
                          <p>{Math.round(score.gameData.duration / 1000)}s</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Offline Scores Notice */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="text-yellow-500">💾</div>
          <div className="text-sm">
            <p className="font-medium text-yellow-800">Offline Scores</p>
            <p className="text-yellow-700">
              Scores are automatically synced when you're online. 
              Offline scores are stored locally until connection is restored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;