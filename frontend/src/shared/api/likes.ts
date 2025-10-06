import client from './client';
import type { ID } from './types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types for likes
export interface Like {
  _id: string;
  user: string;
  post: string;
  createdAt: string;
}

// Query keys
export const likeKeys = {
  all: ['likes'] as const,
  byPost: (postId: ID) => [...likeKeys.all, postId] as const,
};

// API functions for likes
export const likesApi = {
  // Toggle like
  toggleLike: async (
    postId: ID
  ): Promise<{ message: string; liked: boolean }> => {
    const response = await client.post('/api/likes/like', { postId });
    return response.data;
  },

  // Get likes for a post
  getLikes: async (postId: ID): Promise<Like[]> => {
    const response = await client.get(`/api/likes/likes/${postId}`);
    return response.data;
  },
};

// React Query hooks
export function useLikes(postId: ID) {
  return useQuery({
    queryKey: likeKeys.byPost(postId),
    queryFn: () => likesApi.getLikes(postId),
    enabled: Boolean(postId),
  });
}

export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string; liked: boolean }, Error, ID>({
    mutationFn: (postId) => likesApi.toggleLike(postId),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: likeKeys.byPost(postId) });
    },
  });
}
