import client from './client';

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