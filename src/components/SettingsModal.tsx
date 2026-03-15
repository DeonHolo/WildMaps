import { useState, useRef } from 'react';
import { X, ShieldAlert, RotateCcw, Phone, Info, HelpCircle, Share2, Copy, Check, Smartphone } from 'lucide-react';
import {
  FacebookShareButton, FacebookIcon,
  TwitterShareButton, TwitterIcon,
  WhatsappShareButton, WhatsappIcon,
  TelegramShareButton, TelegramIcon,
  RedditShareButton, RedditIcon,
} from 'react-share';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { playSubtleClick } from '../utils/audio';

gsap.registerPlugin(useGSAP);

interface SettingsModalProps {
  onClose: () => void;
  onReset: () => void;
  onShowTutorial: () => void;
}

export default function SettingsModal({ onClose, onReset, onShowTutorial }: SettingsModalProps) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const supportsNativeShare = typeof navigator !== 'undefined' && !!navigator.share;
  
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

  const handleShowShareOptions = () => {
    playSubtleClick();
    setShowShareOptions(true);
  };

  const handleNativeShare = async () => {
    playSubtleClick();
    try {
      await navigator.share({
        title: 'WildMaps',
        text: shareData.text,
        url: shareData.url,
      });
    } catch (err) {
      // User cancelled or share failed — silently ignore
    }
  };

  const handleCopy = () => {
    playSubtleClick();
    navigator.clipboard.writeText(`${shareData.text} 📍 ${shareData.url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            
            {!showShareOptions ? (
              <button 
                onClick={handleShowShareOptions}
                className="w-full neo-brutalist bg-gold hover:bg-gold-dark text-ink font-black uppercase py-3 flex items-center justify-center gap-2 transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]"
              >
                <Share2 size={20} />
                Share WildMaps
              </button>
            ) : (
              <div className="bg-white border-2 border-ink p-3 flex flex-col gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm uppercase">Share via...</span>
                  <button onClick={() => { playSubtleClick(); setShowShareOptions(false); }} className="text-gray-500 hover:text-ink transition-colors hover:rotate-90 duration-300">
                    <X size={16} />
                  </button>
                </div>

                {/* Native Share (mobile — lets user pick Messenger, SMS, etc.) */}
                {supportsNativeShare && (
                  <button
                    onClick={handleNativeShare}
                    className="w-full neo-brutalist bg-gold hover:bg-gold-dark text-ink font-black uppercase py-2 flex items-center justify-center gap-2 transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <Smartphone size={18} />
                    Share via Apps
                  </button>
                )}

                <div className="flex gap-3 justify-center flex-wrap">
                  <FacebookShareButton url={shareData.url} hashtag="#WildMaps" quote={shareData.text}>
                    <FacebookIcon size={40} round className="hover:scale-105 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-full" />
                  </FacebookShareButton>
                  <TwitterShareButton url={shareData.url} title={shareData.text}>
                    <TwitterIcon size={40} round className="hover:scale-105 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-full" />
                  </TwitterShareButton>
                  <WhatsappShareButton url={shareData.url} title={shareData.text} separator=" - ">
                    <WhatsappIcon size={40} round className="hover:scale-105 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-full" />
                  </WhatsappShareButton>
                  <TelegramShareButton url={shareData.url} title={shareData.text}>
                    <TelegramIcon size={40} round className="hover:scale-105 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-full" />
                  </TelegramShareButton>
                  <RedditShareButton url={shareData.url} title={shareData.text}>
                    <RedditIcon size={40} round className="hover:scale-105 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-full" />
                  </RedditShareButton>
                </div>
                <button 
                  onClick={handleCopy}
                  className={`w-full neo-brutalist font-black uppercase py-2 flex items-center justify-center gap-2 transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] text-sm ${copied ? 'bg-green-400 text-ink' : 'bg-gray-200 hover:bg-gray-300 text-ink'}`}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            )}
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
                onClick={() => { playSubtleClick(); setConfirmReset(true); }}
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
    </div>
  );
}
