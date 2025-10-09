import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
}

interface ChatResponse {
  response: string;
  timestamp: string;
}

export const useAIChatMutation = () => {
  return useMutation({
    mutationFn: async (data: ChatRequest): Promise<ChatResponse> => {
      const response = await axios.post(`${API_URL}/ai/chat`, data, {
        withCredentials: true,
      });
      return response.data;
    },
  });
};
