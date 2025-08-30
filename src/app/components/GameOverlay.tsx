'use client';
import { forwardRef, useImperativeHandle, useRef } from 'react';

interface GameOverlayProps {
  isMobile: boolean;
  onRestart: () => void;
}

export interface GameOverlayRef {
  show: () => void;
  hide: () => void;
  setResult: (text: string) => void;
}

const GameOverlay = forwardRef<GameOverlayRef, GameOverlayProps>(({ isMobile, onRestart }, ref) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);

  useImperativeHandle(ref, () => ({
    show: () => overlayRef.current?.classList.add('show'),
    hide: () => overlayRef.current?.classList.remove('show'),
    setResult: (text: string) => {
      if (resultRef.current) resultRef.current.textContent = text;
    },
  }));

  return (
    <>
      <div 
        ref={overlayRef} 
        className="overlay fixed inset-0 z-30 bg-black bg-opacity-75 flex items-center justify-center opacity-0 pointer-events-none transition-opacity"
      >
        <div className="bg-gray-800 rounded-lg p-8 text-center text-white max-w-sm mx-4 border-2 border-yellow-600">
          <h1 ref={resultRef} className="text-3xl font-bold mb-4 text-yellow-400">Bot Wins!</h1>
          <p className="mb-6">
            {isMobile ? (
              <span>Tap restart to play again</span>
            ) : (
              <>
                Press <span className="bg-gray-700 px-2 py-1 rounded text-sm">R</span> to restart
              </>
            )}
          </p>
          <button 
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
            onClick={onRestart}
          >
            Fight Again!
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .overlay.show {
          opacity: 1 !important;
          pointer-events: auto !important;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .overlay.show .bg-gray-800 {
          animation: pulse 0.5s ease-in-out;
        }
      `}</style>
    </>
  );
});

GameOverlay.displayName = 'GameOverlay';
export default GameOverlay;