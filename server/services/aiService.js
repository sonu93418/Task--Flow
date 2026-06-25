import { GoogleGenAI } from '@google/genai';

const getMockSuggestion = (title) => {
  // Deterministic mock based on title length
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
    reasoning: `Mock estimate: Based on task complexity, this appears to be a ${effort}-sized task (~${hours} hours). AI is unavailable — using fallback estimation.`,
    isMock: true
  };
};

export const getAISuggestion = async (title, description) => {
  // If no API key, return mock
  if (!process.env.GEMINI_API_KEY) {
    return getMockSuggestion(title);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const today = new Date().toISOString().split('T')[0];
    const prompt = `You are a project management assistant. Given the following task, estimate the effort required.

Task Title: ${title}
Task Description: ${description || 'No description provided'}
Today's Date: ${today}

Respond ONLY with valid JSON (no markdown, no code fences, no extra text):
{
  "effort": "S or M or L",
  "estimatedHours": <number between 1 and 40>,
  "suggestedDueDate": "<YYYY-MM-DD format>",
  "reasoning": "<1-2 sentence explanation>"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt
    });

    const text = response.text.trim();
    
    // Try to parse the JSON response
    let parsed;
    try {
      // Remove potential code fences if the model adds them
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleanText);
    } catch {
      console.error('Failed to parse AI response:', text);
      return getMockSuggestion(title);
    }

    // Validate the response structure
    const validEfforts = ['S', 'M', 'L'];
    if (!validEfforts.includes(parsed.effort)) parsed.effort = 'M';
    if (typeof parsed.estimatedHours !== 'number' || parsed.estimatedHours < 1) parsed.estimatedHours = 4;
    if (!parsed.suggestedDueDate || isNaN(Date.parse(parsed.suggestedDueDate))) {
      const fallbackDate = new Date();
      fallbackDate.setDate(fallbackDate.getDate() + 3);
      parsed.suggestedDueDate = fallbackDate.toISOString().split('T')[0];
    }
    if (!parsed.reasoning) parsed.reasoning = 'AI-generated estimate based on task analysis.';

    return { ...parsed, isMock: false };
  } catch (error) {
    console.error('AI service error:', error.message);
    return getMockSuggestion(title);
  }
};
