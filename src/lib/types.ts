export type ExaminerPersonaId = 'professor' | 'interviewer' | 'ruthless';

export interface ExaminerPersona {
  id: ExaminerPersonaId;
  name: string;
  title: string;
  avatarSeed: string;
  description: string;
  vibe: string;
  tagline: string;
}

export type PressureIntensity = 'gentle' | 'balanced' | 'brutal';

export type QuestionType = 'mcq' | 'true_false' | 'short_answer';

export type DifficultyLevel = 'foundation' | 'applied' | 'expert';

export type AnswerVerdict = 'correct' | 'partially_correct' | 'incorrect';

export type ExaminerMood = 'neutral' | 'skeptical' | 'intrigued' | 'disappointed' | 'merciless' | 'impressed';

export interface CoreConcept {
  topic: string;
  summary: string;
  importance: 'high' | 'medium' | 'low';
}

export interface MaterialAnalysis {
  subject: string;
  coreConcepts: CoreConcept[];
  examinableGaps: string[];
  estimatedDifficulty: DifficultyLevel;
  examinerIntro: string;
}

export interface Question {
  id: string;
  topic: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  question: string;
  options: string[]; // empty if short_answer
  correctAnswer: string;
  explanation: string;
  misconception: string;
  examinerLine: string;
}

export interface AnswerEvaluation {
  verdict: AnswerVerdict;
  score: number; // 0 to 100
  feedback: string;
  detectedMisconception: string;
  masteryDelta: number; // e.g. +15 or -20
  suggestedNextDifficulty: DifficultyLevel;
  examinerReaction: string;
  examinerMood: ExaminerMood;
}

export interface AnswerRecord {
  questionNumber: number;
  question: Question;
  userAnswer: string;
  evaluation: AnswerEvaluation;
  timeSpentSeconds: number;
}

export interface TopicMastery {
  topic: string;
  mastery: number; // 0 to 100
  questionsAnswered: number;
  correctCount: number;
}

export interface WeakTopicDiagnostic {
  topic: string;
  masteryScore: number;
  primaryReason: string;
}

export interface MisconceptionSummary {
  topic: string;
  whatYouThought: string;
  reality: string;
}

export interface PracticeQuestion {
  question: string;
  hint: string;
  solution: string;
}

export interface RepairAction {
  topic: string;
  actionItem: string;
  practiceQuestion: PracticeQuestion;
}

export type GradeLetter = 'S' | 'A' | 'B' | 'C' | 'D';

export interface FinalReportData {
  subject: string;
  overallScore: number;
  grade: GradeLetter;
  verdictTitle: string;
  verdictSummary: string;
  strongestTopics: string[];
  weakTopics: WeakTopicDiagnostic[];
  misconceptionsSummary: MisconceptionSummary[];
  repairPlan: RepairAction[];
  nextSteps: string[];
  topicMasteries: TopicMastery[];
  totalQuestions: number;
  accuracyRate: number;
  dateGenerated: string;
}

export interface ExamConfig {
  subject: string;
  notesContent: string;
  examLength: number; // 5, 8, or 12
  persona: ExaminerPersonaId;
  intensity: PressureIntensity;
}
