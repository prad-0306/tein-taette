'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  FinalReportData, 
  GradeLetter 
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
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  Flame, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
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
          particleCount: 100,
          spread: 70,
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

  const getGradeInfo = (grade: GradeLetter) => {
    switch (grade) {
      case 'S':
        return {
          color: 'text-amber-600 border-amber-300 bg-amber-50',
          title: 'Exemplary Apex Mastery',
          desc: 'Immaculate conceptual defense. Survived deep edge-case cross-examination.'
        };
      case 'A':
        return {
          color: 'text-neutral-900 border-neutral-900 bg-neutral-50',
          title: 'Superior Academic Rigor',
          desc: 'High-level synthesis with minor boundary hesitation.'
        };
      case 'B':
        return {
          color: 'text-purple-700 border-purple-300 bg-purple-50',
          title: 'Competent Baseline Intuition',
          desc: 'Sound fundamental intuition, but vulnerable to corner-case traps.'
        };
      case 'C':
        return {
          color: 'text-amber-700 border-amber-300 bg-amber-50',
          title: 'Conceptual Instability',
          desc: 'Superficial familiarity. Foundational axioms fractured during stress testing.'
        };
      case 'D':
        return {
          color: 'text-rose-700 border-rose-300 bg-rose-50',
          title: 'Systemic Conceptual Failure',
          desc: 'Critical misconceptions corrupted multiple fundamental causal chains.'
        };
    }
  };

  const gradeInfo = getGradeInfo(report.grade);

  const radarData = report.topicMasteries.map((tm) => ({
    topic: tm.topic.length > 14 ? `${tm.topic.slice(0, 12)}…` : tm.topic,
    mastery: tm.mastery
  }));

  return (
    <div className="w-full max-w-5xl mx-auto px-6 lg:px-12 py-10 lg:py-16 space-y-12">
      {/* Grade Stamp Header */}
      <div className="editorial-card rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-100 border border-black/[0.06] text-xs font-typewriter text-neutral-600">
          <FileCheck className="w-3.5 h-3.5 text-neutral-800" />
          <span>FINAL INTERROGATION DEBRIEF</span>
        </div>

        <div className="space-y-2">
          <h1 className="font-editorial text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
            Diagnostic Verdict: <span className="italic">{report.subject}</span>
          </h1>
          <p className="text-xs text-neutral-500 font-typewriter">
            Generated autonomously by ProfessorX Adaptive Diagnostic Engine
          </p>
        </div>

        {/* Grade Stamp */}
        <div className="relative py-4 flex flex-col items-center justify-center">
          <div className={`w-32 h-32 sm:w-36 sm:h-36 rounded-3xl border-2 ${gradeInfo.color} flex items-center justify-center shadow-xl transition-transform hover:scale-105`}>
            <span className="font-editorial text-7xl sm:text-8xl font-black">
              {report.grade}
            </span>
          </div>

          <div className="mt-5 space-y-1">
            <h3 className="font-editorial text-xl font-bold text-neutral-900">
              {gradeInfo.title}
            </h3>
            <p className="text-xs text-neutral-600 font-sans max-w-md mx-auto">
              {gradeInfo.desc}
            </p>
          </div>
        </div>

        {/* Summary Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-black/[0.06]">
          <div className="p-4 rounded-2xl bg-neutral-50 border border-black/[0.04]">
            <span className="text-[10px] font-typewriter text-neutral-400 uppercase block">Overall Score</span>
            <span className="text-2xl font-typewriter font-bold text-neutral-900">{report.overallScore}%</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-black/[0.04]">
            <span className="text-[10px] font-typewriter text-neutral-400 uppercase block">Total Inquiries</span>
            <span className="text-2xl font-typewriter font-bold text-neutral-900">{report.totalQuestions}</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-black/[0.04]">
            <span className="text-[10px] font-typewriter text-neutral-400 uppercase block">Strongest Domain</span>
            <span className="text-xs sm:text-sm font-typewriter font-bold text-emerald-700 truncate block mt-1">
              {report.strongestTopics[0] || 'Baseline'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-black/[0.04]">
            <span className="text-[10px] font-typewriter text-neutral-400 uppercase block">Primary Gap</span>
            <span className="text-xs sm:text-sm font-typewriter font-bold text-rose-700 truncate block mt-1">
              {report.weakTopics[0]?.topic || 'None'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Radar Breakdown & Weakness Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left: Final Radar */}
        <div className="md:col-span-5 editorial-card rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-black/[0.06]">
              <h4 className="font-editorial text-lg font-bold text-neutral-900">
                Mastery Topology
              </h4>
              <span className="text-[10px] font-typewriter text-neutral-500">FINAL RADAR</span>
            </div>

            {radarData.length >= 3 && (
              <div className="w-full h-56 relative my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius="72%">
                    <PolarGrid stroke="rgba(0, 0, 0, 0.08)" />
                    <PolarAngleAxis 
                      dataKey="topic" 
                      tick={{ fill: '#4B5563', fontSize: 10, fontFamily: 'monospace' }} 
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 100]} 
                      tick={{ fill: '#9CA3AF', fontSize: 9 }} 
                      stroke="rgba(0, 0, 0, 0.06)"
                    />
                    <Radar
                      name="Final Mastery"
                      dataKey="mastery"
                      stroke="#111827"
                      fill="#8B5CF6"
                      fillOpacity={0.25}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-3 border-t border-black/[0.06]">
            {report.topicMasteries.map((tm) => (
              <div key={tm.topic} className="flex items-center justify-between text-xs font-typewriter">
                <span className="text-neutral-600 truncate max-w-[170px]">{tm.topic}</span>
                <span className={`font-bold ${
                  tm.mastery >= 70 ? 'text-emerald-700' : tm.mastery >= 50 ? 'text-amber-700' : 'text-rose-700'
                }`}>
                  {tm.mastery}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Misconceptions Log */}
        <div className="md:col-span-7 editorial-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
            <h4 className="font-editorial text-lg font-bold text-neutral-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Misconceptions Exposed</span>
            </h4>
            <span className="text-xs font-typewriter text-rose-600 font-bold">
              {report.misconceptionsSummary.length} Detected
            </span>
          </div>

          {report.misconceptionsSummary.length === 0 ? (
            <div className="p-8 rounded-2xl bg-emerald-50 text-center space-y-2 border border-emerald-200">
              <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="font-editorial text-base text-emerald-900 font-bold">
                No Catastrophic Misconceptions Triggered
              </p>
              <p className="text-xs text-emerald-700 font-sans">
                You defended your axioms with exceptional precision across all adaptive trials.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {report.misconceptionsSummary.map((m, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-neutral-50 border border-black/[0.06] space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-typewriter">
                    <span className="text-neutral-900 font-bold">{m.topic}</span>
                    <span className="text-[10px] text-neutral-400">GAP #{idx + 1}</span>
                  </div>
                  <div className="text-xs font-sans text-neutral-700 space-y-1">
                    <p className="text-neutral-600">
                      <strong className="text-rose-700 font-typewriter text-[11px]">Assumed:</strong> {m.whatYouThought}
                    </p>
                    <p className="text-neutral-900">
                      <strong className="text-emerald-700 font-typewriter text-[11px]">Real Invariant:</strong> {m.reality}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actionable Repair Plan */}
      <div className="editorial-card rounded-3xl p-8 sm:p-10 space-y-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-black/[0.06]">
          <div>
            <h3 className="font-editorial text-2xl font-bold text-neutral-900">
              Personalized Repair Plan
            </h3>
            <p className="text-xs text-neutral-500 font-typewriter mt-1">
              Targeted remedial practice drills to reinforce exposed vulnerabilities
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyPlan}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-black/[0.1] bg-white hover:bg-neutral-50 text-xs font-typewriter text-neutral-700 transition-all self-start sm:self-auto shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
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
                className="p-6 rounded-2xl bg-neutral-50 border border-black/[0.06] space-y-4"
              >
                <div className="flex items-center justify-between text-xs font-typewriter">
                  <span className="px-3 py-1 rounded-full bg-white border border-black/[0.08] text-neutral-900 font-bold">
                    Action Item {idx + 1}: {item.topic}
                  </span>
                  <span className="text-[11px] text-neutral-400">TARGETED DRILL</span>
                </div>

                <p className="text-sm text-neutral-800 leading-relaxed font-sans">
                  {item.actionItem}
                </p>

                {/* Practice Challenge Box */}
                <div className="p-4 rounded-xl bg-white border border-black/[0.06] space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-typewriter text-neutral-700 font-bold uppercase">
                    <HelpCircle className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Practice Challenge</span>
                  </div>

                  <p className="text-xs text-neutral-700 leading-relaxed font-sans">
                    {item.practiceQuestion.question}
                  </p>

                  <p className="text-[11px] font-editorial italic text-neutral-500 pt-1">
                    Hint: {item.practiceQuestion.hint}
                  </p>

                  {/* Toggle Solution */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => toggleSolution(idx)}
                      className="text-xs font-typewriter text-neutral-900 hover:text-rose-600 flex items-center gap-1 transition-colors font-bold"
                    >
                      <span>{isExpanded ? 'Hide Solution' : 'Reveal Solution'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 p-3.5 rounded-xl bg-neutral-100 border border-black/[0.06] text-xs font-typewriter text-neutral-900 leading-relaxed">
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
        <div className="p-5 rounded-2xl bg-white border border-black/[0.06] space-y-2 text-xs font-typewriter">
          <span className="text-neutral-500 uppercase tracking-wider font-bold block">
            Strategic Next Steps:
          </span>
          <ul className="space-y-1.5 text-neutral-700 list-disc list-inside">
            {report.nextSteps.map((step, idx) => (
              <li key={idx} className="leading-relaxed">{step}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Global Actions Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => {
            sound.playTick();
            onRetryWeakTopics();
          }}
          className="editorial-pill-dark py-4 px-5 font-typewriter font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Weak Topics</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playTick();
            onIncreaseBrutality();
          }}
          className="py-4 px-5 rounded-full border border-black/[0.1] bg-white hover:bg-neutral-50 text-neutral-900 font-typewriter font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <Flame className="w-4 h-4 text-rose-600" />
          <span>Increase Brutality</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadReport}
          className="py-4 px-5 rounded-full border border-black/[0.1] bg-white hover:bg-neutral-50 text-neutral-900 font-typewriter font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Download Markdown</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playTick();
            onStartFresh();
          }}
          className="py-4 px-5 rounded-full border border-black/[0.1] bg-white hover:bg-neutral-50 text-neutral-700 hover:text-neutral-900 font-typewriter font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <span>New Notes / Reset</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
