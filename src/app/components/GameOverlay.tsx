'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

interface GameOverlayProps {
  isMobile: boolean;
  onRestart: () => void;
}

export interface GameOverlayRef {
  show: () => void;
  hide: () => void;
  setResult: (text: string) => void;
}

const GameOverlay = forwardRef<GameOverlayRef, GameOverlayProps>(
  ({ isMobile, onRestart }, ref) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const resultRef = useRef<HTMLHeadingElement>(null);
    const [winner, setWinner] = useState('');

    useImperativeHandle(ref, () => ({
      show: () => overlayRef.current?.classList.add('show'),
      hide: () => overlayRef.current?.classList.remove('show'),
      setResult: (text: string) => {
        if (resultRef.current) {
          resultRef.current.textContent = text;
          setWinner(text.includes('Maveli') ? 'Maveli' : 'Vamanan');
        }
      },
    }));

    // 🔥 Download dynamic watermarked image
    const handleDownload = () => {
      const link = document.createElement('a');
      link.href = '/api/'; // Dynamic API route
      link.download = 'winner.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
      <>
        <div
          ref={overlayRef}
          className="overlay fixed inset-0 z-30 bg-black bg-opacity-80 flex items-center justify-center opacity-0 pointer-events-none transition-opacity"
        >
          <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-2xl p-6 sm:p-8 text-center text-white w-[95%] max-w-lg max-h-[90vh] overflow-y-auto border-2 border-yellow-500 shadow-[0_0_30px_rgba(255,215,0,0.5)]">
            <h1
              ref={resultRef}
              className="text-3xl sm:text-4xl font-extrabold mb-6 text-yellow-400 tracking-wide drop-shadow-lg"
            ></h1>

            {winner === 'Maveli' ? (
              <>
                {/* Winner Content */}
                <div className="mb-6">
                  <Image
                    src="/winner.png"
                    alt="Winner"
                    width={500}
                    height={500}
                    className="rounded-xl border-4 border-yellow-500 shadow-lg mx-auto w-full h-auto max-h-64 sm:max-h-72 object-contain"
                  />
                </div>
                <p className="mb-6 text-base sm:text-lg text-gray-300 leading-relaxed">
                  🎉 Congratulations! You’re eligible for{' '}
                  <span className="text-yellow-400 font-semibold">
                    FREE Lokah tickets worth ₹500!
                  </span>
                  <br />
                  To enter the giveaway:
                </p>

                {/* Terms */}
                <ul className="text-left text-gray-200 mb-6 list-disc list-inside space-y-2 text-sm sm:text-base">
                  <li>
                    Click the{' '}
                    <span className="font-semibold text-yellow-400">Download</span>{' '}
                    button to get your personalized winner image.
                  </li>
                  <li>
                    Post the image as a{' '}
                    <span className="text-yellow-400 font-semibold">story</span> on
                    Instagram and tag{' '}
                    <a
                      href="https://instagram.com/ciltriqlabs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-400 font-semibold underline hover:text-yellow-300"
                    >
                      @ciltriqlabs
                    </a>.
                  </li>
                  <li>
                    Use the hashtag{' '}
                    <span className="text-yellow-400 font-semibold">#MaveliWins</span>.
                  </li>
                  <li>
                    The giveaway closes on{' '}
                    <span className="text-yellow-400 font-semibold">September 5th</span>.
                  </li>
                  <li>
                    <span className="text-yellow-400 font-semibold">Only ONE winner</span>{' '}
                    will be chosen from all eligible entries.
                  </li>
                  <li>
                    The winner will be announced on Instagram on{' '}
                    <span className="text-yellow-400 font-semibold">September 5th</span>.
                  </li>
                </ul>

                <Button
                  onClick={handleDownload}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-xl shadow-lg mb-4 w-full sm:w-auto"
                >
                  Download Image
                </Button>
              </>
            ) : winner === 'Vamanan' ? (
              <>
                {/* Losing Screen */}
                <p className="mb-6 text-lg text-red-400 font-semibold">
                  😔 Vamanan Wins! Better luck next time.
                </p>
                <p className="mb-6 text-gray-300">
                  Train harder and try again to claim victory over Maveli!
                </p>
              </>
            ) : (
              <p className="mb-6">
                {isMobile ? (
                  <span>Tap restart to play again</span>
                ) : (
                  <>
                    Press{' '}
                    <span className="bg-gray-700 px-2 py-1 rounded text-sm">R</span> to
                    restart
                  </>
                )}
              </p>
            )}

            {/* Restart Button */}
            <button
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg w-full sm:w-auto"
              onClick={onRestart}
            >
              Fight Again!
            </button>
          </div>
        </div>

        <style jsx>{`
          .overlay.show {
            opacity: 1 !important;
            pointer-events: auto !important;
          }
          @keyframes pulse {
            0%,
            100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }
          .overlay.show .bg-gradient-to-b {
            animation: pulse 0.5s ease-in-out;
          }
        `}</style>
      </>
    );
  }
);

GameOverlay.displayName = 'GameOverlay';
export default GameOverlay;
