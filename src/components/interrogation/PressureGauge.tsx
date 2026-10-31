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
        bar: 'bg-rose-600',
        text: 'text-rose-600',
        label: 'Critical Tension',
        icon: AlertTriangle
      };
    } else if (clamped >= 45) {
      return {
        bar: 'bg-amber-500',
        text: 'text-amber-600',
        label: 'Elevated Pressure',
        icon: Flame
      };
    } else {
      return {
        bar: 'bg-neutral-900',
        text: 'text-neutral-700',
        label: 'Equilibrium',
        icon: ShieldCheck
      };
    }
  };

  const style = getPressureColor();

  return (
    <div className="editorial-card rounded-2xl p-4 space-y-2.5">
      <div className="flex items-center justify-between text-xs font-typewriter">
        <span className="text-neutral-500 flex items-center gap-1.5 uppercase">
          {React.createElement(style.icon, { className: `w-3.5 h-3.5 ${style.text}` })}
          <span>Room Pressure</span>
        </span>
        <span className={`font-bold ${style.text}`}>
          {clamped}%
        </span>
      </div>

      {/* Main Track & Fill */}
      <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
          style={{ width: `${clamped}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] font-typewriter text-neutral-400">
        <span>{intensity.toUpperCase()} MODE</span>
        <span className={`font-medium ${style.text}`}>{style.label}</span>
      </div>
    </div>
  );
}
