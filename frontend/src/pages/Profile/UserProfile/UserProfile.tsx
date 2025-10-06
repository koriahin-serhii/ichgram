import { useParams } from 'react-router-dom';
import { useUserProfile } from '@shared/api/users';
import { useUserPosts } from '@shared/api/posts';
import { useIsFollowing, useFollowUser, useUnfollowUser } from '@shared/api/follow';
import { ProfileHeader, PostGrid } from '@shared/components';
import { usePostDetail } from '@app/providers/usePostDetail';
import styles from './UserProfile.module.css';

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const { openPostDetail } = usePostDetail();
  
  const { data: profileData, isLoading: profileLoading, error: profileError } = useUserProfile(id || '');
  const { data: posts = [], isLoading: postsLoading, error: postsError } = useUserPosts(id || '');
  const { data: isFollowing = false } = useIsFollowing(id || '');
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();

  if (profileLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading profile...</div>
      </div>
    );
  }

  if (profileError || !profileData) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          Profile not found or failed to load.
        </div>
      </div>
    );
  }

  const handleFollow = () => {
    if (!id) return;
    followUser.mutate(id);
  };

  const handleUnfollow = () => {
    if (!id) return;
    unfollowUser.mutate(id);
  };

  // Merge isFollowing state with profile data
  const enrichedProfileData = profileData ? {
    ...profileData,
    isFollowing
  } : null;

  return (
    <div className={styles.container}>
      {enrichedProfileData && (
        <ProfileHeader 
          user={enrichedProfileData} 
          isOwnProfile={false}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
          isFollowLoading={followUser.isPending || unfollowUser.isPending}
        />
      )}
      
      
      <div className={styles.posts}>
        {postsError ? (
          <div className={styles.error}>Failed to load posts.</div>
        ) : (
          <PostGrid 
            posts={posts} 
            isLoading={postsLoading}
            onPostClick={openPostDetail}
          />
        )}
      </div>
    </div>
  );
}
