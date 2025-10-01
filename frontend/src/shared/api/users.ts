import client from './client';
import type { ID } from './types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../app/providers/useAuth';

// Types for users
export interface User {
  _id: string;
  name: string;
  email: string;
  fullName: string;
  profileImage?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export interface UserProfile extends User {
  stats: UserStats;
  isFollowing?: boolean;
}

// Query keys
export const userKeys = {
  all: ['users'] as const,
  profile: (userId: ID) => [...userKeys.all, 'profile', userId] as const,
  me: () => [...userKeys.all, 'me'] as const,
  stats: (userId: ID) => [...userKeys.all, 'stats', userId] as const,
};

// API functions for users
export const usersApi = {
  // Get user profile by ID
  getProfile: async (userId: ID): Promise<User> => {
    const response = await client.get(`/api/user/profile/${userId}`);
    return response.data;
  },

  // Get current user profile (using information from auth context)
  getMyProfile: async (userId: ID): Promise<User> => {
    const response = await client.get(`/api/user/profile/${userId}`);
    return response.data;
  },

  // Get user stats (posts, followers, following)
  getUserStats: async (userId: ID): Promise<UserStats> => {
    try {
      // Fetch statistics from different endpoints
      const [postsResponse, followersResponse, followingResponse] = await Promise.all([
        client.get(`/api/posts/user/${userId}`),
        client.get(`/api/follow/followers/${userId}`),
        client.get(`/api/follow/following/${userId}`)
      ]);

      return {
        postsCount: postsResponse.data.length || 0,
        followersCount: followersResponse.data.length || 0,
        followingCount: followingResponse.data.length || 0,
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return {
        postsCount: 0,
        followersCount: 0,
        followingCount: 0,
      };
    }
  },

  // Update user profile
  updateProfile: async (data: FormData): Promise<User> => {
    const response = await client.put('/api/user/profile', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Helpers to combine user data with stats
const combineUserWithStats = async (userId: ID): Promise<UserProfile> => {
  const [user, stats] = await Promise.all([
    usersApi.getProfile(userId),
    usersApi.getUserStats(userId)
  ]);

  return {
    ...user,
    stats,
    isFollowing: false, // TODO: implement following check
  };
};

// React Query hooks
export function useUserProfile(userId: ID) {
  return useQuery({
    queryKey: userKeys.profile(userId),
    queryFn: () => combineUserWithStats(userId),
    enabled: Boolean(userId),
  });
}

export function useMyProfile() {
  const { user: currentUser } = useAuth();
  
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: async (): Promise<UserProfile> => {
      if (!currentUser?.id) {
        throw new Error('User not authenticated');
      }
      const user = await usersApi.getMyProfile(currentUser.id);
      const stats = await usersApi.getUserStats(user._id);
      return {
        ...user,
        stats,
        isFollowing: false,
      };
    },
    enabled: Boolean(currentUser?.id),
  });
}

interface UpdateProfileData {
  fullName?: string;
  bio?: string;
  profileImage?: File;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation<User, Error, UpdateProfileData>({
    mutationFn: async (data: UpdateProfileData) => {
      const formData = new FormData();
      if (data.fullName) formData.append('fullName', data.fullName);
      if (data.bio) formData.append('bio', data.bio);
      if (data.profileImage) formData.append('profileImage', data.profileImage);
      
      return usersApi.updateProfile(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}