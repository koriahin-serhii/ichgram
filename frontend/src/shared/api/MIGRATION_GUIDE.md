# 🔄 Миграция API хуков - Руководство

## 📋 Что изменилось?

**Раньше:** Все React Query хуки были централизованы в `hooks.ts`

**Теперь:** Каждый API файл содержит свои собственные хуки

## ✅ Преимущества новой структуры

1. **Модульность** - каждый файл самодостаточен
2. **Масштабируемость** - легко добавлять новые AIP
3. **Читаемость** - API функции и хуки находятся рядом
4. **Меньший размер бандла** - лучше tree-shaking
5. **Типобезопасность** - типы и хуки в одном файле

---

## 📁 Новая структура API файлов

### Каждый API файл теперь содержит:

```typescript
// 1. Imports
import client from './client';
import type { ID } from './types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// 2. Types
export interface SomeType {
  // ...
}

// 3. Query Keys
export const someKeys = {
  all: ['some'] as const,
  detail: (id: ID) => [...someKeys.all, id] as const,
};

// 4. API Functions
export const someApi = {
  getSomething: async () => { /* ... */ },
  createSomething: async () => { /* ... */ },
};

// 5. React Query Hooks
export function useSomething() {
  return useQuery({
    queryKey: someKeys.all,
    queryFn: someApi.getSomething,
  });
}
```

---

## 🗂️ Распределение хуков по файлам

### 📝 **comments.ts**
- ✅ `useComments(postId)` - получить комментарии к посту
- ✅ `useAddComment()` - добавить комментарий
- ✅ `commentKeys` - query keys для комментариев

```typescript
// Новый импорт
import { useComments, useAddComment } from '@api/comments';
// или
import { useComments, useAddComment } from '@api';
```

### ❤️ **likes.ts**
- ✅ `useLikes(postId)` - получить лайки поста
- ✅ `useToggleLike()` - поставить/убрать лайк
- ✅ `likeKeys` - query keys для лайков

```typescript
// Новый импорт
import { useLikes, useToggleLike } from '@api/likes';
// или
import { useLikes, useToggleLike } from '@api';
```

### 👥 **follow.ts**
- ✅ `useFollowers(userId)` - получить подписчиков пользователя
- ✅ `useFollowing(userId)` - получить подписки пользователя
- ✅ `useIsFollowing(userId)` - проверить, подписан ли текущий пользователь
- ✅ `useFollowUser()` - подписаться на пользователя
- ✅ `useUnfollowUser()` - отписаться от пользователя
- ✅ `followKeys` - query keys для подписок

```typescript
// Новый импорт
import { 
  useFollowers, 
  useFollowing, 
  useFollowUser, 
  useUnfollowUser,
  useIsFollowing 
} from '@api/follow';
// или
import { useFollowers, useFollowing } from '@api';
```

### 💬 **messages.ts**
- ✅ `useMessages(userId)` - получить историю сообщений с пользователем
- ✅ `useSendMessage()` - отправить сообщение
- ✅ `messageKeys` - query keys для сообщений

```typescript
// Новый импорт
import { useMessages, useSendMessage } from '@api/messages';
// или
import { useMessages, useSendMessage } from '@api';
```

### 🔔 **notifications.ts**
- ✅ `useNotifications()` - получить все уведомления
- ✅ `useMarkNotificationsAsRead()` - пометить все как прочитанные
- ✅ `notificationKeys` - query keys для уведомлений

```typescript
// Новый импорт
import { useNotifications, useMarkNotificationsAsRead } from '@api/notifications';
// или
import { useNotifications } from '@api';
```

### 🔍 **search.ts**
- ✅ `useSearchUsers(query)` - поиск пользователей
- ✅ `useExplorePosts()` - получить посты для страницы Explore
- ✅ `searchKeys` - query keys для поиска

```typescript
// Новый импорт
import { useSearchUsers, useExplorePosts } from '@api/search';
// или
import { useSearchUsers } from '@api';
```

### 👤 **users.ts** (уже было)
- ✅ `useUserProfile(userId)` - получить профиль пользователя
- ✅ `useMyProfile()` - получить свой профиль
- ✅ `useUpdateProfile()` - обновить профиль
- ✅ `userKeys` - query keys для пользователей

```typescript
// Импорт остался прежним
import { useUserProfile, useMyProfile } from '@api/users';
// или
import { useUserProfile } from '@api';
```

### 📸 **posts.ts** (уже было)
- ✅ `useFeed()` - получить ленту постов
- ✅ `usePost(id)` - получить один пост
- ✅ `useCreatePost()` - создать пост
- ✅ `useDeletePost()` - удалить пост
- ✅ `useUserPosts(userId)` - получить посты пользователя
- ✅ `useUpdatePost()` - обновить пост
- ✅ `postKeys` - query keys для постов

```typescript
// Импорт остался прежним
import { useFeed, usePost, useCreatePost } from '@api/posts';
// или
import { useFeed } from '@api';
```

---

## 🔄 Как мигрировать существующий код

### Вариант 1: Импорт из index.ts (рекомендуется)

```typescript
// ❌ Старый способ
import { useComments, useLikes } from '@api/hooks';

// ✅ Новый способ
import { useComments, useLikes } from '@api';
```

**Преимущество:** Код не нужно менять, просто убираем `/hooks`

### Вариант 2: Импорт из конкретных файлов

```typescript
// ✅ Новый способ (более явный)
import { useComments } from '@api/comments';
import { useLikes } from '@api/likes';
import { useFollowUser } from '@api/follow';
```

**Преимущество:** Явно видно, откуда идет импорт, лучше для больших файлов

### Вариант 3: Использование старого hooks.ts (временно)

```typescript
// ⚠️ Работает, но deprecated
import { useComments, useLikes } from '@api/hooks';
```

**Статус:** `hooks.ts` теперь просто re-export всех хуков для обратной совместимости

---

## 📊 Примеры использования

### Пример 1: Комментарии к посту

```typescript
import { useComments, useAddComment } from '@api/comments';

function PostComments({ postId }: { postId: string }) {
  const { data: comments, isLoading } = useComments(postId);
  const addComment = useAddComment();
  
  const handleSubmit = (content: string) => {
    addComment.mutate({ postId, content });
  };
  
  // ...
}
```

### Пример 2: Подписка на пользователя

```typescript
import { useIsFollowing, useFollowUser, useUnfollowUser } from '@api/follow';

function FollowButton({ userId }: { userId: string }) {
  const { data: isFollowing } = useIsFollowing(userId);
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();
  
  const handleToggle = () => {
    if (isFollowing) {
      unfollowUser.mutate(userId);
    } else {
      followUser.mutate(userId);
    }
  };
  
  return (
    <button onClick={handleToggle}>
      {isFollowing ? 'Отписаться' : 'Подписаться'}
    </button>
  );
}
```

### Пример 3: Лайки с оптимистичным обновлением

```typescript
import { useLikes, useToggleLike } from '@api/likes';

function LikeButton({ postId }: { postId: string }) {
  const { data: likes } = useLikes(postId);
  const toggleLike = useToggleLike();
  
  const handleLike = () => {
    toggleLike.mutate(postId);
  };
  
  return (
    <button onClick={handleLike}>
      ❤️ {likes?.length || 0}
    </button>
  );
}
```

---

## 🎯 Query Keys - важные изменения

### Старые query keys (в hooks.ts)

```typescript
// ❌ Старые keys
const queryKeys = {
  comments: (postId: ID) => ['comments', postId],
  likes: (postId: ID) => ['likes', postId],
  followers: (userId: ID) => ['followers', userId],
  // ...
};
```

### Новые query keys (в каждом файле)

```typescript
// ✅ Новые keys в comments.ts
export const commentKeys = {
  all: ['comments'] as const,
  byPost: (postId: ID) => [...commentKeys.all, postId] as const,
};

// ✅ Новые keys в likes.ts
export const likeKeys = {
  all: ['likes'] as const,
  byPost: (postId: ID) => [...likeKeys.all, postId] as const,
};

// ✅ Новые keys в follow.ts
export const followKeys = {
  all: ['follows'] as const,
  followers: (userId: ID) => [...followKeys.all, 'followers', userId] as const,
  following: (userId: ID) => [...followKeys.all, 'following', userId] as const,
  isFollowing: (userId: ID) => [...followKeys.all, 'isFollowing', userId] as const,
};
```

**Преимущества:**
- Более структурированные ключи
- Лучше для инвалидации кеша
- Иерархическая организация

---

## 🚀 Что дальше?

### Можно удалить после миграции:

1. ✅ Файл `hooks.ts` - когда весь код перейдет на новые импорты (сейчас оставлен для обратной совместимости)

### Рекомендации:

1. **Постепенная миграция** - можно мигрировать по одному компоненту
2. **Используйте новые импорты** - импорт из `@api` или конкретных файлов
3. **Обновите документацию** - если есть документация проекта
4. **Используйте новые query keys** - для лучшей организации кеша

---

## 📈 Статистика

| Категория | До рефакторинга | После рефакторинга |
|-----------|----------------|-------------------|
| Файлов с хуками | 4 (posts, users, search, hooks) | 8 (все API файлы) |
| Строк в hooks.ts | ~186 | ~40 (re-exports) |
| Модульность | ❌ Централизованный | ✅ Распределенный |
| Tree-shaking | ⚠️ Хуже | ✅ Лучше |
| Читаемость | ⚠️ Средняя | ✅ Отличная |

---

## ✅ Чеклист миграции

- [x] Добавлены хуки в `comments.ts`
- [x] Добавлены хуки в `likes.ts`
- [x] Добавлены хуки в `follow.ts` (+ `useIsFollowing`)
- [x] Добавлены хуки в `messages.ts`
- [x] Добавлены хуки в `notifications.ts`
- [x] `hooks.ts` переделан в re-export файл
- [x] `index.ts` обновлен для экспорта всех хуков
- [x] Добавлены query keys в каждый файл
- [x] Все хуки используют `useQueryClient()` правильно

---

**Вывод:** Архитектура API теперь более модульная, масштабируемая и удобная в поддержке! 🎉
