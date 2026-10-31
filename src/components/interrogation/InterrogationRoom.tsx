'use client';

import React from 'react';
import { 
  ExaminerPersona, 
  Question, 
  AnswerEvaluation, 
  TopicMastery, 
  AnswerRecord, 
  PressureIntensity, 
  ExaminerMood,
  DifficultyLevel 
} from '@/lib/types';
import { ExaminerAvatar } from './ExaminerAvatar';
import { PressureGauge } from './PressureGauge';
import { QuestionConsole } from './QuestionConsole';
import { MasteryRadar } from './MasteryRadar';

interface InterrogationRoomProps {
  persona: ExaminerPersona;
  mood: ExaminerMood;
  speechText?: string;
  pressure: number;
  intensity: PressureIntensity;
  currentQuestion: Question;
  questionNumber: number;
  totalQuestions: number;
  onSubmitAnswer: (answer: string) => Promise<AnswerEvaluation>;
  onNextQuestion: () => void;
  isEvaluating: boolean;
  topicMasteries: TopicMastery[];
  streak: number;
  records: AnswerRecord[];
  currentDifficulty: DifficultyLevel;
}

export function InterrogationRoom({
  persona,
  mood,
  speechText,
  pressure,
  intensity,
  currentQuestion,
  questionNumber,
  totalQuestions,
  onSubmitAnswer,
  onNextQuestion,
  isEvaluating,
  topicMasteries,
  streak,
  records,
  currentDifficulty
}: InterrogationRoomProps) {
  const correctCount = records.filter((r) => r.evaluation.verdict === 'correct').length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 lg:py-8">
      {/* 3-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Examiner Avatar & Pressure (3 Cols on Desktop) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-panel-glow rounded-2xl p-5 border border-white/10">
            <ExaminerAvatar
              persona={persona}
              mood={mood}
              speechText={speechText}
              pressure={pressure}
            />
          </div>

          <PressureGauge pressure={pressure} intensity={intensity} />
        </div>

        {/* Center Column: Question Console (6 Cols on Desktop) */}
        <div className="lg:col-span-6 space-y-4">
          <QuestionConsole
            question={currentQuestion}
            questionNumber={questionNumber}
            totalQuestions={totalQuestions}
            intensity={intensity}
            onSubmitAnswer={onSubmitAnswer}
            onNextQuestion={onNextQuestion}
            isEvaluating={isEvaluating}
            isLastQuestion={questionNumber >= totalQuestions}
          />
        </div>

        {/* Right Column: Live Telemetry & Radar (3 Cols on Desktop) */}
        <div className="lg:col-span-3 space-y-4">
          <MasteryRadar
            topicMasteries={topicMasteries}
            streak={streak}
            totalAnswered={records.length}
            totalCorrect={correctCount}
            currentDifficulty={currentDifficulty}
            records={records}
          />
        </div>
      </div>
    </div>
  );
}
