import React, { useRef, useState, useEffect } from 'react';
import GameCanvas, { GameCanvasRef } from '@/app/components/GameCanvas';
import GameOverlay, { GameOverlayRef } from '@/app/components/GameOverlay';
import HUD, { HUDRef } from '@/app/components/HUD';
import MobileControls from '@/app/components/MobileControls';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useSpriteLoader } from '@/hooks/useSpriteLoader';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { createPlayer, resetPlayer } from '@/game/Player';
import { Player } from '@/types/Player';
import TropicalLoadingScreen from '@/app/components/LoadingScreen';

export default function ResponsiveFightingGame() {
  const { isMobile, isLandscape } = useDeviceDetection();
  const { spriteLoaded: spriteLoadedMaveli, spriteSheet: spriteSheetMaveli } = useSpriteLoader("maveli");
  const { spriteLoaded: spriteLoadedVamanan, spriteSheet: spriteSheetVamanan } = useSpriteLoader("vamanan");

  const canvasRef = useRef<GameCanvasRef>(null);
  const hudRef = useRef<HUDRef>(null);
  const overlayRef = useRef<GameOverlayRef>(null);
  const keys = useRef(new Set<string>());
  const mobileKeys = useRef(new Set<string>());
  const playersRef = useRef<[Player, Player] | null>(null);

  const [gameActive, setGameActive] = useState(false);

  const gameLoop = useGameLoop({
    canvas: canvasRef.current?.getCanvas() || null,
    ctx: canvasRef.current?.getContext() || null,
    players: playersRef.current || [null as any, null as any],
    keys: keys.current,
    mobileKeys: mobileKeys.current,
    isMobile,
    spriteSheet: spriteSheetMaveli,
    spriteLoaded: spriteLoadedMaveli,
    botspriteLoaded: spriteLoadedVamanan,
    botspriteSheet: spriteSheetVamanan,
    onUpdateHUD: handleUpdateHUD,
    onGameEnd: handleGameEnd,
  });

  function handleUpdateHUD(p1hp: number, p2hp: number, timer: number) {
    const hud = hudRef.current;
    if (!hud) return;
    const setHP = (el: HTMLElement | null, hp: number, lowColor: string, midColor: string, highColor: string) => {
      if (!el) return;
      hp = Math.max(0, Math.min(100, hp));
      el.style.width = hp + '%';
      el.className = 'h-full ' + (hp <= 25 ? lowColor : hp <= 50 ? midColor : highColor);
    };
    setHP(hud.hp1, p1hp, 'bg-red-500', 'bg-yellow-500', 'bg-green-400');
    setHP(hud.hp2, p2hp, 'bg-red-500', 'bg-yellow-500', 'bg-blue-400');
    if (hud.timer) hud.timer.textContent = String(timer);
  }

  function handleGameEnd(winner: string) {
    setGameActive(false);
    overlayRef.current?.setResult(winner);
    overlayRef.current?.show();
    gameLoop.stopLoop();
  }

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

  function resetGame() {
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
  }

  useEffect(() => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;
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
    playersRef.current = initializePlayers();
    if (!isMobile) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (!isMobile) {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      }
      gameLoop.stopLoop();
    };
  }, [isMobile, isLandscape]);

  // 🔥 Wait for assets to load before starting
  useEffect(() => {
    if (gameLoop.gameReady && playersRef.current) {
      resetGame();
    }
  }, [gameLoop.gameReady]);

  function handleKeyDown(e: KeyboardEvent) {
    keys.current.add(e.key);
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
    if (e.key.toLowerCase() === 'r') resetGame();
  }

  function handleKeyUp(e: KeyboardEvent) {
    keys.current.delete(e.key);
  }

  function handleMobileControl(key: string, pressed: boolean) {
    if (pressed) mobileKeys.current.add(key);
    else mobileKeys.current.delete(key);
  }

  return (
    <div className="w-full h-screen bg-gray-900 relative overflow-hidden select-none">
      {/* HUD */}
      <HUD ref={hudRef} isMobile={isMobile} />
      {/* Canvas */}
      <GameCanvas ref={canvasRef} isMobile={isMobile} isLandscape={isLandscape} />
      {/* Mobile Controls */}
      {isMobile && (
        <MobileControls
          isLandscape={isLandscape}
          onControlChange={handleMobileControl}
        />
      )}
      {/* Overlay for round results */}
      <GameOverlay
        ref={overlayRef}
        isMobile={isMobile}
        onRestart={resetGame}
      />

      {/* 🔥 LOADING SCREEN */}
      {!gameLoop.gameReady && <TropicalLoadingScreen />}
    </div>
  );
}
