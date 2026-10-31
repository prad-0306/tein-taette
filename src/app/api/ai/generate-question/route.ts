import { NextRequest, NextResponse } from 'next/server';
import { generateStructuredAI } from '@/lib/gemini';
import { generateMockQuestion } from '@/lib/mockData';
import { Question, DifficultyLevel, ExaminerPersonaId, PressureIntensity, QuestionType } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      notesContent, 
      topics = [], 
      currentDifficulty = 'applied', 
      targetTopic, 
      persona = 'professor', 
      intensity = 'balanced',
      questionNumber = 1,
      previousQuestions = [],
      previousMisconceptions = []
    } = body;

    const chosenTopic = targetTopic || (topics.length > 0 ? topics[(questionNumber - 1) % topics.length] : 'Core Theory');

    // Oral exam simulator: short_answer text questions are primary, with conceptual MCQs
    let targetType: QuestionType = 'short_answer';
    if (questionNumber % 3 === 0) {
      targetType = 'mcq';
    } else if (questionNumber % 5 === 0) {
      targetType = 'true_false';
    } else {
      targetType = 'short_answer';
    }

    const personaInstructions: Record<ExaminerPersonaId, string> = {
      professor: 'Tone: Academic, formal, meticulous, testing theoretical invariants and rigorous definitions.',
      interviewer: 'Tone: Senior engineering interviewer, testing real-world trade-offs, scalability, and operational failure modes.',
      ruthless: 'Tone: Sarcastic, merciless, high-pressure interrogation targeting edge cases, vulnerabilities, and false assumptions.'
    };

    const systemInstruction = `You are ProfessorX, the ultimate AI oral examiner.
Generate ONE highly specific interrogation question based strictly on the provided study notes.
Question Details:
- Target Topic: ${chosenTopic}
- Difficulty Level: ${currentDifficulty} (foundation = recall/definitions, applied = scenario/consequences, expert = multi-step causal reasoning/deep mechanics)
- Question Type: ${targetType}
- Persona: ${personaInstructions[persona as ExaminerPersonaId] || personaInstructions.professor}
- Intensity: ${intensity}

Strict Rules:
1. ONLY test facts and concepts present in the notes. Do NOT introduce external concepts not covered in the notes.
2. DO NOT repeat any of the following previous questions: ${JSON.stringify(previousQuestions.slice(-5))}.
3. If previous misconceptions are noted (${JSON.stringify(previousMisconceptions.slice(-3))}), craft a question that addresses or probes that specific flaw.
4. For 'mcq': provide 4 plausible options, where 3 are common student traps based on genuine misunderstandings.
5. For 'true_false': options must be ["True", "False"]. The statement must be subtle, not obviously true or false.
6. For 'short_answer': options must be empty [].
7. Include the underlying misconception that would lead a student to answer incorrectly.
8. Include a sharp, in-character examiner spoken line.`;

    const userPrompt = `Study Material Notes:
"""
${(notesContent || '').slice(0, 10000)}
"""

Target Topic: ${chosenTopic}
Required Question Type: ${targetType}
Difficulty: ${currentDifficulty}

Return valid JSON:
{
  "id": "q-${questionNumber}",
  "topic": "${chosenTopic}",
  "type": "${targetType}",
  "difficulty": "${currentDifficulty}",
  "question": "string (the exact question text)",
  "options": ["string", "string", "string", "string"], // empty [] if short_answer, ["True", "False"] if true_false
  "correctAnswer": "string (exact correct option or model short answer)",
  "explanation": "string (clear, rigorous proof of why this is correct)",
  "misconception": "string (the flawed intuition or implicit false assumption exposed by this question)",
  "examinerLine": "string (in-character sharp examiner prompt or observation)"
}`;

    const fallback = () => generateMockQuestion(
      topics, 
      currentDifficulty as DifficultyLevel, 
      chosenTopic, 
      questionNumber - 1,
      persona as ExaminerPersonaId
    );

    const result = await generateStructuredAI<Question>(
      systemInstruction,
      userPrompt,
      fallback
    );

    // Ensure options format matches type
    const finalQuestion = { ...result.data };
    if (targetType === 'true_false' && (!finalQuestion.options || finalQuestion.options.length !== 2)) {
      finalQuestion.options = ['True', 'False'];
    } else if (targetType === 'short_answer') {
      finalQuestion.options = [];
    }

    return NextResponse.json({
      question: finalQuestion,
      isLiveAI: result.isLiveAI,
      warning: result.error
    });
  } catch (error: unknown) {
    console.error('Error in /api/ai/generate-question:', error);
    const fallbackQ = generateMockQuestion(['Core Concepts'], 'applied', 'Core Concepts', 0, 'professor');
    return NextResponse.json({
      question: fallbackQ,
      isLiveAI: false,
      warning: 'Server generated question in fallback mode.'
    });
  }
}
