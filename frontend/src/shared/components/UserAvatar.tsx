import styles from './UserAvatar.module.css';

interface UserAvatarProps {
  src?: string;
  alt?: string;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export default function UserAvatar({ 
  src, 
  alt = "User avatar", 
  size = 'medium',
  onClick 
}: UserAvatarProps) {
  return (
    <div 
      className={`${styles.avatar} ${styles[size]} ${onClick ? styles.clickable : ''}`}
      onClick={onClick}
    >
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className={styles.image}
        />
      ) : (
        <div className={styles.placeholder}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
      )}
    </div>
  );
}