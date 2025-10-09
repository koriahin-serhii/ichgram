import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
  try {
    console.log('Testing OpenAI API...');
    console.log('API Key:', process.env.OPENAI_API_KEY?.substring(0, 20) + '...');
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Say hello!' }
      ],
      max_tokens: 50,
    });

    console.log('✅ OpenAI API is working!');
    console.log('Response:', completion.choices[0]?.message?.content);
  } catch (error) {
    console.error('❌ OpenAI API Error:');
    console.error('Error code:', error.code);
    console.error('Error status:', error.status);
    console.error('Error message:', error.message);
    
    if (error.code === 'invalid_api_key') {
      console.log('\n🔑 Your API key is invalid or expired.');
      console.log('📝 Please get a new one from: https://platform.openai.com/api-keys');
    } else if (error.code === 'insufficient_quota') {
      console.log('\n💰 Your OpenAI account has no credits.');
      console.log('💳 Please add billing at: https://platform.openai.com/account/billing');
    }
  }
}

testOpenAI();
