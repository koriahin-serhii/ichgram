import { useParams } from 'react-router-dom';
import { useUserProfile } from '@shared/api/users';
import { useUserPosts } from '@shared/api/posts';
import { ProfileHeader, PostGrid } from '@shared/components';
import styles from './UserProfile.module.css';

export default function UserProfile() {
  const { username } = useParams<{ username: string }>();
  
  // В реальном приложении нужно было бы получить ID пользователя по username
  // Пока что используем username как ID для демонстрации
  const { data: profileData, isLoading: profileLoading, error: profileError } = useUserProfile(username || '');
  const { data: posts = [], isLoading: postsLoading, error: postsError } = useUserPosts(username || '');

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
    console.log('Follow user:', profileData.name);
    // TODO: Implement follow functionality
  };

  const handleUnfollow = () => {
    console.log('Unfollow user:', profileData.name);
    // TODO: Implement unfollow functionality
  };

  return (
    <div className={styles.container}>
      <ProfileHeader 
        user={profileData} 
        isOwnProfile={false}
        onFollow={handleFollow}
        onUnfollow={handleUnfollow}
      />
      
      <div className={styles.divider} />
      
      <div className={styles.posts}>
        {postsError ? (
          <div className={styles.error}>Failed to load posts.</div>
        ) : (
          <PostGrid 
            posts={posts} 
            isLoading={postsLoading}
          />
        )}
      </div>
    </div>
  );
}
