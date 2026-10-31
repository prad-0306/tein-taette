'use client';

import React, { useState } from 'react';
import { 
  ExamConfig, 
  MaterialAnalysis, 
  Question, 
  AnswerEvaluation, 
  AnswerRecord, 
  TopicMastery, 
  FinalReportData, 
  ExaminerMood,
  ExaminerPersonaId,
  PressureIntensity
} from '@/lib/types';
import { EXAMINER_PERSONAS, generateMockQuestion } from '@/lib/mockData';
import { 
  initializeAdaptiveState, 
  updateAdaptiveState, 
  formatTopicMasteryList, 
  AdaptiveState 
} from '@/lib/adaptiveEngine';
import { HeaderHUD } from '@/components/common/HeaderHUD';
import { IntakeBay } from '@/components/landing/IntakeBay';
import { NeuralScan } from '@/components/transition/NeuralScan';
import { InterrogationRoom } from '@/components/interrogation/InterrogationRoom';
import { FinalReport } from '@/components/report/FinalReport';

type ExamStage = 'landing' | 'scanning' | 'interrogating' | 'report';

export default function Home() {
  const [stage, setStage] = useState<ExamStage>('landing');
  const [isLiveAI, setIsLiveAI] = useState<boolean | undefined>(undefined);

  // Exam Configuration
  const [config, setConfig] = useState<ExamConfig | null>(null);
  const [analysis, setAnalysis] = useState<MaterialAnalysis | null>(null);

  // Active Interrogation State
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [records, setRecords] = useState<AnswerRecord[]>([]);
  const [adaptiveState, setAdaptiveState] = useState<AdaptiveState | null>(null);
  const [topicMasteries, setTopicMasteries] = useState<TopicMastery[]>([]);
  
  // Examiner Telemetry
  const [examinerMood, setExaminerMood] = useState<ExaminerMood>('neutral');
  const [examinerSpeech, setExaminerSpeech] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  // Prefetched next question cache
  const [nextQuestionCache, setNextQuestionCache] = useState<Question | null>(null);

  // Final Report Data
  const [finalReport, setFinalReport] = useState<FinalReportData | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);

  // Refs to eliminate stale closure issues during transitions
  const currentQuestionRef = React.useRef<Question | null>(null);
  const scanDoneRef = React.useRef<boolean>(false);

  // 1. Kick off Exam and Scan
  const handleStartExam = async (newConfig: ExamConfig) => {
    setConfig(newConfig);
    setStage('scanning');
    setRecords([]);
    setQuestionNumber(1);
    setExaminerMood('neutral');
    currentQuestionRef.current = null;
    scanDoneRef.current = false;

    try {
      // Step A: Trigger Ingestion & Analysis
      const analyzePromise = fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notesContent: newConfig.notesContent,
          subject: newConfig.subject
        })
      }).then((res) => res.json());

      const analyzeResult = await analyzePromise;
      const extractedAnalysis: MaterialAnalysis = analyzeResult.analysis;
      setAnalysis(extractedAnalysis);
      if (analyzeResult.isLiveAI !== undefined) {
        setIsLiveAI(analyzeResult.isLiveAI);
      }

      const extractedTopics = extractedAnalysis.coreConcepts.map((c) => c.topic);
      const initialAdaptive = initializeAdaptiveState(extractedTopics, extractedAnalysis.estimatedDifficulty);
      setAdaptiveState(initialAdaptive);
      setTopicMasteries(formatTopicMasteryList(initialAdaptive.topicMasteries, extractedTopics));
      setExaminerSpeech(extractedAnalysis.examinerIntro);

      // Step B: Generate Question #1 concurrently
      const questionResponse = await fetch('/api/ai/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notesContent: newConfig.notesContent,
          topics: extractedTopics,
          currentDifficulty: initialAdaptive.currentDifficulty,
          targetTopic: initialAdaptive.nextTargetTopic,
          persona: newConfig.persona,
          intensity: newConfig.intensity,
          questionNumber: 1,
          previousQuestions: [],
          previousMisconceptions: []
        })
      });

      const qData = await questionResponse.json();
      currentQuestionRef.current = qData.question;
      setCurrentQuestion(qData.question);

      // If neural scan animation already completed, transition to interview room immediately
      if (scanDoneRef.current) {
        setStage('interrogating');
      }
    } catch (err) {
      console.error('Failed during intake initialization:', err);
      // Fallback: Ensure interview room always launches
      const fallbackTopics = [newConfig.subject || 'Core Concepts'];
      const initialAdaptive = initializeAdaptiveState(fallbackTopics, 'applied');
      setAdaptiveState(initialAdaptive);
      setTopicMasteries(formatTopicMasteryList(initialAdaptive.topicMasteries, fallbackTopics));
      const fallbackQ = generateMockQuestion(fallbackTopics, 'applied', fallbackTopics[0], 0, newConfig.persona);
      currentQuestionRef.current = fallbackQ;
      setCurrentQuestion(fallbackQ);
      if (scanDoneRef.current) {
        setStage('interrogating');
      }
    }
  };

  // 2. Complete Neural Scan Transition - Guaranteed transition
  const handleScanComplete = () => {
    scanDoneRef.current = true;
    if (currentQuestionRef.current) {
      setStage('interrogating');
    } else {
      // Check ref every 100ms
      const checkInterval = setInterval(() => {
        if (currentQuestionRef.current) {
          clearInterval(checkInterval);
          setStage('interrogating');
        }
      }, 100);

      // Timeout safety: if question generation takes longer than 2s after scan completes, auto-enter
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!currentQuestionRef.current) {
          const fallbackTopics = analysis?.coreConcepts.map((c) => c.topic) || ['General Concepts'];
          const fallbackQ = generateMockQuestion(
            fallbackTopics,
            adaptiveState?.currentDifficulty || 'applied',
            fallbackTopics[0] || 'Core Mechanics',
            0,
            config?.persona || 'professor'
          );
          currentQuestionRef.current = fallbackQ;
          setCurrentQuestion(fallbackQ);
        }
        setStage('interrogating');
      }, 2000);
    }
  };

  // 3. Submit Student Answer Defense
  const handleSubmitAnswer = async (answer: string): Promise<AnswerEvaluation> => {
    if (!currentQuestion || !config || !adaptiveState || !analysis) {
      throw new Error('Exam state not initialized');
    }

    setIsEvaluating(true);

    try {
      const response = await fetch('/api/ai/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion,
          studentAnswer: answer,
          notesContent: config.notesContent,
          persona: config.persona,
          intensity: config.intensity
        })
      });

      const data = await response.json();
      const evaluation: AnswerEvaluation = data.evaluation;

      // Update Examiner Reaction
      setExaminerMood(evaluation.examinerMood);
      setExaminerSpeech(evaluation.examinerReaction);

      // Record this defense
      const newRecord: AnswerRecord = {
        questionNumber,
        question: currentQuestion,
        userAnswer: answer,
        evaluation,
        timeSpentSeconds: 0
      };
      const updatedRecords = [...records, newRecord];
      setRecords(updatedRecords);

      // Update Adaptive State Machine
      const allTopics = analysis.coreConcepts.map((c) => c.topic);
      const newAdaptive = updateAdaptiveState(
        adaptiveState,
        currentQuestion.topic,
        evaluation.verdict,
        currentQuestion.difficulty,
        config.intensity,
        allTopics
      );
      setAdaptiveState(newAdaptive);
      setTopicMasteries(formatTopicMasteryList(newAdaptive.topicMasteries, allTopics));

      // Prefetch next question if not the final round
      if (questionNumber < config.examLength) {
        const prevQTexts = updatedRecords.map((r) => r.question.question);
        const prevMisconceptions = updatedRecords
          .map((r) => r.evaluation.detectedMisconception)
          .filter(Boolean);

        fetch('/api/ai/generate-question', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            notesContent: config.notesContent,
            topics: allTopics,
            currentDifficulty: newAdaptive.currentDifficulty,
            targetTopic: newAdaptive.nextTargetTopic,
            persona: config.persona,
            intensity: config.intensity,
            questionNumber: questionNumber + 1,
            previousQuestions: prevQTexts,
            previousMisconceptions: prevMisconceptions
          })
        })
          .then((res) => res.json())
          .then((qData) => {
            setNextQuestionCache(qData.question);
          })
          .catch((err) => console.error('Prefetch question failed:', err));
      }

      setIsEvaluating(false);
      return evaluation;
    } catch (err) {
      setIsEvaluating(false);
      console.error('Answer evaluation failed:', err);
      throw err;
    }
  };

  // 4. Advance to Next Round or Final Debrief
  const handleNextQuestion = async () => {
    if (!config || !analysis) return;

    if (questionNumber >= config.examLength) {
      // Interrogation Complete -> Generate Final Diagnostic Report
      setIsGeneratingReport(true);
      try {
        const response = await fetch('/api/ai/generate-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: config.subject,
            records,
            topicMasteries,
            notesContent: config.notesContent
          })
        });

        const data = await response.json();
        setFinalReport(data.report);
        setStage('report');
      } catch (err) {
        console.error('Failed generating final report:', err);
      } finally {
        setIsGeneratingReport(false);
      }
      return;
    }

    // Step to Next Question
    const nextQNum = questionNumber + 1;
    setQuestionNumber(nextQNum);

    if (nextQuestionCache) {
      setCurrentQuestion(nextQuestionCache);
      setNextQuestionCache(null);
    } else {
      // If prefetch hasn't finished, fetch synchronously
      const allTopics = analysis.coreConcepts.map((c) => c.topic);
      const prevQTexts = records.map((r) => r.question.question);
      const prevMisconceptions = records.map((r) => r.evaluation.detectedMisconception).filter(Boolean);

      const res = await fetch('/api/ai/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notesContent: config.notesContent,
          topics: allTopics,
          currentDifficulty: adaptiveState?.currentDifficulty || 'applied',
          targetTopic: adaptiveState?.nextTargetTopic,
          persona: config.persona,
          intensity: config.intensity,
          questionNumber: nextQNum,
          previousQuestions: prevQTexts,
          previousMisconceptions: prevMisconceptions
        })
      });
      const qData = await res.json();
      setCurrentQuestion(qData.question);
    }
  };

  // 5. Retry Weak Topics Action
  const handleRetryWeakTopics = () => {
    if (!config || !analysis) return;
    const weakTopics = topicMasteries.filter((t) => t.mastery < 70).map((t) => t.topic);
    const target = weakTopics.length > 0 ? weakTopics : analysis.coreConcepts.map((c) => c.topic);

    const reconfig: ExamConfig = {
      ...config,
      examLength: 5,
      intensity: 'balanced'
    };

    handleStartExam(reconfig);
  };

  // 6. Increase Brutality Action
  const handleIncreaseBrutality = () => {
    if (!config) return;
    const brutalConfig: ExamConfig = {
      ...config,
      intensity: 'brutal',
      persona: 'ruthless'
    };
    handleStartExam(brutalConfig);
  };

  // 7. Reset / Start Fresh
  const handleReset = () => {
    setStage('landing');
    setConfig(null);
    setAnalysis(null);
    setCurrentQuestion(null);
    setRecords([]);
    setAdaptiveState(null);
    setFinalReport(null);
  };

  const selectedPersona = EXAMINER_PERSONAS[config?.persona || 'professor'];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Persistent Sci-Fi Header HUD */}
      <HeaderHUD
        stage={stage}
        onReset={stage !== 'landing' ? handleReset : undefined}
        isLiveAI={isLiveAI}
      />

      <main className="flex-1 flex flex-col justify-center">
        {/* Stage 1: Landing & Study Intake Bay */}
        {stage === 'landing' && (
          <IntakeBay
            onStartExam={handleStartExam}
            isLoading={false}
          />
        )}

        {/* Stage 2: Neural Scan Transition */}
        {stage === 'scanning' && config && (
          <NeuralScan
            subject={config.subject}
            notesSample={config.notesContent}
            onComplete={handleScanComplete}
          />
        )}

        {/* Stage 3: Adaptive Interrogation Room */}
        {stage === 'interrogating' && config && currentQuestion && (
          <InterrogationRoom
            persona={selectedPersona}
            mood={examinerMood}
            speechText={examinerSpeech}
            pressure={adaptiveState?.pressure || 30}
            intensity={config.intensity}
            currentQuestion={currentQuestion}
            questionNumber={questionNumber}
            totalQuestions={config.examLength}
            onSubmitAnswer={handleSubmitAnswer}
            onNextQuestion={handleNextQuestion}
            isEvaluating={isEvaluating}
            topicMasteries={topicMasteries}
            streak={adaptiveState?.consecutiveCorrect || 0}
            records={records}
            currentDifficulty={adaptiveState?.currentDifficulty || 'applied'}
          />
        )}

        {/* Stage 4: Final Weakness Diagnostic Report */}
        {stage === 'report' && finalReport && (
          <FinalReport
            report={finalReport}
            onRetryWeakTopics={handleRetryWeakTopics}
            onIncreaseBrutality={handleIncreaseBrutality}
            onStartFresh={handleReset}
          />
        )}

        {/* Loading overlay when compiling final report */}
        {isGeneratingReport && (
          <div className="fixed inset-0 z-50 bg-[#05060A]/90 backdrop-blur-md flex flex-col items-center justify-center p-4 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center border border-white/20 shadow-2xl animate-spin">
              <span className="font-mono text-xl font-bold text-white">X</span>
            </div>
            <h3 className="text-xl font-bold font-mono text-white tracking-wide uppercase">
              Synthesizing Weakness Diagnostic...
            </h3>
            <p className="text-xs font-mono text-cyan-300">
              Aggregating topic mastery radar & personal repair plan
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-4 px-6 text-center text-slate-400 text-xs font-mono">
        ProfessorX • Adaptive AI Oral-Exam Simulator • Track 1: Applied AI & Next-Gen Autonomous Agents
      </footer>
    </div>
  );
}
