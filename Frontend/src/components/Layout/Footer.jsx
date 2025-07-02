import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Game Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🏀</span>
              Ball Runner Game
            </h3>
            <p className="text-gray-600 text-sm">
              A fun and addictive jumping game where you control a ball and avoid obstacles. 
              Challenge yourself to get the highest score!
            </p>
          </div>
          
          {/* How to Play */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">How to Play</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="mr-2">⌨️</span>
                Press SPACEBAR to jump
              </li>
              <li className="flex items-center">
                <span className="mr-2">🎯</span>
                Avoid the obstacles
              </li>
              <li className="flex items-center">
                <span className="mr-2">📈</span>
                Get the highest score
              </li>
              <li className="flex items-center">
                <span className="mr-2">🏆</span>
                Compete on leaderboard
              </li>
            </ul>
          </div>
          
          {/* Features */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="mr-2">💾</span>
                Offline play support
              </li>
              <li className="flex items-center">
                <span className="mr-2">📊</span>
                Score tracking
              </li>
              <li className="flex items-center">
                <span className="mr-2">🔄</span>
                Auto-sync scores
              </li>
              <li className="flex items-center">
                <span className="mr-2">📱</span>
                Mobile friendly
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2025 Ball Runner Game. Made with ❤️ for fun!
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;