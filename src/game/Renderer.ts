import type { Player } from '../types/Player';
import { getSpriteFrame } from '../utils/gameUtils';

export function drawStage(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  FLOOR_Y: number,
  isMobile: boolean
) {
  // 🌿 Grass gradient
  const grassGradient = ctx.createLinearGradient(0, FLOOR_Y, 0, H);
  grassGradient.addColorStop(0, '#7CB342');
  grassGradient.addColorStop(0.4, '#689F38');
  grassGradient.addColorStop(0.7, '#558B2F');
  grassGradient.addColorStop(1, '#33691E');
  ctx.fillStyle = grassGradient;
  ctx.fillRect(0, FLOOR_Y, W, H - FLOOR_Y);

  // 🌸 Hardcoded flower petals
  const petals = [
    { x: 100, y: FLOOR_Y + 30, rx: 4, ry: 2, color: 'rgba(255,120,120,0.7)' },
    { x: 250, y: FLOOR_Y + 50, rx: 4, ry: 2, color: 'rgba(255,90,140,0.7)' },
    { x: 400, y: FLOOR_Y + 70, rx: 4, ry: 2, color: 'rgba(255,150,160,0.7)' },
  ];
  petals.forEach(p => {
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.rx, p.ry, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // 🍃 Hardcoded leaves
  const leaves = [
    { x: 150, y: FLOOR_Y + 60, rx: 3, ry: 6, color: 'rgba(80,180,90,0.6)' },
    { x: 320, y: FLOOR_Y + 90, rx: 3, ry: 6, color: 'rgba(60,160,80,0.6)' },
  ];
  leaves.forEach(l => {
    ctx.fillStyle = l.color;
    ctx.beginPath();
    ctx.ellipse(l.x, l.y, l.rx, l.ry, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // 🗿 Hardcoded stones
  const stones = [
    { x: 200, y: FLOOR_Y + 40, size: 8, color: 'rgba(180,150,120,0.8)' },
    { x: 350, y: FLOOR_Y + 60, size: 6, color: 'rgba(160,140,100,0.8)' },
  ];
  stones.forEach(s => {
    ctx.fillStyle = s.color;
    ctx.beginPath();
    ctx.roundRect(s.x - s.size / 2, s.y - s.size / 2, s.size, s.size, 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(s.x, s.y + s.size / 2, s.size * 0.8, s.size * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // 💧 Hardcoded puddles
  const puddles = [
    { x: 180, y: FLOOR_Y + 20, w: 30, h: 10 },
    { x: 400, y: FLOOR_Y + 50, w: 40, h: 12 },
  ];
  puddles.forEach(p => {
    ctx.fillStyle = 'rgba(135,206,235,0.6)';
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.ellipse(p.x - p.w / 4, p.y - p.h / 4, p.w / 6, p.h / 6, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // 🌿 Ground line
  ctx.strokeStyle = 'rgba(139,195,74,0.8)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, FLOOR_Y);
  ctx.lineTo(W, FLOOR_Y);
  ctx.stroke();

  // ✨ Sparkles (positions fixed, only brightness changes)
  const sparkles = [
    { x: 120, y: FLOOR_Y + 20 },
    { x: 300, y: FLOOR_Y + 40 },
    { x: 450, y: FLOOR_Y + 30 },
  ];
  if (!isMobile) {
    sparkles.forEach((s, i) => {
      const sparkleIntensity = Math.sin(Date.now() * 0.003 + i) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(255,215,0,${sparkleIntensity * 0.6})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 1, 0, Math.PI * 2);
      ctx.fill();
    });
  }
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
  const text = p.isBot ? 'VAMANAN' : 'MAVELI';
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
  const spriteFrame = getSpriteFrame(p.state, p.animTime, p.isBot)
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
