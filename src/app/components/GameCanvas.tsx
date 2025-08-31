'use client';
import { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';

interface GameCanvasProps {
  isMobile: boolean;
  isLandscape: boolean;
}

export interface GameCanvasRef {
  getCanvas: () => HTMLCanvasElement | null;
  getContext: () => CanvasRenderingContext2D | null;
}

const GameCanvas = forwardRef<GameCanvasRef, GameCanvasProps>(({ isMobile, isLandscape }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current,
    getContext: () => canvasRef.current?.getContext('2d') || null,
  }));


  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full block"
      style={{ touchAction: 'none', imageRendering: 'pixelated' }}
    />
  );
});

GameCanvas.displayName = 'GameCanvas';
export default GameCanvas;