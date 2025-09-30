// Экспортируем все API модули
export * as AuthAPI from './auth';
export * as PostsAPI from './posts';
export * as UsersAPI from './users';
export * as CommentsAPI from './comments';
export * as FollowAPI from './follow';
export * as LikesAPI from './likes';
export * as MessagesAPI from './messages';
export * as NotificationsAPI from './notifications';
export * as SearchAPI from './search';

// Экспортируем React Query хуки
export * from './hooks';

// Экспортируем основные типы
export type { ID } from './types';
export type { User } from './users';
export type { Comment } from './comments';
export type { Follow } from './follow';
export type { Like } from './likes';
export type { Message } from './messages';
export type { Notification } from './notifications';
export type { SearchResult } from './search';

// Экспортируем клиент
export { default as apiClient } from './client';
