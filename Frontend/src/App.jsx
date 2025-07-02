import React, { useEffect, useState } from 'react';
import { useUserStore } from './stores/userStore';
import { useGameStore } from './stores/gameStore';
import { gameService } from './services/gameService';
import { authService } from './services/auth';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import GameCanvas from './components/Game/GameCanvas';
import GameUI from './components/Game/GameUI';
import LoadingSpinner from './components/UI/LoadingSpinner';
import Modal from './components/UI/Modal';
import Leaderboard from './components/Game/Leaderboard';
import ConnectionStatus from './components/UI/ConnectionStatus';
import './styles/globals.css';

function App() {
  const { login, isAuthenticated, isLoading, error } = useUserStore();
  const { gameState, resetGame } = useGameStore();
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [backendError, setBackendError] = useState(null);
  const [appInitialized, setAppInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 Initializing Ball Runner Game...');
      try {
        resetGame();

        if (navigator.onLine) {
          try {
            await authService.checkHealth();
            await login();
            await gameService.syncOfflineScores();
            setBackendError(null);
            console.log('✅ Backend connected successfully');
          } catch (error) {
            console.warn('⚠️ Backend not available, running in offline mode:', error.message);
            setBackendError(error.message);
          }
        } else {
          console.log('📱 App is offline');
        }

        setAppInitialized(true);
      } catch (error) {
        console.error('❌ Failed to initialize app:', error);
        setAppInitialized(true);
      }
    };

    initializeApp();
  }, [login, resetGame]);

  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 App is online');
      setTimeout(async () => {
        try {
          await authService.checkHealth();
          await login();
          await gameService.syncOfflineScores();
          setBackendError(null);
          console.log('✅ Reconnected to backend');
        } catch (error) {
          console.warn('⚠️ Still cannot connect to backend:', error.message);
        }
      }, 1000);
    };

    const handleOffline = () => {
      console.log('📱 App is offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [login]);

  useEffect(() => {
    const preventSpaceScroll = (e) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', preventSpaceScroll);
    return () => document.removeEventListener('keydown', preventSpaceScroll);
  }, []);

  if (!appInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🏀</div>
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 mt-4 text-lg">Loading Ball Runner Game...</p>
          <p className="text-gray-500 mt-2 text-sm">Get ready to jump!</p>
        </div>
      </div>
    );
  }

  console.log('🎮 App render - Game State:', gameState);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header onShowLeaderboard={() => setShowLeaderboard(true)} />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="relative inline-block">
            <GameCanvas />
            <GameUI />
          </div>

          <div className="mt-6 flex justify-center">
            <ConnectionStatus />
          </div>

          {backendError && (
            <div className="mt-4 max-w-md mx-auto">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-2">⚠️</span>
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">Offline Mode</p>
                    <p className="text-yellow-700">
                      Playing without server connection. Scores saved locally.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          
        </div>
      </main>

      <Footer />

      {/* Leaderboard Modal */}
      <Modal
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        title="Leaderboard"
        size="lg"
      >
        <Leaderboard />
      </Modal>
    </div>
  );
}

export default App;
