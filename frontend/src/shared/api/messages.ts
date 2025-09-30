import client from './client';
import type { ID } from './types';

// Types for messages
export interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  recipient: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// API functions for messages
export const messagesApi = {
  // Get message history with a user
  getMessages: async (userId: ID): Promise<Message[]> => {
    const response = await client.get(`/api/messages/${userId}`);
    return response.data;
  },

  // Send a message (usually via WebSocket, but can also be HTTP)
  sendMessage: async (recipientId: ID, content: string): Promise<Message> => {
    const response = await client.post('/api/messages/send', {
      recipientId,
      content,
    });
    return response.data;
  },
};