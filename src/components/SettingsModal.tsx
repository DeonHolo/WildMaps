import { useState, useRef } from 'react';
import { X, ShieldAlert, RotateCcw, Info, HelpCircle, Share2, Copy, Check, Download } from 'lucide-react';
import {
  FacebookShareButton, FacebookIcon,
  TwitterShareButton,
  TelegramShareButton, TelegramIcon,
  RedditShareButton, RedditIcon,
} from 'react-share';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { playSubtleClick, playResetSound } from '../utils/audio';

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
    playSubtleClick();
    navigator.clipboard.writeText(`${shareData.text} 📍 ${shareData.url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMessengerShare = () => {
    playSubtleClick();
    const message = `${shareData.text}\n${shareData.url}`;
    const isAndroid = /android/i.test(navigator.userAgent);
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

    if (isAndroid) {
      // Android intent:// bypasses Web Share API duplication bug
      const intentUrl = `intent://send/#Intent;package=com.facebook.orca;scheme=fb-messenger;S.android.intent.extra.TEXT=${encodeURIComponent(message)};end`;
      window.location.href = intentUrl;
    } else if (isIOS) {
      // iOS: copy message to clipboard, then open Messenger with just the link
      navigator.clipboard.writeText(message).catch(() => { });
      window.location.href = `fb-messenger://share/?link=${encodeURIComponent(shareData.url)}`;
    } else {
      // Desktop fallback
      window.open(`fb-messenger://share/?link=${encodeURIComponent(shareData.url)}`, '_blank');
    }
  };

  const handleDownloadQR = () => {
    playSubtleClick();
    const qrUrl = '/wildmaps-qr.png';

    // Create an invisible link and trigger a download
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
      .catch(() => window.open(qrUrl, '_blank')); // Fallback to opening in new tab
  };

  return (
    <div ref={overlayRef} className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div ref={containerRef} className="neo-brutalist-card bg-bg w-full max-w-sm flex flex-col relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="bg-white p-3 flex justify-between items-center border-b-4 border-ink">
          <h3 className="font-bold uppercase tracking-tight text-lg flex items-center gap-2">
            Share Via...
          </h3>
          <button onClick={handleClose} className="hover:bg-gray-100 p-1 transition-colors hover:rotate-90 duration-300">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4 bg-white">
          {/* QR Code */}
          <div className="w-full flex flex-col items-center justify-center p-4">
            <p className="text-sm font-bold uppercase text-ink mb-3 tracking-widest">Scan to Play</p>
            <img
              src="/wildmaps-qr.png"
              alt="WildMaps QR Code"
              width={160}
              height={160}
              className="shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-ink mb-4"
              crossOrigin="anonymous"
            />
            <button
              onClick={handleDownloadQR}
              className="flex items-center gap-2 text-xs font-bold uppercase hover:text-blue-600 transition-colors"
            >
              <Download size={14} /> Download QR
            </button>
          </div>

          <div className="flex gap-3 justify-center flex-wrap mt-2">
            <FacebookShareButton url={shareData.url} hashtag="#WildMaps" quote={shareData.text}>
              <FacebookIcon size={44} round className="hover:scale-105 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-full border-2 border-ink" />
            </FacebookShareButton>
            <button
              onClick={handleMessengerShare}
              className="hover:scale-105 transition-transform"
              title="Share via Messenger"
            >
              <div className="w-[44px] h-[44px] rounded-full bg-[#0099FF] flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-ink">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                  <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.2 5.42 3.15 7.15.16.14.26.34.27.56l.05 1.78c.02.56.6.93 1.11.7l1.98-.87c.17-.08.36-.1.55-.06.93.26 1.92.4 2.89.4 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm5.89 7.54l-2.89 4.54c-.46.72-1.41.9-2.09.39l-2.3-1.72a.6.6 0 00-.72 0l-3.1 2.35c-.41.31-.96-.18-.68-.62l2.89-4.54c.46-.72 1.41-.9 2.09-.39l2.3 1.72a.6.6 0 00.72 0l3.1-2.35c.41-.31.96.18.68.62z" />
                </svg>
              </div>
            </button>
            <TwitterShareButton url={shareData.url} title={shareData.text}>
              <div className="w-[44px] h-[44px] rounded-full bg-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-ink hover:scale-105 transition-transform">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                </svg>
              </div>
            </TwitterShareButton>
            <TelegramShareButton url={shareData.url} title={shareData.text}>
              <TelegramIcon size={44} round className="hover:scale-105 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-full border-2 border-ink" />
            </TelegramShareButton>
            <RedditShareButton url={shareData.url} title={shareData.text}>
              <RedditIcon size={44} round className="hover:scale-105 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-full border-2 border-ink" />
            </RedditShareButton>
          </div>

          <button
            onClick={handleCopy}
            className={`w-full neo-brutalist font-black uppercase py-3 mt-4 flex items-center justify-center gap-2 transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] text-sm ${copied ? 'bg-green-400 text-ink' : 'bg-gray-200 hover:bg-gray-300 text-ink'}`}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
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
