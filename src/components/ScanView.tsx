import { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { Camera, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { LandmarkId, LANDMARKS } from '../types';

interface ScanViewProps {
  targetId: LandmarkId | null;
  onUnlock: (id: LandmarkId) => void;
  onCancel: () => void;
}

export default function ScanView({ targetId, onUnlock, onCancel }: ScanViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ className: string; probability: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const target = targetId ? LANDMARKS[targetId] : null;

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
      } catch (err) {
        console.error('Error accessing camera', err);
        setError('Camera access denied or unavailable.');
      }
    };
    
    setupCamera();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleScan = async () => {
    if (!model || !videoRef.current || !targetId) return;
    
    setIsScanning(true);
    setScanResult(null);
    setError(null);
    
    try {
      // Small delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const predictions = await model.classify(videoRef.current);
      
      if (predictions && predictions.length > 0) {
        const topPrediction = predictions[0];
        setScanResult(topPrediction);
        
        // In a real app, we would check if topPrediction.className matches the landmark.
        // For this prototype, we'll accept any prediction with > 0.1 confidence
        // or just simulate success to allow the user to progress.
        if (topPrediction.probability > 0.1) {
          setSuccess(true);
          setTimeout(() => {
            onUnlock(targetId);
          }, 2000);
        } else {
          setError('Landmark not recognized. Try getting closer or improving lighting.');
        }
      }
    } catch (err) {
      console.error('Scan failed', err);
      setError('Scan failed. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  // Debug unlock for testing
  const handleDebugUnlock = () => {
    if (targetId) {
      setSuccess(true);
      setTimeout(() => {
        onUnlock(targetId);
      }, 1000);
    }
  };

  if (!target) {
    return (
      <div className="absolute inset-0 p-6 flex flex-col items-center justify-center">
        <div className="neo-brutalist-card bg-white p-6 text-center max-w-sm">
          <AlertCircle size={48} className="mx-auto mb-4 text-maroon" />
          <h2 className="text-xl font-bold uppercase mb-2">No Target Selected</h2>
          <p className="mb-6">Please select a locked sector from the map first.</p>
          <button 
            onClick={onCancel}
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
          <h2 className="text-sm font-mono uppercase opacity-80">Current Target</h2>
          <p className="font-bold text-lg">{target.name}</p>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-white/20 rounded-full transition-colors">
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
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        
        {/* Viewfinder Overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className={`w-64 h-64 border-4 ${success ? 'border-green-500' : 'border-gold'} relative transition-colors duration-300`}>
            {/* Corner accents */}
            <div className="absolute -top-1 -left-1 w-4 h-4 bg-gold"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold"></div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gold"></div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gold"></div>
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
        
        {scanResult && !success && (
          <div className="bg-white border-2 border-ink p-3 mb-4 text-sm font-mono">
            <p className="opacity-60 text-xs uppercase mb-1">AI Analysis:</p>
            <p className="font-bold truncate">{scanResult.className}</p>
            <p className="text-xs mt-1">Confidence: {(scanResult.probability * 100).toFixed(1)}%</p>
          </div>
        )}

        <button 
          onClick={handleScan}
          disabled={!model || isScanning || success}
          className={`
            w-full py-4 flex items-center justify-center neo-brutalist font-bold uppercase text-lg
            ${(!model || isScanning || success) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gold text-ink hover:bg-gold-dark'}
          `}
        >
          {isScanning ? (
            <>
              <Loader2 size={24} className="animate-spin mr-2" />
              Analyzing...
            </>
          ) : (
            <>
              <Camera size={24} className="mr-2" />
              Scan Landmark
            </>
          )}
        </button>

        {/* Debug button for easy testing without a real camera/model match */}
        <button 
          onClick={handleDebugUnlock}
          className="w-full mt-4 py-2 text-xs font-mono text-gray-500 underline hover:text-ink"
        >
          [Debug] Force Unlock Sector
        </button>
      </div>
    </div>
  );
}
