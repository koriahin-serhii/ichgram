import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Post } from '@shared/api/posts';
import { useToggleLike, useLikes } from '@shared/api/likes';
import { useComments } from '@shared/api/comments';
import { useIsFollowing, useFollowUser } from '@shared/api/follow';
import useAuth from '@app/providers/useAuth';
import styles from './PostCard.module.css';

interface PostCardProps {
  post: Post;
  onPostClick?: (postId: string) => void;
}

// Simple time ago formatter
function timeAgo(date: string): string {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  );

  const intervals: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [name, secondsInInterval] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInInterval);
    if (interval >= 1) {
      return `${interval} ${name}${interval > 1 ? 's' : ''}`;
    }
  }

  return 'just now';
}

export default function PostCard({ post, onPostClick }: PostCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFirstCommentExpanded, setIsFirstCommentExpanded] = useState(false);

  const toggleLike = useToggleLike();
  const { data: comments = [] } = useComments(post._id);
  const { data: likesData } = useLikes(post._id);
  const { data: isFollowing = false } = useIsFollowing(post.author?._id || '');
  const followUser = useFollowUser();

  const isOwnPost = user?.id === post.author?._id;

  // Check if current user has liked this post
  const liked =
    likesData?.likes?.some(
      (like: { user: string }) => like.user === user?.id
    ) || false;
  const likesCount = likesData?.count || 0;

  const handleLike = () => {
    toggleLike.mutate(post._id);
  };

  const handleFollow = () => {
    if (!post.author?._id) return;
    followUser.mutate(post.author._id);
  };

  const handleCommentClick = () => {
    // This is only called for other users' posts, so navigate to messages
    handleSendMessage();
  };

  const handleSendMessage = () => {
    if (!post.author?._id) return;
    navigate('/messages', {
      state: {
        userId: post.author._id,
        userName: post.author.name,
        userImage: post.author.profileImage,
      },
    });
  };

  const handleImageClick = () => {
    onPostClick?.(post._id);
  };

  const handleAuthorClick = () => {
    if (isOwnPost) {
      navigate('/my-profile');
    } else {
      navigate(`/profile/${post.author?._id}`);
    }
  };

  const postTimeAgo = post.createdAt ? timeAgo(post.createdAt) : '';

  return (
    <article className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div
          className={styles.avatar}
          onClick={handleAuthorClick}
        >
          <div className={styles.avatarInner}>
            {post.author?.profileImage ? (
              <img src={post.author.profileImage} alt={post.author.name} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {post.author?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
        </div>
        <div className={styles.headerInfo}>
          <span
            className={styles.authorName}
            onClick={handleAuthorClick}
          >
            {post.author?.name || 'Unknown'}
          </span>
          {postTimeAgo && (
            <>
              <span className={styles.dot}>•</span>
              <span className={styles.timeAgo}>{postTimeAgo}</span>
            </>
          )}
          {!isOwnPost && !isFollowing && post.author?._id && (
            <>
              <span className={styles.dot}>•</span>
              <button
                className={styles.followBtn}
                onClick={handleFollow}
                disabled={followUser.isPending}
              >
                Follow
              </button>
            </>
          )}
        </div>
      </div>

      {/* Image */}
      <div className={styles.imageContainer} onClick={handleImageClick}>
        <img
          src={post.imageUrl}
          alt={post.description || 'Post image'}
          className={styles.image}
        />
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <div className={styles.actionsLeft}>
          <button
            className={`${styles.actionBtn} ${liked ? styles.liked : ''}`}
            onClick={handleLike}
            aria-label="Like"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={liked ? '#ed4956' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          {!isOwnPost && (
            <button
              className={styles.actionBtn}
              onClick={handleCommentClick}
              aria-label="Send message"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ transform: 'scaleX(-1)' }}
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Likes */}
      {likesCount > 0 && (
        <div className={styles.likes}>
          <strong>
            {likesCount} {likesCount === 1 ? 'like' : 'likes'}
          </strong>
        </div>
      )}

      {/* Description as first "comment" from author */}
      {post.description && (
        <div className={styles.description}>
          <span className={styles.authorName}>{post.author?.name}</span>{' '}
          <span className={styles.descriptionText}>{post.description}</span>
        </div>
      )}

      {/* Comments */}
      {comments.length > 0 && (
        <div className={styles.comments}>
          {/* First comment - truncated with "...more" */}
          {comments[0] && (
            <div className={styles.comment}>
              <span className={styles.commentAuthor}>
                {comments[0].user.name}
              </span>{' '}
              {isFirstCommentExpanded ? (
                <span className={styles.commentText}>
                  {comments[0].content}{' '}
                  {comments[0].content.length > 2 && (
                    <button
                      className={styles.moreBtn}
                      onClick={() => setIsFirstCommentExpanded(false)}
                    >
                      less
                    </button>
                  )}
                </span>
              ) : (
                <span className={styles.truncatedComment}>
                  {comments[0].content.slice(0, 2)}
                  {comments[0].content.length > 2 && '... '}
                  {comments[0].content.length > 2 && (
                    <button
                      className={styles.moreBtn}
                      onClick={() => setIsFirstCommentExpanded(true)}
                    >
                      more
                    </button>
                  )}
                </span>
              )}
            </div>
          )}

          {/* View all comments */}
          {comments.length > 0 && (
            <button
              className={styles.viewAllComments}
              onClick={handleCommentClick}
            >
              View all comments ({comments.length})
            </button>
          )}
        </div>
      )}
    </article>
  );
}
