import { useFeed } from '@shared/api/posts';
import { PostGrid } from '@shared/components';
import styles from './Explore.module.css';

export default function Explore() {
  const { data: posts = [], isLoading, error } = useFeed();

  // Mix the posts to show a varied selection
  const shuffledPosts =
    posts.length > 0 ? [...posts].sort(() => Math.random() - 0.5) : [];

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
        <PostGrid posts={shuffledPosts} isLoading={isLoading} />
      </div>
    </div>
  );
}
