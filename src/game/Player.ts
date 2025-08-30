import type { Player, Controls } from '../types/Player';

export function createPlayer({
  x,
  color,
  face = 1,
  controls,
  isBot = false,
  isMobile = false,
  isLandscape = false,
  floorY,
}: {
  x: number;
  color: string;
  face?: number;
  controls: Controls;
  isBot?: boolean;
  isMobile?: boolean;
  isLandscape?: boolean;
  floorY: number;
}): Player {
  const playerSize = isMobile ? (isLandscape ? 45 : 50) : 60;
  const playerHeight = isMobile ? (isLandscape ? 90 : 110) : 130;
  
  return {
    x,
    y: floorY - playerHeight,
    w: playerSize,
    h: playerHeight,
    vx: 0,
    vy: 0,
    speed: isMobile ? 3.5 : 4.2,
    jump: isMobile ? 12 : 14,
    color,
    face,
    onGround: true,
    hp: 100,
    maxHp: 100,
    dead: false,
    stun: 0,
    state: 'idle',
    attack: null,
    comboLock: 0,
    controls,
    isBot,
    aiState: 'idle',
    aiTimer: 0,
    lastAction: 0,
    aggressionLevel: 0.7,
    animTime: 0,
    hitThisFrame: false,
  };
}

export function resetPlayer(
  player: Player, 
  x: number, 
  face: number, 
  floorY: number
) {
  Object.assign(player, {
    x,
    y: floorY - player.h,
    vx: 0,
    vy: 0,
    hp: 100,
    maxHp: 100,
    dead: false,
    stun: 0,
    state: 'idle',
    face,
    attack: null,
    comboLock: 0,
    aiState: 'idle',
    aiTimer: 0,
    lastAction: 0,
    animTime: 0,
    hitThisFrame: false,
  });
}