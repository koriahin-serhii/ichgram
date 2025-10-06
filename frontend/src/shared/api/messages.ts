import client from './client';
import type { ID } from './types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

// Query keys
export const messageKeys = {
  all: ['messages'] as const,
  conversation: (userId: ID) =>
    [...messageKeys.all, 'conversation', userId] as const,
};

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

// React Query hooks
export function useMessages(userId: ID) {
  return useQuery({
    queryKey: messageKeys.conversation(userId),
    queryFn: () => messagesApi.getMessages(userId),
    enabled: Boolean(userId),
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation<Message, Error, { recipientId: ID; content: string }>({
    mutationFn: ({ recipientId, content }) =>
      messagesApi.sendMessage(recipientId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: messageKeys.conversation(variables.recipientId),
      });
    },
  });
}
