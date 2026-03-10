import { useState, useEffect } from 'react';
import { Map, Camera, UserCircle, Settings } from 'lucide-react';
import { LandmarkId } from './types';
import MapView from './components/MapView';
import ScanView from './components/ScanView';
import BadgesView from './components/BadgesView';
import SettingsModal from './components/SettingsModal';

type View = 'map' | 'scan' | 'profile';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('map');
  const [unlockedLandmarks, setUnlockedLandmarks] = useState<LandmarkId[]>([]);
  const [targetLandmark, setTargetLandmark] = useState<LandmarkId | null>(null);
  
  // Profile & Settings State
  const [playerName, setPlayerName] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    // Load Landmarks
    const savedLandmarks = localStorage.getItem('wildmaps_unlocked');
    if (savedLandmarks) {
      try {
        setUnlockedLandmarks(JSON.parse(savedLandmarks));
      } catch (e) {
        console.error('Failed to parse saved landmarks');
      }
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

    // Load or Start Timer
    const savedTime = localStorage.getItem('wildmaps_start');
    if (savedTime) {
      setStartTime(parseInt(savedTime, 10));
    } else {
      const now = Date.now();
      setStartTime(now);
      localStorage.setItem('wildmaps_start', now.toString());
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

  const handleUnlock = (id: LandmarkId) => {
    if (!unlockedLandmarks.includes(id)) {
      setUnlockedLandmarks(prev => [...prev, id]);
    }
    setCurrentView('profile');
  };

  const startScan = (id: LandmarkId) => {
    setTargetLandmark(id);
    setCurrentView('scan');
  };

  const handleReset = () => {
    setUnlockedLandmarks([]);
    const newName = `Wildcat-${Math.floor(Math.random() * 10000)}`;
    setPlayerName(newName);
    const now = Date.now();
    setStartTime(now);
    
    localStorage.setItem('wildmaps_start', now.toString());
    localStorage.setItem('wildmaps_name', newName);
    localStorage.setItem('wildmaps_unlocked', JSON.stringify([]));
    
    setShowSettings(false);
    setCurrentView('map');
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-bg border-x-4 border-ink relative overflow-hidden">
      {/* Header */}
      <header className="bg-maroon text-bg p-4 border-b-4 border-ink flex justify-between items-center z-10">
        <h1 className="text-2xl font-bold uppercase tracking-tighter">WildMaps</h1>
        <div className="flex items-center gap-3">
          <div className="font-mono text-sm bg-gold text-ink px-2 py-1 border-2 border-ink font-bold whitespace-nowrap shrink-0">
            {unlockedLandmarks.length}/4 FOUND
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
      <main className="flex-1 relative overflow-hidden bg-bg">
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
            startTime={startTime}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-gold border-t-4 border-ink flex justify-around p-3 z-10">
        <button 
          onClick={() => setCurrentView('map')}
          className={`flex flex-col items-center p-2 rounded-none border-2 border-transparent ${currentView === 'map' ? 'border-ink bg-white shadow-[2px_2px_0px_0px_var(--color-ink)]' : 'hover:bg-white/50'}`}
        >
          <Map size={24} className="mb-1" />
          <span className="text-xs font-bold uppercase">Map</span>
        </button>
        <button 
          onClick={() => setCurrentView('scan')}
          className={`flex flex-col items-center p-2 rounded-none border-2 border-transparent ${currentView === 'scan' ? 'border-ink bg-white shadow-[2px_2px_0px_0px_var(--color-ink)]' : 'hover:bg-white/50'}`}
        >
          <Camera size={24} className="mb-1" />
          <span className="text-xs font-bold uppercase">Scan</span>
        </button>
        <button 
          onClick={() => setCurrentView('profile')}
          className={`flex flex-col items-center p-2 rounded-none border-2 border-transparent ${currentView === 'profile' ? 'border-ink bg-white shadow-[2px_2px_0px_0px_var(--color-ink)]' : 'hover:bg-white/50'}`}
        >
          <UserCircle size={24} className="mb-1" />
          <span className="text-xs font-bold uppercase">Profile</span>
        </button>
      </nav>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal 
          onClose={() => setShowSettings(false)} 
          onReset={handleReset} 
        />
      )}
    </div>
  );
}
