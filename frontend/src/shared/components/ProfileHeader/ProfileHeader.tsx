import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { usersApi } from '../../api/users';
import useAuth from '../../../app/providers/useAuth';
import styles from './ProfileHeader.module.css';
import type { UserProfile } from '../../api/users';

interface ProfileHeaderProps {
  user: UserProfile;
  isOwnProfile?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
  isFollowLoading?: boolean;
}

export default function ProfileHeader({
  user,
  isOwnProfile = false,
  onFollow,
  onUnfollow,
  isFollowLoading = false,
}: ProfileHeaderProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  const deleteProfileMutation = useMutation({
    mutationFn: usersApi.deleteProfile,
    onSuccess: () => {
      // Logout and redirect to signup
      logout();
      navigate('/signup', { replace: true });
    },
    onError: (error) => {
      console.error('Failed to delete profile:', error);
      alert('Failed to delete profile. Please try again.');
    },
  });

  const handleDeleteProfile = () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone. All your posts, comments, and messages will be permanently deleted.')) {
      deleteProfileMutation.mutate();
    }
  };

  const handleFollowClick = () => {
    if (user.isFollowing) {
      onUnfollow?.();
    } else {
      onFollow?.();
    }
  };

  const handleMessageClick = () => {
    // Navigate to messages page with this user selected
    // We'll store the userId in URL state
    navigate('/messages', {
      state: {
        userId: user._id,
        userName: user.name,
        userImage: user.profileImage,
      },
    });
  };

  return (
    <div className={styles.header}>
      <div className={styles.avatarWrapper}>
        <div className={styles.avatarContainer}>
          {user.profileImage ? (
            <img src={user.profileImage} alt={user.fullName} className={styles.avatarImage} />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </div>
      </div>

      <div className={styles.info}>
        <div className={styles.topRow}>
          <h1 className={styles.username}>{user.name}</h1>

          <div className={styles.actions}>
            {isOwnProfile ? (
              <>
                <button
                  className={styles.editButton}
                  onClick={() => navigate('/edit-profile')}
                >
                  Edit profile
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={handleDeleteProfile}
                  disabled={deleteProfileMutation.isPending}
                >
                  {deleteProfileMutation.isPending ? 'Deleting...' : 'Delete profile'}
                </button>
              </>
            ) : (
              <>
                <button
                  className={`${styles.followButton} ${
                    user.isFollowing ? styles.following : styles.follow
                  }`}
                  onClick={handleFollowClick}
                  disabled={isFollowLoading}
                >
                  {user.isFollowing ? 'Unfollow' : 'Follow'}
                </button>
                <button
                  className={styles.messageButton}
                  onClick={handleMessageClick}
                >
                  Message
                </button>
              </>
            )}
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.count}>{user.stats.postsCount}</span>
            <span className={styles.label}>posts</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.count}>{user.stats.followersCount}</span>
            <span className={styles.label}>followers</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.count}>{user.stats.followingCount}</span>
            <span className={styles.label}>following</span>
          </div>
        </div>

        <div className={styles.details}>
          {user.bio && (
            <div className={styles.bioContainer}>
              <span className={isBioExpanded ? styles.bioExpanded : styles.bioCollapsed}>
                {user.bio}
                {!isBioExpanded && user.bio.length > 100 && '... '}
              </span>
              {user.bio.length > 100 && (
                <button 
                  className={styles.moreBtn}
                  onClick={() => setIsBioExpanded(!isBioExpanded)}
                >
                  {isBioExpanded ? 'less' : 'more'}
                </button>
              )}
            </div>
          )}
          {user.website && (
            <a 
              href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.website}
            >
              {user.website}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
