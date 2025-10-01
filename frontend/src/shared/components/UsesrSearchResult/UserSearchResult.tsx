import { Link } from 'react-router-dom';
import { UserAvatar } from '@shared/components';
import styles from './UserSearchResult.module.css';
import type { User } from '@shared/api/users';

interface UserSearchResultProps {
  user: User;
  onClick?: () => void;
}

export default function UserSearchResult({ user, onClick }: UserSearchResultProps) {
  const handleClick = () => {
    onClick?.();
  };

  return (
    <Link 
      to={`/u/${user.name}`} 
      className={styles.result}
      onClick={handleClick}
    >
      <div className={styles.avatar}>
        <UserAvatar 
          src={user.profileImage} 
          alt={user.fullName}
          size="medium"
        />
      </div>
      
      <div className={styles.info}>
        <div className={styles.username}>{user.name}</div>
        <div className={styles.fullName}>{user.fullName}</div>
        {user.bio && (
          <div className={styles.bio}>{user.bio}</div>
        )}
      </div>
    </Link>
  );
}