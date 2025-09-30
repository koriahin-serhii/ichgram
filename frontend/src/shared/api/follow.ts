import client from './client';
import type { ID } from './types';

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