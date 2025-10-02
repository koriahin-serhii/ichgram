import { useMemo } from 'react';
import { useFeed, type Post } from '@shared/api/posts';
import { PostGrid } from '@shared/components';
import useAuth from '@app/providers/useAuth';
import styles from './Explore.module.css';

export default function Explore() {
  const { user } = useAuth();
  const { data: posts = [], isLoading, error } = useFeed();

  // Filter out current user's posts and shuffle the rest
  const explorePosts = useMemo(() => {
    if (!posts.length) return [];

    // Filter out current user's posts
    const filteredPosts = user
      ? posts.filter((post: Post) => post.author?._id !== user.id)
      : posts;

    // Shuffle posts for variety
    return [...filteredPosts].sort(() => Math.random() - 0.5);
  }, [posts, user]);

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          Failed to load posts. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <PostGrid posts={explorePosts} isLoading={isLoading} />
      </div>
    </div>
  );
}
