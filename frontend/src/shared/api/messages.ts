import client from './client';
import type { ID } from './types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types for messages
export interface Message {
  _id: string;
  text: string;
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
}

export interface Conversation {
  _id: string;
  name: string;
  profileImage?: string;
  lastMessage: string;
  lastMessageDate: string;
}

// Query keys
export const messageKeys = {
  all: ['messages'] as const,
  conversations: () => [...messageKeys.all, 'conversations'] as const,
  conversation: (userId: ID) =>
    [...messageKeys.all, 'conversation', userId] as const,
};

// API functions for messages
export const messagesApi = {
  // Get list of conversations
  getConversations: async (): Promise<Conversation[]> => {
    const response = await client.get('/api/messages/');
    return response.data;
  },

  // Get message history with a user
  getMessages: async (userId: ID): Promise<Message[]> => {
    const response = await client.get(`/api/messages/${userId}`);
    return response.data;
  },

  // Send a message
  sendMessage: async (recipientId: ID, text: string): Promise<Message> => {
    const response = await client.post(`/api/messages/${recipientId}`, {
      text,
    });
    return response.data;
  },
};

// React Query hooks
export function useConversations() {
  return useQuery({
    queryKey: messageKeys.conversations(),
    queryFn: messagesApi.getConversations,
  });
}

export function useMessages(userId: ID | null) {
  return useQuery({
    queryKey: messageKeys.conversation(userId || ''),
    queryFn: () => messagesApi.getMessages(userId!),
    enabled: Boolean(userId),
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation<Message, Error, { recipientId: ID; text: string }>({
    mutationFn: ({ recipientId, text }) =>
      messagesApi.sendMessage(recipientId, text),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: messageKeys.conversation(variables.recipientId),
      });
      queryClient.invalidateQueries({
        queryKey: messageKeys.conversations(),
      });
    },
  });
}
