import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LandmarkId, LANDMARKS } from '../types';
import { MapPin, Lock, Unlock, X, Camera } from 'lucide-react';

interface MapViewProps {
  unlockedLandmarks: LandmarkId[];
  justUnlocked: LandmarkId | null;
  onSelectLandmark: (id: LandmarkId) => void;
}

const SECTOR_PATHS: Record<LandmarkId, string> = {
  cafe: "M -200,-200 L 1200,-200 L 1200,450 C 900,300 700,600 500,550 C 300,500 100,100 -200,100 Z",
  library: "M -200,100 C 100,100 300,500 500,550 C 400,800 600,900 400,1200 L -200,1200 Z",
  statue: "M 500,550 C 700,600 900,300 1200,450 L 1200,1200 L 400,1200 C 600,900 400,800 500,550 Z"
};

export default function MapView({ unlockedLandmarks, justUnlocked, onSelectLandmark }: MapViewProps) {
  const [activeHint, setActiveHint] = useState<LandmarkId | null>(null);

  const handleNodeClick = (id: LandmarkId) => {
    setActiveHint(id);
  };

  const handleProceedToScan = () => {
    if (activeHint) {
      onSelectLandmark(activeHint);
      setActiveHint(null);
    }
  };

  return (
    <div className="absolute inset-0 p-4 flex flex-col">
      <div className="bg-white neo-brutalist-card p-4 mb-4 z-10">
        <h2 className="text-xl font-bold uppercase mb-1">Campus Map</h2>
        <p className="text-sm text-gray-600">Explore the campus and find the hidden landmarks to clear the fog of war.</p>
      </div>

      <div className="flex-1 relative neo-brutalist-card bg-[#d1d5db] overflow-hidden">
        {/* Placeholder Map Background */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(#111 2px, transparent 2px)',
          backgroundSize: '20px 20px'
        }}></div>

        {/* Simulated Paths */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" preserveAspectRatio="none">
          <path d="M 20% 30% L 70% 20% L 80% 70% L 30% 80% Z" fill="none" stroke="black" strokeWidth="4" strokeDasharray="8 8" />
          <path d="M 20% 30% L 80% 70%" fill="none" stroke="black" strokeWidth="4" strokeDasharray="8 8" />
        </svg>

        {/* Fog of War Overlay */}
        <AnimatePresence>
          {unlockedLandmarks.length < 3 && (
            <motion.div 
              className="absolute inset-0 pointer-events-none z-10"
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
            >
              <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <filter id="fog-noise" x="-20%" y="-20%" width="140%" height="140%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="4" result="noise" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.8  0 0 0 0 0.8  0 0 0 0 0.8  1.5 0 0 0 -0.2" in="noise" />
                  </filter>
                  <mask id="fog-mask">
                    <rect width="100%" height="100%" fill="white" />
                    {unlockedLandmarks.map(id => (
                      <motion.path 
                        key={id} 
                        d={SECTOR_PATHS[id]} 
                        initial={id === justUnlocked ? { opacity: 0 } : false}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        fill="black" 
                        stroke="black"
                        strokeWidth="150"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        filter="blur(40px)"
                      />
                    ))}
                  </mask>
                </defs>
                <g mask="url(#fog-mask)">
                  <rect width="100%" height="100%" fill="rgba(17,17,17,0.9)" />
                  <rect width="100%" height="100%" fill="white" filter="url(#fog-noise)" opacity="0.5" />
                </g>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Landmarks */}
        {Object.values(LANDMARKS).map(lm => {
          const isUnlocked = unlockedLandmarks.includes(lm.id);
          
          return (
            <button
              key={lm.id}
              onClick={() => handleNodeClick(lm.id)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 group"
              style={{ left: `${lm.x}%`, top: `${lm.y}%` }}
            >
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center neo-brutalist
                ${isUnlocked ? 'bg-gold text-ink' : 'bg-gray-800 text-white'}
                group-hover:scale-110 transition-transform
              `}>
                {isUnlocked ? <Unlock size={20} /> : <Lock size={20} />}
              </div>
              <div className={`
                mt-2 px-2 py-1 text-xs font-bold uppercase neo-brutalist text-center
                ${isUnlocked ? 'bg-white text-ink max-w-[140px]' : 'bg-gray-800 text-white whitespace-nowrap'}
              `}>
                {isUnlocked ? lm.name : 'Unknown Sector'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Hint Modal */}
      {activeHint && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
          <div className="neo-brutalist-card bg-bg w-full max-w-sm flex flex-col relative animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-maroon text-white p-3 flex justify-between items-center border-b-4 border-ink">
              <h3 className="font-bold uppercase tracking-tight text-lg">
                {unlockedLandmarks.includes(activeHint) ? 'Sector Unlocked' : 'Quest Node'}
              </h3>
              <button onClick={() => setActiveHint(null)} className="hover:bg-white/20 p-1 rounded-none transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-4">
              {/* Building Image */}
              <div className="neo-brutalist overflow-hidden bg-white">
                <img 
                  src={LANDMARKS[activeHint].imageUrl} 
                  alt="Location hint" 
                  className="w-full h-32 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Character & Dialogue */}
              <div className="flex items-end gap-5 mt-2">
                {/* Character Avatar */}
                <motion.div 
                  className="w-16 h-16 shrink-0 neo-brutalist bg-gold overflow-hidden"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                >
                  <img 
                    src="https://api.dicebear.com/9.x/bottts/svg?seed=Guide&backgroundColor=FFD700" 
                    alt="Guide Character" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>

                {/* Speech Bubble */}
                <div className="flex-1 neo-brutalist bg-white p-3 relative">
                  {/* Triangle pointer */}
                  <div className="absolute -left-[10px] bottom-4 w-4 h-4 bg-white border-l-[3px] border-b-[3px] border-ink transform rotate-45"></div>
                  
                  <p className="text-sm font-bold leading-tight relative z-10">
                    {unlockedLandmarks.includes(activeHint) 
                      ? "Great job! You've already mapped this sector." 
                      : LANDMARKS[activeHint].hint}
                  </p>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="p-4 pt-0">
              {!unlockedLandmarks.includes(activeHint) ? (
                <button 
                  onClick={handleProceedToScan}
                  className="w-full neo-brutalist bg-gold hover:bg-gold-dark text-ink font-bold uppercase py-3 flex items-center justify-center gap-2 transition-colors"
                >
                  <Camera size={20} />
                  Scan to Unlock
                </button>
              ) : (
                <button 
                  onClick={() => setActiveHint(null)}
                  className="w-full neo-brutalist bg-gray-200 hover:bg-gray-300 text-ink font-bold uppercase py-3 transition-colors"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
