import { useMemo } from 'react';
import { useFeed, type Post } from '@shared/api/posts';
import { PostGrid } from '@shared/components';
import useAuth from '@app/providers/useAuth';
import { usePostDetail } from '@app/providers/usePostDetail';
import styles from './Explore.module.css';

export default function Explore() {
  const { user } = useAuth();
  const { data, isLoading, error } = useFeed();
  const { openPostDetail } = usePostDetail();

  // Filter out current user's posts and shuffle the rest
  const explorePosts = useMemo(() => {
    // Flatten all pages into single array
    const allPosts = data?.pages.flatMap(page => page.posts) || [];
    
    if (!allPosts.length) return [];

    // Filter out current user's posts
    const filteredPosts = user
      ? allPosts.filter((post: Post) => post.author?._id !== user.id)
      : allPosts;

    // Shuffle posts for variety
    return [...filteredPosts].sort(() => Math.random() - 0.5);
  }, [data, user]);

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
        <PostGrid 
          posts={explorePosts} 
          isLoading={isLoading}
          onPostClick={openPostDetail}
        />
      </div>
    </div>
  );
}
