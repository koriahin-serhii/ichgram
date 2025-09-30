import api from './client';
import type { ID } from './types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const postKeys = {
  all: ['posts'] as const,
  feed: () => [...postKeys.all, 'feed'] as const,
  detail: (id: ID) => [...postKeys.all, 'detail', id] as const,
  byUser: (userId: ID) => [...postKeys.all, 'user', userId] as const,
};

export async function getUserPosts(userId: ID) {
  const res = await api.get(`/posts/user/${userId}`);
  return res.data;
}

export async function getFeed() {
  const res = await api.get('/posts');
  return res.data;
}

export async function getPost(id: ID) {
  const res = await api.get(`/posts/${id}`);
  return res.data;
}

export async function createPost(image: File, description?: string) {
  const form = new FormData();
  form.append('image', image);
  if (description) form.append('description', description);
  const res = await api.post('/posts', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
}

export async function deletePost(id: ID) {
  const res = await api.delete(`/posts/${id}`);
  return res.data;
}

export async function updatePost(id: ID, description?: string, image?: File) {
  const form = new FormData();
  if (description) form.append('description', description);
  if (image) form.append('image', image);
  const res = await api.put(`/posts/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
}

// React Query hooks
export function useFeed() {
  return useQuery({
    queryKey: postKeys.feed(),
    queryFn: getFeed,
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
      qc.invalidateQueries({ queryKey: postKeys.feed() });
    },
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation<unknown, Error, ID>({
    mutationFn: (id: ID) => deletePost(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: postKeys.feed() });
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
    mutationFn: ({ id, description, image }) => updatePost(id, description, image),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: postKeys.feed() });
      qc.invalidateQueries({ queryKey: postKeys.detail(id) });
    },
  });
}
