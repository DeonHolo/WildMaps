import { useState, useEffect } from 'react';
import { Map, Camera, UserCircle, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { LandmarkId, LANDMARKS } from './types';
import MapView from './components/MapView';
import ScanView from './components/ScanView';
import BadgesView from './components/BadgesView';
import SettingsModal from './components/SettingsModal';
import OnboardingModal from './components/OnboardingModal';

type View = 'map' | 'scan' | 'profile';

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
  const [showSettings, setShowSettings] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

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

  const changeView = (newView: View) => {
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
    setJustUnlocked(id);
    setShowAchievementModal(id);
    changeView('map');
  };

  const closeAchievementModal = () => {
    setShowAchievementModal(null);
    if (unlockedLandmarks.length === 3) {
      setTimeout(() => setShowAllUnlockedModal(true), 500);
    }
  };

  const startScan = (id: LandmarkId) => {
    setTargetLandmark(id);
    changeView('scan');
  };

  const handleReset = () => {
    setUnlockedLandmarks([]);
    
    localStorage.setItem('wildmaps_unlocked', JSON.stringify([]));
    localStorage.removeItem('wildmaps_onboarded');
    
    setShowSettings(false);
    setShowOnboarding(true);
    changeView('map');
  };

  const completeOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('wildmaps_onboarded', 'true');
  };

  const views: View[] = ['map', 'scan', 'profile'];
  const currentIndex = views.indexOf(currentView);

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = Math.abs(offset.x) * velocity.x;
    const swipeConfidenceThreshold = 10000;

    if (swipe < -swipeConfidenceThreshold) {
      if (currentIndex < views.length - 1) changeView(views[currentIndex + 1]);
    } else if (swipe > swipeConfidenceThreshold) {
      if (currentIndex > 0) changeView(views[currentIndex - 1]);
    }
  };

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
    <div className="h-[100dvh] flex flex-col max-w-md mx-auto border-x-4 border-ink relative overflow-hidden bg-bg bg-grid-pattern shadow-2xl">
      {/* Header */}
      <header className="bg-maroon text-bg p-4 border-b-4 border-ink flex justify-between items-center z-10">
        <h1 className="text-2xl font-bold uppercase tracking-tighter">WildMaps</h1>
        <div className="flex items-center gap-3">
          <div className="font-mono text-sm bg-gold text-ink px-2 py-1 border-2 border-ink font-bold whitespace-nowrap shrink-0">
            {unlockedLandmarks.length}/3 FOUND
          </div>
          <button 
            onClick={() => setShowSettings(true)}
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
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
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
                onUnlock={handleUnlock} 
                onCancel={() => changeView('map')} 
              />
            )}
            {currentView === 'profile' && (
              <BadgesView 
                unlockedLandmarks={unlockedLandmarks}
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
      <nav className="bg-gold border-t-4 border-ink flex p-3 z-10">
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
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-300">
          <Confetti 
            width={width} 
            height={height} 
            recycle={false} 
            numberOfPieces={500} 
            gravity={0.8} 
            initialVelocityY={40} 
          />
          <div className="neo-brutalist-card bg-bg w-full max-w-sm flex flex-col relative animate-in zoom-in-95 duration-300 text-center p-6">
            <div className="mb-4">
              <h2 className="inline-block text-3xl font-black uppercase text-ink bg-gold px-4 py-2 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-2 transform">
                Sector Unlocked!
              </h2>
            </div>
            <p className="text-gray-800 font-bold mb-6 text-lg">You've successfully mapped {LANDMARKS[showAchievementModal].name}.</p>
            <div className="w-full h-40 mx-auto mb-6 neo-brutalist bg-white flex items-center justify-center overflow-hidden">
              <img src={LANDMARKS[showAchievementModal].imageUrl} alt="Unlocked" className="w-full h-full object-cover" />
            </div>
            <button 
              onClick={closeAchievementModal}
              className="w-full neo-brutalist bg-gold hover:bg-gold-dark text-ink font-bold uppercase py-3 transition-colors text-xl"
            >
              Awesome!
            </button>
          </div>
        </div>
      )}

      {showAllUnlockedModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-300">
          <Confetti 
            width={width} 
            height={height} 
            recycle={true} 
            numberOfPieces={200} 
            gravity={0.5} 
            initialVelocityY={30} 
          />
          <div className="neo-brutalist-card bg-bg w-full max-w-sm flex flex-col relative animate-in zoom-in-95 duration-300 text-center p-6">
            <div className="mb-4">
              <h2 className="inline-block text-3xl font-black uppercase text-ink bg-gold px-4 py-2 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-2 transform">
                Map Cleared!
              </h2>
            </div>
            <p className="text-gray-800 font-bold mb-6 text-lg">You've found all the landmarks and cleared the fog of war. You are a Grandmaster Guide!</p>
            <div className="w-full h-40 mx-auto mb-6 neo-brutalist bg-gold flex items-center justify-center overflow-hidden">
              <img src="https://api.dicebear.com/9.x/bottts/svg?seed=Guide&backgroundColor=FFD700" alt="Guide" className="w-full h-full object-cover" />
            </div>
            <button 
              onClick={() => setShowAllUnlockedModal(false)}
              className="w-full neo-brutalist bg-gold hover:bg-gold-dark text-ink font-bold uppercase py-3 transition-colors text-xl"
            >
              View Full Map
            </button>
          </div>
        </div>
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
