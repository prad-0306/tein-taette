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
  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-8 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Examiner Profile & Pressure (3 Cols on Desktop) */}
        <div className="lg:col-span-3 space-y-5">
          <div className="editorial-card rounded-3xl p-6">
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
        <div className="lg:col-span-6 space-y-5">
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
        <div className="lg:col-span-3 space-y-5">
          <MasteryRadar
            topicMasteries={topicMasteries}
            streak={streak}
            totalAnswered={records.length}
            totalCorrect={records.filter((r) => r.evaluation.verdict === 'correct').length}
            currentDifficulty={currentDifficulty}
            records={records}
          />
        </div>
      </div>
    </div>
  );
}
