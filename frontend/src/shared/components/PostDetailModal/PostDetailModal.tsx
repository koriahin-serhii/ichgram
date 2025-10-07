import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePost, useDeletePost } from '@shared/api/posts';
import { useComments, useAddComment } from '@shared/api/comments';
import { useToggleLike, useLikes } from '@shared/api/likes';
import {
  useIsFollowing,
  useFollowUser,
  useUnfollowUser,
} from '@shared/api/follow';
import useAuth from '@app/providers/useAuth';
import MoreIcon from '@assets/icons/more.svg?react';
import CommentIcon from '@assets/icons/comment.svg?react';
import styles from './PostDetailModal.module.css';

const EMOJI_LIST = [
  '😀',
  '😂',
  '🥰',
  '😍',
  '🤩',
  '😎',
  '🥳',
  '😇',
  '🙏',
  '👍',
  '❤️',
  '🔥',
  '✨',
  '🎉',
  '💯',
  '🌟',
  '💪',
  '👏',
  '🙌',
  '🎊',
];

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

interface PostDetailModalProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function PostDetailModal({
  postId,
  isOpen,
  onClose,
}: PostDetailModalProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const {
    data: post,
    isLoading: postLoading,
    error: postError,
  } = usePost(postId);
  const { data: comments = [], isLoading: commentsLoading } =
    useComments(postId);
  const { data: likesData } = useLikes(postId);
  const { data: isFollowing = false } = useIsFollowing(post?.author?._id || '');

  const toggleLike = useToggleLike();
  const addComment = useAddComment();
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();
  const deletePost = useDeletePost();

  const isOwnPost = user?.id === post?.author?._id;

  // Check if current user has liked this post
  const liked =
    likesData?.likes?.some(
      (like: { user: string }) => like.user === user?.id
    ) || false;
  const likesCount = likesData?.count || 0;

  const handleLike = () => {
    toggleLike.mutate(postId);
  };

  const handleEmojiClick = (emoji: string) => {
    setComment((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFollow = () => {
    if (!post?.author?._id) return;
    followUser.mutate(post.author._id);
  };

  const handleUnfollow = () => {
    if (!post?.author?._id) return;
    unfollowUser.mutate(post.author._id);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postId || !comment.trim()) return;

    addComment.mutate(
      { postId, content: comment },
      {
        onSuccess: () => {
          setComment('');
          setShowEmojiPicker(false);
        },
      }
    );
  };

  const handleDelete = () => {
    deletePost.mutate(postId, {
      onSuccess: () => {
        onClose();
        navigate('/my-profile');
      },
    });
  };

  const handleEdit = () => {
    onClose();
    navigate(`/post/${postId}/edit`);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/my-profile`;
    navigator.clipboard.writeText(url);
    setShowOptionsModal(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Close the modal only if clicked on the overlay, not on its content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  if (postLoading) {
    return (
      <>
        <div className={styles.overlay} onClick={onClose} />
        <div className={styles.container} onClick={handleOverlayClick}>
          <div className={styles.loading}>Loading post...</div>
        </div>
      </>
    );
  }

  if (postError || !post) {
    return (
      <>
        <div className={styles.overlay} onClick={onClose} />
        <div className={styles.container} onClick={handleOverlayClick}>
          <div className={styles.error}>Post not found</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.container} onClick={handleOverlayClick}>
        <div className={styles.modal}>
          <div className={styles.imageSection}>
            <img
              src={post.imageUrl}
              alt={post.description || 'Post'}
              className={styles.image}
            />
          </div>

          <div className={styles.contentSection}>
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.userInfo}>
                <div
                  className={styles.avatar}
                  onClick={() => navigate(`/profile/${post.author?._id}`)}
                >
                  <div className={styles.avatarInner}>
                    {post.author?.profileImage ? (
                      <img
                        src={post.author.profileImage}
                        alt={post.author.name}
                      />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        {post.author?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.userDetails}>
                  <span
                    className={styles.username}
                    onClick={() => navigate(`/profile/${post.author?._id}`)}
                  >
                    {post.author?.name || 'Unknown'}
                  </span>
                  {!isOwnPost && (
                    <>
                      <span className={styles.dot}>•</span>
                      <button
                        className={styles.followBtn}
                        onClick={isFollowing ? handleUnfollow : handleFollow}
                        disabled={
                          followUser.isPending || unfollowUser.isPending
                        }
                      >
                        {isFollowing ? 'Unfollow' : 'Follow'}
                      </button>
                    </>
                  )}
                </div>
              </div>
              {isOwnPost && (
                <button
                  className={styles.moreBtn}
                  onClick={() => setShowOptionsModal(true)}
                >
                  <MoreIcon />
                </button>
              )}
            </div>

            {/* Comments section */}
            <div className={styles.commentsSection}>
              {/* Post description as first comment */}
              {post.description && (
                <div className={styles.comment}>
                  <div
                    className={styles.commentAvatar}
                    onClick={() => navigate(`/profile/${post.author?._id}`)}
                  >
                    <div className={styles.avatarInner}>
                      {post.author?.profileImage ? (
                        <img
                          src={post.author.profileImage}
                          alt={post.author.name}
                        />
                      ) : (
                        <div className={styles.avatarPlaceholder}>
                          {post.author?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={styles.commentContent}>
                    <div className={styles.commentText}>
                      <span
                        className={styles.commentUsername}
                        onClick={() => navigate(`/profile/${post.author?._id}`)}
                      >
                        {post.author?.name}
                      </span>{' '}
                      {post.description}
                    </div>
                    {post.createdAt && (
                      <div className={styles.commentTime}>
                        {timeAgo(post.createdAt)}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Comments list */}
              {commentsLoading ? (
                <div className={styles.commentsLoading}>
                  Loading comments...
                </div>
              ) : comments.length > 0 ? (
                comments.map((c) => (
                  <div key={c._id} className={styles.comment}>
                    <div
                      className={styles.commentAvatar}
                      onClick={() => navigate(`/profile/${c.user._id}`)}
                    >
                      <div className={styles.avatarInner}>
                        {c.user.profileImage ? (
                          <img src={c.user.profileImage} alt={c.user.name} />
                        ) : (
                          <div className={styles.avatarPlaceholder}>
                            {c.user.name[0]?.toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={styles.commentContent}>
                      <div className={styles.commentText}>
                        <span
                          className={styles.commentUsername}
                          onClick={() => navigate(`/profile/${c.user._id}`)}
                        >
                          {c.user.name}
                        </span>{' '}
                        {c.content}
                      </div>
                      <div className={styles.commentTime}>
                        {timeAgo(c.createdAt)}
                      </div>
                    </div>
                  </div>
                ))
              ) : null}
            </div>

            {/* Actions */}
            <div className={styles.actions}>
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
              <button
                className={styles.actionBtn}
                onClick={() =>
                  document
                    .querySelector<HTMLInputElement>(`.${styles.commentInput}`)
                    ?.focus()
                }
              >
                <CommentIcon />
              </button>
            </div>

            {/* Likes count */}
            {likesCount > 0 && (
              <div className={styles.likes}>
                {likesCount} {likesCount === 1 ? 'like' : 'likes'}
              </div>
            )}

            {/* Time */}
            {post.createdAt && (
              <div className={styles.time}>{timeAgo(post.createdAt)}</div>
            )}

            {/* Add comment form */}
            <form className={styles.addCommentForm} onSubmit={handleAddComment}>
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={styles.emojiBtn}
                aria-label="Add emoji"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c.83 0 1.5-.67 1.5-1.5S7.83 8 7 8s-1.5.67-1.5 1.5S6.17 11 7 11zm10 0c.83 0 1.5-.67 1.5-1.5S17.83 8 17 8s-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-5 6c2.21 0 4-1.79 4-4h-8c0 2.21 1.79 4 4 4z" />
                </svg>
              </button>
              <input
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onFocus={() => setShowEmojiPicker(false)}
                className={styles.commentInput}
              />
              <button
                type="submit"
                className={styles.postBtn}
                disabled={!comment.trim() || addComment.isPending}
              >
                Send
              </button>

              {/* Emoji picker */}
              {showEmojiPicker && (
                <div className={styles.emojiPicker}>
                  {EMOJI_LIST.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleEmojiClick(emoji)}
                      className={styles.emojiItem}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Options Modal */}
      {showOptionsModal && (
        <>
          <div
            className={styles.optionsOverlay}
            onClick={() => setShowOptionsModal(false)}
          />
          <div className={styles.optionsModal}>
            {isOwnPost && (
              <>
                <button
                  className={`${styles.optionBtn} ${styles.deleteBtn}`}
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <button className={styles.optionBtn} onClick={handleEdit}>
                  Edit
                </button>
                <button
                  className={styles.optionBtn}
                  onClick={() => setShowOptionsModal(false)}
                >
                  Go to post
                </button>
                <button className={styles.optionBtn} onClick={handleCopyLink}>
                  Copy link
                </button>
                <button
                  className={styles.optionBtnCancel}
                  onClick={() => setShowOptionsModal(false)}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
