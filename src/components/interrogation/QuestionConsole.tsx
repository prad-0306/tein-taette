'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Question, AnswerEvaluation, PressureIntensity } from '@/lib/types';
import { sound } from '@/lib/audio';
import { 
  Clock, 
  Send, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight, 
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
  const initialTime = intensity === 'brutal' ? 20 : intensity === 'gentle' ? 45 : 30;
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [shortAnswerText, setShortAnswerText] = useState<string>('');
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isGlitching, setIsGlitching] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
      : (shortAnswerText.trim() || selectedOption);

    if (!answerToSubmit) return;

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
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'applied':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'foundation':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    }
  };

  return (
    <div className={`editorial-card rounded-3xl p-7 sm:p-9 space-y-6 transition-all duration-300 ${
      isGlitching ? 'ring-2 ring-rose-500' : ''
    }`}>
      {/* Question Header HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-black/[0.06]">
        <div className="flex items-center gap-2 font-typewriter text-xs text-neutral-500">
          <span className="font-bold text-neutral-900">
            {questionNumber.toString().padStart(2, '0')} / {totalQuestions.toString().padStart(2, '0')}
          </span>
          <span>•</span>
          <span className="text-neutral-700 max-w-[220px] truncate">
            {question.topic}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-typewriter font-medium uppercase border ${getDifficultyBadge()}`}>
            {question.difficulty}
          </span>

          {/* Countdown Timer */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border font-typewriter text-xs font-bold transition-colors ${
            timeLeft <= 5 
              ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse' 
              : 'bg-neutral-100 border-black/[0.06] text-neutral-700'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Main Question Display in Serif */}
      <div className="space-y-3">
        <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-neutral-900 leading-snug">
          {question.question}
        </h3>

        {question.examinerLine && (
          <p className="font-editorial italic text-xs sm:text-sm text-neutral-500 leading-relaxed">
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
                  const label = String.fromCharCode(65 + idx);
                  const isSelected = selectedOption === opt;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        sound.playTick();
                        setSelectedOption(opt);
                      }}
                      className={`text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 group ${
                        isSelected
                          ? 'bg-neutral-900 border-neutral-900 text-white shadow-md'
                          : 'bg-white border-black/[0.08] hover:border-black/25 text-neutral-800'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-md border flex items-center justify-center text-xs font-typewriter font-bold shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-white text-neutral-900 border-white'
                          : 'border-black/15 text-neutral-400 group-hover:border-black/30'
                      }`}>
                        {label}
                      </span>
                      <span className="text-sm leading-relaxed font-sans pt-0.5">
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Optional Text Justification */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-[11px] font-typewriter text-neutral-500 mb-1">
                  <span>Or type your defense in text:</span>
                  {shortAnswerText.length > 0 && <span>{shortAnswerText.length} chars</span>}
                </div>
                <textarea
                  value={shortAnswerText}
                  onChange={(e) => setShortAnswerText(e.target.value)}
                  placeholder="Explain your technical reasoning in your own words..."
                  rows={2}
                  className="w-full p-3 rounded-xl bg-white border border-black/[0.1] focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 text-xs text-neutral-800 placeholder-neutral-400 font-typewriter resize-none leading-relaxed"
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
                      className={`py-4 px-6 rounded-2xl border text-center font-typewriter font-bold text-sm tracking-wider uppercase transition-all ${
                        isSelected
                          ? 'bg-neutral-900 border-neutral-900 text-white shadow-md'
                          : 'bg-white border-black/[0.08] hover:border-black/25 text-neutral-800'
                      }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                <textarea
                  value={shortAnswerText}
                  onChange={(e) => setShortAnswerText(e.target.value)}
                  placeholder="Optional: Defend why this statement is True or False..."
                  rows={2}
                  className="w-full p-3 rounded-xl bg-white border border-black/[0.1] focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 text-xs text-neutral-800 placeholder-neutral-400 font-typewriter resize-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* Short Answer Mode (Primary Oral Exam Mode) */}
          {question.type === 'short_answer' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-typewriter text-neutral-500">
                <span className="font-bold text-neutral-800 uppercase">Defend Your Answer (Graded Semantically)</span>
                <span>{shortAnswerText.length} chars</span>
              </div>
              <textarea
                autoFocus
                value={shortAnswerText}
                onChange={(e) => setShortAnswerText(e.target.value)}
                placeholder="Type your explanation and defense here. Defend your answer with specific mechanisms, definitions, and causal reasoning from your notes..."
                rows={5}
                className="w-full p-4 rounded-2xl bg-white border border-black/[0.12] focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 text-sm text-neutral-900 placeholder-neutral-400 font-typewriter transition-all resize-none leading-relaxed"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handleAnswerSubmit();
                  }
                }}
              />
              <p className="text-[11px] text-neutral-500 font-typewriter">
                Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 border border-black/[0.1]">Ctrl+Enter</kbd> to submit defense immediately.
              </p>
            </div>
          )}

          {/* Submit Defense CTA */}
          <div className="pt-2">
            <button
              type="button"
              disabled={isEvaluating || (!shortAnswerText.trim() && !selectedOption)}
              onClick={() => handleAnswerSubmit()}
              className="editorial-pill-dark w-full py-4 px-6 font-typewriter font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isEvaluating ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Evaluating Defense Against Notes...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Oral Defense</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Immediate Evaluation Feedback & Misconception Breakdown */}
      {isSubmitted && evaluation && (
        <div className="space-y-4 pt-2">
          {/* Verdict Banner */}
          <div className={`p-5 rounded-2xl border flex items-start gap-3.5 ${
            evaluation.verdict === 'correct'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : evaluation.verdict === 'partially_correct'
              ? 'bg-amber-50 border-amber-200 text-amber-950'
              : 'bg-rose-50 border-rose-200 text-rose-950'
          }`}>
            {evaluation.verdict === 'correct' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : evaluation.verdict === 'partially_correct' ? (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-editorial text-lg font-bold">
                  {evaluation.verdict === 'correct' ? 'Defense Sustained — Correct' : evaluation.verdict === 'partially_correct' ? 'Partially Sound — Incomplete Proof' : 'Defense Fractured — Incorrect'}
                </h4>
                <span className="text-xs font-typewriter text-neutral-500">
                  (Score: {evaluation.score}/100)
                </span>
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed font-sans">
                {evaluation.feedback}
              </p>
            </div>
          </div>

          {/* Correct Reference & Explanation */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-black/[0.06] space-y-1.5 text-xs font-typewriter">
            <div className="flex items-center gap-1.5 text-neutral-700 font-bold uppercase">
              <BookOpen className="w-3.5 h-3.5 text-neutral-700" />
              <span>Verified Reference Solution</span>
            </div>
            <p className="text-neutral-900 leading-relaxed font-sans text-sm">
              {question.correctAnswer}
            </p>
            <p className="text-neutral-500 pt-1 leading-relaxed font-sans">
              {question.explanation}
            </p>
          </div>

          {/* Misconception Diagnostic Card */}
          {evaluation.detectedMisconception && (
            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-rose-700 font-typewriter font-bold uppercase">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Misconception Detected</span>
              </div>
              <p className="text-rose-900 leading-relaxed font-sans">
                <strong>Flawed Assumption:</strong> {evaluation.detectedMisconception}
              </p>
            </div>
          )}

          {/* Examiner Live Reaction */}
          {evaluation.examinerReaction && (
            <div className="p-3.5 rounded-2xl bg-neutral-100 border border-black/[0.06] text-xs font-editorial italic text-neutral-700 text-center">
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
              className="editorial-pill-dark w-full py-4 px-6 font-typewriter font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>{isLastQuestion ? 'Proceed to Final Weakness Report' : 'Next Interrogation Question'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
