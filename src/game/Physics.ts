import type { Player } from '../types/Player';
import { clamp, rectsOverlap } from '../utils/gameUtils';

const GRAVITY = 0.7;

export function updatePlayerPhysics(
  p: Player, 
  opponent: Player, 
  dt: number, 
  W: number, 
  FLOOR_Y: number
) {
  // Determine facing direction
  p.face = p.x < opponent.x ? 1 : -1;
  
  // Update timers
  p.comboLock = Math.max(0, p.comboLock - dt);
  p.stun = Math.max(0, p.stun - dt);
  p.animTime += dt;
  p.hitThisFrame = false;

  // Apply physics
  p.vy += GRAVITY;
  p.x += p.vx;
  p.y += p.vy;
  
  // Ground collision
  if (p.y + p.h >= FLOOR_Y) {
    p.y = FLOOR_Y - p.h;
    p.vy = 0;
    p.onGround = true;
  }
  
  // Screen boundaries
  p.x = clamp(p.x, 10, W - p.w - 10);

  // Player collision
  const me = { x: p.x, y: p.y, w: p.w, h: p.h };
  const him = { x: opponent.x, y: opponent.y, w: opponent.w, h: opponent.h };
  if (rectsOverlap(me, him)) {
    const mid = (p.x + opponent.x) / 2;
    if (p.x < opponent.x) {
      p.x = Math.min(p.x, mid - p.w - 2);
      opponent.x = Math.max(opponent.x, mid + 2);
    } else {
      p.x = Math.max(p.x, mid + 2);
      opponent.x = Math.min(opponent.x, mid - opponent.w - 2);
    }
  }
  
  // Check if player is dead
  if (p.hp <= 0 && !p.dead) {
    p.dead = true;
    p.state = 'ko';
    p.animTime = 0;
  }
}