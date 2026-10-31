'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Question, AnswerEvaluation, PressureIntensity, AnswerVerdict } from '@/lib/types';
import { sound } from '@/lib/audio';
import { 
  Clock, 
  Send, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles,
  BookOpen
} from 'lucide-react';

interface QuestionConsoleProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  intensity: PressureIntensity;
  onSubmitAnswer: (answer: string) => Promise<AnswerEvaluation>;
  onNextQuestion: () => void;
  isEvaluating: boolean;
  isLastQuestion: boolean;
}

export function QuestionConsole({
  question,
  questionNumber,
  totalQuestions,
  intensity,
  onSubmitAnswer,
  onNextQuestion,
  isEvaluating,
  isLastQuestion
}: QuestionConsoleProps) {
  // Timer durations based on intensity
  const initialTime = intensity === 'brutal' ? 20 : intensity === 'gentle' ? 45 : 30;
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [shortAnswerText, setShortAnswerText] = useState<string>('');
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isGlitching, setIsGlitching] = useState<boolean>(false);

  // Timer interval ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset state when new question arrives
  useEffect(() => {
    setSelectedOption('');
    setShortAnswerText('');
    setEvaluation(null);
    setIsSubmitted(false);
    setIsGlitching(false);
    setTimeLeft(initialTime);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        if (prev <= 6) {
          sound.playHeartbeat();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [question.id, initialTime]);

  // Handle timeout auto-submission
  useEffect(() => {
    if (timeLeft === 0 && !isSubmitted && !isEvaluating) {
      handleAnswerSubmit('Timed out / No answer provided');
    }
  }, [timeLeft, isSubmitted, isEvaluating]);

  const handleAnswerSubmit = async (forcedAnswer?: string) => {
    if (isSubmitted || isEvaluating) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const answerToSubmit = forcedAnswer !== undefined 
      ? forcedAnswer 
      : (question.type === 'short_answer' ? shortAnswerText.trim() : selectedOption);

    if (!answerToSubmit && question.type === 'short_answer') return;

    sound.playTick();
    setIsSubmitted(true);

    try {
      const result = await onSubmitAnswer(answerToSubmit);
      setEvaluation(result);

      if (result.verdict === 'correct') {
        sound.playCorrect();
      } else {
        sound.playWrong();
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 500);
      }
    } catch (err) {
      console.error('Answer submission error:', err);
    }
  };

  const getDifficultyBadge = () => {
    switch (question.difficulty) {
      case 'expert':
        return 'border-rose-500/50 bg-rose-950/40 text-rose-300';
      case 'applied':
        return 'border-violet-500/50 bg-violet-950/40 text-violet-300';
      case 'foundation':
        return 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300';
    }
  };

  // Keyboard shortcut listener for A, B, C, D in MCQ
  useEffect(() => {
    if (isSubmitted || isEvaluating || question.type !== 'mcq') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const map: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
      if (map[key] !== undefined && question.options[map[key]]) {
        sound.playTick();
        setSelectedOption(question.options[map[key]]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitted, isEvaluating, question]);

  return (
    <div className={`w-full glass-panel-glow rounded-2xl p-5 sm:p-7 space-y-6 transition-all duration-300 border ${
      isGlitching ? 'animate-glitch border-rose-500' : 'border-white/10'
    }`}>
      {/* Top Question HUD Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            Inquiry {questionNumber.toString().padStart(2, '0')} / {totalQuestions.toString().padStart(2, '0')}
          </span>
          <span className="text-slate-600 font-mono">•</span>
          <span className="text-xs font-mono text-cyan-400 max-w-[200px] truncate">
            {question.topic}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Difficulty Badge */}
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border tracking-wider ${getDifficultyBadge()}`}>
            {question.difficulty}
          </span>

          {/* Countdown Timer */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono text-xs font-bold transition-colors ${
            timeLeft <= 5 
              ? 'bg-rose-950/50 border-rose-500 text-rose-300 animate-pulse' 
              : 'bg-black/40 border-white/10 text-slate-300'
          }`}>
            <Clock className={`w-3.5 h-3.5 ${timeLeft <= 5 ? 'text-rose-400 animate-spin' : 'text-slate-400'}`} />
            <span>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Main Question Display */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-500/40 flex items-center justify-center shrink-0 mt-0.5">
            <span className="font-mono font-bold text-violet-300 text-xs">Q</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed font-sans">
            {question.question}
          </h3>
        </div>

        {/* In-character prompt subtitle */}
        {question.examinerLine && (
          <p className="text-xs font-mono italic text-slate-400 pl-10">
            &ldquo;{question.examinerLine}&rdquo;
          </p>
        )}
      </div>

      {/* Answer Form Options */}
      {!isSubmitted && (
        <div className="space-y-4 pt-2">
          {/* MCQ Mode */}
          {question.type === 'mcq' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-2.5">
                {question.options.map((opt, idx) => {
                  const label = String.fromCharCode(65 + idx); // A, B, C, D
                  const isSelected = selectedOption === opt;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        sound.playTick();
                        setSelectedOption(opt);
                      }}
                      className={`text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 group ${
                        isSelected
                          ? 'bg-violet-950/50 border-violet-400 ring-1 ring-violet-400/50 text-white shadow-lg shadow-violet-500/10'
                          : 'bg-black/40 border-white/10 hover:border-white/20 hover:bg-white/[0.04] text-slate-200'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-md border flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-violet-600 border-violet-400 text-white'
                          : 'border-white/20 text-slate-400 group-hover:border-white/40'
                      }`}>
                        {label}
                      </span>
                      <span className="text-sm leading-relaxed pt-0.5 font-sans">
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Text justification box for MCQ */}
              <div className="pt-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>Optional: Explain your reasoning in text:</span>
                  {shortAnswerText.length > 0 && <span>{shortAnswerText.length} chars</span>}
                </div>
                <textarea
                  value={shortAnswerText}
                  onChange={(e) => setShortAnswerText(e.target.value)}
                  placeholder="Type extra justification or explain your choice..."
                  rows={2}
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/10 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 text-xs text-slate-200 placeholder-slate-500 font-mono resize-none leading-relaxed"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      handleAnswerSubmit();
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* True / False Mode */}
          {question.type === 'true_false' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {['True', 'False'].map((val) => {
                  const isSelected = selectedOption === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        sound.playTick();
                        setSelectedOption(val);
                      }}
                      className={`py-4 px-6 rounded-xl border text-center font-mono font-bold text-sm tracking-wider uppercase transition-all ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400/50 shadow-lg shadow-cyan-500/10'
                          : 'bg-black/40 border-white/10 hover:border-white/20 hover:bg-white/[0.04] text-slate-300'
                      }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>

              <div className="pt-1">
                <textarea
                  value={shortAnswerText}
                  onChange={(e) => setShortAnswerText(e.target.value)}
                  placeholder="Optional: Defend why this statement is True or False..."
                  rows={2}
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/10 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs text-slate-200 placeholder-slate-500 font-mono resize-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* Short Answer Mode (Primary Oral Exam Mode) */}
          {question.type === 'short_answer' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="text-cyan-400 font-bold uppercase tracking-wider">Type Your Defense (Graded Semantically by Gemini)</span>
                <span>{shortAnswerText.length} chars</span>
              </div>
              <textarea
                autoFocus
                value={shortAnswerText}
                onChange={(e) => setShortAnswerText(e.target.value)}
                placeholder="Type your explanation and defense here. Defend your answer with specific mechanisms, definitions, and causal reasoning from the notes..."
                rows={5}
                className="w-full p-4 rounded-xl bg-black/60 border border-violet-500/30 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 text-sm text-slate-100 placeholder-slate-500 font-mono transition-all resize-none leading-relaxed shadow-inner"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handleAnswerSubmit();
                  }
                }}
              />
              <p className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
                <span>Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20">Ctrl+Enter</kbd> to submit defense immediately.</span>
              </p>
            </div>
          )}

          {/* Submit Defense CTA */}
          <button
            type="button"
            disabled={
              isEvaluating || 
              (!shortAnswerText.trim() && !selectedOption)
            }
            onClick={() => handleAnswerSubmit()}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-mono font-bold text-sm tracking-wider uppercase shadow-lg shadow-violet-600/20 border border-white/20 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
          >
            {isEvaluating ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Evaluating Defense Against Notes...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Defense</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Immediate Evaluation Feedback & Misconception Breakdown */}
      {isSubmitted && evaluation && (
        <div className="space-y-4 pt-2">
          {/* Verdict Banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            evaluation.verdict === 'correct'
              ? 'glass-panel-success border-emerald-500/50'
              : evaluation.verdict === 'partially_correct'
              ? 'bg-amber-950/40 border-amber-500/50'
              : 'glass-panel-danger border-rose-500/50'
          }`}>
            {evaluation.verdict === 'correct' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : evaluation.verdict === 'partially_correct' ? (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className={`text-sm font-bold uppercase tracking-wider font-mono ${
                  evaluation.verdict === 'correct' ? 'text-emerald-300' : evaluation.verdict === 'partially_correct' ? 'text-amber-300' : 'text-rose-300'
                }`}>
                  {evaluation.verdict === 'correct' ? 'Defense Sustained — Correct' : evaluation.verdict === 'partially_correct' ? 'Partially Sound — Incomplete Proof' : 'Defense Fractured — Incorrect'}
                </h4>
                <span className="text-xs font-mono text-slate-400">
                  (Score: {evaluation.score}/100)
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {evaluation.feedback}
              </p>
            </div>
          </div>

          {/* Correct Reference & Explanation */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1.5 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-slate-400">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span className="uppercase tracking-wider font-bold">Verified Reference Solution</span>
            </div>
            <p className="text-cyan-200 leading-relaxed">
              {question.correctAnswer}
            </p>
            <p className="text-slate-400 pt-1 leading-relaxed">
              {question.explanation}
            </p>
          </div>

          {/* Misconception Diagnostic Card (CRITICAL for Track 1!) */}
          {evaluation.detectedMisconception && (
            <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40 space-y-1.5 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Misconception Detected</span>
              </div>
              <p className="text-rose-200 leading-relaxed">
                <strong className="text-white">Flawed Assumption:</strong> {evaluation.detectedMisconception}
              </p>
            </div>
          )}

          {/* Examiner Live Reaction */}
          {evaluation.examinerReaction && (
            <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-500/30 text-xs font-mono italic text-violet-300">
              &ldquo;{evaluation.examinerReaction}&rdquo;
            </div>
          )}

          {/* Proceed CTA */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                sound.playTick();
                onNextQuestion();
              }}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white font-mono font-bold text-sm tracking-wider uppercase shadow-xl shadow-cyan-600/20 border border-white/20 transition-all flex items-center justify-center gap-2 group hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>{isLastQuestion ? 'Proceed to Final Weakness Report' : 'Next Interrogation Question'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
