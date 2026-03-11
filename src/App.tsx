import { useState, useEffect } from 'react';
import { Map, Camera, UserCircle, Settings } from 'lucide-react';
import { LandmarkId } from './types';
import MapView from './components/MapView';
import ScanView from './components/ScanView';
import BadgesView from './components/BadgesView';
import SettingsModal from './components/SettingsModal';
import OnboardingModal from './components/OnboardingModal';

type View = 'map' | 'scan' | 'profile';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('map');
  const [unlockedLandmarks, setUnlockedLandmarks] = useState<LandmarkId[]>([]);
  const [targetLandmark, setTargetLandmark] = useState<LandmarkId | null>(null);
  
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
      const newAvatar = `seed-${Math.floor(Math.random() * 100000)}`;
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

  const handleUnlock = (id: LandmarkId) => {
    setUnlockedLandmarks(prev => {
      if (!prev.includes(id)) {
        return [...prev, id];
      }
      return prev;
    });
    setCurrentView('profile');
  };

  const startScan = (id: LandmarkId) => {
    setTargetLandmark(id);
    setCurrentView('scan');
  };

  const handleReset = () => {
    setUnlockedLandmarks([]);
    
    localStorage.setItem('wildmaps_unlocked', JSON.stringify([]));
    localStorage.removeItem('wildmaps_onboarded');
    
    setShowSettings(false);
    setShowOnboarding(true);
    setCurrentView('map');
  };

  const completeOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('wildmaps_onboarded', 'true');
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto border-x-4 border-ink relative overflow-hidden bg-bg bg-grid-pattern shadow-2xl">
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
        {currentView === 'map' && (
          <MapView 
            unlockedLandmarks={unlockedLandmarks} 
            onSelectLandmark={startScan} 
          />
        )}
        {currentView === 'scan' && (
          <ScanView 
            targetId={targetLandmark} 
            onUnlock={handleUnlock} 
            onCancel={() => setCurrentView('map')} 
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
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-gold border-t-4 border-ink flex p-3 z-10">
        <button 
          onClick={() => setCurrentView('map')}
          className={`flex-1 flex flex-col items-center p-2 rounded-none border-2 border-transparent ${currentView === 'map' ? 'border-ink bg-white shadow-[2px_2px_0px_0px_var(--color-ink)]' : 'hover:bg-white/50'}`}
        >
          <Map size={24} className="mb-1" />
          <span className="text-xs font-bold uppercase">Map</span>
        </button>
        <button 
          onClick={() => setCurrentView('scan')}
          className={`flex-1 flex flex-col items-center p-2 rounded-none border-2 border-transparent ${currentView === 'scan' ? 'border-ink bg-white shadow-[2px_2px_0px_0px_var(--color-ink)]' : 'hover:bg-white/50'}`}
        >
          <Camera size={24} className="mb-1" />
          <span className="text-xs font-bold uppercase">Scan</span>
        </button>
        <button 
          onClick={() => setCurrentView('profile')}
          className={`flex-1 flex flex-col items-center p-2 rounded-none border-2 border-transparent ${currentView === 'profile' ? 'border-ink bg-white shadow-[2px_2px_0px_0px_var(--color-ink)]' : 'hover:bg-white/50'}`}
        >
          <UserCircle size={24} className="mb-1" />
          <span className="text-xs font-bold uppercase">Profile</span>
        </button>
      </nav>

      {/* Modals */}
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
