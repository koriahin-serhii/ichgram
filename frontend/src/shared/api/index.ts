// Экспортируем все API модули
export * as AuthAPI from './auth';
export * as PostsAPI from './posts';
export * as UsersAPI from './users';

// Экспортируем основные типы
export type { ID } from './types';
export type { User, UserProfile, UserStats } from './users';

// Экспортируем клиент
export { default as apiClient } from './client';
