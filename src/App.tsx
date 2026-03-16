import { useState, useEffect, useRef } from 'react';
import { Map, Camera, UserCircle, Settings, Trophy, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { LandmarkId, LANDMARKS } from './types';
import MapView from './components/MapView';
import ScanView from './components/ScanView';
import BadgesView from './components/BadgesView';
import SettingsModal from './components/SettingsModal';
import OnboardingModal from './components/OnboardingModal';
import { playSubtleClick, playModalOpen, playSuccessChime, playGrandSuccessChime } from './utils/audio';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

type View = 'map' | 'scan' | 'profile';
type ChangeViewOptions = {
  playSound?: boolean;
};

function AchievementModal({ landmark, onClose, width, height }: any) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(overlayRef.current, { opacity: 0, duration: 0.3 });
    gsap.from(containerRef.current, { 
      y: 60, 
      opacity: 0, 
      scale: 0.85, 
      rotation: -3,
      duration: 0.6, 
      ease: 'back.out(1.5)' 
    });
  }, []);

  const handleClose = () => {
    playSubtleClick();
    gsap.to(containerRef.current, { y: 40, opacity: 0, scale: 0.9, rotation: 2, duration: 0.25, ease: 'power2.in' });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.25, ease: 'power2.in', onComplete: onClose });
  };

  return (
    <div ref={overlayRef} className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <Confetti width={width} height={height} recycle={false} numberOfPieces={500} gravity={0.8} initialVelocityY={40} />
      <div ref={containerRef} className="neo-brutalist-card bg-bg w-full max-w-sm flex flex-col relative text-center p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="mb-4">
          <h2 className="inline-block text-3xl font-black uppercase text-ink bg-gold px-4 py-2 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-2 transform">
            Sector Unlocked!
          </h2>
        </div>
        <p className="text-gray-800 font-bold mb-6 text-lg">You've successfully mapped {landmark.name}.</p>
        <div className="w-full h-40 mx-auto mb-6 neo-brutalist bg-white flex items-center justify-center overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <img src={landmark.imageUrl} alt="Unlocked" className="w-full h-full object-cover" />
        </div>
        <button 
          onClick={handleClose}
          className="w-full neo-brutalist bg-gold hover:bg-gold-dark text-ink font-black uppercase py-3 transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] text-xl"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}

function MapClearedModal({ onClose, width, height, playerName, totalLandmarks }: any) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(overlayRef.current, { opacity: 0, duration: 0.3 });
    gsap.from(containerRef.current, {
      y: 60, 
      opacity: 0, 
      scale: 0.85, 
      rotation: 3,
      duration: 0.6, 
      ease: 'back.out(1.5)' 
    });
    
    gsap.to(characterRef.current, {
      y: -6,
      duration: 1.5,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });
  }, []);

  const handleClose = () => {
    playSubtleClick();
    gsap.to(containerRef.current, { y: 40, opacity: 0, scale: 0.9, rotation: -2, duration: 0.25, ease: 'power2.in' });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.25, ease: 'power2.in', onComplete: onClose });
  };

  return (
    <div ref={overlayRef} className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <Confetti width={width} height={height} recycle={true} numberOfPieces={280} gravity={0.45} initialVelocityY={32} />
      <div ref={containerRef} className="neo-brutalist-card bg-bg w-full max-w-sm flex flex-col relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-h-[90vh] overflow-hidden">
        {/* Header with close button */}
        <div className="bg-gold text-ink p-3 flex justify-between items-center border-b-4 border-ink shrink-0">
          <h3 className="font-bold uppercase tracking-tight text-lg flex items-center gap-2">
            <Trophy size={18} />
            Mission Complete
          </h3>
          <button onClick={handleClose} className="hover:bg-black/10 p-1 transition-colors hover:rotate-90 duration-300">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4 overflow-y-auto text-center">
          <div>
            <h2 className="inline-block text-3xl font-black uppercase text-ink bg-gold px-4 py-2 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-2 transform">
              Campus Cleared!
            </h2>
          </div>

          <p className="text-gray-800 font-bold text-base leading-snug">
            <span className="bg-gold/50 px-1.5 py-0.5">{playerName}</span> uncovered every hidden sector and lifted the fog of war.
            You are now the campus <span className="text-maroon">Grandmaster Guide</span>.
          </p>

          <div className="flex flex-col gap-2 text-left">
            <div className="grid grid-cols-2 gap-2">
              <div className="neo-brutalist bg-white p-2.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-[10px] font-mono uppercase text-gray-500 mb-1">Progress</p>
                <p className="text-lg font-black text-maroon">100%</p>
              </div>
              <div className="neo-brutalist bg-white p-2.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-[10px] font-mono uppercase text-gray-500 mb-1">Unlocked</p>
                <p className="text-lg font-black text-maroon">{totalLandmarks}/{totalLandmarks}</p>
              </div>
            </div>
            <div className="neo-brutalist bg-white p-2.5 flex items-center justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-[10px] font-mono uppercase text-gray-500">Rank</p>
              <p className="text-sm font-black uppercase text-maroon">Grandmaster Guide</p>
            </div>
          </div>

          <div
            ref={characterRef}
            className="w-full aspect-video neo-brutalist bg-white overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <img src="https://api.dicebear.com/9.x/bottts/svg?seed=Guide&backgroundColor=FFD700" alt="Guide" className="w-full h-full object-cover" />
          </div>

          <p className="text-sm font-bold text-ink leading-relaxed text-left">
            Every landmark is now unlocked, every badge is claimed, and the full campus map is yours to explore without limits.
          </p>

          <button 
            onClick={handleClose}
            className="w-full neo-brutalist bg-gold hover:bg-gold-dark text-ink font-black uppercase py-3 transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] text-lg"
          >
            View Full Map
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>('map');
  const [direction, setDirection] = useState(0);
  const [unlockedLandmarks, setUnlockedLandmarks] = useState<LandmarkId[]>([]);
  const [targetLandmark, setTargetLandmark] = useState<LandmarkId | null>(null);
  const [justUnlocked, setJustUnlocked] = useState<LandmarkId | null>(null);
  const [showAchievementModal, setShowAchievementModal] = useState<LandmarkId | null>(null);
  const [showAllUnlockedModal, setShowAllUnlockedModal] = useState(false);
  const { width, height } = useWindowSize();
  
  // Profile & Settings State
  const [playerName, setPlayerName] = useState<string>('');
  const [avatarSeed, setAvatarSeed] = useState<string>('');
  const [unlockTimes, setUnlockTimes] = useState<Record<string, string>>({});
  const [showSettings, setShowSettings] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const totalLandmarks = Object.keys(LANDMARKS).length;

  // Load from local storage on mount
  useEffect(() => {
    // Load Landmarks
    const savedLandmarks = localStorage.getItem('wildmaps_unlocked');
    if (savedLandmarks) {
      try {
        const parsed = JSON.parse(savedLandmarks);
        // Remove any existing duplicates from local storage
        setUnlockedLandmarks(Array.from(new Set(parsed)));
      } catch (e) {
        console.error('Failed to parse saved landmarks');
      }
    }

    // Load Onboarding Status
    const onboarded = localStorage.getItem('wildmaps_onboarded');
    if (!onboarded) {
      setShowOnboarding(true);
    }

    // Load or Generate Player Name
    const savedName = localStorage.getItem('wildmaps_name');
    if (savedName) {
      setPlayerName(savedName);
    } else {
      const newName = `Wildcat-${Math.floor(Math.random() * 10000)}`;
      setPlayerName(newName);
      localStorage.setItem('wildmaps_name', newName);
    }

    // Load or Generate Avatar Seed
    const savedAvatar = localStorage.getItem('wildmaps_avatar');
    if (savedAvatar) {
      setAvatarSeed(savedAvatar);
    } else {
      const randomColors = ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf', 'c2e9c6', 'FFD700', 'ffb3ba', 'baffc9', 'bae1ff'];
      const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
      const newAvatar = `seed-${Math.floor(Math.random() * 100000)}&backgroundColor=${randomColor}`;
      setAvatarSeed(newAvatar);
      localStorage.setItem('wildmaps_avatar', newAvatar);
    }

    // Load Unlock Times
    const savedTimes = localStorage.getItem('wildmaps_unlock_times');
    if (savedTimes) {
      try {
        setUnlockTimes(JSON.parse(savedTimes));
      } catch (e) {
        console.error('Failed to parse saved unlock times');
      }
    }
  }, []);

  // Save landmarks to local storage on change
  useEffect(() => {
    localStorage.setItem('wildmaps_unlocked', JSON.stringify(unlockedLandmarks));
  }, [unlockedLandmarks]);

  // Save name to local storage on change
  useEffect(() => {
    if (playerName) {
      localStorage.setItem('wildmaps_name', playerName);
    }
  }, [playerName]);

  // Save avatar to local storage on change
  useEffect(() => {
    if (avatarSeed) {
      localStorage.setItem('wildmaps_avatar', avatarSeed);
    }
  }, [avatarSeed]);

  // Save unlock times to local storage on change
  useEffect(() => {
    if (Object.keys(unlockTimes).length > 0) {
      localStorage.setItem('wildmaps_unlock_times', JSON.stringify(unlockTimes));
    }
  }, [unlockTimes]);

  const changeView = (newView: View, options: ChangeViewOptions = {}) => {
    const { playSound = true } = options;

    if (playSound && currentView !== newView) {
      playSubtleClick();
    }
    const views: View[] = ['map', 'scan', 'profile'];
    const currentIndex = views.indexOf(currentView);
    const newIndex = views.indexOf(newView);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setCurrentView(newView);
  };

  const handleUnlock = (id: LandmarkId) => {
    setUnlockedLandmarks(prev => {
      if (!prev.includes(id)) {
        return [...prev, id];
      }
      return prev;
    });
    setUnlockTimes(prev => {
      if (!prev[id]) {
        return { ...prev, [id]: new Date().toISOString() };
      }
      return prev;
    });
    setJustUnlocked(id);
    setShowAchievementModal(id);
    playSuccessChime();
    setTargetLandmark(null);
    changeView('map', { playSound: false });
  };

  const closeAchievementModal = () => {
    setShowAchievementModal(null);
    if (unlockedLandmarks.length === totalLandmarks) {
      setTimeout(() => {
        setShowAllUnlockedModal(true);
        playGrandSuccessChime();
      }, 500);
    }
  };

  const startScan = (id: LandmarkId) => {
    setTargetLandmark(id);
    changeView('scan', { playSound: false });
  };

  const handleReset = () => {
    playSubtleClick();
    setUnlockedLandmarks([]);
    setUnlockTimes({});
    
    localStorage.setItem('wildmaps_unlocked', JSON.stringify([]));
    localStorage.removeItem('wildmaps_unlock_times');
    localStorage.removeItem('wildmaps_onboarded');
    
    setShowSettings(false);
    setShowOnboarding(true);
    changeView('map');
  };

  const completeOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('wildmaps_onboarded', 'true');
  };

  const openSettings = () => {
    playModalOpen();
    setShowSettings(true);
  };

  const views: View[] = ['map', 'scan', 'profile'];
  const currentIndex = views.indexOf(currentView);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return (
    <div className="h-full flex flex-col max-w-md mx-auto border-x-4 border-ink relative overflow-hidden bg-bg bg-grid-pattern shadow-2xl">
      {/* Header */}
      <header className="shrink-0 bg-maroon text-bg p-4 border-b-4 border-ink flex justify-between items-center z-10">
        <h1 className="text-2xl font-bold uppercase tracking-tighter">WildMaps</h1>
        <div className="flex items-center gap-3">
          <motion.button 
            key={unlockedLandmarks.length}
            onClick={() => changeView('profile')}
            whileTap={{ scale: 0.9 }}
            animate={{ scale: [1.3, 1], rotate: [-5, 0] }}
            transition={{ duration: 0.4, type: 'spring', bounce: 0.5 }}
            className="font-mono text-sm bg-gold text-ink px-2 py-1 border-2 border-ink font-bold whitespace-nowrap shrink-0 origin-right cursor-pointer hover:bg-yellow-300"
            title="View Profile & Badges"
          >
            {unlockedLandmarks.length}/{totalLandmarks} FOUND
          </motion.button>
          <button 
            onClick={openSettings}
            className="p-1 hover:bg-white/20 transition-colors shrink-0"
          >
            <Settings size={24} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentView}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 600, damping: 35 },
              opacity: { duration: 0.15 },
            }}
            className="absolute inset-0 w-full h-full"
          >
            {currentView === 'map' && (
              <MapView 
                unlockedLandmarks={unlockedLandmarks} 
                justUnlocked={justUnlocked}
                onSelectLandmark={startScan} 
              />
            )}
            {currentView === 'scan' && (
              <ScanView 
                targetId={targetLandmark} 
                unlockedLandmarks={unlockedLandmarks}
                onUnlock={handleUnlock} 
                onCancel={() => {
                  setTargetLandmark(null);
                  changeView('map', { playSound: false });
                }} 
              />
            )}
            {currentView === 'profile' && (
              <BadgesView 
                unlockedLandmarks={unlockedLandmarks}
                unlockTimes={unlockTimes}
                playerName={playerName}
                setPlayerName={setPlayerName}
                avatarSeed={avatarSeed}
                setAvatarSeed={setAvatarSeed}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="shrink-0 bg-gold border-t-4 border-ink flex p-3 z-10">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => changeView('map')}
          className={`flex-1 flex flex-col items-center p-2 rounded-none border-2 border-transparent ${currentView === 'map' ? 'border-ink bg-white shadow-[2px_2px_0px_0px_var(--color-ink)]' : 'hover:bg-white/50'}`}
        >
          <Map size={24} className="mb-1" />
          <span className="text-xs font-bold uppercase">Map</span>
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => changeView('scan')}
          className={`flex-1 flex flex-col items-center p-2 rounded-none border-2 border-transparent ${currentView === 'scan' ? 'border-ink bg-white shadow-[2px_2px_0px_0px_var(--color-ink)]' : 'hover:bg-white/50'}`}
        >
          <Camera size={24} className="mb-1" />
          <span className="text-xs font-bold uppercase">Scan</span>
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => changeView('profile')}
          className={`flex-1 flex flex-col items-center p-2 rounded-none border-2 border-transparent ${currentView === 'profile' ? 'border-ink bg-white shadow-[2px_2px_0px_0px_var(--color-ink)]' : 'hover:bg-white/50'}`}
        >
          <UserCircle size={24} className="mb-1" />
          <span className="text-xs font-bold uppercase">Profile</span>
        </motion.button>
      </nav>

      {/* Modals */}
      {showAchievementModal && (
        <AchievementModal 
          landmark={LANDMARKS[showAchievementModal]} 
          onClose={closeAchievementModal} 
          width={width} 
          height={height} 
        />
      )}

      {showAllUnlockedModal && (
        <MapClearedModal 
          onClose={() => setShowAllUnlockedModal(false)} 
          playerName={playerName}
          totalLandmarks={totalLandmarks}
          width={width} 
          height={height} 
        />
      )}

      {showSettings && (
        <SettingsModal 
          onClose={() => setShowSettings(false)} 
          onReset={handleReset}
          onShowTutorial={() => {
            setShowSettings(false);
            setShowOnboarding(true);
          }}
        />
      )}

      {showOnboarding && (
        <OnboardingModal onComplete={completeOnboarding} />
      )}
    </div>
  );
}
