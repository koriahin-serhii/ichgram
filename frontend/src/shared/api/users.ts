import client from './client';
import type { ID } from './types';

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

// API functions for users
export const usersApi = {
  // Get user profile by ID
  getProfile: async (userId: ID): Promise<User> => {
    const response = await client.get(`/api/user/profile/${userId}`);
    return response.data;
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