import { User, Settings, LogOut, Shield, Bell, Smartphone } from 'lucide-react';

interface ProfileViewProps {
  unlockedCount: number;
  totalCount: number;
}

export default function ProfileView({ unlockedCount, totalCount }: ProfileViewProps) {
  const progress = (unlockedCount / totalCount) * 100;

  return (
    <div className="absolute inset-0 bg-bg p-4 overflow-y-auto flex flex-col">
      {/* Profile Header */}
      <div className="bg-white neo-brutalist-card p-6 mb-6 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full neo-brutalist bg-gold overflow-hidden mb-4">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Freshman&backgroundColor=FFD700" 
            alt="Student Avatar" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <h2 className="text-2xl font-bold uppercase tracking-tighter">Freshman Explorer</h2>
        <p className="text-sm font-mono text-gray-600 mt-1">ID: 2025-XXXX</p>
        
        <div className="w-full mt-6 flex justify-around border-t-2 border-dashed border-gray-300 pt-4">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-maroon">{unlockedCount}</span>
            <span className="text-xs font-mono uppercase text-gray-500">Badges</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-maroon">{progress.toFixed(0)}%</span>
            <span className="text-xs font-mono uppercase text-gray-500">Explored</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-maroon">Lv.1</span>
            <span className="text-xs font-mono uppercase text-gray-500">Rank</span>
          </div>
        </div>
      </div>

      {/* Settings Menu */}
      <div className="flex-1 flex flex-col gap-4 pb-20">
        <h3 className="font-bold uppercase tracking-tight text-gray-500 px-2">Settings & Preferences</h3>
        
        <div className="bg-white neo-brutalist-card flex flex-col">
          <button className="flex items-center justify-between p-4 border-b-2 border-ink hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <User size={20} className="text-maroon" />
              <span className="font-bold uppercase text-sm">Edit Profile</span>
            </div>
            <span className="text-gray-400 font-mono text-xs">&gt;</span>
          </button>
          
          <button className="flex items-center justify-between p-4 border-b-2 border-ink hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-maroon" />
              <span className="font-bold uppercase text-sm">Notifications</span>
            </div>
            <div className="w-10 h-5 bg-gold border-2 border-ink rounded-full relative">
              <div className="absolute right-0 top-0 bottom-0 w-5 bg-white border-l-2 border-ink rounded-full"></div>
            </div>
          </button>

          <button className="flex items-center justify-between p-4 border-b-2 border-ink hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Smartphone size={20} className="text-maroon" />
              <span className="font-bold uppercase text-sm">Camera Permissions</span>
            </div>
            <span className="text-green-600 font-mono text-xs font-bold uppercase">Granted</span>
          </button>

          <button className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-maroon" />
              <span className="font-bold uppercase text-sm">Privacy Policy</span>
            </div>
            <span className="text-gray-400 font-mono text-xs">&gt;</span>
          </button>
        </div>

        {/* Danger Zone */}
        <div className="mt-4">
          <button 
            onClick={() => {
              if(confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
                localStorage.removeItem('wildmaps_unlocked');
                window.location.reload();
              }
            }}
            className="w-full neo-brutalist bg-red-100 hover:bg-red-200 text-red-700 font-bold uppercase py-4 flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut size={20} />
            Reset Progress
          </button>
        </div>
      </div>
    </div>
  );
}
