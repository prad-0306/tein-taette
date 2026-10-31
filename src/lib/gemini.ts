import { GoogleGenAI } from '@google/genai';

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.length < 5) {
    return null;
  }
  try {
    return new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
    return null;
  }
}

/**
 * Extracts and safely parses JSON from model response text
 */
function cleanAndParseJSON<T>(text: string): T {
  let cleaned = text.trim();
  // Strip ```json or ``` markdown code blocks if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
    cleaned = cleaned.replace(/\s*```$/i, '');
  }
  cleaned = cleaned.trim();

  // Find first { or [ and last } or ]
  const firstBrace = cleaned.search(/[\{\[]/);
  const lastBrace = Math.max(cleaned.lastIndexOf('}'), cleaned.lastIndexOf(']'));
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return JSON.parse(cleaned) as T;
}

/**
 * Calls Gemini Flash with structured output and automatic retry.
 * Falls back to realistic mock generator if key is absent or quota is exceeded.
 */
export async function generateStructuredAI<T>(
  systemInstruction: string,
  userPrompt: string,
  fallbackGenerator: () => T,
  schema?: Record<string, unknown>
): Promise<{ data: T; isLiveAI: boolean; error?: string }> {
  const client = getGeminiClient();

  if (!client) {
    // Graceful fallback to mock data generator
    return {
      data: fallbackGenerator(),
      isLiveAI: false
    };
  }

  // Model priority: test active models supported on Google AI Studio
  const models = [
    'gemini-3.6-flash',
    'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-2.5-flash',
    'gemini-2.0-flash'
  ];

  const timeoutPromise = <R>(ms: number): Promise<R> =>
    new Promise((_, reject) => setTimeout(() => reject(new Error('AI request timeout')), ms));

  for (const model of models) {
    try {
      // First attempt with 4.5s timeout race
      const response = await Promise.race([
        client.models.generateContent({
          model,
          contents: [
            { role: 'user', parts: [{ text: `${systemInstruction}\n\nTask:\n${userPrompt}` }] }
          ],
          config: {
            responseMimeType: 'application/json',
            ...(schema ? { responseSchema: schema } : {})
          }
        }),
        timeoutPromise<any>(4500)
      ]);

      const responseText = response?.text || '';
      try {
        const parsed = cleanAndParseJSON<T>(responseText);
        return { data: parsed, isLiveAI: true };
      } catch (parseError) {
        console.warn(`JSON parse error on ${model}, attempting single fast retry...`, parseError);
        
        // Single fast retry
        const retryResponse = await Promise.race([
          client.models.generateContent({
            model,
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemInstruction}\n\nTask:\n${userPrompt}\n\nCRITICAL: Return ONLY valid, raw, unescaped JSON. No comments, no formatting markdown.` }]
              }
            ],
            config: {
              responseMimeType: 'application/json'
            }
          }),
          timeoutPromise<any>(3500)
        ]);

        const retryText = retryResponse?.text || '';
        const parsedRetry = cleanAndParseJSON<T>(retryText);
        return { data: parsedRetry, isLiveAI: true };
      }
    } catch (apiError: unknown) {
      const errMessage = apiError instanceof Error ? apiError.message : String(apiError);
      console.warn(`Gemini call bypassed on model ${model}:`, errMessage.slice(0, 120));
      // Break fast on 503 demand spikes so user is not kept waiting
      if (errMessage.includes('503') || errMessage.includes('UNAVAILABLE') || errMessage.includes('timeout')) {
        break;
      }
    }
  }

  // If all live models failed, fallback safely to guaranteed mock simulation
  console.warn('All Gemini Flash models failed or quota exceeded. Falling back to simulation mode.');
  return {
    data: fallbackGenerator(),
    isLiveAI: false,
    error: 'Gemini API temporarily unavailable or quota reached. Running in adaptive simulation mode.'
  };
}
