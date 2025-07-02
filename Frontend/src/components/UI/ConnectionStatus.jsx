import React, { useState, useEffect } from 'react';
import { authService } from '../../services/auth';

const ConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [storageStatus, setStorageStatus] = useState('checking');

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check backend connection
  useEffect(() => {
    const checkBackend = async () => {
      if (!isOnline) {
        setBackendStatus('offline');
        return;
      }

      try {
        await authService.checkHealth();
        setBackendStatus('connected');
      } catch (error) {
        console.warn('Backend check failed:', error.message);
        setBackendStatus('disconnected');
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 30000);
    return () => clearInterval(interval);
  }, [isOnline]);

  // Check localStorage availability
  useEffect(() => {
    const checkStorage = () => {
      try {
        const key = 'ball-runner-test';
        const val = 'test';
        localStorage.setItem(key, val);
        const result = localStorage.getItem(key);
        localStorage.removeItem(key);
        setStorageStatus(result === val ? 'available' : 'limited');
      } catch (err) {
        console.error('LocalStorage check failed:', err);
        setStorageStatus('unavailable');
      }
    };

    checkStorage();
  }, []);

  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        icon: '🔴',
        text: 'Offline',
        color: 'bg-red-100 text-red-800 border-red-200',
        description: 'No internet connection',
      };
    }

    if (backendStatus === 'disconnected') {
      return {
        icon: '🟡',
        text: 'Offline Mode',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        description: 'Backend unavailable. Scores stored locally.',
      };
    }

    if (storageStatus === 'unavailable') {
      return {
        icon: '🟠',
        text: 'No Storage',
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        description: 'LocalStorage not available. Game progress won’t be saved.',
      };
    }

    return {
      icon: '🟢',
      text: 'Connected',
      color: 'bg-green-100 text-green-800 border-green-200',
      description: 'All systems working.',
    };
  };

  const status = getStatusInfo();

  return (
    <div
      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border font-mono cursor-help ${status.color}`}
      title={status.description}
    >
      <span className="mr-2">{status.icon}</span>
      <span className="hidden sm:inline">{status.text}</span>
      <span className="sm:hidden">{status.icon}</span>
    </div>
  );
};

export default ConnectionStatus;
