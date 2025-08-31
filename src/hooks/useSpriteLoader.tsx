import { useState, useEffect, useRef } from 'react';

export function useSpriteLoader(characterName:string) {
  const [spriteLoaded, setSpriteLoaded] = useState(false);
  const spriteSheet = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      spriteSheet.current = img;
      setSpriteLoaded(true);
    };
    img.onerror = () => {
      console.warn('Could not load spritesheet_maveli.png, using fallback rendering');
      setSpriteLoaded(false);
    };
    if(characterName==="maveli"){
      img.src = 'spritesheet_maveli.png';
    }else{
      img.src='spritesheet_vamanan.png'
    }
  }, []);

  return { spriteLoaded, spriteSheet: spriteSheet.current };
}