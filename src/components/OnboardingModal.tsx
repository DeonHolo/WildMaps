import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ONBOARDING_STEPS } from '../onboardingSteps';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { playSubtleClick } from '../utils/audio';

gsap.registerPlugin(useGSAP);

interface OnboardingModalProps {
  onComplete: () => void;
}

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const step = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;
  
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Initial modal entrance and continuous animations
  useGSAP(() => {
    // Modal background fade in
    gsap.fromTo(overlayRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.4 }
    );

    // Modal container bounce in with a slight spin
    gsap.fromTo(containerRef.current, {
      y: 100,
      opacity: 0,
      scale: 0.8,
      rotation: -5,
      transformPerspective: 1000
    }, {
      y: 0,
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 0.8,
      ease: 'back.out(1.2)',
    });
    
    // Smooth, purely vertical float for image (fixed sideways issue)
    gsap.to(imageRef.current, {
      y: -12,
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });
  }, { scope: overlayRef });

  // Animate content change with more flair
  useGSAP(() => {
    if (!contentRef.current) return;
    
    const elements = contentRef.current.children;
    
    gsap.fromTo(elements, 
      { 
        x: direction * 60, 
        opacity: 0,
        scale: 0.85,
        rotation: direction * 4
      },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'back.out(1.4)',
        onComplete: () => setIsAnimating(false)
      }
    );
  }, [currentStep]);

  const closeTutorial = () => {
    gsap.to(containerRef.current, {
      y: 50,
      opacity: 0,
      scale: 0.9,
      rotation: 5,
      duration: 0.3,
      ease: 'power3.in'
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power3.in',
      onComplete
    });
  };

  const handleNext = () => {
    if (isAnimating) return;
    playSubtleClick();
    
    if (isLastStep) {
      closeTutorial();
    } else {
      setIsAnimating(true);
      setDirection(1);
      gsap.to(contentRef.current?.children || [], {
        x: -60,
        opacity: 0,
        scale: 0.85,
        rotation: -4,
        duration: 0.3,
        stagger: 0.04,
        ease: 'power3.in',
        onComplete: () => {
          setCurrentStep(prev => prev + 1);
        }
      });
    }
  };

  const handleBack = () => {
    if (isAnimating || currentStep === 0) return;
    playSubtleClick();
    setIsAnimating(true);
    setDirection(-1);
    gsap.to(contentRef.current?.children || [], {
      x: 60,
      opacity: 0,
      scale: 0.85,
      rotation: 4,
      duration: 0.3,
      stagger: 0.04,
      ease: 'power3.in',
      onComplete: () => {
        setCurrentStep(prev => prev - 1);
      }
    });
  };

  const handleSkip = () => {
    playSubtleClick();
    closeTutorial();
  };

  return (
    <div ref={overlayRef} className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-hidden">
      {/* 
        Image Preloader: 
        Renders all tutorial images hidden in the DOM as soon as modal opens, 
        ensuring they are cached by the browser and eliminating the white flash on slide changes.
      */}
      <div className="hidden">
        {ONBOARDING_STEPS.map(s => (
          <img key={`preload-${s.image}`} src={s.image} alt="Preload" />
        ))}
      </div>

      <div 
        ref={containerRef}
        className="neo-brutalist-card bg-bg w-full max-w-sm flex flex-col relative max-h-[90vh] overflow-visible"
      >
        {/* Progress Dots */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {ONBOARDING_STEPS.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 border border-ink transition-all duration-500 ease-out ${idx === currentStep ? 'bg-gold w-8 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white w-2'}`}
            />
          ))}
        </div>

        {/* Skip Button */}
        <button 
          onClick={handleSkip}
          className="absolute top-2 right-2 p-2 text-gray-400 hover:text-ink transition-colors z-[100] hover:rotate-90 duration-300 bg-transparent hover:bg-white/50 rounded-full"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="p-4 sm:p-6 pt-12 sm:pt-14 flex flex-col items-center text-center h-full bg-white relative z-0">
          <div ref={contentRef} className="w-full flex flex-col items-center flex-1">
            <div className="w-full mb-6 sm:mb-8">
              <div 
                ref={imageRef}
                className="w-full aspect-video neo-brutalist bg-white overflow-hidden relative group shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="absolute inset-0 bg-gold/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-10" />
                <img 
                  key={step.image}
                  src={step.image} 
                  alt={step.title} 
                  className="w-full h-full object-cover relative z-0 animate-[fadeIn_0.3s_ease-out]"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black uppercase mb-3 sm:mb-4 tracking-tighter leading-none text-ink">
              {step.title}
            </h2>
            
            <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed mb-6 sm:mb-8 min-h-[5rem]">
              {step.description}
            </p>
          </div>

          <div className="w-full flex gap-2 sm:gap-3 mt-auto pt-4 border-t-4 border-ink border-dashed">
            {currentStep > 0 && (
              <button 
                onClick={handleBack}
                disabled={isAnimating}
                className="neo-brutalist bg-gray-100 p-3 sm:p-4 hover:bg-white hover:-translate-x-1 transition-all flex items-center justify-center shrink-0 disabled:opacity-50 mt-4"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            
            <button 
              onClick={handleNext}
              disabled={isAnimating}
              className="flex-1 neo-brutalist bg-gold hover:bg-gold-dark hover:translate-x-1 hover:-translate-y-1 text-ink font-black uppercase py-3 sm:py-4 flex items-center justify-center gap-2 transition-all text-base sm:text-lg disabled:opacity-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] mt-4"
            >
              {step.buttonText}
              {!isLastStep && <ChevronRight size={24} className="animate-pulse" />}
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-ink text-white/50 text-[10px] uppercase font-mono p-2 text-center mt-auto border-t-4 border-ink">
          WildMaps Orientation Protocol v2.0
        </div>
      </div>
    </div>
  );
}
