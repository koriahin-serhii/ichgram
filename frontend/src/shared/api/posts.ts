import api from './client';
import type { ID } from './types';
import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userKeys } from './users';

// Types
export interface Post {
  _id: string;
  imageUrl: string;
  description?: string;
  likesCount?: number;
  commentsCount?: number;
  author?: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasMore: boolean;
  limit: number;
}

export interface FeedResponse {
  posts: Post[];
  pagination: PaginationMeta;
}

export const postKeys = {
  all: ['posts'] as const,
  feed: () => [...postKeys.all, 'feed'] as const,
  detail: (id: ID) => [...postKeys.all, 'detail', id] as const,
  byUser: (userId: ID) => [...postKeys.all, 'user', userId] as const,
};

export async function getUserPosts(userId: ID) {
  const res = await api.get(`/api/posts/user/${userId}`);
  return res.data;
}

export async function getFeed(page = 1, limit = 10): Promise<FeedResponse> {
  const res = await api.get('/api/posts/', {
    params: { page, limit },
  });
  return res.data;
}

export async function getPost(id: ID) {
  const res = await api.get(`/api/posts/${id}`);
  return res.data;
}

export async function createPost(image: File, description?: string) {
  const form = new FormData();
  form.append('image', image);
  if (description) form.append('description', description);
  const res = await api.post('/api/posts/', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function deletePost(id: ID) {
  const res = await api.delete(`/api/posts/${id}`);
  return res.data;
}

export async function updatePost(id: ID, description?: string, image?: File) {
  const form = new FormData();
  if (description) form.append('description', description);
  if (image) form.append('image', image);
  const res = await api.put(`/api/posts/${id}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

// React Query hooks
export function useFeed() {
  return useInfiniteQuery({
    queryKey: postKeys.feed(),
    queryFn: ({ pageParam = 1 }) => getFeed(pageParam, 10),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore 
        ? lastPage.pagination.currentPage + 1 
        : undefined;
    },
  });
}

export function usePost(id: ID) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => getPost(id),
    enabled: Boolean(id),
  });
}

type CreatePostVars = { image: File; description?: string };
export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation<unknown, Error, CreatePostVars>({
    mutationFn: ({ image, description }) => createPost(image, description),
    onSuccess: () => {
      // Invalidating feed
      qc.invalidateQueries({ queryKey: postKeys.feed() });
      // Invalidating user posts (to update profile)
      qc.invalidateQueries({ queryKey: [...postKeys.all, 'user'] });
      // Invalidating user profiles (to update stats.postsCount)
      qc.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation<unknown, Error, ID>({
    mutationFn: (id: ID) => deletePost(id),
    onSuccess: (_, deletedPostId) => {
      // Deleting post from cache
      qc.removeQueries({ queryKey: postKeys.detail(deletedPostId) });
      
      // Invalidating feed and user posts
      qc.invalidateQueries({ queryKey: postKeys.feed() });
      qc.invalidateQueries({ queryKey: [...postKeys.all, 'user'] });

      // Invalidating user profiles (to update stats.postsCount)
      qc.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useUserPosts(userId: ID) {
  return useQuery({
    queryKey: postKeys.byUser(userId),
    queryFn: () => getUserPosts(userId),
    enabled: Boolean(userId),
  });
}

type UpdatePostVars = { id: ID; description?: string; image?: File };
export function useUpdatePost() {
  const qc = useQueryClient();
  return useMutation<unknown, Error, UpdatePostVars>({
    mutationFn: ({ id, description, image }) =>
      updatePost(id, description, image),
    onSuccess: (_, { id }) => {
      // Invalidating feed, post details, and user posts
      qc.invalidateQueries({ queryKey: postKeys.feed() });
      qc.invalidateQueries({ queryKey: postKeys.detail(id) });
      qc.invalidateQueries({ queryKey: [...postKeys.all, 'user'] });
      // Invalidating user profiles (to update stats.postsCount)
      qc.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
