import type { Post } from '@shared/api/posts';
import PostCard from '../PostCard/PostCard';
import allUpdateIcon from '@shared/assets/images/all-update.png';
import styles from './FeedList.module.css';

interface FeedListProps {
  posts: Post[];
  isLoading?: boolean;
  error?: Error | null;
}

export default function FeedList({ posts, isLoading, error }: FeedListProps) {
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          Error loading posts: {error.message}
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <h2>No posts</h2>
          <p>Follow users to see their posts in your feed</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.feed}>
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
      <div className={styles.endMessage}>
        <img src={allUpdateIcon} alt="All updates" className={styles.endIcon} />
        <p>You've seen all the updates</p>
        <span>You have viewed all new publications</span>
      </div>
    </div>
  );
}
