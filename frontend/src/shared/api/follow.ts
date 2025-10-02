import client from './client';
import type { ID } from './types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types for follows
export interface Follow {
  _id: string;
  follower: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  following: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  createdAt: string;
}

// Query keys
export const followKeys = {
  all: ['follows'] as const,
  followers: (userId: ID) => [...followKeys.all, 'followers', userId] as const,
  following: (userId: ID) => [...followKeys.all, 'following', userId] as const,
  isFollowing: (userId: ID) =>
    [...followKeys.all, 'isFollowing', userId] as const,
};

// API functions for follows
export const followApi = {
  // Get followers of a user
  getFollowers: async (userId: ID): Promise<Follow[]> => {
    const response = await client.get(`/api/follow/followers/${userId}`);
    return response.data;
  },

  // Get following of a user
  getFollowing: async (userId: ID): Promise<Follow[]> => {
    const response = await client.get(`/api/follow/following/${userId}`);
    return response.data;
  },

  // Check if current user is following another user
  isFollowing: async (userId: ID): Promise<boolean> => {
    try {
      const response = await client.get(`/api/follow/isFollowing/${userId}`);
      return response.data.isFollowing;
    } catch {
      return false;
    }
  },

  // Follow a user
  followUser: async (userId: ID): Promise<{ message: string }> => {
    const response = await client.post('/api/follow/follow', { userId });
    return response.data;
  },

  // Unfollow a user
  unfollowUser: async (userId: ID): Promise<{ message: string }> => {
    const response = await client.post('/api/follow/unfollow', { userId });
    return response.data;
  },
};

// React Query hooks
export function useFollowers(userId: ID) {
  return useQuery({
    queryKey: followKeys.followers(userId),
    queryFn: () => followApi.getFollowers(userId),
    enabled: Boolean(userId),
  });
}

export function useFollowing(userId: ID) {
  return useQuery({
    queryKey: followKeys.following(userId),
    queryFn: () => followApi.getFollowing(userId),
    enabled: Boolean(userId),
  });
}

export function useIsFollowing(userId: ID) {
  return useQuery({
    queryKey: followKeys.isFollowing(userId),
    queryFn: () => followApi.isFollowing(userId),
    enabled: Boolean(userId),
  });
}

export function useFollowUser() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, ID>({
    mutationFn: (userId) => followApi.followUser(userId),
    onSuccess: (_, userId) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: followKeys.followers(userId) });
      queryClient.invalidateQueries({ queryKey: followKeys.following(userId) });
      queryClient.invalidateQueries({
        queryKey: followKeys.isFollowing(userId),
      });
    },
  });
}

export function useUnfollowUser() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, ID>({
    mutationFn: (userId) => followApi.unfollowUser(userId),
    onSuccess: (_, userId) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: followKeys.followers(userId) });
      queryClient.invalidateQueries({ queryKey: followKeys.following(userId) });
      queryClient.invalidateQueries({
        queryKey: followKeys.isFollowing(userId),
      });
    },
  });
}
