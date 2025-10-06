import client from './client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types for notifications
export interface Notification {
  _id: string;
  type: 'like' | 'comment' | 'follow' | 'message';
  recipient: string;
  sender: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  post?: string;
  message?: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

// Query keys
export const notificationKeys = {
  all: ['notifications'] as const,
  list: () => [...notificationKeys.all, 'list'] as const,
};

// API functions for notifications
export const notificationsApi = {
  // Get all notifications
  getNotifications: async (): Promise<Notification[]> => {
    const response = await client.get('/api/notifications/');
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<{ message: string }> => {
    const response = await client.post('/api/notifications/read');
    return response.data;
  },
};

// React Query hooks
export function useNotifications() {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: notificationsApi.getNotifications,
  });
}

export function useMarkNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error>({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
