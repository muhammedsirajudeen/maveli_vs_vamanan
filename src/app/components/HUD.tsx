'use client';
import { forwardRef, useImperativeHandle, useRef } from 'react';

interface HUDProps {
  isMobile: boolean;
}

export interface HUDRef {
  hp1: HTMLDivElement | null;
  hp2: HTMLDivElement | null;
  timer: HTMLSpanElement | null;
}

const HUD = forwardRef<HUDRef, HUDProps>(({ isMobile }, ref) => {
  const hp1Ref = useRef<HTMLDivElement>(null);
  const hp2Ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<HTMLSpanElement>(null);

  useImperativeHandle(ref, () => ({
    hp1: hp1Ref.current,
    hp2: hp2Ref.current,
    timer: timerRef.current,
  }));

  return (
    <div className={`absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-2 ${isMobile ? 'text-xs' : 'text-sm'} text-white bg-black bg-opacity-40`}>
      <div className="flex-1 mr-4">
        <div className="text-xs text-green-400 mb-1">BOT</div>
        <div className={`${isMobile ? 'h-3' : 'h-4'} bg-gray-700 rounded-full overflow-hidden border border-gray-600`}>
          <div ref={hp1Ref} className="h-full bg-green-400" style={{ width: '100%' }} />
        </div>
      </div>
      <div className={`px-4 font-bold ${isMobile ? 'text-sm' : 'text-lg'} whitespace-nowrap`}>
        <span ref={timerRef}>99</span>s
      </div>
      <div className="flex-1 ml-4">
        <div className="text-xs text-blue-400 mb-1 text-right">MAVELI</div>
        <div className={`${isMobile ? 'h-3' : 'h-4'} bg-gray-700 rounded-full overflow-hidden border border-gray-600`}>
          <div ref={hp2Ref} className="h-full bg-blue-400" style={{ width: '100%' }} />
        </div>
      </div>
    </div>
  );
});

HUD.displayName = 'HUD';
export default HUD;