'use client';

import { useCallback, useState } from 'react';

interface MobileControlsProps {
  isLandscape: boolean;
  onControlChange: (key: string, pressed: boolean) => void;
}

export default function MobileControls({
  isLandscape,
  onControlChange,
}: MobileControlsProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleControl = useCallback(
    (key: string, pressed: boolean, e?: React.TouchEvent | React.MouseEvent) => {
      if (e) e.preventDefault();
      if (pressed && 'vibrate' in navigator) navigator.vibrate(15);
      onControlChange(key, pressed);
    },
    [onControlChange]
  );

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  }, []);

  const baseButton = `rounded-full flex items-center justify-center text-white font-bold select-none
    transition-transform duration-100 ease-in-out active:scale-90 shadow-lg`;

  // Increased D-pad button sizes
  const dpadButton = `${baseButton} bg-gray-700/70 backdrop-blur-md border border-gray-500/30 
    ${isLandscape ? 'w-16 h-16 text-lg' : 'w-18 h-18 text-xl'}`;

  // Different sizes for punch (smaller) and kick (bigger)
  const punchButton = `${baseButton} backdrop-blur-md border bg-red-500/80 border-red-400/50 shadow-red-500/50
    ${isLandscape ? 'w-16 h-16 text-lg' : 'w-18 h-18 text-xl'}`;

  const kickButton = `${baseButton} backdrop-blur-md border bg-blue-500/80 border-blue-400/50 shadow-blue-500/50
    ${isLandscape ? 'w-20 h-20 text-xl' : 'w-24 h-24 text-2xl'}`;

  const fullscreenButton = `${baseButton} bg-green-500/80 border-green-400/50 shadow-green-500/50
    ${isLandscape ? 'w-12 h-12 text-sm' : 'w-14 h-14 text-base'}`;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {/* Fullscreen Button */}
      <div className="absolute top-3 right-3 pointer-events-auto">
        <button
          className={fullscreenButton}
          onClick={toggleFullscreen}
        >
          {isFullscreen ? '⤢' : '⛶'}
        </button>
      </div>

      {/* Main Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 flex justify-between items-end ${
          isLandscape ? 'p-4' : 'p-6'
        } pointer-events-auto`}
      >
        {/* Movement Controls */}
        <div className="flex flex-col items-center">
          <button
            className={`${dpadButton} mb-3`}
            onTouchStart={(e) => handleControl('ArrowUp', true, e)}
            onTouchEnd={(e) => handleControl('ArrowUp', false, e)}
            onMouseDown={() => handleControl('ArrowUp', true)}
            onMouseUp={() => handleControl('ArrowUp', false)}
            onMouseLeave={() => handleControl('ArrowUp', false)}
          >
            ▲
          </button>
          <div className="flex space-x-4">
            <button
              className={dpadButton}
              onTouchStart={(e) => handleControl('ArrowLeft', true, e)}
              onTouchEnd={(e) => handleControl('ArrowLeft', false, e)}
              onMouseDown={() => handleControl('ArrowLeft', true)}
              onMouseUp={() => handleControl('ArrowLeft', false)}
              onMouseLeave={() => handleControl('ArrowLeft', false)}
            >
              ◀
            </button>
            <button
              className={dpadButton}
              onTouchStart={(e) => handleControl('ArrowRight', true, e)}
              onTouchEnd={(e) => handleControl('ArrowRight', false, e)}
              onMouseDown={() => handleControl('ArrowRight', true)}
              onMouseUp={() => handleControl('ArrowRight', false)}
              onMouseLeave={() => handleControl('ArrowRight', false)}
            >
              ▶
            </button>
          </div>
        </div>

        {/* Action Buttons - Punch (smaller) and Kick (bigger) */}
        <div className="flex items-end space-x-5">
          <button
            className={punchButton}
            onTouchStart={(e) => handleControl('/', true, e)}
            onTouchEnd={(e) => handleControl('/', false, e)}
            onMouseDown={() => handleControl('/', true)}
            onMouseUp={() => handleControl('/', false)}
            onMouseLeave={() => handleControl('/', false)}
          >
            🥊
          </button>
          <button
            className={kickButton}
            onTouchStart={(e) => handleControl('.', true, e)}
            onTouchEnd={(e) => handleControl('.', false, e)}
            onMouseDown={() => handleControl('.', true)}
            onMouseUp={() => handleControl('.', false)}
            onMouseLeave={() => handleControl('.', false)}
          >
            🦵
          </button>
        </div>
      </div>
    </div>
  );
}