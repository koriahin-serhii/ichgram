import { Request, Response } from 'express';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// System prompt for the AI assistant
const SYSTEM_PROMPT = `Ты SKYJECTIV AI Ассистент - помощник в социальной сети. 
Отвечай кратко и по делу. Ты можешь помочь с:
- Созданием и оптимизацией постов
- Управлением профилем
- Функциями сообщений
- Уведомлениями

Отвечай на том же языке, на котором задан вопрос (русский или английский).
Будь дружелюбным и используй эмодзи в ответах.`;

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const getChatResponse = async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build messages array with conversation history
    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    // Add conversation history (last 10 messages to save tokens)
    if (conversationHistory && Array.isArray(conversationHistory)) {
      const recentHistory = conversationHistory.slice(-10);
      messages.push(...recentHistory);
    }

    // Add current user message
    messages.push({ role: 'user', content: message });

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // or 'gpt-4' for better quality
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content || 'Извините, не могу ответить на этот вопрос.';

    res.json({
      response: aiResponse,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('OpenAI API error:', error);
    
    // Handle specific OpenAI errors
    let errorMessage = 'Извините, сейчас я не могу ответить. Попробуйте позже.';
    let statusCode = 500;

    if (error.code === 'insufficient_quota') {
      errorMessage = 'OpenAI API квота исчерпана. Пожалуйста, пополните баланс на platform.openai.com или используйте локальный режим (📝).';
      statusCode = 429;
    } else if (error.status === 401) {
      errorMessage = 'Неверный API ключ OpenAI. Проверьте настройки.';
      statusCode = 401;
    } else if (error.code === 'model_not_found') {
      errorMessage = 'Модель OpenAI не найдена. Проверьте настройки.';
      statusCode = 400;
    }
    
    // Return fallback response on error
    res.status(statusCode).json({
      error: error.code || 'AI service error',
      fallback: errorMessage,
      useLocalFallback: true, // Signal frontend to switch to local mode
    });
  }
};
