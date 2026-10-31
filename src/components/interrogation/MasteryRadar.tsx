'use client';

import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { TopicMastery, AnswerRecord, DifficultyLevel } from '@/lib/types';
import { Flame, Target, Activity, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';

interface MasteryRadarProps {
  topicMasteries: TopicMastery[];
  streak: number;
  totalAnswered: number;
  totalCorrect: number;
  currentDifficulty: DifficultyLevel;
  records: AnswerRecord[];
}

export function MasteryRadar({
  topicMasteries,
  streak,
  totalAnswered,
  totalCorrect,
  currentDifficulty,
  records
}: MasteryRadarProps) {
  // Format data for Recharts Radar
  const radarData = topicMasteries.map((tm) => ({
    topic: tm.topic.length > 14 ? `${tm.topic.slice(0, 12)}…` : tm.topic,
    fullTopic: tm.topic,
    mastery: tm.mastery
  }));

  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const getDifficultyColor = () => {
    switch (currentDifficulty) {
      case 'expert':
        return 'text-rose-400 bg-rose-950/40 border-rose-500/40';
      case 'applied':
        return 'text-violet-400 bg-violet-950/40 border-violet-500/40';
      case 'foundation':
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40';
    }
  };

  return (
    <div className="space-y-4">
      {/* Telemetry Stats Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Streak */}
        <div className="glass-panel rounded-xl p-3 border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Streak</span>
            <span className="text-xl font-mono font-black text-white flex items-center gap-1">
              {streak}
              {streak >= 2 && <Flame className="w-4 h-4 text-amber-400 animate-bounce" />}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
        </div>

        {/* Accuracy */}
        <div className="glass-panel rounded-xl p-3 border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Accuracy</span>
            <span className="text-xl font-mono font-black text-cyan-300">
              {accuracy}%
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
        </div>
      </div>

      {/* Difficulty Level Indicator */}
      <div className="glass-panel rounded-xl p-3 border border-white/10 flex items-center justify-between">
        <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-violet-400" />
          <span>Active Difficulty</span>
        </span>
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase border tracking-wider ${getDifficultyColor()}`}>
          {currentDifficulty}
        </span>
      </div>

      {/* Live Topic Mastery Radar Chart */}
      <div className="glass-panel-glow rounded-2xl p-4 border border-violet-500/20 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-mono font-bold text-white tracking-wider uppercase">
            Topic Mastery Radar
          </h4>
          <span className="text-[10px] font-mono text-violet-400 animate-pulse">
            LIVE UPDATES
          </span>
        </div>

        {radarData.length >= 3 ? (
          <div className="w-full h-56 sm:h-60 relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="72%">
                <PolarGrid stroke="rgba(255, 255, 255, 0.12)" strokeDasharray="3 3" />
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
                  name="Mastery"
                  dataKey="mastery"
                  stroke="#8B5CF6"
                  fill="#22D3EE"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-44 flex items-center justify-center text-center p-4">
            <p className="text-xs text-slate-400 font-mono">
              Calibrating 3+ concept axes for full radar topology...
            </p>
          </div>
        )}

        <div className="space-y-1.5 pt-2 border-t border-white/5">
          {topicMasteries.map((tm) => (
            <div key={tm.topic} className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-300 truncate max-w-[140px]">{tm.topic}</span>
              <span className={`font-bold ${
                tm.mastery >= 70 ? 'text-emerald-400' : tm.mastery >= 50 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {tm.mastery}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Answer History Ticker */}
      <div className="glass-panel rounded-xl p-3.5 border border-white/10 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="uppercase tracking-wider">Recent Inquiries</span>
          <span>{records.length} Completed</span>
        </div>

        {records.length === 0 ? (
          <p className="text-[11px] text-slate-500 font-mono italic">
            Awaiting first student defense...
          </p>
        ) : (
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {records.slice(-4).reverse().map((rec) => {
              const isCorrect = rec.evaluation.verdict === 'correct';
              const isPartial = rec.evaluation.verdict === 'partially_correct';

              return (
                <div 
                  key={rec.questionNumber}
                  className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : isPartial ? (
                      <MinusCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    )}
                    <span className="text-slate-300 truncate">Q{rec.questionNumber}: {rec.question.topic}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-bold shrink-0 ${
                    isCorrect ? 'text-emerald-400' : isPartial ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {rec.evaluation.verdict.replace('_', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
