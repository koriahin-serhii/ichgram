import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as PostsAPI from '../api';
import type { ID } from '@shared/api/types';

export const postKeys = {
  all: ['posts'] as const,
  feed: () => [...postKeys.all, 'feed'] as const,
  detail: (id: ID) => [...postKeys.all, 'detail', id] as const,
  byUser: (userId: ID) => [...postKeys.all, 'user', userId] as const,
};

export function useFeed() {
  return useQuery({
    queryKey: postKeys.feed(),
    queryFn: PostsAPI.getFeed,
  });
}

export function usePost(id: ID) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => PostsAPI.getPost(id),
    enabled: Boolean(id),
  });
}

type CreatePostVars = { image: File; data?: Record<string, string | number | boolean> };
export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation<unknown, Error, CreatePostVars>({
    mutationFn: ({ image, data }) => PostsAPI.createPost(image, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: postKeys.feed() });
    },
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation<unknown, Error, ID>({
    mutationFn: (id: ID) => PostsAPI.deletePost(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: postKeys.feed() });
    },
  });
}
