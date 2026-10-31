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
  const radarData = topicMasteries.map((tm) => ({
    topic: tm.topic.length > 14 ? `${tm.topic.slice(0, 12)}…` : tm.topic,
    fullTopic: tm.topic,
    mastery: tm.mastery
  }));

  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const getDifficultyColor = () => {
    switch (currentDifficulty) {
      case 'expert':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'applied':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'foundation':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Telemetry Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Streak */}
        <div className="editorial-card rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-typewriter uppercase text-neutral-400 block">Streak</span>
            <span className="text-xl font-typewriter font-bold text-neutral-900 flex items-center gap-1">
              {streak}
              {streak >= 2 && <Flame className="w-4 h-4 text-amber-500 animate-bounce" />}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
            <Flame className="w-4 h-4 text-amber-600" />
          </div>
        </div>

        {/* Accuracy */}
        <div className="editorial-card rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-typewriter uppercase text-neutral-400 block">Accuracy</span>
            <span className="text-xl font-typewriter font-bold text-neutral-900">
              {accuracy}%
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
            <Target className="w-4 h-4 text-neutral-700" />
          </div>
        </div>
      </div>

      {/* Difficulty Level Indicator */}
      <div className="editorial-card rounded-2xl p-3.5 flex items-center justify-between">
        <span className="text-xs font-typewriter uppercase text-neutral-500 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-neutral-600" />
          <span>Active Scrutiny</span>
        </span>
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-typewriter font-bold uppercase border ${getDifficultyColor()}`}>
          {currentDifficulty}
        </span>
      </div>

      {/* Live Topic Mastery Radar Chart */}
      <div className="editorial-card rounded-3xl p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
          <h4 className="font-editorial text-base font-bold text-neutral-900">
            Mastery Topology
          </h4>
          <span className="text-[10px] font-typewriter text-rose-600 font-bold">
            LIVE RADAR
          </span>
        </div>

        {radarData.length >= 3 ? (
          <div className="w-full h-52 sm:h-56 relative">
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
                  name="Mastery"
                  dataKey="mastery"
                  stroke="#E11D48"
                  fill="#8B5CF6"
                  fillOpacity={0.25}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-44 flex items-center justify-center text-center p-4">
            <p className="text-xs text-neutral-400 font-typewriter">
              Calibrating concepts...
            </p>
          </div>
        )}

        <div className="space-y-1.5 pt-2 border-t border-black/[0.06]">
          {topicMasteries.map((tm) => (
            <div key={tm.topic} className="flex items-center justify-between text-xs font-typewriter">
              <span className="text-neutral-600 truncate max-w-[140px]">{tm.topic}</span>
              <span className={`font-bold ${
                tm.mastery >= 70 ? 'text-emerald-700' : tm.mastery >= 50 ? 'text-amber-700' : 'text-rose-700'
              }`}>
                {tm.mastery}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Answer History */}
      <div className="editorial-card rounded-2xl p-4 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-typewriter text-neutral-500 pb-2 border-b border-black/[0.06]">
          <span>Recent Inquiries</span>
          <span>{records.length} Completed</span>
        </div>

        {records.length === 0 ? (
          <p className="text-xs text-neutral-400 font-typewriter italic py-1">
            Awaiting first defense...
          </p>
        ) : (
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {records.slice(-4).reverse().map((rec) => {
              const isCorrect = rec.evaluation.verdict === 'correct';
              const isPartial = rec.evaluation.verdict === 'partially_correct';

              return (
                <div 
                  key={rec.questionNumber}
                  className="p-2 rounded-xl bg-neutral-50 border border-black/[0.04] flex items-center justify-between text-xs font-typewriter"
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : isPartial ? (
                      <MinusCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    )}
                    <span className="text-neutral-800 truncate">Q{rec.questionNumber}: {rec.question.topic}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-bold shrink-0 ${
                    isCorrect ? 'text-emerald-700' : isPartial ? 'text-amber-700' : 'text-rose-700'
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
