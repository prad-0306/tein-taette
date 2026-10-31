'use client';

import React from 'react';
import { ExaminerPersonaId } from '@/lib/types';
import { EXAMINER_PERSONAS } from '@/lib/mockData';
import { sound } from '@/lib/audio';
import { Check } from 'lucide-react';

interface PersonaSelectorProps {
  selected: ExaminerPersonaId;
  onChange: (id: ExaminerPersonaId) => void;
}

export function PersonaSelector({ selected, onChange }: PersonaSelectorProps) {
  const personas = Object.values(EXAMINER_PERSONAS);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-typewriter uppercase text-neutral-500 tracking-wider">
        <span>Examiner Persona</span>
        <span>Choose Examiner Demeanor</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {personas.map((persona, index) => {
          const isSelected = selected === persona.id;
          const num = `0${index + 1}`;

          return (
            <button
              key={persona.id}
              type="button"
              onClick={() => {
                sound.playTick();
                onChange(persona.id);
              }}
              className={`editorial-card rounded-2xl p-5 text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'border-neutral-900 ring-2 ring-neutral-900 shadow-xl bg-white'
                  : 'editorial-card-hover hover:border-black/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-black/[0.06]">
                  <span className="font-typewriter text-xs font-bold text-neutral-400">
                    {num}
                  </span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <h4 className="font-editorial text-lg font-bold text-neutral-900 mb-0.5">
                  {persona.name}
                </h4>
                <p className="text-xs font-typewriter text-neutral-500 mb-3">
                  {persona.title}
                </p>

                <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                  {persona.description}
                </p>
              </div>

              <div className="pt-3 border-t border-black/[0.06]">
                <p className="text-xs font-editorial italic text-neutral-500">
                  &ldquo;{persona.tagline}&rdquo;
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
