import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ONBOARDING_STEPS } from '../onboardingSteps';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

interface OnboardingModalProps {
  onComplete: () => void;
}

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-300">
      <div className="neo-brutalist-card bg-bg w-full max-w-sm flex flex-col relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        
        {/* Progress Dots */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {ONBOARDING_STEPS.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 w-2 border border-ink transition-all ${idx === currentStep ? 'bg-gold w-6' : 'bg-white'}`}
            />
          ))}
        </div>

        {/* Skip Button */}
        <button 
          onClick={onComplete}
          className="absolute top-2 right-2 p-2 text-gray-400 hover:text-ink transition-colors z-10"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="p-4 sm:p-6 pt-10 sm:pt-12 flex flex-col items-center text-center">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentStep}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="w-full flex flex-col items-center"
            >
              <motion.div 
                className="w-full aspect-video neo-brutalist bg-white mb-4 sm:mb-6 overflow-hidden"
                animate={currentStep === 0 ? { y: [0, -6, 0] } : {}}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              >
                <img 
                  src={step.image} 
                  alt={step.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              <h2 className="text-xl sm:text-2xl font-bold uppercase mb-2 sm:mb-3 tracking-tighter leading-none">
                {step.title}
              </h2>
              
              <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed mb-6 sm:mb-8 min-h-[4.5rem]">
                {step.description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="w-full flex gap-2 sm:gap-3 mt-auto">
            {currentStep > 0 && (
              <button 
                onClick={handleBack}
                className="neo-brutalist bg-white p-2 sm:p-3 hover:bg-gray-100 transition-colors flex items-center justify-center shrink-0"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            
            <button 
              onClick={handleNext}
              className="flex-1 neo-brutalist bg-gold hover:bg-gold-dark text-ink font-bold uppercase py-2 sm:py-3 flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
            >
              {step.buttonText}
              {!isLastStep && <ChevronRight size={20} />}
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-ink text-white/50 text-[10px] uppercase font-mono p-2 text-center mt-auto">
          WildMaps Orientation Protocol v1.0
        </div>
      </div>
    </div>
  );
}
