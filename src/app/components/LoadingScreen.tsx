import React, { useState, useEffect } from 'react';

const TropicalLoadingScreen = ({ isVisible = true }) => {
  const [isClient, setIsClient] = useState(false);
  
  // Fixed particle positions to prevent hydration mismatch
  const particles = [
    { left: '10%', top: '20%', delay: '0s', duration: '2s' },
    { left: '80%', top: '15%', delay: '0.3s', duration: '2.5s' },
    { left: '25%', top: '70%', delay: '0.6s', duration: '2.2s' },
    { left: '90%', top: '60%', delay: '0.9s', duration: '2.8s' },
    { left: '5%', top: '80%', delay: '1.2s', duration: '2.1s' },
    { left: '70%', top: '30%', delay: '1.5s', duration: '2.7s' },
    { left: '45%', top: '10%', delay: '1.8s', duration: '2.4s' },
    { left: '15%', top: '50%', delay: '2.1s', duration: '2.6s' },
    { left: '85%', top: '85%', delay: '2.4s', duration: '2.3s' },
    { left: '35%', top: '90%', delay: '2.7s', duration: '2.9s' },
    { left: '60%', top: '5%', delay: '3.0s', duration: '2.0s' },
    { left: '95%', top: '40%', delay: '0.15s', duration: '2.45s' }
  ];

  // Fixed dot positions for the loading circle
  const loadingDots = [
    { left: '50%', top: '10%' },
    { left: '78.54%', top: '21.46%' },
    { left: '89.64%', top: '50%' },
    { left: '78.54%', top: '78.54%' },
    { left: '50%', top: '89.64%' },
    { left: '21.46%', top: '78.54%' },
    { left: '10.36%', top: '50%' },
    { left: '21.46%', top: '21.46%' }
  ];

  // Fixed bar heights for bottom decoration
  const decorativeBars = [24, 38, 31, 45, 28];

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-orange-800 to-red-900 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400/30 rounded-full animate-bounce"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
              animationDuration: particle.duration
            }}
          />
        ))}
      </div>

      {/* Palm Leaf Decorations */}
      <div className="absolute top-10 left-10 w-16 h-24 opacity-20">
        <div className="w-full h-full bg-green-600 rounded-full transform rotate-45 animate-pulse"></div>
      </div>
      <div className="absolute top-20 right-16 w-12 h-20 opacity-15">
        <div className="w-full h-full bg-green-500 rounded-full transform -rotate-12 animate-pulse"></div>
      </div>
      <div className="absolute bottom-16 left-20 w-14 h-22 opacity-25">
        <div className="w-full h-full bg-green-700 rounded-full transform rotate-12 animate-pulse"></div>
      </div>

      {/* Central Temple Icon */}
      <div className="relative mb-8 animate-pulse">
        <div className="w-24 h-24 bg-gradient-to-b from-yellow-400 to-orange-600 rounded-lg shadow-2xl transform rotate-45 animate-spin-slow">
          <div className="absolute inset-2 bg-gradient-to-b from-orange-300 to-red-500 rounded transform -rotate-45">
            <div className="absolute inset-1 bg-gradient-to-b from-yellow-200 to-orange-400 rounded flex items-center justify-center">
              <div className="w-8 h-8 bg-orange-800 rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* Temple Spires */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-500 animate-bounce"></div>
        </div>
        <div className="absolute -top-4 left-2 transform">
          <div className="w-0 h-0 border-l-2 border-r-2 border-b-6 border-l-transparent border-r-transparent border-b-orange-500 animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
        <div className="absolute -top-4 right-2 transform">
          <div className="w-0 h-0 border-l-2 border-r-2 border-b-6 border-l-transparent border-r-transparent border-b-orange-500 animate-bounce" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>

      {/* Game Title */}
      <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 mb-4 animate-pulse font-serif tracking-wider drop-shadow-2xl">
        VAMANAN
      </h1>

      {/* Subtitle */}
      <p className="text-xl text-yellow-200 mb-12 opacity-80 font-light tracking-wide">
        Ancient Temples Await
      </p>

      {/* Enhanced Loading Animation */}
      <div className="relative">
        {/* Outer Ring */}
        <div className="w-32 h-32 border-4 border-yellow-400/20 rounded-full animate-spin-slow">
          <div className="absolute top-0 left-1/2 w-4 h-4 bg-yellow-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        </div>
        
        {/* Inner Ring */}
        <div className="absolute inset-4 border-4 border-orange-500/30 rounded-full animate-spin-reverse">
          <div className="absolute top-0 left-1/2 w-3 h-3 bg-orange-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Center Orb */}
        <div className="absolute inset-8 bg-gradient-to-br from-yellow-400 to-red-600 rounded-full animate-pulse shadow-xl">
          <div className="absolute inset-2 bg-gradient-to-br from-yellow-200 to-orange-400 rounded-full animate-ping opacity-75"></div>
        </div>

        {/* Floating Dots Around */}
        <div className="absolute inset-0">
          {loadingDots.map((dot, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-yellow-400 rounded-full animate-bounce"
              style={{
                left: dot.left,
                top: dot.top,
                animationDelay: `${i * 0.1}s`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </div>
      </div>

      {/* Loading Text */}
      <div className="mt-12 text-center">
        <p className="text-2xl text-yellow-200 font-light tracking-widest animate-pulse">
          LOADING
        </p>
        <div className="flex justify-center mt-4 space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      {/* Bottom Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent">
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
          {decorativeBars.map((height, i) => (
            <div
              key={i}
              className="w-1 bg-yellow-400/40 animate-pulse"
              style={{
                height: `${height}px`,
                animationDelay: `${i * 0.3}s`
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default TropicalLoadingScreen;