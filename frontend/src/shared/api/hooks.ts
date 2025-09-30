import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from './users';
import { commentsApi } from './comments';
import { followApi } from './follow';
import { likesApi } from './likes';
import { messagesApi } from './messages';
import { notificationsApi } from './notifications';
import { searchApi } from './search';
import type { ID } from './types';

// Query keys для кеширования
export const queryKeys = {
  // Users
  user: (id: ID) => ['user', id] as const,
  
  // Comments
  comments: (postId: ID) => ['comments', postId] as const,
  
  // Follow
  followers: (userId: ID) => ['followers', userId] as const,
  following: (userId: ID) => ['following', userId] as const,
  
  // Likes
  likes: (postId: ID) => ['likes', postId] as const,
  
  // Messages
  messages: (userId: ID) => ['messages', userId] as const,
  
  // Notifications
  notifications: () => ['notifications'] as const,
  
  // Search
  searchUsers: (query: string) => ['search', 'users', query] as const,
  explorePosts: () => ['search', 'explore'] as const,
};

// Users hooks
export const useUser = (userId: ID) => {
  return useQuery({
    queryKey: queryKeys.user(userId),
    queryFn: () => usersApi.getProfile(userId),
    enabled: !!userId,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

// Comments hooks
export const useComments = (postId: ID) => {
  return useQuery({
    queryKey: queryKeys.comments(postId),
    queryFn: () => commentsApi.getComments(postId),
    enabled: !!postId,
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, content }: { postId: ID; content: string }) =>
      commentsApi.addComment(postId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments(variables.postId) });
    },
  });
};

// Follow hooks
export const useFollowers = (userId: ID) => {
  return useQuery({
    queryKey: queryKeys.followers(userId),
    queryFn: () => followApi.getFollowers(userId),
    enabled: !!userId,
  });
};

export const useFollowing = (userId: ID) => {
  return useQuery({
    queryKey: queryKeys.following(userId),
    queryFn: () => followApi.getFollowing(userId),
    enabled: !!userId,
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: followApi.followUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      queryClient.invalidateQueries({ queryKey: ['following'] });
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: followApi.unfollowUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      queryClient.invalidateQueries({ queryKey: ['following'] });
    },
  });
};

// Likes hooks
export const useLikes = (postId: ID) => {
  return useQuery({
    queryKey: queryKeys.likes(postId),
    queryFn: () => likesApi.getLikes(postId),
    enabled: !!postId,
  });
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: likesApi.toggleLike,
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.likes(postId) });
    },
  });
};

// Messages hooks
export const useMessages = (userId: ID) => {
  return useQuery({
    queryKey: queryKeys.messages(userId),
    queryFn: () => messagesApi.getMessages(userId),
    enabled: !!userId,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ recipientId, content }: { recipientId: ID; content: string }) =>
      messagesApi.sendMessage(recipientId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages(variables.recipientId) });
    },
  });
};

// Notifications hooks
export const useNotifications = () => {
  return useQuery({
    queryKey: queryKeys.notifications(),
    queryFn: notificationsApi.getNotifications,
  });
};

export const useMarkNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications() });
    },
  });
};

// Search hooks
export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: queryKeys.searchUsers(query),
    queryFn: () => searchApi.searchUsers(query),
    enabled: query.length > 0,
  });
};

export const useExplorePosts = () => {
  return useQuery({
    queryKey: queryKeys.explorePosts(),
    queryFn: searchApi.getExplorePosts,
  });
};