export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export const rectsOverlap = (a: any, b: any) =>
  a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

export const getSpriteFrame = (state: string, time: number) => {
  const frameTime = 200; // ms per frame
  const frame = Math.floor(time / frameTime);
  
  switch (state) {
    case 'idle':
      return { x: 0, y: 0, frame: frame % 1 };
    case 'run':
      return { x: 0, y: 0, frame: frame % 1 };
    case 'jump':
      return { x: 0, y: 0, frame: frame % 1 };
    case 'punch':
      return { x: 2.4, y: 0, frame: frame % 1 };
    case 'kick':
      return { x: 5.2, y: 0, frame: frame % 1 };
    case 'hurt':
    case 'ko':
      return { x: 0, y: 0, frame: 0 };
    default:
      return { x: 0, y: 0, frame: 0 };
  }
};