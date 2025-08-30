import type { Player } from '../types/Player';
import { startAttack } from './Combat';

export function handlePlayerInput(
  p: Player, 
  keys: Set<string>, 
  mobileKeys: Set<string>
) {
  if (p.dead || p.stun > 0 || p.isBot) return;

  const allKeys = new Set([...keys, ...mobileKeys]);
  const c = p.controls;
  let moving = false;
  
  if (allKeys.has(c.left)) {
    p.vx = -p.speed;
    moving = true;
  } else if (allKeys.has(c.right)) {
    p.vx = p.speed;
    moving = true;
  } else {
    p.vx = 0;
  }

  if (allKeys.has(c.up) && p.onGround) {
    p.vy = -p.jump;
    p.onGround = false;
  }
  
  if (allKeys.has(c.punch)) startAttack(p, 'punch', false);
  if (allKeys.has(c.kick)) startAttack(p, 'kick', false);

  // Update state based on actions
  if (!p.onGround) {
    if (p.state !== 'jump' && !p.attack) p.animTime = 0;
    if (!p.attack) p.state = 'jump';
  } else if (moving && !p.attack) {
    if (p.state !== 'run') p.animTime = 0;
    p.state = 'run';
  } else if (!p.attack) {
    if (p.state !== 'idle') p.animTime = 0;
    p.state = 'idle';
  }
}