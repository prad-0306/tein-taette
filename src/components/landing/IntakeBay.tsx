'use client';

import React, { useState, useRef } from 'react';
import { 
  ExaminerPersonaId, 
  PressureIntensity, 
  ExamConfig 
} from '@/lib/types';
import { DEMO_PRESETS, DemoPreset } from '@/lib/mockData';
import { parseUploadedFile } from '@/lib/pdfParser';
import { sound } from '@/lib/audio';
import { PersonaSelector } from './PersonaSelector';
import { PresetSelector } from './PresetSelector';
import { 
  FileText, 
  UploadCloud, 
  Flame, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface IntakeBayProps {
  onStartExam: (config: ExamConfig) => void;
  isLoading?: boolean;
}

export function IntakeBay({ onStartExam, isLoading }: IntakeBayProps) {
  const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste');
  const [notesContent, setNotesContent] = useState<string>(DEMO_PRESETS[0].content);
  const [subject, setSubject] = useState<string>(DEMO_PRESETS[0].subject);
  const [examLength, setExamLength] = useState<number>(5);
  const [persona, setPersona] = useState<ExaminerPersonaId>('professor');
  const [intensity, setIntensity] = useState<PressureIntensity>('balanced');
  
  // File upload state
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileWarning, setFileWarning] = useState<string | null>(null);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectPreset = (preset: DemoPreset) => {
    setNotesContent(preset.content);
    setSubject(preset.subject);
    setFileName(null);
    setFileWarning(null);
    setActiveTab('paste');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingFile(true);
    setFileWarning(null);
    setFileName(file.name);

    try {
      const result = await parseUploadedFile(file);
      if (result.success && result.text) {
        setNotesContent(result.text);
        if (!subject || subject === 'Study Notes') {
          // Infer subject from filename
          const inferred = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          setSubject(inferred.charAt(0).toUpperCase() + inferred.slice(1));
        }
      } else {
        setFileWarning(result.warning || 'Could not parse text. Please paste your notes directly.');
      }
    } catch {
      setFileWarning('An error occurred during file extraction. Please paste your notes directly.');
    } finally {
      setIsParsingFile(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notesContent.trim()) {
      setFileWarning('Please provide study notes by pasting text, uploading a file, or choosing a demo preset.');
      return;
    }
    sound.playScanPing();
    onStartExam({
      subject: subject.trim() || 'General Subject',
      notesContent: notesContent.trim(),
      examLength,
      persona,
      intensity
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 lg:py-12 space-y-10">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-violet-500/30 bg-violet-950/40 text-violet-300 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Track 1: Applied AI & Next-Gen Autonomous Agents</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-mono uppercase">
          Your notes are about to <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">interrogate you</span>.
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans max-w-2xl mx-auto">
          ProfessorX reads your material, hunts your weak concepts, and adapts every question to expose what you don’t know.
        </p>
      </div>

      {/* 1-Click Demo Presets Bar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5">
        <PresetSelector onSelect={handleSelectPreset} />
      </div>

      {/* Main Intake Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="glass-panel-glow rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Header & Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <FileText className="w-4 h-4 text-violet-400" />
                <span>Ingest Study Material</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Paste lecture notes, study guides, or upload a TXT/PDF document
              </p>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-black/40 border border-white/10 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  sound.playTick();
                  setActiveTab('paste');
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                  activeTab === 'paste'
                    ? 'bg-violet-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Paste Notes
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playTick();
                  setActiveTab('upload');
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                  activeTab === 'upload'
                    ? 'bg-violet-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Upload File (PDF / TXT)
              </button>
            </div>
          </div>

          {/* Subject Field */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                Subject or Domain Name
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Distributed Consensus, Transformer Architecture, Operating Systems"
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 text-sm text-white placeholder-slate-500 transition-all font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Exam Length</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[5, 8, 12].map((len) => (
                  <button
                    key={len}
                    type="button"
                    onClick={() => {
                      sound.playTick();
                      setExamLength(len);
                    }}
                    className={`py-2 rounded-lg border text-xs font-mono font-bold transition-all ${
                      examLength === len
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400/40'
                        : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {len} Qs
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content: Paste vs Upload */}
          {activeTab === 'paste' ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Direct Material Textarea</span>
                <span>{notesContent.length.toLocaleString()} characters</span>
              </div>
              <textarea
                value={notesContent}
                onChange={(e) => {
                  setNotesContent(e.target.value);
                  setFileWarning(null);
                }}
                rows={9}
                placeholder="Paste your study notes, markdown outlines, or textbook excerpts here..."
                className="w-full p-4 rounded-xl bg-black/60 border border-white/10 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 text-sm text-slate-200 placeholder-slate-600 font-mono transition-all resize-y leading-relaxed"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/20 hover:border-violet-500/60 rounded-xl p-8 text-center cursor-pointer bg-white/[0.01] hover:bg-violet-950/20 transition-all group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.md,.pdf,text/plain,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-violet-600/20 border border-violet-500/40 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6 text-violet-400" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">
                  {fileName ? fileName : 'Click or drag PDF/TXT file here'}
                </h4>
                <p className="text-xs text-slate-400 font-mono">
                  Supported formats: .pdf, .txt, .md (client-side extraction)
                </p>
                {isParsingFile && (
                  <p className="text-xs text-cyan-400 font-mono mt-3 animate-pulse">
                    Extracting study material from file...
                  </p>
                )}
              </div>

              {notesContent && fileName && (
                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Extracted {notesContent.length.toLocaleString()} characters from &ldquo;{fileName}&rdquo;. Ready for neural scan.</span>
                </div>
              )}
            </div>
          )}

          {/* Warning Message if any */}
          {fileWarning && (
            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/40 flex items-start gap-2.5 text-xs text-rose-300 font-mono">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p>{fileWarning}</p>
                <button
                  type="button"
                  onClick={() => setActiveTab('paste')}
                  className="underline hover:text-white mt-1 block"
                >
                  Switch to Paste Notes tab &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Persona Selector */}
          <div className="pt-4 border-t border-white/10">
            <PersonaSelector selected={persona} onChange={setPersona} />
          </div>

          {/* Intensity Controls */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Interrogation Intensity</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                Scales timer speed, pressure meter & strictness
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'gentle', title: 'Gentle', desc: '45s timer, forgiving tolerance, constructive tone', color: 'border-emerald-500/40 text-emerald-300' },
                { id: 'balanced', title: 'Balanced', desc: '30s timer, strict academic evaluation, standard pressure', color: 'border-violet-500/40 text-violet-300' },
                { id: 'brutal', title: 'Brutal', desc: '18s timer, merciless grading, relentless edge-case grilling', color: 'border-rose-500/40 text-rose-300' }
              ].map((lvl) => {
                const isSelected = intensity === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => {
                      sound.playTick();
                      setIntensity(lvl.id as PressureIntensity);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? `bg-black/60 ring-1 ring-white/30 ${lvl.color}`
                        : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs uppercase tracking-wider">{lvl.title}</span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-current animate-ping" />}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">{lvl.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading || isParsingFile}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-mono font-bold text-base tracking-wider uppercase shadow-xl shadow-violet-600/25 border border-white/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Begin Interrogation</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-center text-[11px] text-slate-400 font-mono mt-2">
              Neural scanning initiates upon confirmation • Gemini 2.5 Flash Structured Ingestion
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
