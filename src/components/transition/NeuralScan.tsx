'use client';

import React, { useState, useEffect } from 'react';
import { sound } from '@/lib/audio';
import { Terminal, Cpu, Database, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

interface NeuralScanProps {
  subject: string;
  notesSample: string;
  onComplete: () => void;
}

export function NeuralScan({ subject, notesSample, onComplete }: NeuralScanProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const steps = [
    { text: 'Ingesting study material…', icon: Database, duration: 900 },
    { text: 'Mapping core concepts…', icon: Cpu, duration: 1000 },
    { text: 'Identifying examinable gaps…', icon: AlertTriangle, duration: 1000 },
    { text: 'Calibrating difficulty…', icon: Terminal, duration: 900 },
    { text: 'ProfessorX is ready.', icon: CheckCircle, duration: 700 }
  ];

  useEffect(() => {
    sound.playScanPing();

    const interval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 80);

    const timeouts: NodeJS.Timeout[] = [];
    let accumulatedTime = 0;

    steps.forEach((step, index) => {
      accumulatedTime += step.duration;
      const t = setTimeout(() => {
        setCurrentStep(index);
        sound.playTick();
        if (index === steps.length - 1) {
          setTimeout(() => {
            onComplete();
          }, 600);
        }
      }, accumulatedTime - step.duration);
      timeouts.push(t);
    });

    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl editorial-card rounded-3xl p-8 sm:p-12 text-center space-y-8 relative overflow-hidden">
        {/* Top Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-black/[0.06] text-xs font-typewriter text-neutral-600">
            <span>NEURAL SCANNER • STAGE {currentStep + 1} OF {steps.length}</span>
          </div>
          <h2 className="font-editorial text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
            Dissecting <span className="italic">{subject}</span>
          </h2>
          <p className="text-xs text-neutral-500 font-typewriter max-w-md mx-auto">
            Extracting core axioms and calibrating oral interrogation questions
          </p>
        </div>

        {/* Minimalist Hologram / Scan Graphic */}
        <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-black/10 animate-ping opacity-30" />
          <div className="absolute inset-2 rounded-full border border-rose-400/30 animate-spin" style={{ animationDuration: '6s' }} />
          <div className="absolute inset-6 rounded-full border border-dashed border-purple-400/40 animate-spin" style={{ animationDuration: '10s', animationDirection: 'reverse' }} />
          <div className="absolute inset-10 rounded-full bg-white shadow-xl flex items-center justify-center border border-black/[0.06]">
            <span className="font-typewriter text-2xl font-bold text-neutral-900">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Status Ticker */}
        <div className="space-y-4 max-w-md mx-auto">
          <div className="p-4 rounded-xl bg-neutral-50 border border-black/[0.06] text-left space-y-2">
            <div className="text-[11px] font-typewriter text-neutral-400 truncate">
              STREAM: {notesSample.slice(0, 140).replace(/\n/g, ' ')}...
            </div>
            
            <div className="flex items-center gap-2.5 text-sm font-bold font-typewriter text-neutral-900">
              {React.createElement(steps[currentStep]?.icon || Terminal, {
                className: 'w-4 h-4 text-rose-500 shrink-0'
              })}
              <span>{steps[currentStep]?.text}</span>
            </div>
          </div>

          {/* Minimalist Progress Line */}
          <div className="w-full bg-neutral-100 rounded-full h-1 overflow-hidden">
            <div 
              className="h-full bg-neutral-900 rounded-full transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Fast Proceed Button */}
          {currentStep >= 3 && (
            <button
              type="button"
              onClick={() => {
                sound.playTick();
                onComplete();
              }}
              className="editorial-pill-dark w-full py-3.5 px-6 font-typewriter font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>Enter Interrogation Room Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
