import { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { Camera, X, CheckCircle2, AlertCircle, Loader2, ScanLine, Flashlight, FlashlightOff } from 'lucide-react';
import { motion } from 'motion/react';
import { LandmarkId, LANDMARKS } from '../types';
import { playScanComplete, playSubtleClick } from '../utils/audio';

interface ScanViewProps {
  targetId: LandmarkId | null;
  unlockedLandmarks: LandmarkId[];
  onUnlock: (id: LandmarkId) => void;
  onCancel: () => void;
}

export default function ScanView({ targetId, unlockedLandmarks, onUnlock, onCancel }: ScanViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [scanResult, setScanResult] = useState<{ className: string; probability: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const totalLandmarks = Object.keys(LANDMARKS).length;

  const target = targetId ? LANDMARKS[targetId] : null;
  const isFreeMode = unlockedLandmarks.length >= totalLandmarks;

  // Load Model
  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const loadedModel = await mobilenet.load();
        setModel(loadedModel);
      } catch (err) {
        console.error('Failed to load model', err);
        setError('Failed to load AI model. Please try again.');
      }
    };
    loadModel();
  }, []);

  // Setup Camera
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const setupCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        // Check for torch support
        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities() as any;
        if (capabilities.torch) {
          setTorchSupported(true);
        }
      } catch (err) {
        console.error('Error accessing camera', err);
        setError('Camera access denied. Please allow camera permissions in your browser settings and reload.');
      }
    };
    
    setupCamera();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Toggle Torch
  const toggleTorch = async () => {
    if (!videoRef.current) return;
    const stream = videoRef.current.srcObject as MediaStream;
    if (!stream) return;
    
    const track = stream.getVideoTracks()[0];
    try {
      await track.applyConstraints({
        advanced: [{ torch: !isTorchOn }]
      } as any);
      setIsTorchOn(!isTorchOn);
      playSubtleClick();
    } catch (err) {
      console.error('Failed to toggle torch', err);
    }
  };

  // Continuous Scan Effect
  useEffect(() => {
    // Prevent scanning to unlock if already unlocked (unless all 3 are found, which makes it free mode)
    const isAlreadyUnlocked = targetId && unlockedLandmarks.includes(targetId) && !isFreeMode;
    
    if (!model || !isVideoReady || success || (isAlreadyUnlocked && !isFreeMode) || (!targetId && !isFreeMode)) return;

    const interval = setInterval(async () => {
      if (!videoRef.current) return;
      try {
        const predictions = await model.classify(videoRef.current);
        if (predictions && predictions.length > 0) {
          const topPrediction = predictions[0];
          setScanResult(topPrediction);
          
          if (topPrediction.probability > 0.1 && !isFreeMode) {
            // Success! (Only unlock if not in free mode)
            playScanComplete();
            setSuccess(true);
            clearInterval(interval);
            setTimeout(() => {
              if (targetId) onUnlock(targetId);
            }, 2000);
          }
        }
      } catch (err) {
        console.error('Scan error:', err);
      }
    }, 1000); // Scan every 1 second

    return () => clearInterval(interval);
  }, [model, isVideoReady, success, targetId, onUnlock]);

  // Debug unlock for testing
  const handleDebugUnlock = () => {
    if (isFreeMode) return;
    const isAlreadyUnlocked = targetId && unlockedLandmarks.includes(targetId) && !isFreeMode;
    if (targetId && !isAlreadyUnlocked) {
      playScanComplete();
      setSuccess(true);
      setTimeout(() => {
        onUnlock(targetId);
      }, 1000);
    }
  };

  const handleCancel = () => {
    playSubtleClick();
    onCancel();
  };

  if (!target && !isFreeMode) {
    return (
      <div className="absolute inset-0 p-6 flex flex-col items-center justify-center">
        <div className="neo-brutalist-card bg-white p-6 text-center max-w-sm">
          <AlertCircle size={48} className="mx-auto mb-4 text-maroon" />
          <h2 className="text-xl font-bold uppercase mb-2">No Target Selected</h2>
          <p className="mb-6">Please select a locked sector from the map first.</p>
          <button 
            onClick={handleCancel}
            className="neo-brutalist bg-gold text-ink px-6 py-3 font-bold uppercase w-full"
          >
            Return to Map
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-ink flex flex-col">
      {/* Header */}
      <div className="bg-gold text-ink p-4 flex justify-between items-center z-10 border-b-4 border-ink">
        <div>
          <h2 className="text-sm font-mono uppercase opacity-80">
            {isFreeMode ? 'Free Exploration' : 'Current Target'}
          </h2>
          <p className="font-bold text-lg">
            {isFreeMode ? 'Playground Mode' : (success ? target?.name : `??? (${target?.shortHint})`)}
          </p>
        </div>
        <button onClick={handleCancel} className="p-2 hover:bg-white/20 rounded-full transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative overflow-hidden bg-black flex items-center justify-center">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          onCanPlay={() => setIsVideoReady(true)}
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        
        {/* Torch Toggle Button */}
        {torchSupported && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTorch}
            className={`absolute bottom-6 right-6 z-30 p-4 rounded-full border-2 neo-brutalist transition-all duration-300 ${
              isTorchOn 
                ? 'bg-gold text-ink border-ink shadow-[0_0_20px_rgba(255,215,0,0.8)]' 
                : 'bg-ink/80 text-white border-white/50 backdrop-blur-sm'
            }`}
          >
            {isTorchOn ? <Flashlight size={28} /> : <FlashlightOff size={28} />}
          </motion.button>
        )}
        
        {/* Viewfinder Overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className={`w-64 h-64 border-4 ${success ? 'border-green-500' : 'border-gold'} relative transition-colors duration-300 overflow-hidden`}>
            {/* Corner accents */}
            <div className={`absolute -top-1 -left-1 w-4 h-4 ${success ? 'bg-green-500' : 'bg-gold'} transition-colors duration-300`}></div>
            <div className={`absolute -top-1 -right-1 w-4 h-4 ${success ? 'bg-green-500' : 'bg-gold'} transition-colors duration-300`}></div>
            <div className={`absolute -bottom-1 -left-1 w-4 h-4 ${success ? 'bg-green-500' : 'bg-gold'} transition-colors duration-300`}></div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${success ? 'bg-green-500' : 'bg-gold'} transition-colors duration-300`}></div>
            
            {/* Scanning Line */}
            {!success && isVideoReady && model && (
              <motion.div 
                className="absolute left-0 right-0 h-1 bg-gold/50 shadow-[0_0_15px_rgba(255,215,0,0.8)]"
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
              />
            )}
          </div>
        </div>

        {/* Status Overlays */}
        {success && (
          <div className="absolute inset-0 bg-green-500/80 flex flex-col items-center justify-center text-white z-20 animate-in fade-in duration-300">
            <CheckCircle2 size={80} className="mb-4" />
            <h2 className="text-3xl font-bold uppercase tracking-widest">Verified</h2>
            <p className="font-mono mt-2">Sector Unlocked!</p>
          </div>
        )}

        {!model && !error && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white z-20">
            <Loader2 size={48} className="animate-spin mb-4 text-gold" />
            <p className="font-mono uppercase">Loading AI Model...</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-bg p-6 border-t-4 border-ink z-10">
        {error && (
          <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 mb-4 text-sm font-mono flex items-start">
            <AlertCircle size={16} className="mr-2 mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        <div className="bg-white border-2 border-ink p-3 mb-4 text-sm font-mono flex justify-between items-center">
          <div className="overflow-hidden pr-2">
            <p className="opacity-60 text-[10px] uppercase mb-1">Live Analysis:</p>
            <p className="font-bold truncate text-xs">
              {scanResult ? scanResult.className : 'Waiting for camera...'}
            </p>
          </div>
          {scanResult && (
            <div className="text-right shrink-0">
              <p className="opacity-60 text-[10px] uppercase mb-1">Match</p>
              <p className="font-bold text-xs">{(scanResult.probability * 100).toFixed(1)}%</p>
            </div>
          )}
        </div>

        <div className={`
          w-full py-4 flex items-center justify-center neo-brutalist font-bold uppercase text-lg
          ${success && !isFreeMode ? 'bg-green-500 text-white' : (isFreeMode ? 'bg-[#c0aede] text-ink' : 'bg-gold text-ink')}
        `}>
          {success && !isFreeMode ? (
            <>
              <CheckCircle2 size={24} className="mr-2" />
              Verified
            </>
          ) : (
            <>
              <ScanLine size={24} className="mr-2 animate-pulse" />
              {isFreeMode ? 'Free Scanning...' : 'Auto-Scanning...'}
            </>
          )}
        </div>

        {/* Debug button for easy testing without a real camera/model match */}
        {!isFreeMode && (
          <button 
            onClick={handleDebugUnlock}
            className="w-full mt-4 py-2 text-xs font-mono text-gray-500 underline hover:text-ink"
          >
            [Debug] Force Unlock Sector
          </button>
        )}
      </div>
    </div>
  );
}
