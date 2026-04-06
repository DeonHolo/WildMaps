import { useState, useRef } from 'react';
import { LandmarkId, LANDMARKS } from '../types';
import { Award, Lock, CheckCircle2, Trophy, User, Edit2, Check, Star, X, Copy } from 'lucide-react';
import { playSubtleClick, playModalOpen, playCopySound } from '../utils/audio';
import { motion } from 'framer-motion';
import { AVATAR_PRESETS } from '../avatarPresets';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

interface BadgesViewProps {
  unlockedLandmarks: LandmarkId[];
  unlockTimes: Record<string, string>;
  playerName: string;
  setPlayerName: (name: string) => void;
  avatarSeed: string;
  setAvatarSeed: (seed: string) => void;
}

// Supports Dicebear seeds (legacy) and local /images/... paths (new).
const getAvatarUrl = (seed: string) => {
  if (seed.startsWith('/images/')) return encodeURI(seed);
  if (seed.includes('backgroundColor=')) {
    return `https://api.dicebear.com/9.x/bottts/svg?seed=${seed}`;
  }
  return `https://api.dicebear.com/9.x/bottts/svg?seed=${seed}&backgroundColor=FFD700`;
};

const getAvatarBgClass = (seed: string) => {
  const preset = AVATAR_PRESETS.find(p => p.src === seed);
  return preset?.bgClass ?? 'bg-gold';
};

function RankModal({ unlockedCount, totalLandmarks, getRank, isComplete, onClose }: any) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(overlayRef.current, { opacity: 0, duration: 0.3 });
    gsap.from(containerRef.current, { 
      y: 60, 
      opacity: 0, 
      scale: 0.9, 
      rotation: 2,
      duration: 0.5, 
      ease: 'back.out(1.5)' 
    });
  }, []);

  const handleClose = () => {
    playSubtleClick();
    gsap.to(containerRef.current, { 
      y: 40, 
      opacity: 0, 
      scale: 0.95, 
      rotation: -2,
      duration: 0.25, 
      ease: 'power2.in' 
    });
    gsap.to(overlayRef.current, { 
      opacity: 0, 
      duration: 0.25, 
      ease: 'power2.in', 
      onComplete: onClose 
    });
  };

  return (
    <div ref={overlayRef} className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div ref={containerRef} className="neo-brutalist-card bg-bg w-full max-w-sm flex flex-col relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="bg-maroon text-white p-3 flex justify-between items-center border-b-4 border-ink">
          <h3 className="font-bold uppercase tracking-tight text-lg flex items-center gap-2">
            <Star size={20} className="text-gold" />
            Explorer Rank
          </h3>
          <button onClick={handleClose} className="hover:bg-white/20 p-1 rounded-none transition-colors hover:rotate-90 duration-300">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="text-center">
            <p className="text-sm font-bold text-gray-500 uppercase mb-1">Current Rank</p>
            <h2 className="text-2xl font-black text-ink uppercase">{getRank(unlockedCount)}</h2>
            <p className="text-sm font-mono mt-2 bg-gold/30 inline-block px-2 py-1 border border-gold font-bold">
              {unlockedCount} / {totalLandmarks} Sectors Unlocked
            </p>
          </div>

          <div className="space-y-2 mt-2">
            {[
              { count: 0, name: 'Novice Tourist' },
              { count: 1, name: 'Adept Pathfinder' },
              { count: 2, name: 'Master Cartographer' },
              { count: 3, name: 'Grandmaster Guide' }
            ].map(rank => {
              const isCurrent = getRank(unlockedCount) === rank.name;
              const isLocked = unlockedCount < rank.count;
              return (
                <div key={rank.name} className={`p-3 border-2 flex items-center justify-between ${isCurrent ? 'bg-gold border-ink font-bold shadow-[4px_4px_0px_0px_var(--color-ink)]' : isLocked ? 'bg-gray-100 border-gray-300 text-gray-400' : 'bg-white border-ink'}`}>
                  <div className="flex items-center gap-2">
                    {isCurrent ? <Star size={16} className="text-maroon" /> : isLocked ? <Lock size={16} /> : <Check size={16} className="text-green-600" />}
                    <span className="uppercase text-sm">{rank.name}</span>
                  </div>
                  <span className="font-mono text-xs">{rank.count} Badges</span>
                </div>
              )
            })}
          </div>

          {isComplete && (
            <div className="mt-2 bg-maroon text-white p-4 text-center border-2 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h4 className="font-bold text-gold uppercase mb-1">Campus Conquered!</h4>
              <p className="text-xs">You have successfully navigated the entire campus and cleared the Fog of War. You are now ready for the semester!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AvatarModal({ avatarSeed, setAvatarSeed, onClose }: any) {
  const [tempAvatarSeed, setTempAvatarSeed] = useState(avatarSeed);
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(overlayRef.current, { opacity: 0, duration: 0.3 });
    gsap.from(containerRef.current, { 
      y: 60, 
      opacity: 0, 
      scale: 0.9, 
      rotation: -2,
      duration: 0.5, 
      ease: 'back.out(1.5)' 
    });
  }, []);

  const animateClose = (callback: () => void) => {
    gsap.to(containerRef.current, { 
      y: 40, 
      opacity: 0, 
      scale: 0.95, 
      rotation: 2,
      duration: 0.25, 
      ease: 'power2.in' 
    });
    gsap.to(overlayRef.current, { 
      opacity: 0, 
      duration: 0.25, 
      ease: 'power2.in', 
      onComplete: callback 
    });
  };

  const handleClose = () => {
    playSubtleClick();
    animateClose(onClose);
  };

  const saveAvatar = () => {
    playSubtleClick();
    setAvatarSeed(tempAvatarSeed);
    animateClose(onClose);
  };

  const selectPreset = (seed: string) => {
    playSubtleClick();
    setTempAvatarSeed(seed);
  };

  return (
    <div ref={overlayRef} className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div ref={containerRef} className="neo-brutalist-card bg-bg w-full max-w-sm flex flex-col relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="bg-ink text-white p-3 flex justify-between items-center border-b-4 border-ink">
          <h3 className="font-bold uppercase tracking-tight text-lg">Customize Avatar</h3>
          <button onClick={handleClose} className="hover:bg-white/20 p-1 rounded-none transition-colors hover:rotate-90 duration-300">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 flex flex-col gap-4">
          <div className="flex justify-center mb-2">
            <div className={`w-24 h-24 neo-brutalist overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${getAvatarBgClass(tempAvatarSeed)}`}>
              <img 
                src={getAvatarUrl(tempAvatarSeed)} 
                alt="Current Avatar" 
                className="w-full h-full object-contain p-2"
              />
            </div>
          </div>
          
          <div>
            <p className="text-xs font-bold uppercase text-gray-500 mb-2">Presets</p>
            <div className="grid grid-cols-3 gap-3 justify-items-center">
              {AVATAR_PRESETS.map(({ id, src, bgClass }) => (
                <button 
                  key={id}
                  onClick={() => selectPreset(src)}
                  className={`w-24 h-24 neo-brutalist overflow-hidden transition-transform hover:scale-105 ${tempAvatarSeed === src ? 'ring-4 ring-maroon shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : ''}`}
                >
                  <img 
                    src={getAvatarUrl(src)} 
                    alt={`${id} avatar`} 
                    className={`w-full h-full object-contain p-2 ${bgClass}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={saveAvatar}
            className="w-full neo-brutalist bg-gold hover:bg-gold-dark text-ink font-black uppercase py-3 transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] mt-2"
          >
            Save Avatar
          </button>
        </div>
      </div>
    </div>
  );
}


function BadgeDetailModal({ landmark, unlockTime, onClose }: { landmark: typeof LANDMARKS[keyof typeof LANDMARKS], unlockTime?: string, onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeImagePositionClass =
    landmark.id === 'cafe'
      ? 'object-[50%_22%]'
      : landmark.id === 'statue'
        ? 'object-[50%_15%]'
        : 'object-center';

  useGSAP(() => {
    gsap.from(overlayRef.current, { opacity: 0, duration: 0.3 });
    gsap.from(containerRef.current, {
      y: 60,
      opacity: 0,
      scale: 0.9,
      rotation: -2,
      duration: 0.5,
      ease: 'back.out(1.5)'
    });
  }, []);

  const handleClose = () => {
    playSubtleClick();
    gsap.to(containerRef.current, {
      y: 40,
      opacity: 0,
      scale: 0.95,
      rotation: 2,
      duration: 0.25,
      ease: 'power2.in'
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: onClose
    });
  };

  return (
    <div ref={overlayRef} className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div ref={containerRef} className="neo-brutalist-card bg-bg w-full max-w-sm flex flex-col relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {/* Header */}
        <div className="bg-gold text-ink p-3 flex justify-between items-center border-b-4 border-ink">
          <h3 className="font-bold uppercase tracking-tight text-lg flex items-center gap-2">
            <Award size={18} />
            {landmark.name}
          </h3>
          <button onClick={handleClose} className="hover:bg-black/10 p-1 transition-colors hover:rotate-90 duration-300">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-4 bg-white">
          {/* Image */}
          <motion.div 
            className="neo-brutalist overflow-hidden bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <img 
              src={landmark.imageUrl} 
              alt={landmark.name} 
              className={`w-full h-36 object-cover ${badgeImagePositionClass}`}
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm text-ink leading-relaxed">{landmark.description}</p>
          </motion.div>

          {/* Fun Fact */}
          <motion.div 
            className="neo-brutalist bg-gold p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <p className="text-[10px] font-bold uppercase text-ink tracking-widest">Trivia</p>
            </div>
            <p className="text-xs text-ink leading-relaxed font-bold">{landmark.funFact}</p>
          </motion.div>

          {/* Unlock Time */}
          {unlockTime && (
            <motion.div 
              className="neo-brutalist bg-white p-3 flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-8 h-8 shrink-0 bg-green-400 border-2 border-ink flex items-center justify-center">
                <CheckCircle2 size={16} className="text-ink" />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase text-gray-500">Unlocked</p>
                <p className="text-sm font-black text-ink uppercase">
                  {new Date(unlockTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </motion.div>
          )}

          {/* Close button */}
          <motion.button
            onClick={handleClose}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="w-full neo-brutalist bg-gray-200 hover:bg-gray-300 text-ink font-black uppercase py-3 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Close
          </motion.button>
        </div>
      </div>
    </div>
  );
}


export default function BadgesView({ unlockedLandmarks, unlockTimes, playerName, setPlayerName, avatarSeed, setAvatarSeed }: BadgesViewProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(playerName);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showRankModal, setShowRankModal] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<LandmarkId | null>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);

  const totalLandmarks = Object.keys(LANDMARKS).length;
  const unlockedCount = unlockedLandmarks.length;
  const progress = (unlockedCount / totalLandmarks) * 100;
  const isComplete = unlockedCount === totalLandmarks;

  const getRank = (count: number) => {
    if (count >= totalLandmarks) return 'Grandmaster Guide';
    switch (count) {
      case 0: return 'Novice Tourist';
      case 1: return 'Adept Pathfinder';
      case 2: return 'Master Cartographer';
      default: return 'Novice Tourist';
    }
  };

  const getArticle = (rank: string) => {
    return /^[AEIOU]/i.test(rank) ? 'an' : 'a';
  };

  const handleSaveName = () => {
    playCopySound();
    if (tempName.trim()) {
      setPlayerName(tempName.trim());
    } else {
      setTempName(playerName); // revert if empty
    }
    setIsEditingName(false);
    
    // Animate the name after a tick to let it re-render
    setTimeout(() => {
      if (nameRef.current) {
        gsap.fromTo(nameRef.current, 
          { scale: 1.15, color: '#800000' },
          { scale: 1, color: '#1a1a2e', duration: 0.5, ease: 'elastic.out(1.2, 0.5)' }
        );
      }
    }, 50);
  };



  const openAvatarModal = () => {
    playModalOpen();
    setShowAvatarModal(true);
  };

  return (
    <>
      <div className="absolute inset-0 p-4 overflow-y-auto">
        
        {/* Profile Section */}
        <div className="bg-white neo-brutalist-card p-5 mb-6 relative shrink-0">
          <div className="flex items-start gap-4 relative z-10">
            <button 
              onClick={openAvatarModal}
              className={`w-16 h-16 shrink-0 neo-brutalist overflow-hidden relative group cursor-pointer ${getAvatarBgClass(avatarSeed)}`}
            >
              <img 
                src={getAvatarUrl(avatarSeed)} 
                alt="Avatar" 
                className="w-full h-full object-contain p-1.5"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit2 size={20} className="text-white" />
              </div>
            </button>
            
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono uppercase text-gray-500 font-bold">Explorer ID</p>
              
              {isEditingName ? (
                <div className="flex items-center gap-2 mt-1">
                  <input 
                    type="text" 
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="neo-brutalist px-2 py-1 w-full font-bold text-lg outline-none focus:bg-gray-100"
                    autoFocus
                    maxLength={15}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  />
                  <button onClick={handleSaveName} className="neo-brutalist bg-green-400 p-1.5 shrink-0 hover:-translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <Check size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                <h2 ref={nameRef} className="text-xl font-bold truncate">{playerName}</h2>
                  <button onClick={() => setIsEditingName(true)} className="text-gray-400 hover:text-ink shrink-0 transition-colors">
                    <Edit2 size={16} />
                  </button>
                </div>
              )}

              <div className="mt-3">
                <button 
                  onClick={() => { playModalOpen(); setShowRankModal(true); }}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono bg-maroon text-white px-2 py-1 border-2 border-ink font-bold uppercase hover:bg-red-800 transition-colors cursor-pointer max-w-full"
                >
                  <Star size={14} className="text-gold shrink-0" />
                  <span className="truncate">Rank: {getRank(unlockedCount)}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-white neo-brutalist-card p-5 mb-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="text-lg font-bold uppercase tracking-tighter flex items-center min-w-0">
              <Trophy size={20} className="mr-2 text-gold shrink-0" />
              <span className="truncate">Exploration Progress</span>
            </h2>
            <div className="font-mono text-sm bg-ink text-gold px-3 py-1 font-bold whitespace-nowrap shrink-0">
              {unlockedCount} / {totalLandmarks}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-4 bg-gray-200 border-2 border-ink w-full relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-maroon transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Badges List */}
        <h3 className="font-bold uppercase text-sm text-gray-500 mb-3 px-1">Acquired Badges</h3>
        <div className="grid grid-cols-1 gap-4 pb-20">
          {Object.values(LANDMARKS).map(lm => {
            const isUnlocked = unlockedLandmarks.includes(lm.id);

            return (
              <div 
                key={lm.id}
                onClick={() => {
                  if (isUnlocked) {
                    playModalOpen();
                    setSelectedBadge(lm.id);
                  }
                }}
                className={`
                  neo-brutalist-card p-4 flex items-start transition-all
                  ${isUnlocked 
                    ? 'bg-gold text-ink border-4 border-ink shadow-[6px_6px_0px_0px_var(--color-ink)] cursor-pointer hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_var(--color-ink)] active:translate-y-0 active:shadow-[4px_4px_0px_0px_var(--color-ink)]' 
                    : 'bg-gray-100 text-gray-500 border-2 border-dashed border-gray-400 shadow-none'}
                `}
              >
                <div className={`
                  w-16 h-16 shrink-0 flex items-center justify-center mr-4 border-2
                  ${isUnlocked ? 'bg-white border-ink rounded-full' : 'bg-gray-200 border-gray-400 rounded-lg'}
                `}>
                  {isUnlocked ? (
                    <Award size={32} className="text-maroon" />
                  ) : (
                    <Lock size={32} className="text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-bold uppercase ${isUnlocked ? 'text-lg' : 'text-base'}`}>
                      {isUnlocked ? lm.name : '???'}
                    </h3>
                    {isUnlocked && <CheckCircle2 size={20} className="text-ink shrink-0 ml-2" />}
                  </div>
                  
                  <p className={`text-sm mt-1 ${isUnlocked ? 'text-ink/80' : 'text-gray-400 font-mono text-xs'}`}>
                    {isUnlocked ? lm.description : 'Sector locked. Find this location on the map and scan it to reveal.'}
                  </p>
                  
                  {isUnlocked && (
                    <div className="mt-3 inline-block bg-ink text-white text-xs font-mono px-2 py-1 uppercase">
                      {unlockTimes[lm.id] 
                        ? `Unlocked ${new Date(unlockTimes[lm.id]).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` 
                        : 'Badge Earned'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Modals */}
      {showRankModal && (
        <RankModal 
          unlockedCount={unlockedCount} 
          totalLandmarks={totalLandmarks} 
          getRank={getRank} 
          isComplete={isComplete} 
          onClose={() => setShowRankModal(false)} 
        />
      )}

      {showAvatarModal && (
        <AvatarModal 
          avatarSeed={avatarSeed} 
          setAvatarSeed={setAvatarSeed} 
          onClose={() => setShowAvatarModal(false)} 
        />
      )}

      {selectedBadge && (
        <BadgeDetailModal 
          landmark={LANDMARKS[selectedBadge]} 
          unlockTime={unlockTimes[selectedBadge]}
          onClose={() => setSelectedBadge(null)} 
        />
      )}


    </>
  );
}
