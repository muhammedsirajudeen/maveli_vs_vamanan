import type { Player } from '../types/Player';
import { getSpriteFrame } from '../utils/gameUtils';

export function drawStage(
  ctx: CanvasRenderingContext2D, 
  W: number, 
  H: number, 
  FLOOR_Y: number, 
  isMobile: boolean
) {
  // Night sky gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, H);
  gradient.addColorStop(0, '#0a0f2e');
  gradient.addColorStop(1, '#1a1f3a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);
  
  // Background buildings
  ctx.globalAlpha = 0.15;
  const buildingCount = isMobile ? 4 : 8;
  for (let i = 0; i < buildingCount; i++) {
    const bw = (isMobile ? 40 : 60) + Math.random() * (isMobile ? 60 : 100);
    const bh = (isMobile ? 40 : 60) + Math.random() * (isMobile ? 100 : 150);
    const spacing = isMobile ? 100 : 160;
    const bx = (i * spacing + (Date.now() / 40) % spacing) % (W + spacing) - spacing;
    const by = FLOOR_Y - bh;
    ctx.fillStyle = i % 2 ? '#1d255a' : '#162055';
    ctx.fillRect(bx, by, bw, bh);
  }
  ctx.globalAlpha = 1;
  
  // Floor
  ctx.fillStyle = '#0c132f';
  ctx.fillRect(0, FLOOR_Y, W, H - FLOOR_Y);
  ctx.strokeStyle = '#243074';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, FLOOR_Y + 0.5);
  ctx.lineTo(W, FLOOR_Y + 0.5);
  ctx.stroke();
}

export function drawPlayer(
  ctx: CanvasRenderingContext2D, 
  p: Player, 
  spriteSheet: HTMLImageElement | null, 
  spriteLoaded: boolean,
  isMobile: boolean
) {
  ctx.save();
  
  // Handle facing direction
  if (p.face === -1) {
    ctx.scale(-1, 1);
    ctx.translate(-p.x - p.w, 0);
  } else {
    ctx.translate(p.x, 0);
  }

  // Visual effects for different states
  if (p.hitThisFrame) {
    ctx.globalAlpha = 0.7;
  } else if (p.state === 'hurt' && p.stun > 0) {
    ctx.globalAlpha = 0.8 + Math.sin(p.animTime / 30) * 0.2;
  }

  if (spriteLoaded && spriteSheet) {
    drawSprite(ctx, p, spriteSheet);
  } else {
    drawFallbackPlayer(ctx, p, isMobile);
  }
  
  ctx.restore();
  
  // Player labels
  const fontSize = isMobile ? '8px' : '10px';
  ctx.font = `bold ${fontSize} sans-serif`;
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  const text = p.isBot ? 'BOT' : 'MAVELI';
  const textWidth = ctx.measureText(text).width;
  const textX = p.x + p.w / 2 - textWidth / 2;
  const textY = p.y - (isMobile ? 6 : 8);
  ctx.strokeText(text, textX, textY);
  ctx.fillText(text, textX, textY);

  // Attack hitbox
  if (p.attack) {
    const a = p.attack;
    ctx.strokeStyle = '#fca5a5';
    ctx.lineWidth = isMobile ? 1 : 2;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(a.x, a.y, a.w, a.h);
    ctx.setLineDash([]);
  }
  
  // State debug info (desktop only)
  if (!isMobile) {
    ctx.font = '12px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,.6)';
    const stateText = p.isBot
      ? `${p.state.toUpperCase()} [${p.aiState.toUpperCase()}]`
      : p.state.toUpperCase();
    ctx.fillText(stateText, p.x, p.y - 20);
    
    const sideText = p.isBot 
      ? `Player is ${p.face === 1 ? 'RIGHT' : 'LEFT'}`
      : `Bot is ${p.face === 1 ? 'RIGHT' : 'LEFT'}`;
    ctx.fillText(sideText, p.x, p.y - 6);
  }
}

function drawSprite(ctx: CanvasRenderingContext2D, p: Player, spriteSheet: HTMLImageElement) {
  const spriteFrame = getSpriteFrame(p.state, p.animTime);
  const spriteW = 200;
  const spriteH = 300;
  const srcX = spriteFrame.x * spriteW;
  const srcY = spriteFrame.y * spriteH;
  
  let yOffset = 0;
  if (p.state === 'hurt' && p.stun > 0) {
    yOffset = Math.sin(p.animTime / 50) * 2;
  }
  
  try {
    ctx.drawImage(
      spriteSheet,
      srcX, srcY, spriteW, spriteH,
      0, p.y + yOffset, p.w, p.h
    );
  } catch (e) {
    drawFallbackPlayer(ctx, p, false);
  }
}

function drawFallbackPlayer(ctx: CanvasRenderingContext2D, p: Player, isMobile: boolean) {
  ctx.fillStyle = p.color;
  ctx.fillRect(0, p.y, p.w, p.h);
  
  // Visor
  ctx.fillStyle = 'rgba(0,0,0,.25)';
  const visorW = isMobile ? 12 : 16;
  const visorH = isMobile ? 6 : 8;
  const vx = p.w - visorW - (isMobile ? 4 : 6);
  ctx.fillRect(vx, p.y + (isMobile ? 12 : 16), visorW, visorH);
}
