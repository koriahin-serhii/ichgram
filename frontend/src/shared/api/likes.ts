import client from './client';
import type { ID } from './types';

// Types for likes
export interface Like {
  _id: string;
  user: string;
  post: string;
  createdAt: string;
}

// API functions for likes
export const likesApi = {
  // Toggle like
  toggleLike: async (postId: ID): Promise<{ message: string; liked: boolean }> => {
    const response = await client.post('/api/likes/like', { postId });
    return response.data;
  },

  // Get likes for a post
  getLikes: async (postId: ID): Promise<Like[]> => {
    const response = await client.get(`/api/likes/likes/${postId}`);
    return response.data;
  },
};