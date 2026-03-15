import { useState, useRef } from 'react';
import { X, ShieldAlert, RotateCcw, Info, HelpCircle, Share2, Copy, Check, Download, Link, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { playSubtleClick, playResetSound, playCopySound } from '../utils/audio';

gsap.registerPlugin(useGSAP);

interface SettingsModalProps {
  onClose: () => void;
  onReset: () => void;
  onShowTutorial: () => void;
}

function ShareModal({ shareData, onClose }: { shareData: any, onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const copyBtnRef = useRef<HTMLButtonElement>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handleCopy = () => {
    playCopySound();
    navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
    
    // Clear any existing timeout to prevent flicker on spam
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    setCopied(true);

    // Punch animation on button
    if (copyBtnRef.current) {
      gsap.fromTo(copyBtnRef.current, 
        { scale: 0.92, rotation: -1 },
        { scale: 1, rotation: 0, duration: 0.4, ease: 'elastic.out(1.2, 0.4)' }
      );
    }

    copyTimeoutRef.current = setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQR = () => {
    playSubtleClick();
    const qrUrl = '/wildmaps-qr.png';
    fetch(qrUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'WildMaps-QR.png';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => window.open(qrUrl, '_blank'));
  };

  return (
    <div ref={overlayRef} className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div ref={containerRef} className="neo-brutalist-card bg-bg w-full max-w-sm flex flex-col relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {/* Header */}
        <div className="bg-maroon text-white p-3 flex justify-between items-center border-b-4 border-ink">
          <h3 className="font-bold uppercase tracking-tight text-lg flex items-center gap-2">
            <Share2 size={18} className="text-gold" />
            Invite Friends
          </h3>
          <button onClick={handleClose} className="hover:bg-white/20 p-1 transition-colors hover:rotate-90 duration-300">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-5 bg-white">
          {/* Invite message */}
          <div className="text-center">
            <p className="text-sm text-gray-600 leading-relaxed">
              Challenge your classmates to find all <strong>3 hidden landmarks</strong> on campus! Share the link or scan the QR code below.
            </p>
          </div>

          {/* QR Code */}
          <div className="w-full flex flex-col items-center justify-center p-4 bg-gray-50 border-2 border-ink">
            <div className="flex items-center gap-1.5 mb-3">
              <QrCode size={14} className="text-maroon" />
              <p className="text-xs font-bold uppercase text-ink tracking-widest">Scan to Play</p>
            </div>
            <motion.div
              initial={{ scale: 0.85, rotate: -5, opacity: 0 }}
              animate={{ scale: [0.85, 1.08, 1], rotate: [-5, 3, 0], opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="mb-3"
            >
              <motion.img
                src="/wildmaps-qr.png"
                alt="WildMaps QR Code"
                width={140}
                height={140}
                className="shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-3 border-ink"
                crossOrigin="anonymous"
                whileHover={{ y: -4, scale: 1.03, rotate: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 18 }}
              />
            </motion.div>
            <button
              onClick={handleDownloadQR}
              className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-gray-500 hover:text-maroon transition-colors"
            >
              <Download size={12} /> Save QR Image
            </button>
          </div>

          {/* Share link preview */}
          <div className="bg-gray-50 border-2 border-ink p-3">
            <p className="text-[10px] font-mono uppercase text-gray-400 mb-1.5">Share Message</p>
            <p className="text-xs text-ink leading-relaxed font-mono break-words">
              {shareData.text}
            </p>
            <p className="text-xs text-blue-600 font-mono mt-1 break-words">
              {shareData.url}
            </p>
          </div>

          {/* Copy Link Button */}
          <motion.button
            ref={copyBtnRef}
            onClick={handleCopy}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className={`w-full neo-brutalist font-black uppercase py-4 flex items-center justify-center gap-2.5 transition-colors text-base ${
              copied 
                ? 'bg-green-400 text-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                : 'bg-gold hover:bg-yellow-400 text-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
            }`}
          >
            {copied ? (
              <>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                >
                  <Check size={20} strokeWidth={3} />
                </motion.div>
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Link size={20} />
                Copy Invite Link
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default function SettingsModal({ onClose, onReset, onShowTutorial }: SettingsModalProps) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

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

  const handleTutorial = () => {
    playSubtleClick();
    animateClose(onShowTutorial);
  };

  const handleReset = () => {
    playSubtleClick();
    animateClose(onReset);
  };

  const shareData = {
    text: `🗺️ I'm exploring the CIT-U campus in WildMaps! Can you find all the landmarks?`,
    url: 'https://wildmaps.vercel.app/',
  };

  const handleShowShareModal = () => {
    playSubtleClick();
    setShowShareModal(true);
  };

  return (
    <div ref={overlayRef} className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div ref={containerRef} className="neo-brutalist-card bg-bg w-full max-w-sm flex flex-col relative max-h-[90vh] overflow-y-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {/* Header */}
        <div className="bg-ink text-white p-3 flex justify-between items-center border-b-4 border-ink sticky top-0 z-10">
          <h3 className="font-bold uppercase tracking-tight text-lg flex items-center gap-2">
            <Info size={20} />
            Settings & Info
          </h3>
          <button onClick={handleClose} className="hover:bg-white/20 p-1 rounded-none transition-colors hover:rotate-90 duration-300">
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
              onClick={handleTutorial}
              className="w-full neo-brutalist bg-white hover:bg-gray-100 text-ink font-black uppercase py-3 flex items-center justify-center gap-2 transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]"
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
              onClick={handleShowShareModal}
              className="w-full neo-brutalist bg-gold hover:bg-gold-dark text-ink font-black uppercase py-3 flex items-center justify-center gap-2 transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]"
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
                onClick={() => { playResetSound(); setConfirmReset(true); }}
                className="w-full neo-brutalist bg-red-500 hover:bg-red-600 text-white font-black uppercase py-3 transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]"
              >
                Reset Progress
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => { playSubtleClick(); setConfirmReset(false); }}
                  className="flex-1 neo-brutalist bg-gray-200 hover:bg-gray-300 text-ink font-black uppercase py-3 transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 neo-brutalist bg-red-600 hover:bg-red-700 text-white font-black uppercase py-3 transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] text-sm"
                >
                  Confirm Reset
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      {showShareModal && (
        <ShareModal
          shareData={shareData}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}
