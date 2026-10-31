'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Shield, RotateCcw } from 'lucide-react';
import { sound } from '@/lib/audio';

interface HeaderHUDProps {
  stage: 'landing' | 'scanning' | 'interrogating' | 'report';
  onReset?: () => void;
  isLiveAI?: boolean;
}

export function HeaderHUD({ stage, onReset, isLiveAI }: HeaderHUDProps) {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(sound.isMuted());
  }, []);

  const handleToggleSound = () => {
    const next = sound.toggleMute();
    setMuted(next);
    if (!next) sound.playTick();
  };

  const getStageLabel = () => {
    switch (stage) {
      case 'landing':
        return 'Ready';
      case 'scanning':
        return 'Neural Ingestion';
      case 'interrogating':
        return 'Interrogation Live';
      case 'report':
        return 'Diagnostic Debrief';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/[0.06] bg-[#FAF9F6]/80 backdrop-blur-md px-6 lg:px-12 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Minimalist Geometric Line Logo (Exact Match to User Screenshot) */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-8 h-8 stroke-neutral-900 fill-none stroke-[1.4]" strokeLinecap="round" strokeLinejoin="round">
              {/* Outer Triangle */}
              <polygon points="16,3 2,29 30,29" />
              {/* Internal diagonal stripes matching reference screenshot */}
              <line x1="8" y1="17.5" x2="14" y2="29" />
              <line x1="12" y1="10" x2="21" y2="29" />
              <line x1="16" y1="3" x2="28" y2="27" />
            </svg>
          </div>
          <div>
            <span className="font-editorial text-xl font-bold tracking-tight text-neutral-900">
              Professor<span className="italic font-normal">X</span>
            </span>
          </div>
        </div>

        {/* Right Navigation & Status (Matching Reference 'Work', 'About' simplicity) */}
        <div className="flex items-center gap-6 sm:gap-8">
          <span className="text-xs font-typewriter text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer hidden sm:inline">
            Prescriptions
          </span>
          <span className="text-xs font-typewriter text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer hidden sm:inline">
            Architecture
          </span>
          {/* Status Badge */}
          <div className="flex items-center gap-2 text-xs font-typewriter text-neutral-600">
            <span className={`w-2 h-2 rounded-full ${
              stage === 'interrogating' ? 'bg-rose-500 animate-ping' : stage === 'scanning' ? 'bg-purple-500 animate-pulse' : 'bg-emerald-500'
            }`} />
            <span className="hidden sm:inline">{getStageLabel()}</span>
          </div>

          {/* AI Engine Indicator */}
          {isLiveAI !== undefined && (
            <div className="hidden md:flex items-center gap-1.5 text-xs font-typewriter px-3 py-1 rounded-full bg-neutral-900 text-white shadow-sm">
              <Shield className="w-3 h-3 text-rose-400" />
              <span>{isLiveAI ? 'Gemini Flash' : 'High-Fidelity Sim'}</span>
            </div>
          )}

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            title={muted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-1.5 text-neutral-600 hover:text-neutral-900 transition-colors"
            aria-label="Toggle Sound"
          >
            {muted ? <VolumeX className="w-4 h-4 text-neutral-400" /> : <Volume2 className="w-4 h-4 text-neutral-800" />}
          </button>

          {/* Reset Action */}
          {stage !== 'landing' && onReset && (
            <button
              onClick={() => {
                sound.playTick();
                onReset();
              }}
              className="flex items-center gap-1.5 text-xs font-typewriter text-neutral-600 hover:text-rose-600 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
