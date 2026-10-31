'use client';

import React, { useState } from 'react';
import { DEMO_PRESETS, DemoPreset } from '@/lib/mockData';
import { sound } from '@/lib/audio';
import { ArrowUpRight, Share2, Heart, ChevronLeft, ShieldCheck, Cpu, Database } from 'lucide-react';

interface PresetSelectorProps {
  onSelect: (preset: DemoPreset) => void;
}

export function PresetSelector({ onSelect }: PresetSelectorProps) {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const activePreset = DEMO_PRESETS[activeIdx];

  const getSubcategories = (id: string) => {
    switch (id) {
      case 'distributed-systems':
        return [
          { name: 'Leader Election', tag: 'Term Log' },
          { name: 'Split Brain', tag: 'Quorum (N/2+1)' },
          { name: 'Log Commit', tag: 'Byzantine' }
        ];
      case 'transformer-mechanics':
        return [
          { name: 'Self-Attention', tag: 'Q·Kᵀ / √dₖ' },
          { name: 'KV Cache', tag: 'Inference O(1)' },
          { name: 'RoPE Embeddings', tag: 'Rotary Phase' }
        ];
      case 'os-virtual-memory':
      default:
        return [
          { name: 'Page Tables', tag: '4-Level Walk' },
          { name: 'TLB Thrashing', tag: 'Hugepages' },
          { name: 'Dirty Invalidation', tag: 'Kernel Trap' }
        ];
    }
  };

  const subcats = getSubcategories(activePreset.id);

  return (
    <div className="space-y-8">
      {/* Featured Editorial Layout (Exact Match to User Reference Screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
        {/* Left Column: Large Serif Title & Manifesto */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="font-typewriter text-xs uppercase tracking-widest text-rose-600 font-bold">
              Featured Study Dossier
            </span>
            <h3 className="font-editorial text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 leading-[1.12]">
              {activePreset.title.split('&')[0]}
              {activePreset.title.includes('&') && (
                <>
                  <br />
                  <span className="italic font-normal text-neutral-700">
                    & {activePreset.title.split('&')[1]}
                  </span>
                </>
              )}
            </h3>
          </div>

          <p className="font-typewriter text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-lg">
            {activePreset.subtitle}. Sourced directly from premier systems engineering syllabi and production architecture incident post-mortems.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                sound.playTick();
                onSelect(activePreset);
              }}
              className="editorial-pill-dark px-7 py-3 text-xs font-typewriter font-bold uppercase tracking-wider flex items-center gap-3 transition-transform"
            >
              <span>Load This Dossier</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Thin Vertical Divider + Monospace Number (Matching Reference Screenshot) */}
        <div className="hidden lg:flex lg:col-span-1 items-start justify-center gap-3 self-stretch">
          <div className="w-[1px] bg-neutral-300 h-full min-h-[220px]" />
          <span className="font-typewriter text-sm font-bold text-neutral-800 pt-1">
            0{activeIdx + 1}
          </span>
        </div>

        {/* Right Column: Device / Mockup Card (Matching Airbnb Card in Reference) */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="w-full max-w-[340px] bg-white rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-neutral-200/80 space-y-4">
            {/* Mockup Header Controls */}
            <div className="flex items-center justify-between text-neutral-500 pb-2 border-b border-neutral-100">
              <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center">
                <ChevronLeft className="w-4 h-4 text-neutral-700" />
              </div>
              <div className="font-typewriter text-[11px] font-bold text-neutral-800">
                {activePreset.subject}
              </div>
              <div className="flex items-center gap-2">
                <Share2 className="w-3.5 h-3.5 text-neutral-500 hover:text-neutral-900 cursor-pointer" />
                <Heart className="w-3.5 h-3.5 text-neutral-500 hover:text-rose-500 cursor-pointer" />
              </div>
            </div>

            {/* Mockup Preview Carousel / Grid matching photo viewer in screenshot */}
            <div className="space-y-2">
              <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-4 text-white space-y-2 relative overflow-hidden">
                <div className="text-[10px] font-typewriter text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                  Oral Interrogation Drill
                </div>
                <div className="font-editorial text-lg font-bold leading-tight">
                  &ldquo;Prove why 2 partitioned nodes out of 5 can never commit.&rdquo;
                </div>
                <div className="text-[10px] font-typewriter text-neutral-400">
                  Target: Quorum Majority Rule
                </div>
              </div>

              {/* 3 mini cards below main photo preview (matching Exterior, Living room, Loft in reference) */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {subcats.map((sub, i) => (
                  <div key={i} className="bg-neutral-50 rounded-xl p-2 border border-neutral-100 text-center space-y-1">
                    <div className="text-[10px] font-bold text-neutral-900 font-typewriter truncate">
                      {sub.name}
                    </div>
                    <div className="text-[8px] font-typewriter text-neutral-500 truncate">
                      {sub.tag}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action */}
            <button
              type="button"
              onClick={() => {
                sound.playTick();
                onSelect(activePreset);
              }}
              className="w-full py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-800 text-xs font-typewriter font-bold transition-all text-center flex items-center justify-center gap-2"
            >
              <span>Ingest Study Notes</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Preset Switcher Tabs */}
      <div className="pt-4 border-t border-black/[0.08] flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs font-typewriter text-neutral-500 uppercase tracking-wider">
          Available Presets (03)
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {DEMO_PRESETS.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                sound.playTick();
                setActiveIdx(idx);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-typewriter transition-all ${
                activeIdx === idx
                  ? 'bg-neutral-900 text-white shadow-sm font-bold'
                  : 'bg-white/80 text-neutral-600 hover:text-neutral-900 hover:bg-white border border-black/[0.06]'
              }`}
            >
              0{idx + 1} {p.subject}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
