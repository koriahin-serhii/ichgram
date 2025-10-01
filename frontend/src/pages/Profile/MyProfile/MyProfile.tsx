import useAuth from '@app/providers/useAuth';
import { useMyProfile } from '@shared/api/users';
import { useUserPosts } from '@shared/api/posts';
import { ProfileHeader, PostGrid } from '@shared/components';
import { mockUser, mockPosts } from '@shared/utils/mockData';
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

  // Используем моковые данные если есть ошибка или нет данных
  const displayUser = profileError || !profileData ? mockUser : profileData;
  const displayPosts = postsError || posts.length === 0 ? mockPosts : posts;

  if (profileLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ProfileHeader user={displayUser} isOwnProfile={true} />

      <div className={styles.posts}>
        <PostGrid posts={displayPosts} isLoading={postsLoading} />
      </div>
    </div>
  );
}
