import client from './client';
import type { User } from './users';

// Types for search results
export interface SearchResult {
  users: User[];
  posts: Array<{
    _id: string;
    description: string;
    imageUrl: string;
    author: User;
    createdAt: string;
  }>;
}

// API functions for search
export const searchApi = {
  // Search users
  searchUsers: async (query: string): Promise<User[]> => {
    const response = await client.get('/api/search/users', {
      params: { q: query },
    });
    return response.data;
  },

  // Get posts for the "Explore" page
  getExplorePosts: async (): Promise<SearchResult['posts']> => {
    const response = await client.get('/api/search/explore');
    return response.data;
  },
};