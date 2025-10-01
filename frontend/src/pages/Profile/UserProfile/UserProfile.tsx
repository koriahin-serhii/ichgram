import { useParams } from 'react-router-dom';
import { useUserProfile } from '@shared/api/users';
import { useUserPosts } from '@shared/api/posts';
import { ProfileHeader, PostGrid } from '@shared/components';
import { mockUser, mockPosts } from '@shared/utils/mockData';
import styles from './UserProfile.module.css';

export default function UserProfile() {
  const { username } = useParams<{ username: string }>();
  
  // В реальном приложении нужно было бы получить ID пользователя по username
  // Пока что используем username как ID для демонстрации
  const { data: profileData, isLoading: profileLoading, error: profileError } = useUserProfile(username || '');
  const { data: posts = [], isLoading: postsLoading, error: postsError } = useUserPosts(username || '');

  // Используем моковые данные если есть ошибка или нет данных
  const displayUser = profileError || !profileData ? { ...mockUser, isFollowing: true } : profileData;
  const displayPosts = postsError || posts.length === 0 ? mockPosts : posts;

  if (profileLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading profile...</div>
      </div>
    );
  }

  const handleFollow = () => {
    console.log('Follow user:', displayUser.name);
    // TODO: Implement follow functionality
  };

  const handleUnfollow = () => {
    console.log('Unfollow user:', displayUser.name);
    // TODO: Implement unfollow functionality
  };

  return (
    <div className={styles.container}>
      <ProfileHeader 
        user={displayUser} 
        isOwnProfile={false}
        onFollow={handleFollow}
        onUnfollow={handleUnfollow}
      />
      
      <div className={styles.divider} />
      
      <div className={styles.posts}>
        <PostGrid 
          posts={displayPosts} 
          isLoading={postsLoading}
        />
      </div>
    </div>
  );
}
