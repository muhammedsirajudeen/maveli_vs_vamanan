import { useEffect, useRef, useCallback } from 'react';
import type { Player } from '../types/Player';
import { updatePlayerPhysics } from '../game/Physics';
import { updateBotAI } from '../game/AI';
import { handlePlayerInput } from '../game/Input';
import { applyAttack } from '../game/Combat';
import { drawStage, drawPlayer } from '../game/Renderer';

interface GameLoopProps {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  players: [Player, Player];
  keys: Set<string>;
  mobileKeys: Set<string>;
  isMobile: boolean;
  spriteSheet: HTMLImageElement | null;
  spriteLoaded: boolean;
  onUpdateHUD: (p1hp: number, p2hp: number, timer: number) => void;
  onGameEnd: (winner: string) => void;
}

export function useGameLoop({
  canvas,
  ctx,
  players,
  keys,
  mobileKeys,
  isMobile,
  spriteSheet,
  spriteLoaded,
  onUpdateHUD,
  onGameEnd
}: GameLoopProps) {
  const animationId = useRef<number>(0);
  const lastTick = useRef<number>(0);
  const roundTime = useRef<number>(99);
  const acc = useRef<number>(0);

  const gameLoop = useCallback((now: number) => {
    if (!canvas || !ctx) return;

    const dt = now - lastTick.current;
    lastTick.current = now;
    acc.current += dt;

    if (acc.current >= 1000) {
      acc.current -= 1000;
      if (roundTime.current > 0) roundTime.current--;
    }

    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    const FLOOR_Y = H - (isMobile ? 60 : 90);

    const [p1, p2] = players;

    // Handle input and AI
    handlePlayerInput(p1, keys, mobileKeys);
    handlePlayerInput(p2, keys, mobileKeys);
    updateBotAI(p1, p2, dt, isMobile);

    // Update physics
    updatePlayerPhysics(p1, p2, dt, W, FLOOR_Y);
    updatePlayerPhysics(p2, p1, dt, W, FLOOR_Y);

    // Apply attacks
    applyAttack(p1, p2, dt);
    applyAttack(p2, p1, dt);

    // Update HUD
    onUpdateHUD(p1.hp, p2.hp, roundTime.current);

    // Render
    ctx.clearRect(0, 0, W, H);
    drawStage(ctx, W, H, FLOOR_Y, isMobile);
    drawPlayer(ctx, p1, spriteSheet, spriteLoaded, isMobile);
    drawPlayer(ctx, p2, spriteSheet, spriteLoaded, isMobile);

    // Check win conditions
    if (p1.dead || p2.dead || roundTime.current <= 0) {
      let winner = '';
      if (roundTime.current <= 0) {
        winner = p1.hp === p2.hp ? 'Draw!' : p1.hp > p2.hp ? 'Bot Wins!' : 'Maveli Wins!';
      } else {
        winner = p1.dead ? 'Maveli Wins!' : 'Bot Wins!';
      }
      onGameEnd(winner);
      return;
    }

    animationId.current = requestAnimationFrame(gameLoop);
  }, [canvas, ctx, players, keys, mobileKeys, isMobile, spriteSheet, spriteLoaded, onUpdateHUD, onGameEnd]);

  const startLoop = useCallback(() => {
    lastTick.current = performance.now();
    roundTime.current = 99;
    acc.current = 0;
    animationId.current = requestAnimationFrame(gameLoop);
  }, [gameLoop]);

  const stopLoop = useCallback(() => {
    if (animationId.current) {
      cancelAnimationFrame(animationId.current);
    }
  }, []);

  const resetTimer = useCallback(() => {
    roundTime.current = 99;
    acc.current = 0;
  }, []);

  useEffect(() => {
    return () => {
      stopLoop();
    };
  }, [stopLoop]);

  return { startLoop, stopLoop, resetTimer };
}