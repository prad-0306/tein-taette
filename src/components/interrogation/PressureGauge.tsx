'use client';

import React from 'react';
import { Flame, AlertTriangle, ShieldCheck } from 'lucide-react';

interface PressureGaugeProps {
  pressure: number; // 0 to 100
  intensity: 'gentle' | 'balanced' | 'brutal';
}

export function PressureGauge({ pressure, intensity }: PressureGaugeProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(pressure)));

  const getPressureColor = () => {
    if (clamped >= 75) {
      return {
        bar: 'bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600',
        text: 'text-rose-400',
        border: 'border-rose-500/40',
        label: 'CRITICAL SCRUTINY',
        icon: AlertTriangle
      };
    } else if (clamped >= 45) {
      return {
        bar: 'bg-gradient-to-r from-cyan-500 via-violet-500 to-amber-500',
        text: 'text-amber-400',
        border: 'border-amber-500/40',
        label: 'HIGH TENSION',
        icon: Flame
      };
    } else {
      return {
        bar: 'bg-gradient-to-r from-cyan-500 to-violet-500',
        text: 'text-cyan-400',
        border: 'border-cyan-500/40',
        label: 'CONTROLLED',
        icon: ShieldCheck
      };
    }
  };

  const style = getPressureColor();

  return (
    <div className="w-full glass-panel rounded-xl p-3.5 space-y-2 border border-white/10">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
          {React.createElement(style.icon, { className: `w-3.5 h-3.5 ${style.text}` })}
          <span>Room Pressure</span>
        </span>
        <span className={`font-bold text-sm ${style.text}`}>
          {clamped}%
        </span>
      </div>

      {/* Main Track & Fill */}
      <div className="w-full bg-black/60 rounded-full h-2.5 overflow-hidden p-0.5 border border-white/10">
        <div
          className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
          style={{ width: `${clamped}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>MODE: {intensity.toUpperCase()}</span>
        <span className={`uppercase font-bold ${style.text}`}>{style.label}</span>
      </div>
    </div>
  );
}
