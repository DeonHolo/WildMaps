import { useState } from 'react';
import { LandmarkId, LANDMARKS } from '../types';
import { Award, Lock, CheckCircle2, Trophy, User, Edit2, Check, Star, X, RotateCcw } from 'lucide-react';

interface BadgesViewProps {
  unlockedLandmarks: LandmarkId[];
  playerName: string;
  setPlayerName: (name: string) => void;
  avatarSeed: string;
  setAvatarSeed: (seed: string) => void;
}

const PRESET_AVATARS = [
  'Felix&backgroundColor=b6e3f4',
  'Aneka&backgroundColor=c0aede',
  'Jasper&backgroundColor=d1d4f9',
  'Brian&backgroundColor=ffd5dc',
  'Ginger&backgroundColor=ffdfbf',
  'Midnight&backgroundColor=c2e9c6'
];

export default function BadgesView({ unlockedLandmarks, playerName, setPlayerName, avatarSeed, setAvatarSeed }: BadgesViewProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(playerName);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [tempAvatarSeed, setTempAvatarSeed] = useState(avatarSeed);

  const totalLandmarks = Object.keys(LANDMARKS).length;
  const unlockedCount = unlockedLandmarks.length;
  const progress = (unlockedCount / totalLandmarks) * 100;
  const isComplete = unlockedCount === totalLandmarks;

  const getRank = (count: number) => {
    if (count >= 3) return 'Grandmaster Guide';
    switch (count) {
      case 0: return 'Novice Tourist';
      case 1: return 'Adept Pathfinder';
      case 2: return 'Master Cartographer';
      default: return 'Novice Tourist';
    }
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      setPlayerName(tempName.trim());
    } else {
      setTempName(playerName); // revert if empty
    }
    setIsEditingName(false);
  };

  // Helper to ensure old seeds without background colors still get a default gold background
  const getAvatarUrl = (seed: string) => {
    if (seed.includes('backgroundColor=')) {
      return `https://api.dicebear.com/9.x/bottts/svg?seed=${seed}`;
    }
    return `https://api.dicebear.com/9.x/bottts/svg?seed=${seed}&backgroundColor=FFD700`;
  };

  return (
    <>
      <div className="absolute inset-0 p-4 overflow-y-auto">
        
        {/* Profile Section */}
        <div className="bg-white neo-brutalist-card p-5 mb-6 relative shrink-0">
          <div className="flex items-start gap-4 relative z-10">
            <button 
              onClick={() => { setTempAvatarSeed(avatarSeed); setShowAvatarModal(true); }}
              className="w-16 h-16 shrink-0 neo-brutalist bg-gold overflow-hidden relative group cursor-pointer"
            >
              <img 
                src={getAvatarUrl(avatarSeed)} 
                alt="Avatar" 
                className="w-full h-full object-cover"
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
                  <button onClick={handleSaveName} className="neo-brutalist bg-green-400 p-1.5 shrink-0">
                    <Check size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <h2 className="text-xl font-bold truncate">{playerName}</h2>
                  <button onClick={() => setIsEditingName(true)} className="text-gray-400 hover:text-ink shrink-0">
                    <Edit2 size={16} />
                  </button>
                </div>
              )}

              <div className="mt-3">
                <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono bg-maroon text-white px-2 py-1 border-2 border-ink font-bold uppercase whitespace-nowrap">
                  <Star size={14} className="text-gold shrink-0" />
                  Rank: {getRank(unlockedCount)}
                </div>
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
                className={`
                  neo-brutalist-card p-4 flex items-start transition-all
                  ${isUnlocked ? 'bg-gold text-ink border-4 border-ink shadow-[6px_6px_0px_0px_var(--color-ink)]' : 'bg-gray-100 text-gray-500 border-2 border-dashed border-gray-400 shadow-none'}
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
                      Badge Earned
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {isComplete && (
          <div className="mt-6 bg-maroon text-white neo-brutalist-card p-6 text-center animate-in slide-in-from-bottom-4 duration-500 mb-20">
            <h2 className="text-2xl font-bold uppercase mb-2 text-gold">Grandmaster Guide!</h2>
            <p className="text-sm">You have successfully navigated the entire campus and cleared the Fog of War. You are now ready for the semester!</p>
          </div>
        )}
      </div>

      {/* Avatar Customization Modal */}
      {showAvatarModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
          <div className="neo-brutalist-card bg-bg w-full max-w-sm flex flex-col relative animate-in zoom-in-95 duration-200">
            <div className="bg-ink text-white p-3 flex justify-between items-center border-b-4 border-ink">
              <h3 className="font-bold uppercase tracking-tight text-lg">Customize Avatar</h3>
              <button onClick={() => setShowAvatarModal(false)} className="hover:bg-white/20 p-1 rounded-none transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 flex flex-col gap-4">
              <div className="flex justify-center mb-2">
                <div className="w-24 h-24 neo-brutalist bg-gold overflow-hidden">
                  <img 
                    src={getAvatarUrl(tempAvatarSeed)} 
                    alt="Current Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div>
                <p className="text-xs font-bold uppercase text-gray-500 mb-2">Presets</p>
                <div className="grid grid-cols-3 gap-3">
                  {PRESET_AVATARS.map(seed => (
                    <button 
                      key={seed}
                      onClick={() => setTempAvatarSeed(seed)}
                      className={`aspect-square neo-brutalist overflow-hidden ${tempAvatarSeed === seed ? 'border-4 border-maroon' : 'border-2 border-ink'}`}
                    >
                      <img 
                        src={getAvatarUrl(seed)} 
                        alt={seed} 
                        className="w-full h-full object-cover bg-gold"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => {
                  const randomColors = ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf', 'c2e9c6', 'FFD700', 'ffb3ba', 'baffc9', 'bae1ff'];
                  const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
                  setTempAvatarSeed(`random-${Math.floor(Math.random() * 100000)}&backgroundColor=${randomColor}`);
                }}
                className="w-full neo-brutalist bg-white hover:bg-gray-100 text-ink font-bold uppercase py-2 flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw size={16} />
                Generate Random
              </button>

              <button 
                onClick={() => {
                  setAvatarSeed(tempAvatarSeed);
                  setShowAvatarModal(false);
                }}
                className="w-full neo-brutalist bg-gold hover:bg-gold-dark text-ink font-bold uppercase py-3 transition-colors mt-2"
              >
                Save Avatar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
