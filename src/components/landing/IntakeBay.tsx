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
  UploadCloud, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
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
    <div className="w-full max-w-6xl mx-auto px-6 lg:px-12 py-10 lg:py-16 space-y-14">
      {/* Editorial Hero Section (Exact Style of Reference Screenshot) */}
      <div className="space-y-8 max-w-4xl">
        {/* Main Serif Heading */}
        <div className="space-y-1">
          <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-900 leading-[1.08]">
            Hello, I’m ProfessorX.
          </h1>
          <h2 className="font-editorial text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-900 leading-[1.08]">
            Your notes interrogate you.
          </h2>
        </div>

        {/* Monospace Manifesto with Bold Keywords (Matching Reference) */}
        <div className="space-y-4 font-typewriter text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-2xl">
          <p>
            I have analyzed thousands of technical architectures across distributed computing, machine learning, and operating kernels.
          </p>
          <p>
            I value <strong className="text-neutral-900 font-bold">clarity</strong>, <strong className="text-neutral-900 font-bold">causality</strong>, and <strong className="text-neutral-900 font-bold">first principles</strong> above all else. These ideals guide my approach to exposing what you don’t know.
          </p>
        </div>

        {/* Ultra-thin Horizontal Divider Line */}
        <div className="editorial-divider pt-2" />
      </div>

      {/* 1-Click Gallery Presets (Matching Airbnb Card Style in Reference) */}
      <PresetSelector onSelect={handleSelectPreset} />

      {/* Main Intake Bay Container */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="editorial-card rounded-3xl p-7 sm:p-10 space-y-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-black/[0.06]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-typewriter text-xs text-neutral-400">01 / INPUT</span>
                <span className="text-neutral-300">•</span>
                <span className="text-xs font-typewriter text-rose-600 uppercase font-bold tracking-wider">
                  Material Ingestion
                </span>
              </div>
              <h3 className="font-editorial text-2xl font-bold text-neutral-900">
                Deposit Your Study Material
              </h3>
            </div>

            {/* Clean Pill Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-neutral-100 border border-black/[0.06] self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  sound.playTick();
                  setActiveTab('paste');
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-typewriter transition-all ${
                  activeTab === 'paste'
                    ? 'bg-neutral-900 text-white shadow'
                    : 'text-neutral-600 hover:text-neutral-900'
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
                className={`px-4 py-1.5 rounded-full text-xs font-typewriter transition-all ${
                  activeTab === 'upload'
                    ? 'bg-neutral-900 text-white shadow'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Upload File
              </button>
            </div>
          </div>

          {/* Subject & Exam Length Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="sm:col-span-2 space-y-2">
              <label className="text-xs font-typewriter uppercase tracking-wider text-neutral-500">
                Subject or Domain Name
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Distributed Systems, Transformer Architecture, Operating Systems"
                className="w-full px-4 py-3 rounded-xl bg-white border border-black/[0.1] focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm text-neutral-900 placeholder-neutral-400 font-typewriter transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-typewriter uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neutral-500" />
                <span>Exam Length</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 8, 12].map((len) => (
                  <button
                    key={len}
                    type="button"
                    onClick={() => {
                      sound.playTick();
                      setExamLength(len);
                    }}
                    className={`py-3 rounded-xl border text-xs font-typewriter font-bold transition-all ${
                      examLength === len
                        ? 'bg-neutral-900 border-neutral-900 text-white shadow'
                        : 'border-black/[0.08] bg-white text-neutral-600 hover:border-black/20'
                    }`}
                  >
                    {len} Qs
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab 1: Paste Textarea */}
          {activeTab === 'paste' ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-typewriter text-neutral-500">
                <span>Material Editor</span>
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
                className="w-full p-4 rounded-2xl bg-white border border-black/[0.1] focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm text-neutral-800 placeholder-neutral-400 font-typewriter transition-all resize-y leading-relaxed"
              />
            </div>
          ) : (
            /* Tab 2: Upload Dropzone */
            <div className="space-y-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-black/[0.15] hover:border-neutral-900 rounded-2xl p-10 text-center cursor-pointer bg-white/50 hover:bg-white transition-all group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.md,.pdf,text/plain,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6 text-neutral-700" />
                </div>
                <h4 className="text-sm font-bold text-neutral-900 mb-1">
                  {fileName ? fileName : 'Click or drop PDF / TXT study material here'}
                </h4>
                <p className="text-xs text-neutral-500 font-typewriter">
                  Supported formats: .pdf, .txt, .md (client-side extraction)
                </p>
                {isParsingFile && (
                  <p className="text-xs text-rose-600 font-typewriter mt-3 animate-pulse">
                    Extracting study material from file...
                  </p>
                )}
              </div>

              {notesContent && fileName && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-typewriter">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Extracted {notesContent.length.toLocaleString()} characters from &ldquo;{fileName}&rdquo;.</span>
                </div>
              )}
            </div>
          )}

          {/* Warning Message if any */}
          {fileWarning && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-800 font-typewriter">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p>{fileWarning}</p>
                <button
                  type="button"
                  onClick={() => setActiveTab('paste')}
                  className="underline hover:text-rose-950 mt-1 block font-bold"
                >
                  Switch to Paste Notes &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Persona Selector */}
          <div className="pt-6 border-t border-black/[0.06]">
            <PersonaSelector selected={persona} onChange={setPersona} />
          </div>

          {/* Intensity Controls */}
          <div className="pt-6 border-t border-black/[0.06] space-y-3">
            <div className="flex items-center justify-between text-xs font-typewriter uppercase text-neutral-500 tracking-wider">
              <span>Interrogation Intensity</span>
              <span>Pacing & Scrutiny Tolerance</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'gentle', title: 'Gentle', desc: '45s timer, forgiving tolerance, constructive tone' },
                { id: 'balanced', title: 'Balanced', desc: '30s timer, strict academic evaluation, standard pressure' },
                { id: 'brutal', title: 'Brutal', desc: '18s timer, merciless grading, relentless edge-case grilling' }
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
                    className={`editorial-card rounded-2xl p-4 text-left transition-all ${
                      isSelected
                        ? 'border-neutral-900 ring-2 ring-neutral-900 bg-white shadow-md'
                        : 'editorial-card-hover hover:border-black/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs uppercase font-typewriter text-neutral-900">
                        {lvl.title}
                      </span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-neutral-900" />}
                    </div>
                    <p className="text-xs text-neutral-500 leading-snug">{lvl.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Minimalist Dark Pill CTA Button (Exact Reference Style) */}
          <div className="pt-6 flex flex-col items-center space-y-3">
            <button
              type="submit"
              disabled={isLoading || isParsingFile}
              className="editorial-pill-dark px-10 py-4 font-typewriter font-bold text-sm tracking-wide uppercase transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Begin Interrogation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-center text-xs text-neutral-500 font-typewriter">
              Neural scanning initiates upon confirmation • Gemini Flash Structured Outputs
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
