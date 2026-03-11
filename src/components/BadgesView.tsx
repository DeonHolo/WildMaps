import { useState } from 'react';
import { LandmarkId, LANDMARKS } from '../types';
import { Award, Lock, CheckCircle2, Trophy, User, Edit2, Check, Star } from 'lucide-react';

interface BadgesViewProps {
  unlockedLandmarks: LandmarkId[];
  playerName: string;
  setPlayerName: (name: string) => void;
}

export default function BadgesView({ unlockedLandmarks, playerName, setPlayerName }: BadgesViewProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(playerName);

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

  return (
    <div className="absolute inset-0 bg-bg p-4 overflow-y-auto">
      
      {/* Profile Section */}
      <div className="bg-white neo-brutalist-card p-5 mb-6 relative overflow-hidden shrink-0">
        {/* Decorative background element */}
        <div className="absolute -right-10 -top-10 text-gold opacity-20">
          <User size={120} />
        </div>

        <div className="flex items-start gap-4 relative z-10">
          <div className="w-16 h-16 shrink-0 neo-brutalist bg-gold overflow-hidden">
            <img 
              src={`https://api.dicebear.com/7.x/bottts/svg?seed=${playerName}&backgroundColor=FFD700`} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1">
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
                <button onClick={handleSaveName} className="neo-brutalist bg-green-400 p-1.5">
                  <Check size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <h2 className="text-xl font-bold uppercase truncate">{playerName}</h2>
                <button onClick={() => setIsEditingName(true)} className="text-gray-400 hover:text-ink">
                  <Edit2 size={16} />
                </button>
              </div>
            )}

            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1 text-sm font-mono bg-maroon text-white px-2 py-1 border-2 border-ink font-bold uppercase">
                <Star size={14} className="text-gold" />
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
  );
}
