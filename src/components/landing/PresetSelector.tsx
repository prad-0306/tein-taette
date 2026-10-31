'use client';

import React from 'react';
import { DEMO_PRESETS, DemoPreset } from '@/lib/mockData';
import { sound } from '@/lib/audio';
import { Zap, Sparkles } from 'lucide-react';

interface PresetSelectorProps {
  onSelect: (preset: DemoPreset) => void;
}

export function PresetSelector({ onSelect }: PresetSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-300">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>1-Click Hackathon Demo Presets</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {DEMO_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => {
              sound.playTick();
              onSelect(preset);
            }}
            className="group text-left p-3 rounded-lg border border-white/10 hover:border-cyan-500/50 bg-white/[0.02] hover:bg-cyan-950/20 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                  {preset.badge}
                </span>
                <Zap className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </div>
              <h5 className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-1">
                {preset.title}
              </h5>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                {preset.subtitle}
              </p>
            </div>
            <span className="text-[10px] font-mono text-cyan-400/80 mt-2 flex items-center gap-1">
              Click to load notes &rarr;
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
