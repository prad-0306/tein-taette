'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Shield, Terminal, RotateCcw } from 'lucide-react';
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

  const getStageBadge = () => {
    switch (stage) {
      case 'landing':
        return { text: 'SYSTEM READY', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' };
      case 'scanning':
        return { text: 'NEURAL EXTRACTION', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 animate-pulse' };
      case 'interrogating':
        return { text: 'INTERROGATION ACTIVE', color: 'bg-violet-500/20 text-violet-400 border-violet-500/40 animate-pulse' };
      case 'report':
        return { text: 'DIAGNOSTIC DEBRIEF', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40' };
    }
  };

  const stageBadge = getStageBadge();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#05060A]/80 backdrop-blur-xl px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20 border border-white/20">
            <span className="font-mono font-black text-white text-lg tracking-wider">X</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white font-mono">
                Professor<span className="text-violet-400">X</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full border border-violet-500/30 bg-violet-950/40 text-violet-300">
                Next-Gen Agent
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
              Adaptive AI Oral-Exam Simulator • Track 1: Applied AI
            </p>
          </div>
        </div>

        {/* Center Status Pill */}
        <div className="flex items-center gap-2">
          <div className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono tracking-wider ${stageBadge.color}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
            {stageBadge.text}
          </div>

          {isLiveAI !== undefined && (
            <div className={`text-[11px] font-mono px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${
              isLiveAI 
                ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300' 
                : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
            }`}>
              <Shield className="w-3 h-3" />
              <span>{isLiveAI ? 'Gemini 2.5 Flash' : 'High-Fidelity Sim'}</span>
            </div>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleSound}
            title={muted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-2 rounded-lg border border-white/10 hover:border-violet-500/50 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
            aria-label="Toggle Sound"
          >
            {muted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-violet-400" />}
          </button>

          {stage !== 'landing' && onReset && (
            <button
              onClick={() => {
                sound.playTick();
                onReset();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-rose-500/40 bg-white/5 hover:bg-rose-950/30 text-xs font-mono text-slate-300 hover:text-rose-300 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Abort / Reset</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
