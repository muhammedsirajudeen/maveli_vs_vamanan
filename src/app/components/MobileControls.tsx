'use client';

import { useCallback, useState, useRef } from 'react';

interface MobileControlsProps {
  isLandscape: boolean;
  onControlChange: (key: string, pressed: boolean) => void;
}

export default function MobileControls({
  isLandscape,
  onControlChange,
}: MobileControlsProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Track active buttons to prevent spam
  const activeButtons = useRef<Set<string>>(new Set());
  const cooldowns = useRef<Map<string, number>>(new Map());
  
  // Cooldown duration in milliseconds (adjust as needed)
  const ATTACK_COOLDOWN = 300; // 300ms between attacks
  const MOVEMENT_COOLDOWN = 50; // 50ms for movement (more responsive)

  const handleControl = useCallback(
    (key: string, pressed: boolean, e?: React.TouchEvent | React.MouseEvent) => {
      if (e) e.preventDefault();
      
      // Determine if this is an attack button
      const isAttack = key === '/' || key === '.';
      const cooldownTime = isAttack ? ATTACK_COOLDOWN : MOVEMENT_COOLDOWN;
      
      if (pressed) {
        // Check if button is already active (prevent spam)
        if (activeButtons.current.has(key)) {
          return;
        }
        
        // Check cooldown for attack buttons
        if (isAttack) {
          const lastPress = cooldowns.current.get(key) || 0;
          const now = Date.now();
          
          if (now - lastPress < cooldownTime) {
            return; // Still in cooldown
          }
          
          cooldowns.current.set(key, now);
        }
        
        // Mark as active and vibrate
        activeButtons.current.add(key);
        if ('vibrate' in navigator) navigator.vibrate(15);
        
        onControlChange(key, true);
        
        // For attack buttons, automatically release after a short duration
        if (isAttack) {
          setTimeout(() => {
            activeButtons.current.delete(key);
            onControlChange(key, false);
          }, 100); // Short press duration
        }
      } else {
        // Release button
        if (activeButtons.current.has(key)) {
          activeButtons.current.delete(key);
          onControlChange(key, false);
        }
      }
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
    transition-transform duration-100 ease-in-out active:scale-90 shadow-lg
    touch-none`; // Prevents unwanted touch actions

  const dpadButton = `${baseButton} bg-gray-700/70 backdrop-blur-md border border-gray-500/30 
    ${isLandscape ? 'w-16 h-16 text-lg' : 'w-18 h-18 text-xl'}`;

  const punchButton = `${baseButton} backdrop-blur-md border bg-red-500/80 border-red-400/50 shadow-red-500/50
    ${isLandscape ? 'w-16 h-16 text-lg' : 'w-18 h-18 text-xl'}`;

  const kickButton = `${baseButton} backdrop-blur-md border bg-blue-500/80 border-blue-400/50 shadow-blue-500/50
    ${isLandscape ? 'w-20 h-20 text-xl' : 'w-24 h-24 text-2xl'}`;

  const fullscreenButton = `${baseButton} bg-green-500/80 border-green-400/50 shadow-green-500/50
    ${isLandscape ? 'w-12 h-12 text-sm' : 'w-14 h-14 text-base'}`;

  return (
    <div
      className="absolute inset-0 z-20 pointer-events-none select-none"
      onContextMenu={(e) => e.preventDefault()} // Prevent right-click/long-press menu
    >
      {/* Fullscreen Button */}
      <div className="absolute top-3 right-3 pointer-events-auto">
        <button
          className={fullscreenButton}
          onClick={toggleFullscreen}
          onContextMenu={(e) => e.preventDefault()}
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
            onContextMenu={(e) => e.preventDefault()}
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
              onContextMenu={(e) => e.preventDefault()}
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
              onContextMenu={(e) => e.preventDefault()}
            >
              ▶
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-end space-x-5">
          <button
            className={punchButton}
            onTouchStart={(e) => handleControl('/', true, e)}
            onTouchEnd={(e) => handleControl('/', false, e)}
            onMouseDown={() => handleControl('/', true)}
            onMouseUp={() => handleControl('/', false)}
            onMouseLeave={() => handleControl('/', false)}
            onContextMenu={(e) => e.preventDefault()}
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
            onContextMenu={(e) => e.preventDefault()}
          >
            🦵
          </button>
        </div>
      </div>
    </div>
  );
}