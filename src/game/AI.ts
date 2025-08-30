import type { Player } from '../types/Player';
import { startAttack } from './Combat';

export function updateBotAI(
  bot: Player,
  opponent: Player,
  dt: number,
  isMobile: boolean
) {
  if (bot.dead || bot.stun > 0) return;

  bot.aiTimer += dt;

  // ✅ Use actual sprite sizes
  const botWidth = 200;
  const botHeight = 300;
  const opponentWidth = 200;
  const opponentHeight = 300;

  // ✅ Compute centers
  const botCenterX = bot.x + botWidth / 2;
  const opponentCenterX = opponent.x + opponentWidth / 2;
  const botCenterY = bot.y + botHeight / 2;
  const opponentCenterY = opponent.y + opponentHeight / 2;

  const distX = Math.abs(botCenterX - opponentCenterX);
  const distY = Math.abs(botCenterY - opponentCenterY);

  // 🔥 Adjusted thresholds
  const horizontalRange = (botWidth + opponentWidth) * 0.25; // Attack range ~100px
  const verticalRange = (botHeight + opponentHeight) * 0.4;
  const closeRange = (botWidth + opponentWidth) * 3.0; // Start moving in earlier (~600px)

  const inRange = distX < horizontalRange && distY < verticalRange;
  const opponentOnRight = opponentCenterX > botCenterX;

  console.log({
    distX,
    distY,
    horizontalRange,
    verticalRange,
    inRange,
    closeRange,
  });

  switch (bot.aiState) {
    case 'idle':
      if (bot.aiTimer > 200 + Math.random() * 300) {
        if (inRange && Math.random() < bot.aggressionLevel) {
          bot.aiState = 'attack';
        } else if (distX < closeRange) {
          bot.aiState = Math.random() < 0.25 ? 'retreat' : 'chase';
        } else {
          bot.aiState = 'chase';
        }
        bot.aiTimer = 0;
      }
      break;

    case 'chase':
      // Move in aggressively
      bot.vx = opponentOnRight ? bot.speed * 0.9 : -bot.speed * 0.9;
      bot.state = 'run';
      if ((opponent.y < bot.y - 30 || Math.random() < 0.02) && bot.onGround) {
        bot.vy = -bot.jump;
        bot.onGround = false;
        bot.aiState = 'jump_attack';
      }
      if (inRange) bot.aiState = 'attack';
      else if (bot.aiTimer > 800 + Math.random() * 400) bot.aiState = 'idle';
      break;

    case 'attack':
      // Slight nudge forward if not quite in range
      if (distX > horizontalRange * 0.8) {
        bot.vx = opponentOnRight ? bot.speed * 0.4 : -bot.speed * 0.4;
      } else {
        bot.vx = 0;
      }

      if (bot.comboLock === 0) {
        startAttack(bot, Math.random() < 0.6 ? 'punch' : 'kick', isMobile);
      }

      if (bot.aiTimer > 300 + Math.random() * 200) {
        bot.aiState = Math.random() < 0.4 ? 'retreat' : 'idle';
      }
      break;

    case 'retreat':
      bot.vx = opponentOnRight ? -bot.speed : bot.speed;
      bot.state = 'run';
      if (bot.aiTimer > 400 + Math.random() * 300) bot.aiState = 'idle';
      break;

    case 'jump_attack':
      bot.vx = opponentOnRight ? bot.speed * 0.5 : -bot.speed * 0.5;
      if (inRange && bot.comboLock === 0 && Math.random() < 0.7) {
        startAttack(bot, 'kick', isMobile);
      }
      if (bot.onGround) bot.aiState = 'idle';
      break;
  }
}
