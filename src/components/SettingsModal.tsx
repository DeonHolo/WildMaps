import { X, ShieldAlert, RotateCcw, Phone, Info } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
  onReset: () => void;
}

export default function SettingsModal({ onClose, onReset }: SettingsModalProps) {
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

          {/* Emergency Section */}
          <section>
            <h4 className="font-bold uppercase text-maroon flex items-center gap-2 mb-2 border-b-2 border-ink pb-1">
              <Phone size={18} />
              Need Help?
            </h4>
            <div className="neo-brutalist bg-gold p-3 text-sm">
              <p className="font-bold mb-1">Actually lost on campus?</p>
              <p className="font-mono">CIT-U Security: (032) 261-7741</p>
              <p className="font-mono">Student Affairs: Local 123</p>
            </div>
          </section>

          {/* Danger Zone */}
          <section>
            <h4 className="font-bold uppercase text-maroon flex items-center gap-2 mb-2 border-b-2 border-ink pb-1">
              <RotateCcw size={18} />
              Danger Zone
            </h4>
            <p className="text-xs text-gray-600 mb-3">
              Resetting will clear your current progress, badges, and generated ID. This cannot be undone.
            </p>
            <button 
              onClick={() => {
                if (window.confirm("Are you sure you want to reset all progress?")) {
                  onReset();
                }
              }}
              className="w-full neo-brutalist bg-red-500 hover:bg-red-600 text-white font-bold uppercase py-3 transition-colors"
            >
              Reset Progress
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
