import { useState } from 'react';
import { X, ShieldAlert, RotateCcw, Phone, Info, HelpCircle, Share2 } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
  onReset: () => void;
  onShowTutorial: () => void;
}

export default function SettingsModal({ onClose, onReset, onShowTutorial }: SettingsModalProps) {
  const [confirmReset, setConfirmReset] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: 'WildMaps',
      text: `I'm exploring the CIT-U campus in WildMaps! Can you find all the landmarks? Play here:`,
      url: 'https://wildmaps.vercel.app/',
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
      <div className="neo-brutalist-card bg-bg w-full max-w-sm flex flex-col relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-ink text-white p-3 flex justify-between items-center border-b-4 border-ink sticky top-0 z-10">
          <h3 className="font-bold uppercase tracking-tight text-lg flex items-center gap-2">
            <Info size={20} />
            Settings & Info
          </h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-none transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-6">
          {/* Tutorial Section */}
          <section>
            <h4 className="font-bold uppercase text-maroon flex items-center gap-2 mb-2 border-b-2 border-ink pb-1">
              <HelpCircle size={18} />
              Orientation
            </h4>
            <p className="text-sm text-gray-700 mb-3">
              Need a refresher on how to use WildMaps?
            </p>
            <button 
              onClick={onShowTutorial}
              className="w-full neo-brutalist bg-white hover:bg-gray-100 text-ink font-bold uppercase py-3 flex items-center justify-center gap-2 transition-colors"
            >
              Replay Tutorial
            </button>
          </section>

          {/* Share Section */}
          <section>
            <h4 className="font-bold uppercase text-maroon flex items-center gap-2 mb-2 border-b-2 border-ink pb-1">
              <Share2 size={18} />
              Share with Friends
            </h4>
            <p className="text-sm text-gray-700 mb-3">
              Challenge your friends to find all the landmarks!
            </p>
            <button 
              onClick={handleShare}
              className="w-full neo-brutalist bg-gold hover:bg-gold-dark text-ink font-bold uppercase py-3 flex items-center justify-center gap-2 transition-colors"
            >
              <Share2 size={20} />
              Share WildMaps
            </button>
          </section>

          {/* Privacy Section */}
          <section>
            <h4 className="font-bold uppercase text-maroon flex items-center gap-2 mb-2 border-b-2 border-ink pb-1">
              <ShieldAlert size={18} />
              Privacy-by-Design
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed font-mono">
              WildMaps processes all camera data <strong>locally on your device</strong> using TensorFlow.js. 
              No images or personal data are ever sent to or stored on a server. Your anonymity is guaranteed.
            </p>
          </section>

          {/* Danger Zone */}
          <section>
            <h4 className="font-bold uppercase text-maroon flex items-center gap-2 mb-2 border-b-2 border-ink pb-1">
              <RotateCcw size={18} />
              Danger Zone
            </h4>
            <p className="text-xs text-gray-600 mb-3">
              Resetting will clear your current progress and badges. Your Explorer ID will remain intact. This cannot be undone.
            </p>
            {!confirmReset ? (
              <button 
                onClick={() => setConfirmReset(true)}
                className="w-full neo-brutalist bg-red-500 hover:bg-red-600 text-white font-bold uppercase py-3 transition-colors"
              >
                Reset Progress
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={() => setConfirmReset(false)}
                  className="flex-1 neo-brutalist bg-gray-200 hover:bg-gray-300 text-ink font-bold uppercase py-3 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={onReset}
                  className="flex-1 neo-brutalist bg-red-600 hover:bg-red-700 text-white font-bold uppercase py-3 transition-colors text-sm"
                >
                  Confirm Reset
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
