import { NextRequest, NextResponse } from 'next/server';
import { generateStructuredAI } from '@/lib/gemini';
import { getMockAnalysis } from '@/lib/mockData';
import { MaterialAnalysis } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { notesContent, subject } = body;

    if (!notesContent || typeof notesContent !== 'string' || notesContent.trim().length === 0) {
      return NextResponse.json({ error: 'Study material text is required.' }, { status: 400 });
    }

    const systemInstruction = `You are ProfessorX, an elite, high-pressure AI oral-examiner.
Analyze the provided student study notes with surgical academic precision.
Extract 3 to 6 distinct core topics/concepts that can be rigorously examined.
Identify examinable gaps and potential student misconceptions.
Determine the appropriate baseline difficulty level ('foundation', 'applied', or 'expert').
Craft an intimidating, intellectually rigorous introduction from the examiner.
Strict Rule: Ground all topics and concepts exclusively in the provided notes. Do not hallucinate outside content.`;

    const userPrompt = `Subject: ${subject || 'Auto-Detect from Notes'}
Notes Content:
"""
${notesContent.slice(0, 15000)}
"""

Return JSON format:
{
  "subject": "string (refined academic subject name)",
  "coreConcepts": [
    {
      "topic": "string (concise 2-4 word topic title)",
      "summary": "string (1-2 sentence core principle)",
      "importance": "high" | "medium" | "low"
    }
  ],
  "examinableGaps": ["string (specific tricky failure mode or boundary condition)"],
  "estimatedDifficulty": "foundation" | "applied" | "expert",
  "examinerIntro": "string (2-3 sentences of sharp examiner critique and challenge)"
}`;

    const fallback = () => getMockAnalysis(notesContent, subject);

    const result = await generateStructuredAI<MaterialAnalysis>(
      systemInstruction,
      userPrompt,
      fallback
    );

    return NextResponse.json({
      analysis: result.data,
      isLiveAI: result.isLiveAI,
      warning: result.error
    });
  } catch (error: unknown) {
    console.error('Error in /api/ai/analyze:', error);
    const fallbackData = getMockAnalysis('General Notes');
    return NextResponse.json({
      analysis: fallbackData,
      isLiveAI: false,
      warning: 'Server processed analysis in fallback mode.'
    });
  }
}
