import { useNavigate } from 'react-router-dom';
import UserAvatar from '../UserAvatar/UserAvatar';
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
      <div className={styles.avatar}>
        <UserAvatar src={user.profileImage} alt={user.fullName} size="large" />
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
          {user.bio && <div className={styles.bio}>{user.bio}</div>}
        </div>
      </div>
    </div>
  );
}
