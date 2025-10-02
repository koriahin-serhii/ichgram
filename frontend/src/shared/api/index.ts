// Экспортируем все API модули
export * as AuthAPI from './auth';
export * as PostsAPI from './posts';
export * as UsersAPI from './users';
export * as SearchAPI from './search';
export * as CommentsAPI from './comments';
export * as LikesAPI from './likes';
export * as FollowAPI from './follow';
export * as MessagesAPI from './messages';
export * as NotificationsAPI from './notifications';

// Экспортируем основные типы
export type { ID } from './types';
export type { User, UserProfile, UserStats } from './users';
export type { Comment } from './comments';
export type { Like } from './likes';
export type { Follow } from './follow';
export type { Message } from './messages';
export type { Notification } from './notifications';

// Экспортируем клиент
export { default as apiClient } from './client';

// Экспортируем все хуки для удобства (можно импортировать как из index, так и из конкретных файлов)
export {
  // Posts hooks
  useFeed,
  usePost,
  useCreatePost,
  useDeletePost,
  useUserPosts,
  useUpdatePost,
  postKeys,
} from './posts';

export {
  // Users hooks
  useUserProfile,
  useMyProfile,
  useUpdateProfile,
  userKeys,
} from './users';

export {
  // Search hooks
  useSearchUsers,
  useExplorePosts,
  searchKeys,
} from './search';

export {
  // Comments hooks
  useComments,
  useAddComment,
  commentKeys,
} from './comments';

export {
  // Likes hooks
  useLikes,
  useToggleLike,
  likeKeys,
} from './likes';

export {
  // Follow hooks
  useFollowers,
  useFollowing,
  useFollowUser,
  useUnfollowUser,
  useIsFollowing,
  followKeys,
} from './follow';

export {
  // Messages hooks
  useMessages,
  useSendMessage,
  messageKeys,
} from './messages';

export {
  // Notifications hooks
  useNotifications,
  useMarkNotificationsAsRead,
  notificationKeys,
} from './notifications';
