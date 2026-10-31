import { NextRequest, NextResponse } from 'next/server';
import { generateStructuredAI } from '@/lib/gemini';
import { generateMockReport } from '@/lib/mockData';
import { FinalReportData, AnswerRecord, TopicMastery } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subject = 'Study Notes', records = [], topicMasteries = [], notesContent = '' } = body;

    const totalQuestions = records.length;
    const correctCount = records.filter((r: AnswerRecord) => r.evaluation.verdict === 'correct').length;
    const accuracyRate = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const systemInstruction = `You are ProfessorX, delivering the final debrief and comprehensive repair plan following an adaptive oral examination.
Analyze the complete transcript of questions, answers, verdicts, and detected misconceptions.
Calculate the definitive academic grade:
- 'S': 90% - 100% (Flawless mastery, survived expert traps)
- 'A': 80% - 89% (Strong, minor edge-case gaps)
- 'B': 65% - 79% (Competent baseline, vulnerable to boundary conditions)
- 'C': 50% - 64% (Superficial familiarity, multiple misconceptions)
- 'D': < 50% (Systemic conceptual failure)

Deliver:
1. Verdict Title and detailed diagnostic critique.
2. Strongest topics and Weakest topics with primary failure causes.
3. Synthesized list of root misconceptions exposed.
4. Concrete, actionable repair plan with exactly ONE challenging practice question per weak topic (including hint and complete solution).
5. 3 strategic next steps for mastery.`;

    const userPrompt = `Subject: ${subject}
Total Questions: ${totalQuestions}
Correct Answers: ${correctCount}
Accuracy Rate: ${accuracyRate}%

Topic Mastery Distribution:
${JSON.stringify(topicMasteries, null, 2)}

Full Interrogation Log:
${JSON.stringify(
  records.map((r: AnswerRecord) => ({
    qNum: r.questionNumber,
    topic: r.question.topic,
    difficulty: r.question.difficulty,
    question: r.question.question,
    userAnswer: r.userAnswer,
    verdict: r.evaluation.verdict,
    feedback: r.evaluation.feedback,
    misconception: r.evaluation.detectedMisconception
  })),
  null,
  2
)}

Original Study Notes Excerpt:
"""
${(notesContent || '').slice(0, 8000)}
"""

Return valid JSON matching this schema:
{
  "overallScore": ${accuracyRate},
  "grade": "S" | "A" | "B" | "C" | "D",
  "verdictTitle": "string",
  "verdictSummary": "string",
  "strongestTopics": ["string"],
  "weakTopics": [
    {
      "topic": "string",
      "masteryScore": number,
      "primaryReason": "string"
    }
  ],
  "misconceptionsSummary": [
    {
      "topic": "string",
      "whatYouThought": "string",
      "reality": "string"
    }
  ],
  "repairPlan": [
    {
      "topic": "string",
      "actionItem": "string",
      "practiceQuestion": {
        "question": "string",
        "hint": "string",
        "solution": "string"
      }
    }
  ],
  "nextSteps": ["string"]
}`;

    const fallback = () => generateMockReport(subject, records, topicMasteries);

    const result = await generateStructuredAI<Omit<FinalReportData, 'subject' | 'topicMasteries' | 'totalQuestions' | 'accuracyRate' | 'dateGenerated'>>(
      systemInstruction,
      userPrompt,
      fallback
    );

    const fullReport: FinalReportData = {
      ...result.data,
      subject,
      topicMasteries,
      totalQuestions,
      accuracyRate,
      dateGenerated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    return NextResponse.json({
      report: fullReport,
      isLiveAI: result.isLiveAI,
      warning: result.error
    });
  } catch (error: unknown) {
    console.error('Error in /api/ai/generate-report:', error);
    const fallbackReport = generateMockReport('Study Notes', [], []);
    return NextResponse.json({
      report: fallbackReport,
      isLiveAI: false,
      warning: 'Server generated report in fallback mode.'
    });
  }
}
