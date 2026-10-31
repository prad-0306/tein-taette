'use client';

import React from 'react';
import { ExaminerPersonaId } from '@/lib/types';
import { EXAMINER_PERSONAS } from '@/lib/mockData';
import { sound } from '@/lib/audio';
import { GraduationCap, Briefcase, Skull, Check } from 'lucide-react';

interface PersonaSelectorProps {
  selected: ExaminerPersonaId;
  onChange: (id: ExaminerPersonaId) => void;
}

export function PersonaSelector({ selected, onChange }: PersonaSelectorProps) {
  const personas = Object.values(EXAMINER_PERSONAS);

  const getIcon = (id: ExaminerPersonaId) => {
    switch (id) {
      case 'professor':
        return <GraduationCap className="w-5 h-5 text-indigo-400" />;
      case 'interviewer':
        return <Briefcase className="w-5 h-5 text-cyan-400" />;
      case 'ruthless':
        return <Skull className="w-5 h-5 text-rose-400" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
          Examiner Persona
        </label>
        <span className="text-[11px] text-slate-400 font-mono">
          Shapes tone, scrutiny & reaction style
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {personas.map((persona) => {
          const isSelected = selected === persona.id;
          return (
            <button
              key={persona.id}
              type="button"
              onClick={() => {
                sound.playTick();
                onChange(persona.id);
              }}
              className={`text-left p-4 rounded-xl border transition-all relative flex flex-col justify-between group ${
                isSelected
                  ? 'bg-violet-950/30 border-violet-500 shadow-lg shadow-violet-500/10 ring-1 ring-violet-500/50'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-violet-500/20' : 'bg-white/5'}`}>
                    {getIcon(persona.id)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">{persona.name}</h4>
                    <p className="text-[11px] text-slate-400 font-mono">{persona.title}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {persona.description}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5">
                <span className="text-[10px] font-mono italic text-violet-300/80">
                  &ldquo;{persona.tagline}&rdquo;
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
