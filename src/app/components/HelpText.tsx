// 'use client';

// interface HelpTextProps {
//   isMobile: boolean;
//   isLandscape: boolean;
// }

// export default function HelpText({ isMobile, isLandscape }: HelpTextProps) {
//   return (
//     <div className={`absolute ${isMobile ? 'top-20 left-2 right-2' : 'bottom-4 left-4'} z-10 text-white text-xs bg-black bg-opacity-60 rounded-lg p-3 ${isMobile ? 'text-center' : ''} border border-yellow-600`}>
//       {isMobile ? (
//         <div>
//           <div className="flex justify-center items-center space-x-2 mb-1">
//             <span className="text-green-400 font-bold">🤖 BOT</span>
//             <span className="text-yellow-400">vs</span>
//             <span className="text-blue-400 font-bold">👑 MAVELI</span>
//           </div>
//           <div className="text-xs opacity-75">Both fighters use Maveli sprites!</div>
//         </div>
//       ) : (
//         <div className="space-y-1">
//           <div className="flex items-center space-x-2">
//             <span className="text-green-400 font-bold">🤖 BOT</span>
//             <span className="text-yellow-400">vs</span>
//             <span className="text-blue-400 font-bold">👑 MAVELI</span>
//           </div>
//           <div>
//             <strong className="text-blue-400">CONTROLS:</strong> Move ←/→, Jump ↑, Punch /, Kick .
//           </div>
//           <div className="text-xs opacity-75">Press R to restart • Both fighters use Maveli sprites!</div>
//         </div>
//       )}
//     </div>
//   );
// }