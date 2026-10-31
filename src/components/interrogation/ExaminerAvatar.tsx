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
  const getMoodAura = () => {
    switch (mood) {
      case 'merciless':
        return {
          eyeColor: '#E11D48',
          status: 'Merciless Scrutiny',
          icon: AlertOctagon,
          badgeColor: 'text-rose-700 bg-rose-50 border-rose-200'
        };
      case 'impressed':
        return {
          eyeColor: '#059669',
          status: 'Grudgingly Satisfied',
          icon: ThumbsUp,
          badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200'
        };
      case 'skeptical':
        return {
          eyeColor: '#D97706',
          status: 'High Skepticism',
          icon: HelpCircle,
          badgeColor: 'text-amber-700 bg-amber-50 border-amber-200'
        };
      case 'intrigued':
        return {
          eyeColor: '#7C3AED',
          status: 'Testing Limits',
          icon: Sparkles,
          badgeColor: 'text-purple-700 bg-purple-50 border-purple-200'
        };
      default:
        return {
          eyeColor: '#2563EB',
          status: 'Analytical Baseline',
          icon: Bot,
          badgeColor: 'text-neutral-700 bg-neutral-100 border-neutral-200'
        };
    }
  };

  const aura = getMoodAura();

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Holographic Geometric Avatar */}
      <div className="relative group">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border border-black/[0.08] bg-white shadow-xl flex items-center justify-center p-3 relative overflow-hidden">
          <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 transition-transform duration-300">
            {/* Outer Helmet Geometry */}
            <polygon
              points="20,25 50,12 80,25 88,60 75,88 25,88 12,60"
              fill="#F9FAFB"
              stroke="#111827"
              strokeWidth="2.5"
            />
            {/* Forehead Core */}
            <circle cx="50" cy="24" r="3.5" fill={aura.eyeColor} />
            <line x1="50" y1="28" x2="50" y2="40" stroke="#9CA3AF" strokeWidth="1.5" />

            {/* Eyes */}
            <rect
              x="28"
              y="46"
              width="15"
              height="6"
              rx="1.5"
              fill={aura.eyeColor}
            />
            <rect
              x="57"
              y="46"
              width="15"
              height="6"
              rx="1.5"
              fill={aura.eyeColor}
            />

            {/* Mouth */}
            <rect
              x="36"
              y="74"
              width="28"
              height="3.5"
              rx="1.75"
              fill="#1F2937"
            />
          </svg>
        </div>
      </div>

      {/* Persona Info & Mood Badge */}
      <div className="text-center space-y-1">
        <h3 className="font-editorial text-lg font-bold text-neutral-900 leading-snug">
          {persona.name}
        </h3>
        <p className="text-xs font-typewriter text-neutral-500">
          {persona.title}
        </p>
        
        <div className="pt-1.5">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-typewriter border ${aura.badgeColor}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
            {aura.status}
          </span>
        </div>
      </div>

      {/* Examiner Speech Bubble (Editorial Quote Style) */}
      {speechText && (
        <div className="w-full relative mt-3 p-4 rounded-2xl bg-neutral-50 border border-black/[0.06] shadow-sm">
          <p className="text-xs font-editorial italic text-neutral-700 leading-relaxed text-center">
            &ldquo;{speechText}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
