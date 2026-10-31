'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  FinalReportData, 
  GradeLetter, 
  RepairAction 
} from '@/lib/types';
import { sound } from '@/lib/audio';
import { generateMarkdownReport, downloadMarkdownFile } from '@/lib/markdownExporter';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Trophy, 
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  Flame, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Target, 
  ArrowRight,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

interface FinalReportProps {
  report: FinalReportData;
  onRetryWeakTopics: () => void;
  onIncreaseBrutality: () => void;
  onStartFresh: () => void;
}

export function FinalReport({
  report,
  onRetryWeakTopics,
  onIncreaseBrutality,
  onStartFresh
}: FinalReportProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const [expandedSolutions, setExpandedSolutions] = useState<Record<number, boolean>>({});

  useEffect(() => {
    sound.playGradeReveal();

    if (report.grade === 'S' || report.grade === 'A') {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  }, [report.grade]);

  const toggleSolution = (idx: number) => {
    sound.playTick();
    setExpandedSolutions((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleCopyPlan = () => {
    const text = report.repairPlan
      .map(
        (r, i) =>
          `Action Item ${i + 1} (${r.topic}):\nPrescription: ${r.actionItem}\nPractice Question: ${r.practiceQuestion.question}\nSolution: ${r.practiceQuestion.solution}\n`
      )
      .join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    sound.playTick();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadReport = () => {
    sound.playTick();
    const mdContent = generateMarkdownReport(report);
    const sanitizedSubject = report.subject.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    downloadMarkdownFile(`professorx_report_${sanitizedSubject}`, mdContent);
  };

  const getGradeBadge = (grade: GradeLetter) => {
    switch (grade) {
      case 'S':
        return {
          color: 'from-amber-400 via-yellow-300 to-amber-500 text-amber-950 border-amber-300 shadow-amber-500/50',
          title: 'ELITE APEX MASTERY',
          desc: 'Immaculate conceptual defense. Survived deep edge-case cross-examination.'
        };
      case 'A':
        return {
          color: 'from-cyan-400 via-sky-300 to-indigo-400 text-slate-950 border-cyan-300 shadow-cyan-500/50',
          title: 'SUPERIOR RIGOR',
          desc: 'High-level synthesis with minor boundary hesitation.'
        };
      case 'B':
        return {
          color: 'from-violet-400 via-indigo-300 to-purple-400 text-violet-950 border-violet-300 shadow-violet-500/50',
          title: 'COMPETENT BASELINE',
          desc: 'Sound fundamental intuition, but vulnerable to corner-case traps.'
        };
      case 'C':
        return {
          color: 'from-amber-500 via-orange-400 to-amber-600 text-amber-950 border-amber-400 shadow-amber-500/50',
          title: 'CONCEPTUAL INSTABILITY',
          desc: 'Superficial memorization. Foundational axioms fractured during stress testing.'
        };
      case 'D':
        return {
          color: 'from-rose-500 via-red-400 to-rose-600 text-white border-rose-400 shadow-rose-500/50',
          title: 'SYSTEMIC FAILURE',
          desc: 'Critical misconceptions corrupted multiple fundamental causal chains.'
        };
    }
  };

  const gradeInfo = getGradeBadge(report.grade);

  const radarData = report.topicMasteries.map((tm) => ({
    topic: tm.topic.length > 14 ? `${tm.topic.slice(0, 12)}…` : tm.topic,
    mastery: tm.mastery
  }));

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 lg:py-12 space-y-10">
      {/* Grade Reveal Banner */}
      <div className="glass-panel-glow rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden border border-white/20 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-violet-500/30 bg-violet-950/40 text-violet-300 text-xs font-mono">
          <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>FINAL INTERROGATION DEBRIEF</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white uppercase">
            Diagnostic Verdict: <span className="text-violet-300">{report.subject}</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Generated autonomously by ProfessorX Adaptive Diagnostic Engine
          </p>
        </div>

        {/* Animated Grade Stamp Hologram */}
        <div className="relative py-4 flex flex-col items-center justify-center">
          <div className="relative group">
            {/* Glowing outer ring */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-violet-600 to-cyan-500 opacity-40 blur-xl animate-pulse" />
            <div className={`relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br ${gradeInfo.color} border-4 flex items-center justify-center shadow-2xl transition-transform hover:scale-105`}>
              <span className="font-mono text-6xl sm:text-7xl font-black tracking-tighter drop-shadow-md">
                {report.grade}
              </span>
            </div>
          </div>

          <div className="mt-5 space-y-1">
            <h3 className="text-sm sm:text-base font-bold font-mono tracking-wider text-white uppercase">
              {gradeInfo.title}
            </h3>
            <p className="text-xs text-slate-300 font-sans max-w-md mx-auto">
              {gradeInfo.desc}
            </p>
          </div>
        </div>

        {/* Core Stats Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Overall Score</span>
            <span className="text-xl sm:text-2xl font-mono font-black text-cyan-300">{report.overallScore}%</span>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Inquiries</span>
            <span className="text-xl sm:text-2xl font-mono font-black text-white">{report.totalQuestions}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Strongest Domain</span>
            <span className="text-xs sm:text-sm font-mono font-bold text-emerald-400 truncate block mt-1">
              {report.strongestTopics[0] || 'Baseline'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Primary Gap</span>
            <span className="text-xs sm:text-sm font-mono font-bold text-rose-400 truncate block mt-1">
              {report.weakTopics[0]?.topic || 'None'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Radar Breakdown & Weakness Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Final Radar Topology */}
        <div className="md:col-span-5 glass-panel rounded-2xl p-5 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Tested Mastery Topology
              </h4>
              <span className="text-[10px] font-mono text-cyan-400">FINAL RADAR</span>
            </div>

            {radarData.length >= 3 && (
              <div className="w-full h-56 relative my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius="70%">
                    <PolarGrid stroke="rgba(255, 255, 255, 0.12)" />
                    <PolarAngleAxis 
                      dataKey="topic" 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} 
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 100]} 
                      tick={{ fill: '#64748b', fontSize: 9 }} 
                      stroke="rgba(255, 255, 255, 0.1)"
                    />
                    <Radar
                      name="Final Mastery"
                      dataKey="mastery"
                      stroke="#22D3EE"
                      fill="#8B5CF6"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t border-white/10">
            {report.topicMasteries.map((tm) => (
              <div key={tm.topic} className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 truncate max-w-[170px]">{tm.topic}</span>
                <span className={`font-bold ${
                  tm.mastery >= 70 ? 'text-emerald-400' : tm.mastery >= 50 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {tm.mastery}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Detected Misconceptions Log */}
        <div className="md:col-span-7 glass-panel rounded-2xl p-5 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Misconceptions Exposed</span>
            </h4>
            <span className="text-[11px] font-mono text-rose-400 font-bold">
              {report.misconceptionsSummary.length} Detected
            </span>
          </div>

          {report.misconceptionsSummary.length === 0 ? (
            <div className="p-6 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-center space-y-2">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-xs text-emerald-300 font-mono font-bold">
                No Catastrophic Conceptual Fractures Triggered
              </p>
              <p className="text-[11px] text-slate-400">
                You defended your axioms with exceptional precision across all adaptive trials.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {report.misconceptionsSummary.map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-black/40 border border-rose-500/30 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-rose-300 font-bold">{m.topic}</span>
                    <span className="text-[10px] text-slate-500">GAP #{idx + 1}</span>
                  </div>
                  <div className="text-xs font-sans text-slate-300 space-y-1">
                    <p className="text-slate-400">
                      <strong className="text-rose-400 font-mono text-[11px]">Assumed:</strong> {m.whatYouThought}
                    </p>
                    <p className="text-slate-200">
                      <strong className="text-emerald-400 font-mono text-[11px]">Real Invariant:</strong> {m.reality}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actionable Repair Plan & Remedial Practice Drills */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-white/20 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              <span>Personalized Repair Plan</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Specific remedial actions and custom practice drills to repair exposed vulnerabilities
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyPlan}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-white/10 hover:border-cyan-500/40 bg-white/5 hover:bg-cyan-950/30 text-xs font-mono text-slate-300 hover:text-cyan-300 transition-all self-start sm:self-auto"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Plan Copied!' : 'Copy Revision Plan'}</span>
          </button>
        </div>

        {/* Repair Plan Cards */}
        <div className="space-y-4">
          {report.repairPlan.map((item, idx) => {
            const isExpanded = !!expandedSolutions[idx];

            return (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-3.5"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-2.5 py-0.5 rounded-md bg-violet-950/60 border border-violet-500/40 text-violet-300 font-bold uppercase">
                    Action Item {idx + 1}: {item.topic}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">TARGETED DRILL</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  {item.actionItem}
                </p>

                {/* Practice Question */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 font-bold uppercase">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Practice Challenge</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {item.practiceQuestion.question}
                  </p>

                  <p className="text-[11px] font-mono italic text-slate-400 pt-1">
                    Hint: {item.practiceQuestion.hint}
                  </p>

                  {/* Collapsible Solution Toggle */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => toggleSolution(idx)}
                      className="text-xs font-mono text-cyan-300 hover:text-cyan-200 flex items-center gap-1 transition-colors"
                    >
                      <span>{isExpanded ? 'Hide Solution' : 'Reveal Solution'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-2.5 p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-xs font-mono text-cyan-200 leading-relaxed">
                        {item.practiceQuestion.solution}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Strategic Next Steps */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs font-mono">
          <span className="text-slate-400 uppercase tracking-wider font-bold block">
            Strategic Next Steps for Absolute Mastery:
          </span>
          <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
            {report.nextSteps.map((step, idx) => (
              <li key={idx} className="leading-relaxed">{step}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Global Actions Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Retry Weak Topics */}
        <button
          type="button"
          onClick={() => {
            sound.playTick();
            onRetryWeakTopics();
          }}
          className="py-3.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-mono font-bold text-xs uppercase tracking-wider border border-white/20 transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Weak Topics</span>
        </button>

        {/* Increase Brutality */}
        <button
          type="button"
          onClick={() => {
            sound.playTick();
            onIncreaseBrutality();
          }}
          className="py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs uppercase tracking-wider border border-white/20 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20"
        >
          <Flame className="w-4 h-4" />
          <span>Increase Brutality</span>
        </button>

        {/* Download Report */}
        <button
          type="button"
          onClick={handleDownloadReport}
          className="py-3.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs uppercase tracking-wider border border-white/20 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20"
        >
          <Download className="w-4 h-4" />
          <span>Download Markdown</span>
        </button>

        {/* Start Fresh */}
        <button
          type="button"
          onClick={() => {
            sound.playTick();
            onStartFresh();
          }}
          className="py-3.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-mono font-bold text-xs uppercase tracking-wider border border-white/10 transition-all flex items-center justify-center gap-2"
        >
          <span>New Notes / Reset</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
