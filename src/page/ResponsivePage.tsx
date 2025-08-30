'use client';
import GameCanvas, { GameCanvasRef } from '@/app/components/GameCanvas';
import GameOverlay, { GameOverlayRef } from '@/app/components/GameOverlay';
import HUD, { HUDRef } from '@/app/components/HUD';
import MobileControls from '@/app/components/MobileControls';
import { createPlayer, resetPlayer } from '@/game/Player';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useSpriteLoader } from '@/hooks/useSpriteLoader';
import { Player } from '@/types/Player';
import React from 'react';
import { useRef, useState } from 'react';

export default function ResponsiveFightingGame() {
  const { isMobile, isLandscape } = useDeviceDetection();
  const { spriteLoaded, spriteSheet } = useSpriteLoader();
  
  const canvasRef = useRef<GameCanvasRef>(null);
  const hudRef = useRef<HUDRef>(null);
  const overlayRef = useRef<GameOverlayRef>(null);
  
  const keys = useRef(new Set<string>());
  const mobileKeys = useRef(new Set<string>());
  const playersRef = useRef<[Player, Player] | null>(null);

  const [gameActive, setGameActive] = useState(false);

  // Initialize players
  const initializePlayers = () => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return null;

    const W = canvas.clientWidth;
    const FLOOR_Y = canvas.clientHeight - (isMobile ? 60 : 90);

    const p1 = createPlayer({
      x: isMobile ? 60 : 120,
      color: '#4ade80',
      face: 1,
      controls: { left: 'a', right: 'd', up: 'w', punch: 'f', kick: 'g' },
      isBot: true,
      isMobile,
      isLandscape,
      floorY: FLOOR_Y,
    });

    const p2 = createPlayer({
      x: W - (isMobile ? 100 : 170),
      color: '#60a5fa',
      face: -1,
      controls: { left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', punch: '/', kick: '.' },
      isBot: false,
      isMobile,
      isLandscape,
      floorY: FLOOR_Y,
    });

    return [p1, p2] as [Player, Player];
  };

  const resetGame = () => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas || !playersRef.current) return;

    const W = canvas.clientWidth;
    const FLOOR_Y = canvas.clientHeight - (isMobile ? 60 : 90);
    const [p1, p2] = playersRef.current;

    resetPlayer(p1, isMobile ? 60 : 120, 1, FLOOR_Y);
    resetPlayer(p2, W - (isMobile ? 100 : 170), -1, FLOOR_Y);
    
    overlayRef.current?.hide();
    setGameActive(true);
    gameLoop.resetTimer();
    gameLoop.startLoop();
  };

  const handleUpdateHUD = (p1hp: number, p2hp: number, timer: number) => {
    const hud = hudRef.current;
    if (!hud) return;

    const p1Percentage = Math.max(0, Math.min(100, p1hp));
    const p2Percentage = Math.max(0, Math.min(100, p2hp));
    
    if (hud.hp1) {
      hud.hp1.style.width = p1Percentage + '%';
      if (p1Percentage <= 25) {
        hud.hp1.className = 'h-full bg-red-500';
      } else if (p1Percentage <= 50) {
        hud.hp1.className = 'h-full bg-yellow-500';
      } else {
        hud.hp1.className = 'h-full bg-green-400';
      }
    }
    
    if (hud.hp2) {
      hud.hp2.style.width = p2Percentage + '%';
      if (p2Percentage <= 25) {
        hud.hp2.className = 'h-full bg-red-500';
      } else if (p2Percentage <= 50) {
        hud.hp2.className = 'h-full bg-yellow-500';
      } else {
        hud.hp2.className = 'h-full bg-blue-400';
      }
    }
    
    if (hud.timer) {
      hud.timer.textContent = String(timer);
    }
  };

  const handleGameEnd = (winner: string) => {
    setGameActive(false);
    overlayRef.current?.setResult(winner);
    overlayRef.current?.show();
    gameLoop.stopLoop();
  };

  const gameLoop = useGameLoop({
    canvas: canvasRef.current?.getCanvas() || null,
    ctx: canvasRef.current?.getContext() || null,
    players: playersRef.current || [null as any, null as any],
    keys: keys.current,
    mobileKeys: mobileKeys.current,
    isMobile,
    spriteSheet,
    spriteLoaded,
    onUpdateHUD: handleUpdateHUD,
    onGameEnd: handleGameEnd,
  });

  // Keyboard handlers
  const handleKeyDown = (e: KeyboardEvent) => {
    keys.current.add(e.key);
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }
    if (e.key.toLowerCase() === 'r') {
      resetGame();
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    keys.current.delete(e.key);
  };

  // Mobile control handler
  const handleMobileControl = (key: string, pressed: boolean) => {
    if (pressed) {
      mobileKeys.current.add(key);
    } else {
      mobileKeys.current.delete(key);
    }
  };

  // Initialize game on mount
  React.useEffect(() => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;

    // Setup canvas
    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const ctx = canvasRef.current?.getContext();
    if (!ctx) return;

    const resize = () => {
      const cssW = window.innerWidth;
      const cssH = window.innerHeight;
      canvas.width = Math.floor(cssW * DPR);
      canvas.height = Math.floor(cssH * DPR);
      canvas.style.width = cssW + 'px';
      canvas.style.height = cssH + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    window.addEventListener('resize', resize);
    resize();

    // Initialize players
    playersRef.current = initializePlayers();
    
    // Setup keyboard events (desktop only)
    if (!isMobile) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    }

    // Start game
    resetGame();

    return () => {
      window.removeEventListener('resize', resize);
      if (!isMobile) {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      }
      gameLoop.stopLoop();
    };
  }, [isMobile, isLandscape, spriteLoaded]);

  return (
    <div className="w-full h-screen bg-gray-900 relative overflow-hidden select-none">
      <HUD ref={hudRef} isMobile={isMobile} />
      <GameCanvas ref={canvasRef} isMobile={isMobile} isLandscape={isLandscape} />
      
      {isMobile && (
        <MobileControls 
          isLandscape={isLandscape} 
          onControlChange={handleMobileControl} 
        />
      )}
      
      <GameOverlay 
        ref={overlayRef} 
        isMobile={isMobile} 
        onRestart={resetGame} 
      />
      

      <style jsx>{`
        button {
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }
      `}</style>
    </div>
  );
}