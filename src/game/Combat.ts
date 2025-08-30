import type { Player } from '../types/Player';
import { rectsOverlap } from '../utils/gameUtils';

export function startAttack(p: Player, type: string, isMobile: boolean) {
  if (p.comboLock > 0 || p.stun > 0 || p.dead) return;
  
  const short = type === 'punch';
  const baseReach = short ? 38 : 64;
  const baseHeight = short ? 26 : 34;
  const reach = isMobile ? baseReach * 0.8 : baseReach;
  const height = isMobile ? baseHeight * 0.8 : baseHeight;
  const dmg = short ? 8 : 12;
  const knock = short ? 6 : 10;
  const ttl = short ? 120 : 160;
  const ox = p.face === 1 ? p.w : -reach;
  
  p.attack = { 
    x: p.x + ox, 
    y: p.y + 20, 
    w: reach, 
    h: height, 
    dmg, 
    knock, 
    ttl, 
    hasHit: false 
  };
  p.state = type;
  p.comboLock = short ? 160 : 260;
  p.animTime = 0;
}

export function applyAttack(attacker: Player, defender: Player, dt: number) {
  if (!attacker.attack) return;
  
  const a = attacker.attack;
  a.ttl -= dt;
  
  if (a.ttl <= 0) {
    attacker.attack = null;
    attacker.state = attacker.onGround ? 'idle' : 'jump';
    attacker.animTime = 0;
    return;
  }
  
  const ox = attacker.face === 1 ? attacker.w : -a.w;
  a.x = attacker.x + ox;
  a.y = attacker.y + 20;
  
  if (!a.hasHit && rectsOverlap(
    { x: a.x, y: a.y, w: a.w, h: a.h },
    { x: defender.x, y: defender.y, w: defender.w, h: defender.h }
  )) {
    defender.hp = Math.max(0, defender.hp - a.dmg);
    defender.stun = 180;
    defender.state = defender.hp <= 0 ? 'ko' : 'hurt';
    defender.vx = attacker.face * a.knock;
    defender.vy = defender.onGround ? -4 : defender.vy - 2;
    defender.animTime = 0;
    defender.hitThisFrame = true;
    a.hasHit = true;
    
    if (defender.hp <= 0) {
      defender.dead = true;
    }
  }
}