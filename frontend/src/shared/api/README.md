# API Documentation

Modules for interacting with the backend API of the social media application. This includes authentication, posts, users, comments, follows, likes, messages, notifications, and search functionalities.

## 📁 Structure

### Core Files
- `client.ts` - Axios HTTP client with interceptors
- `types.ts` - Common TypeScript types (ID, etc.)
- `index.ts` - Re-exports all APIs and hooks

### API Modules (each contains API functions + React Query hooks)
- `auth.ts` - Authentication (login, register, logout)
- `posts.ts` - Posts CRUD + hooks (`useFeed`, `usePost`, `useCreatePost`, etc.)
- `users.ts` - User profiles + hooks (`useUserProfile`, `useMyProfile`, `useUpdateProfile`)
- `comments.ts` - Comments + hooks (`useComments`, `useAddComment`)
- `likes.ts` - Likes + hooks (`useLikes`, `useToggleLike`)
- `follow.ts` - Follows + hooks (`useFollowers`, `useFollowing`, `useFollowUser`, `useUnfollowUser`, `useIsFollowing`)
- `messages.ts` - Messages + hooks (`useMessages`, `useSendMessage`)
- `notifications.ts` - Notifications + hooks (`useNotifications`, `useMarkNotificationsAsRead`)
- `search.ts` - Search + hooks (`useSearchUsers`, `useExplorePosts`)

### Legacy
- `hooks.ts` - **DEPRECATED** - Re-exports hooks from individual files for backward compatibility

## 🎯 Usage

### Option 1: Import from index (recommended)
```typescript
import { useFeed, usePost, useCreatePost } from '@api';
import { useComments, useAddComment } from '@api';
import { useFollowUser, useIsFollowing } from '@api';
```

### Option 2: Import from specific files
```typescript
import { useFeed, usePost } from '@api/posts';
import { useComments, useAddComment } from '@api/comments';
import { useFollowUser, useIsFollowing } from '@api/follow';
```

## 🔑 Backend Endpoints

### Auth (`/api/auth/`)
- `POST /register` - Registration
- `POST /login` - Login
- `POST /logout` - Logout

### Users (`/api/user/`)
- `GET /profile/:id` - Get profile
- `PUT /profile` - Update profile

### Posts (`/api/posts/`)
- `GET /` - Feed
- `GET /user/:userId` - User posts
- `GET /:id` - Post by ID
- `POST /` - Create post
- `PUT /:id` - Update post
- `DELETE /:id` - Delete post

### Comments (`/api/comments/`)
- `POST /comment` - Add comment
- `GET /comments/:postId` - Get comments for post

### Follow (`/api/follow/`)
- `GET /followers/:userId` - Get followers
- `GET /following/:userId` - Get following
- `POST /follow` - Follow user
- `POST /unfollow` - Unfollow user

### Likes (`/api/likes/`)
- `POST /like` - Like/Unlike
- `GET /likes/:postId` - Get likes for post

### Messages (`/api/messages/`)
- `GET /:userId` - Message history
- `POST /send` - Send message

### Notifications (`/api/notifications/`)
- `GET /` - Get all notifications
- `POST /read` - Mark as read

### Search (`/api/search/`)
- `GET /users` - Search users
- `GET /explore` - Explore posts

## Примеры использования

### Простое использование API

```typescript
import { UsersAPI, PostsAPI } from '@shared/api';

// Get user profile
const user = await UsersAPI.usersApi.getProfile('userId');

// Create post
const post = await PostsAPI.createPost(imageFile, 'Description');
```

### Использование React Query хуков

```typescript
import { useUser, useComments, useToggleLike } from '@shared/api';

function ProfilePage({ userId }: { userId: string }) {
  // Automatic caching and updates
  const { data: user, isLoading } = useUser(userId);
  
  if (isLoading) return <div>Loading...</div>;
  
  return <div>{user?.name}</div>;
}

function PostComponent({ postId }: { postId: string }) {
  const { data: comments } = useComments(postId);
  const toggleLike = useToggleLike();
  
  const handleLike = () => {
    toggleLike.mutate(postId);
  };
  
  return (
    <div>
      <button onClick={handleLike}>Like</button>
      {comments?.map(comment => (
        <div key={comment._id}>{comment.content}</div>
      ))}
    </div>
  );
}
```

### Mutation Example

```typescript
import { useAddComment, useFollowUser } from '@shared/api';

function CommentForm({ postId }: { postId: string }) {
  const addComment = useAddComment();
  
  const handleSubmit = (content: string) => {
    addComment.mutate({ postId, content });
  };
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(e.target.content.value);
    }}>
      <input name="content" />
      <button type="submit" disabled={addComment.isPending}>
        {addComment.isPending ? 'Adding...' : 'Add Comment'}
      </button>
    </form>
  );
}
```

## Query Keys

All query keys are centralized in `hooks.ts` for convenient cache invalidation:

```typescript
import { queryKeys } from '@shared/api/hooks';

// Invalidate comments for a post
queryClient.invalidateQueries({ queryKey: queryKeys.comments(postId) });
```
