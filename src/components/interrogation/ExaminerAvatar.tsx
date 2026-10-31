'use client';

import React from 'react';
import { ExaminerPersona, ExaminerMood } from '@/lib/types';
import { Bot, Sparkles, AlertOctagon, ThumbsUp, HelpCircle } from 'lucide-react';

interface ExaminerAvatarProps {
  persona: ExaminerPersona;
  mood: ExaminerMood;
  speechText?: string;
  pressure: number;
}

export function ExaminerAvatar({ persona, mood, speechText, pressure }: ExaminerAvatarProps) {
  // Determine avatar glow and mood details
  const getMoodAura = () => {
    switch (mood) {
      case 'merciless':
        return {
          glow: 'shadow-rose-500/30 border-rose-500/60 bg-rose-950/30',
          eyeColor: '#F43F5E',
          status: 'MERCILESS SCRUTINY',
          icon: AlertOctagon,
          badgeColor: 'text-rose-400 border-rose-500/40 bg-rose-950/50'
        };
      case 'impressed':
        return {
          glow: 'shadow-emerald-500/30 border-emerald-500/60 bg-emerald-950/30',
          eyeColor: '#34D399',
          status: 'GRUDGINGLY SATISFIED',
          icon: ThumbsUp,
          badgeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/50'
        };
      case 'skeptical':
        return {
          glow: 'shadow-amber-500/30 border-amber-500/60 bg-amber-950/30',
          eyeColor: '#F59E0B',
          status: 'HIGH SKEPTICISM',
          icon: HelpCircle,
          badgeColor: 'text-amber-400 border-amber-500/40 bg-amber-950/50'
        };
      case 'intrigued':
        return {
          glow: 'shadow-violet-500/30 border-violet-500/60 bg-violet-950/30',
          eyeColor: '#8B5CF6',
          status: 'TESTING LIMITS',
          icon: Sparkles,
          badgeColor: 'text-violet-400 border-violet-500/40 bg-violet-950/50'
        };
      default:
        return {
          glow: 'shadow-cyan-500/20 border-cyan-500/40 bg-cyan-950/20',
          eyeColor: '#22D3EE',
          status: 'ANALYTICAL BASELINE',
          icon: Bot,
          badgeColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/50'
        };
    }
  };

  const aura = getMoodAura();

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Holographic Avatar Frame */}
      <div className="relative group">
        {/* Pulsing Aura Ring */}
        <div 
          className={`absolute -inset-1.5 rounded-2xl blur-md transition-all duration-500 opacity-70 ${
            mood === 'merciless' ? 'bg-rose-600/40' : mood === 'impressed' ? 'bg-emerald-600/40' : 'bg-violet-600/30'
          }`} 
        />

        {/* Dynamic Holographic SVG Face */}
        <div className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-2 flex items-center justify-center backdrop-blur-xl shadow-2xl transition-all duration-500 overflow-hidden ${aura.glow}`}>
          {/* Subtle grid in avatar */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:12px_12px]" />

          {/* SVG Robotic / Holographic Face */}
          <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-24 sm:h-24 transition-transform duration-300">
            {/* Outer Helmet / Head Geometry */}
            <polygon
              points="20,25 50,12 80,25 88,60 75,88 25,88 12,60"
              fill="rgba(15, 23, 42, 0.85)"
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth="2"
            />

            {/* Forehead Circuit Core */}
            <circle cx="50" cy="24" r="3.5" fill={aura.eyeColor} className="animate-pulse" />
            <line x1="50" y1="28" x2="50" y2="40" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" />

            {/* Left Eye Visor */}
            <path
              d={
                mood === 'merciless'
                  ? 'M 28 46 L 44 50 L 42 54 L 27 50 Z'
                  : mood === 'skeptical'
                  ? 'M 28 48 L 44 48 L 42 53 L 28 53 Z'
                  : 'M 27 48 L 43 48 L 41 54 L 27 54 Z'
              }
              fill={aura.eyeColor}
              filter="drop-shadow(0px 0px 3px currentColor)"
            />

            {/* Right Eye Visor */}
            <path
              d={
                mood === 'merciless'
                  ? 'M 72 46 L 56 50 L 58 54 L 73 50 Z'
                  : mood === 'skeptical'
                  ? 'M 72 44 L 56 46 L 58 51 L 72 49 Z'
                  : 'M 73 48 L 57 48 L 59 54 L 73 54 Z'
              }
              fill={aura.eyeColor}
              filter="drop-shadow(0px 0px 3px currentColor)"
            />

            {/* Nose Bridge Sensors */}
            <circle cx="50" cy="58" r="1.5" fill="rgba(255, 255, 255, 0.4)" />
            <circle cx="50" cy="64" r="1.5" fill="rgba(255, 255, 255, 0.4)" />

            {/* Mouth / Speaker Bar */}
            <rect
              x="36"
              y="74"
              width="28"
              height="3.5"
              rx="1.75"
              fill={mood === 'merciless' ? '#F43F5E' : mood === 'impressed' ? '#34D399' : 'rgba(255, 255, 255, 0.3)'}
            />

            {/* Corner Tech Accents */}
            <circle cx="20" cy="25" r="2" fill="rgba(255, 255, 255, 0.5)" />
            <circle cx="80" cy="25" r="2" fill="rgba(255, 255, 255, 0.5)" />
          </svg>

          {/* Holographic sweep overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-cyan-400/5 to-transparent pointer-events-none animate-pulse" />
        </div>
      </div>

      {/* Persona Info & Mood Badge */}
      <div className="text-center space-y-1">
        <h3 className="text-sm font-bold text-white tracking-tight">{persona.name}</h3>
        <p className="text-[11px] text-slate-400 font-mono">{persona.title}</p>
        
        <div className="pt-1">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider border uppercase ${aura.badgeColor}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
            {aura.status}
          </span>
        </div>
      </div>

      {/* Examiner Speech Bubble */}
      {speechText && (
        <div className="w-full relative mt-2">
          {/* Bubble tail */}
          <div className="w-3 h-3 bg-[#0d111e] border-l border-t border-violet-500/30 transform rotate-45 mx-auto -mb-1.5 relative z-10" />
          <div className="p-3.5 rounded-xl bg-[#0d111e]/90 border border-violet-500/30 shadow-xl backdrop-blur-md">
            <p className="text-xs font-mono text-violet-200 leading-relaxed italic">
              &ldquo;{speechText}&rdquo;
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
