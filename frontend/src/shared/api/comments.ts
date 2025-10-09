import client from './client';
import type { ID } from './types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postKeys } from './posts';

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

// Query keys
export const commentKeys = {
  all: ['comments'] as const,
  byPost: (postId: ID) => [...commentKeys.all, postId] as const,
};

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

// React Query hooks
export function useComments(postId: ID) {
  return useQuery({
    queryKey: commentKeys.byPost(postId),
    queryFn: () => commentsApi.getComments(postId),
    enabled: Boolean(postId),
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation<Comment, Error, { postId: ID; content: string }>({
    mutationFn: ({ postId, content }) =>
      commentsApi.addComment(postId, content),
    onSuccess: (_, variables) => {
      // Invalidate comments for this specific post
      queryClient.invalidateQueries({
        queryKey: commentKeys.byPost(variables.postId),
      });
      
      // Invalidate all user posts to update commentsCount in PostCard
      queryClient.invalidateQueries({ queryKey: [...postKeys.all, 'user'] });
      
      // Invalidate feed and explore pages
      queryClient.invalidateQueries({ queryKey: postKeys.feed() });
      queryClient.invalidateQueries({ queryKey: postKeys.explore() });
      
      // Invalidate post details
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
    },
  });
}
