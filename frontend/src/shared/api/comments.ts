import client from './client';
import type { ID } from './types';

// Types for comments
export interface Comment {
  _id: string;
  content: string;
  user: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  post: string;
  createdAt: string;
  updatedAt: string;
}

// API functions for comments
export const commentsApi = {
  // Add a comment
  addComment: async (postId: ID, content: string): Promise<Comment> => {
    const response = await client.post('/api/comments/comment', {
      postId,
      content,
    });
    return response.data;
  },

  // Get comments for a post
  getComments: async (postId: ID): Promise<Comment[]> => {
    const response = await client.get(`/api/comments/comments/${postId}`);
    return response.data;
  },
};