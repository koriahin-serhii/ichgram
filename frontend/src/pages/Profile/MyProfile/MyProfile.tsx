import useAuth from '@app/providers/useAuth';
import { useMyProfile } from '@shared/api/users';
import { useUserPosts } from '@shared/api/posts';
import { ProfileHeader, PostGrid } from '@shared/components';
import styles from './MyProfile.module.css';

export default function MyProfile() {
  const { user: currentUser } = useAuth();
  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
  } = useMyProfile();
  const {
    data: posts = [],
    isLoading: postsLoading,
    error: postsError,
  } = useUserPosts(currentUser?.id || '');

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
          Failed to load profile. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ProfileHeader user={profileData} isOwnProfile={true} />

      <div className={styles.posts}>
        {postsError ? (
          <div className={styles.error}>Failed to load posts.</div>
        ) : (
          <PostGrid posts={posts} isLoading={postsLoading} />
        )}
      </div>
    </div>
  );
}
