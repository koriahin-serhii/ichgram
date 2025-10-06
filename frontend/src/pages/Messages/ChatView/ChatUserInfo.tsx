import { useNavigate } from 'react-router-dom';
import styles from './ChatUserInfo.module.css';

interface ChatUserInfoProps {
  userId: string;
  name: string;
  fullName?: string;
  profileImage?: string;
  createdAt: string;
}

export const ChatUserInfo = ({ userId, name, fullName, profileImage, createdAt }: ChatUserInfoProps) => {
  const navigate = useNavigate();

  const formatDate = (date: string) => {
    const messageDate = new Date(date);
    return messageDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.avatarWrapper}>
        {profileImage ? (
          <img src={profileImage} alt={name} className={styles.avatar} />
        ) : (
          <div className={styles.avatarPlaceholder}>
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      
      <h2 className={styles.name}>{name}</h2>
      
      {fullName && <p className={styles.fullName}>{fullName}</p>}
      
      <button 
        className={styles.profileButton}
        onClick={() => navigate(`/profile/${userId}`)}
      >
        View profile
      </button>
      
      <p className={styles.date}>{formatDate(createdAt)}</p>
    </div>
  );
};
