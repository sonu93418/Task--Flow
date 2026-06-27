import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const key = process.env.GEMINI_API_KEY;
console.log('🔑 Key:', key ? `${key.substring(0, 15)}...` : 'MISSING');

if (!key) {
  console.error('❌ Error: GEMINI_API_KEY environment variable is missing.');
  process.exit(1);
}

if (key.startsWith('AQ.') || key.startsWith('ya29.')) {
  console.warn('⚠️  Warning: Your key starts with an OAuth/Authentication token prefix (AQ. or ya29.).');
  console.warn('   Standard Gemini API keys from Google AI Studio start with "AIzaSy...".');
  console.warn('   If this key fails with a 401 ACCESS_TOKEN_TYPE_UNSUPPORTED, it has likely expired or is invalid.');
  console.warn('   Please obtain a fresh, permanent API key from: https://aistudio.google.com/');
}

try {
  const ai = new GoogleGenAI({ apiKey: key });
  console.log('📡 Testing API call...');
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: 'Reply with only: {"status":"ok"}'
  });
  console.log('✅ SUCCESS! Response:', response.text.trim());
} catch (err) {
  console.error('❌ Error status:', err.status || err.code);
  console.error('❌ Error message:', err.message?.substring(0, 300));
  
  if (err.message?.includes('UNAUTHENTICATED') || err.message?.includes('access token')) {
    console.error('\n💡 Troubleshooting Guide:');
    console.error('1. Your API key is unauthenticated. Ensure it has not been revoked or copied incorrectly.');
    console.error('2. Google is migrating to a new API key format. Ensure you generated a valid API key at https://aistudio.google.com/ and NOT a temporary Google Cloud token.');
    console.error('3. Make sure to restart your server process after updating the .env file.');
  }
}
