'use client';

import React, { useState, useEffect } from 'react';
import { sound } from '@/lib/audio';
import { Terminal, Cpu, Database, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

interface NeuralScanProps {
  subject: string;
  notesSample: string;
  onComplete: () => void;
}

export function NeuralScan({ subject, notesSample, onComplete }: NeuralScanProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const steps = [
    { text: 'Ingesting study material…', icon: Database, duration: 1000 },
    { text: 'Mapping core concepts…', icon: Cpu, duration: 1100 },
    { text: 'Identifying examinable gaps…', icon: AlertTriangle, duration: 1100 },
    { text: 'Calibrating difficulty…', icon: Terminal, duration: 1000 },
    { text: 'ProfessorX is ready.', icon: CheckCircle, duration: 800 }
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
    }, 90);

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
          }, 800);
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
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl glass-panel-glow rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-violet-500/30 text-center space-y-8">
        {/* Holographic Scanline */}
        <div className="scanline-effect" />

        {/* Top Scanner HUD */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-mono">
            <Zap className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>NEURAL MATRIX SCANNER v4.2</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white uppercase">
            Dissecting <span className="text-violet-400">{subject}</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Extracting conceptual topologies & constructing targeted interrogations
          </p>
        </div>

        {/* Center Scanner Hologram Graphic */}
        <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
          {/* Animated concentric rings */}
          <div className="absolute inset-0 rounded-full border border-violet-500/30 animate-ping opacity-25" />
          <div className="absolute inset-2 rounded-full border border-cyan-500/40 animate-spin" style={{ animationDuration: '8s' }} />
          <div className="absolute inset-6 rounded-full border border-dashed border-violet-400/50 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
          <div className="absolute inset-10 rounded-full bg-gradient-to-br from-violet-600/30 to-cyan-500/30 backdrop-blur-md flex items-center justify-center shadow-inner">
            <span className="font-mono text-2xl font-black text-cyan-300">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Terminal Matrix Ticker */}
        <div className="space-y-4">
          <div className="bg-black/60 rounded-xl p-4 border border-white/10 font-mono text-left max-h-32 overflow-hidden relative">
            <div className="text-[11px] text-slate-500 line-clamp-3 mb-2 font-mono">
              &gt; RAW_STREAM: {notesSample.slice(0, 220).replace(/\n/g, ' ')}...
            </div>
            
            <div className="flex items-center gap-3 text-sm font-bold text-white">
              {React.createElement(steps[currentStep]?.icon || Terminal, {
                className: 'w-4 h-4 text-cyan-400 animate-pulse shrink-0'
              })}
              <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">
                {steps[currentStep]?.text}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden p-0.5 border border-white/10">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>CALIBRATING GEMINI FLASH AGENT</span>
            <span>STAGE {currentStep + 1} OF {steps.length}</span>
          </div>

          {currentStep >= 3 && (
            <button
              type="button"
              onClick={() => {
                sound.playTick();
                onComplete();
              }}
              className="w-full mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-violet-600/30 border border-white/20 transition-all flex items-center justify-center gap-2 animate-pulse hover:animate-none"
            >
              <span>Enter Interrogation Room Now</span>
              <Zap className="w-4 h-4 text-cyan-300" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
