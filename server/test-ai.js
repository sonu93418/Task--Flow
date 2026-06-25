import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

console.log('🔑 Key:', process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0,15)}...` : 'MISSING');

try {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log('📡 Testing API call...');
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: 'Reply with only: {"status":"ok"}'
  });
  console.log('✅ SUCCESS! Response:', response.text.trim());
} catch (err) {
  console.error('❌ Error code:', err.status || err.code);
  console.error('❌ Message:', err.message?.substring(0, 300));
}
