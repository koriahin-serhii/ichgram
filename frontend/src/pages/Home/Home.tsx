import { useMemo } from 'react';
import { useFeed } from '@shared/api/posts';
import FeedList from '@components/FeedList/FeedList';
import useAuth from '@app/providers/useAuth';
import type { Post } from '@shared/api/posts';
import styles from './Home.module.css';

export default function Home() {
  const { user } = useAuth();
  const { data: posts, isLoading, error } = useFeed();

  // Get posts excluding own posts
  const feedPosts = useMemo(() => {
    if (!posts || !Array.isArray(posts)) return [];
    return posts.filter(
      (post: Post) => post.author?._id !== user?.id
    );
  }, [posts, user]);

  return (
    <div className={styles.wrapper}>
      <FeedList posts={feedPosts} isLoading={isLoading} error={error} />
    </div>
  );
}
