import { useNavigate, useParams } from 'react-router-dom';
import { useConversations } from '../../../shared/api/messages';
import useAuth from '../../../app/providers/useAuth';
import styles from './ConversationsList.module.css';

const formatTime = (date: string) => {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInMs = now.getTime() - messageDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);

  if (diffInMinutes < 1) return 'now';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInHours < 24) return `${diffInHours}h`;
  if (diffInDays < 7) return `${diffInDays}d`;
  return messageDate.toLocaleDateString();
};

export const ConversationsList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { userId: activeUserId } = useParams();
  const { data: conversations, isLoading } = useConversations();

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading conversations...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Current user header */}
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <span className={styles.username}>{user?.name}</span>
        </div>
      </div>

      {/* Conversations list */}
      <div className={styles.conversationsList}>
        {!conversations || conversations.length === 0 ? (
          <div className={styles.empty}>
            <p>Your messages</p>
            <span>Send private messages to a friend</span>
          </div>
        ) : (
          conversations.map((conv) => {
            const isActive = conv._id === activeUserId;
            return (
              <div
                key={conv._id}
                className={`${styles.conversationItem} ${isActive ? styles.active : ''}`}
                onClick={() => navigate(`/messages/${conv._id}`)}
              >
                <div className={styles.conversationAvatar}>
                  {conv.profileImage ? (
                    <img src={conv.profileImage} alt={conv.name} />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {conv.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className={styles.conversationInfo}>
                  <div className={styles.conversationHeader}>
                    <span className={styles.name}>{conv.name}</span>
                    <span className={styles.time}>{formatTime(conv.lastMessageDate)}</span>
                  </div>
                  <p className={styles.lastMessage}>{conv.lastMessage}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
