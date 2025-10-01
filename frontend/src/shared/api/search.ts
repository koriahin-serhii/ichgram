import client from './client';
import type { User } from './users';
import { useQuery } from '@tanstack/react-query';

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

// Query keys
export const searchKeys = {
  all: ['search'] as const,
  users: (query: string) => [...searchKeys.all, 'users', query] as const,
  explore: () => [...searchKeys.all, 'explore'] as const,
};

// API functions for search
export const searchApi = {
  // Search users
  searchUsers: async (query: string): Promise<User[]> => {
    if (!query.trim()) return [];
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

// React Query hooks
export function useSearchUsers(query: string) {
  return useQuery({
    queryKey: searchKeys.users(query),
    queryFn: () => searchApi.searchUsers(query),
    enabled: Boolean(query.trim()),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useExplorePosts() {
  return useQuery({
    queryKey: searchKeys.explore(),
    queryFn: searchApi.getExplorePosts,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}