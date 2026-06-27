import { GoogleGenAI } from '@google/genai';

const getMockSuggestion = (title, reason = 'AI unavailable') => {
  const len = title.length;
  let effort, hours;
  if (len < 20) { effort = 'S'; hours = 2; }
  else if (len < 50) { effort = 'M'; hours = 5; }
  else { effort = 'L'; hours = 10; }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + hours);

  return {
    effort,
    estimatedHours: hours,
    suggestedDueDate: dueDate.toISOString().split('T')[0],
    reasoning: `Fallback estimate (${reason}): Based on task length, this is a ${effort}-sized task (~${hours} hours).`,
    isMock: true
  };
};

const MODELS_TO_TRY = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
];

const tryGenerateWithModel = async (ai, model, prompt) => {
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          effort: { type: 'STRING', description: 'Effort size: S, M, or L' },
          estimatedHours: { type: 'INTEGER', description: 'Estimated hours to complete' },
          suggestedDueDate: { type: 'STRING', description: 'Suggested due date in YYYY-MM-DD format' },
          reasoning: { type: 'STRING', description: 'Brief reasoning for the estimate' }
        },
        required: ['effort', 'estimatedHours', 'suggestedDueDate', 'reasoning']
      }
    }
  });
  return response.text.trim();
};

export const getAISuggestion = async (title, description) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return getMockSuggestion(title, 'no API key configured');
  }

  const ai = new GoogleGenAI({ apiKey });

  const today = new Date().toISOString().split('T')[0];
  const prompt = `You are a project management assistant. Given the following task, estimate the effort required.

Task Title: ${title}
Task Description: ${description || 'No description provided'}
Today's Date: ${today}

Respond with the effort size (S, M, or L), estimated hours, a suggested due date in YYYY-MM-DD format, and a brief reasoning.`;

  let lastError = null;

  for (const model of MODELS_TO_TRY) {
    try {
      console.log(`🤖 Trying AI model: ${model}`);
      const text = await tryGenerateWithModel(ai, model, prompt);

      // Parse JSON response
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      let parsed;
      try {
        parsed = JSON.parse(cleanText);
      } catch {
        console.error(`Failed to parse AI response from ${model}:`, text);
        continue; // Try next model
      }

      // Validate and sanitize
      const validEfforts = ['S', 'M', 'L'];
      if (!validEfforts.includes(parsed.effort)) parsed.effort = 'M';
      if (typeof parsed.estimatedHours !== 'number' || parsed.estimatedHours < 1) parsed.estimatedHours = 4;
      if (!parsed.suggestedDueDate || isNaN(Date.parse(parsed.suggestedDueDate))) {
        const fallback = new Date();
        fallback.setDate(fallback.getDate() + 3);
        parsed.suggestedDueDate = fallback.toISOString().split('T')[0];
      }
      if (!parsed.reasoning) parsed.reasoning = 'AI-generated estimate based on task analysis.';

      console.log(`✅ AI suggestion from model: ${model}`);
      return { ...parsed, isMock: false, model };

    } catch (err) {
      lastError = err;
      const status = err.status || err.code;
      if (status === 429) {
        console.warn(`⚠️ Quota exceeded for ${model}, trying next model...`);
        continue; // Try next model
      }
      // For other errors, log and try next
      console.error(`❌ Error with ${model}:`, err.message);
      continue;
    }
  }

  // All models failed
  const reason = lastError?.status === 429
    ? 'API quota exceeded — please check your Gemini API key at aistudio.google.com'
    : lastError?.message || 'AI service unavailable';

  console.error('❌ All AI models failed:', reason);
  return getMockSuggestion(title, reason);
};
