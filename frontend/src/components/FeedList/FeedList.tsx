import { useEffect, useRef } from 'react';
import type { Post } from '@shared/api/posts';
import PostCard from '../PostCard/PostCard';
import allUpdateIcon from '@shared/assets/images/all-update.png';
import styles from './FeedList.module.css';

interface FeedListProps {
  posts: Post[];
  isLoading?: boolean;
  error?: Error | null;
  onPostClick?: (postId: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isFetchingMore?: boolean;
}

export default function FeedList({ 
  posts, 
  isLoading, 
  error, 
  onPostClick,
  onLoadMore,
  hasMore = false,
  isFetchingMore = false,
}: FeedListProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!onLoadMore || !hasMore || isFetchingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.5 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [onLoadMore, hasMore, isFetchingMore]);

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
          <PostCard key={post._id} post={post} onPostClick={onPostClick} />
        ))}
      </div>

      {/* Loading more indicator */}
      {isFetchingMore && (
        <div className={styles.loadingMore}>
          <div className={styles.spinner}></div>
          <span>Loading more posts...</span>
        </div>
      )}

      {/* Intersection observer target */}
      {hasMore && !isFetchingMore && (
        <div ref={loadMoreRef} className={styles.loadMoreTrigger} />
      )}

      {/* End message */}
      {!hasMore && posts.length > 0 && (
        <div className={styles.endMessage}>
          <img src={allUpdateIcon} alt="All updates" className={styles.endIcon} />
          <p>You've seen all the updates</p>
          <span>You have viewed all new publications</span>
        </div>
      )}
    </div>
  );
}
