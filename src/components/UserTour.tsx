"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { X, ChevronRight, ChevronLeft, HelpCircle } from 'lucide-react';

export interface TourStep {
  targetId: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface UserTourProps {
  tourId: string;
  steps: TourStep[];
  autoStart?: boolean;
}

export default function UserTour({ tourId, steps, autoStart = true }: UserTourProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  
  const step = steps[currentStep];

  useEffect(() => {
    const hasSeen = localStorage.getItem(`tour_seen_${tourId}`);
    if (!hasSeen && autoStart) {
      setIsOpen(true);
    }
  }, [tourId, autoStart]);

  const updateCoords = () => {
    if (!isOpen || !step) return;
    const element = document.getElementById(step.targetId);
    if (element) {
      const rect = element.getBoundingClientRect();
      setCoords({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });

      // Calculate tooltip position
      const padding = 12;
      let tTop = 0;
      let tLeft = 0;

      const pos = step.position || 'bottom';

      if (pos === 'bottom') {
        tTop = rect.bottom + window.scrollY + padding;
        tLeft = rect.left + window.scrollX + (rect.width / 2) - 150; // assuming width 300
      } else if (pos === 'top') {
        tTop = rect.top + window.scrollY - 180; // assuming height 160
        tLeft = rect.left + window.scrollX + (rect.width / 2) - 150;
      } else if (pos === 'right') {
        tTop = rect.top + window.scrollY;
        tLeft = rect.right + window.scrollX + padding;
      } else if (pos === 'left') {
        tTop = rect.top + window.scrollY;
        tLeft = rect.left + window.scrollX - 300 - padding;
      }

      // Constrain to viewport
      tLeft = Math.max(10, Math.min(tLeft, window.innerWidth - 310));
      
      setTooltipPos({ top: tTop, left: tLeft });
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useLayoutEffect(() => {
    updateCoords();
    window.addEventListener('resize', updateCoords);
    return () => window.removeEventListener('resize', updateCoords);
  }, [isOpen, currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsOpen(false);
    localStorage.setItem(`tour_seen_${tourId}`, 'true');
  };

  const startTour = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={startTour}
        className="fixed bottom-6 right-6 z-40 bg-secondary border border-border-subtle p-3 rounded-full text-secondary-text hover:text-accent hover:border-accent/50 transition-all shadow-xl group"
        title="Start Tour"
      >
        <HelpCircle className="w-6 h-6" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-secondary border border-border-subtle px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Quick Tour</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Knockout Overlay */}
      <div 
        className="absolute inset-0 bg-black/80"
        style={{
          clipPath: `polygon(
            0% 0%, 0% 100%, 
            ${coords.left}px 100%, 
            ${coords.left}px ${coords.top}px, 
            ${coords.left + coords.width}px ${coords.top}px, 
            ${coords.left + coords.width}px ${coords.top + coords.height}px, 
            ${coords.left}px ${coords.top + coords.height}px, 
            ${coords.left}px 100%, 
            100% 100%, 100% 0%
          )`
        }}
      />

      {/* Tooltip */}
      <div 
        className="absolute w-[300px] bg-secondary border border-accent/30 rounded-2xl p-6 shadow-2xl pointer-events-auto animate-in fade-in zoom-in-95 duration-200"
        style={{ top: tooltipPos.top, left: tooltipPos.left }}
      >
        <div className="flex justify-between items-start mb-3">
          <h4 className="text-sm font-black text-accent uppercase tracking-widest">{step.title}</h4>
          <button onClick={handleComplete} className="text-secondary-text hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-foreground mb-6 leading-relaxed">
          {step.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-mono text-secondary-text">
            Step {currentStep + 1} of {steps.length}
          </div>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <button onClick={handleBack} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-secondary-text">
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <button 
              onClick={handleNext}
              className="px-4 py-2 bg-accent text-black font-bold text-xs rounded-lg hover:bg-accent/90 transition-all flex items-center gap-1"
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
              {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Pointer Arrow */}
        <div 
          className="absolute w-4 h-4 bg-secondary border-t border-l border-accent/20 rotate-45"
          style={{
            top: step.position === 'bottom' ? -8 : 'auto',
            bottom: step.position === 'top' ? -8 : 'auto',
            left: 'calc(50% - 8px)',
            display: (step.position === 'left' || step.position === 'right') ? 'none' : 'block'
          }}
        />
      </div>
    </div>
  );
}
