import { useRef, useEffect, useState } from 'react';
import { useExploreFeed, type Post } from '@shared/api/posts';
import { PostGrid } from '@shared/components';
import useAuth from '@app/providers/useAuth';
import { usePostDetail } from '@app/providers/usePostDetail';
import styles from './Explore.module.css';

export default function Explore() {
  const { user } = useAuth();
  const { 
    data, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useExploreFeed();
  const { openPostDetail } = usePostDetail();
  const observerTarget = useRef<HTMLDivElement>(null);
  const [shuffledPosts, setShuffledPosts] = useState<Post[]>([]);

  // Filter out current user's posts and shuffle only new posts
  useEffect(() => {
    if (!data) return;

    // Flatten all pages into single array
    const allPosts = data.pages.flatMap(page => page.posts);
    
    if (!allPosts.length) {
      setShuffledPosts([]);
      return;
    }

    // Filter out current user's posts
    const filteredPosts = user
      ? allPosts.filter((post: Post) => post.author?._id !== user.id)
      : allPosts;

    setShuffledPosts(prev => {
      // Create a map of current posts by ID for quick lookup
      const postsMap = new Map(filteredPosts.map(post => [post._id, post]));
      
      // Update existing posts with fresh data and filter out deleted ones
      const updatedExisting = prev
        .filter(post => postsMap.has(post._id))
        .map(post => postsMap.get(post._id)!);
      
      // Get IDs of posts we already have
      const existingIds = new Set(prev.map(p => p._id));
      
      // Find new posts that aren't in our shuffled array yet
      const newPosts = filteredPosts.filter(post => !existingIds.has(post._id));
      
      if (newPosts.length > 0) {
        // Shuffle only new posts
        const shuffledNewPosts = [...newPosts].sort(() => Math.random() - 0.5);
        // Append to existing shuffled posts
        return [...updatedExisting, ...shuffledNewPosts];
      }
      
      // If no new posts, just return updated existing posts
      return updatedExisting;
    });
  }, [data, user]);

  // Infinite scroll with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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
          posts={shuffledPosts} 
          isLoading={isLoading}
          onPostClick={openPostDetail}
        />
        
        {/* Intersection observer target */}
        {hasNextPage && (
          <div ref={observerTarget} className={styles.loadMoreTrigger}>
            {isFetchingNextPage && (
              <div className={styles.loadingMore}>Loading more posts...</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
