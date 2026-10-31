import { NextRequest, NextResponse } from 'next/server';
import { generateStructuredAI } from '@/lib/gemini';
import { evaluateMockAnswer } from '@/lib/mockData';
import { AnswerEvaluation, ExaminerPersonaId, PressureIntensity, Question } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      question, 
      studentAnswer, 
      notesContent = '', 
      persona = 'professor', 
      intensity = 'balanced' 
    } = body;

    if (!question || studentAnswer === undefined) {
      return NextResponse.json({ error: 'Question and studentAnswer are required.' }, { status: 400 });
    }

    const personaStyle: Record<ExaminerPersonaId, string> = {
      professor: 'Pedantic professor: evaluate with academic precision, point out missing logical steps, and praise sound proofs.',
      interviewer: 'Pragmatic staff engineer: evaluate production viability, edge-case resilience, and communication clarity.',
      ruthless: 'Merciless interrogator: surgical takedown of any hand-waving or false assumptions; grudging respect only for airtight answers.'
    };

    const systemInstruction = `You are ProfessorX, evaluating an oral exam answer.
Persona: ${personaStyle[persona as ExaminerPersonaId] || personaStyle.professor}
Intensity: ${intensity}

Evaluation Rules:
1. For MCQ or True/False:
   - Check if the selected answer matches the correct answer.
   - If correct: verdict is 'correct', score is 100.
   - If incorrect: verdict is 'incorrect', score is 0. Explicitly state the misconception that lured the student into the wrong choice.
2. For Short Answer:
   - Perform SEMANTIC conceptual evaluation. Do NOT require exact word-for-word matching.
   - Look for correct causal relationships, key technical concepts, and accuracy according to the notes.
   - If the student demonstrated full understanding: 'correct' (score 85-100).
   - If the student captured partial intuition but missed the core mechanism or made a flawed claim: 'partially_correct' (score 50-75).
   - If the student was fundamentally mistaken or guessing: 'incorrect' (score 0-35).
3. Identify the EXACT misconception behind an incorrect or partial answer.
4. Calculate masteryDelta: (+15 to +25 for correct, +5 to -5 for partial, -15 to -25 for incorrect).
5. Suggest next difficulty level:
   - If correct on foundation -> applied. If correct on applied -> expert.
   - If incorrect on expert -> applied. If incorrect on applied -> foundation.
6. Provide an in-character examiner reaction and examiner mood ('impressed', 'stern', 'skeptical', 'merciless', 'neutral').`;

    const userPrompt = `Question Topic: ${question.topic}
Difficulty: ${question.difficulty}
Question Type: ${question.type}
Question: "${question.question}"
Correct Answer Reference: "${question.correctAnswer}"
Reference Explanation: "${question.explanation}"
Default Misconception: "${question.misconception}"

Student Answer:
"""
${studentAnswer || '(Student provided no answer / timed out)'}
"""

Relevant Study Material Excerpt:
"""
${(notesContent || '').slice(0, 6000)}
"""

Return valid JSON:
{
  "verdict": "correct" | "partially_correct" | "incorrect",
  "score": number, // 0 to 100
  "feedback": "string (clear explanation of why the answer is right/wrong and the proper reasoning)",
  "detectedMisconception": "string (empty if answer is fully correct; otherwise describe the exact false assumption)",
  "masteryDelta": number, // e.g. 20 or -15
  "suggestedNextDifficulty": "foundation" | "applied" | "expert",
  "examinerReaction": "string (in-character reaction line to the student's answer)",
  "examinerMood": "impressed" | "stern" | "skeptical" | "merciless" | "neutral"
}`;

    const fallback = () => evaluateMockAnswer(
      question as Question, 
      studentAnswer, 
      persona as ExaminerPersonaId, 
      intensity as PressureIntensity
    );

    const result = await generateStructuredAI<AnswerEvaluation>(
      systemInstruction,
      userPrompt,
      fallback
    );

    return NextResponse.json({
      evaluation: result.data,
      isLiveAI: result.isLiveAI,
      warning: result.error
    });
  } catch (error: unknown) {
    console.error('Error in /api/ai/evaluate-answer:', error);
    const fallbackEval = evaluateMockAnswer(
      req.body as unknown as Question, 
      '', 
      'professor', 
      'balanced'
    );
    return NextResponse.json({
      evaluation: fallbackEval,
      isLiveAI: false,
      warning: 'Server evaluated answer in fallback mode.'
    });
  }
}
