export interface Attack {
  x: number;
  y: number;
  w: number;
  h: number;
  dmg: number;
  knock: number;
  ttl: number;
  hasHit: boolean;
}

export interface Controls {
  left: string;
  right: string;
  up: string;
  punch: string;
  kick: string;
}

export interface Player {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  speed: number;
  jump: number;
  color: string;
  face: number;
  onGround: boolean;
  hp: number;
  maxHp: number;
  dead: boolean;
  stun: number;
  state: string;
  attack: Attack | null;
  comboLock: number;
  controls: Controls;
  isBot: boolean;
  aiState: string;
  aiTimer: number;
  lastAction: number;
  aggressionLevel: number;
  animTime: number;
  hitThisFrame: boolean;
}