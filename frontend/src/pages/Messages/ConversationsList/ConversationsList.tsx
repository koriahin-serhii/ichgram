import { useNavigate, useLocation } from 'react-router-dom';
import { useMemo, useEffect } from 'react';
import { useConversations } from '../../../shared/api/messages';
import useAuth from '../../../app/providers/useAuth';
import { getSocket } from '../../../shared/utils/socket';
import { useQueryClient } from '@tanstack/react-query';
import { messageKeys } from '../../../shared/api/messages';
import styles from './ConversationsList.module.css';

const formatTime = (date: string) => {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInMs = now.getTime() - messageDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);
  const diffInWeeks = Math.floor(diffInDays / 7);

  if (diffInMinutes < 1) return 'now';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInHours < 24) return `${diffInHours}h`;
  if (diffInDays < 7) return `${diffInDays}d`;
  if (diffInWeeks < 5) return `${diffInWeeks} wek`;
  return messageDate.toLocaleDateString();
};

interface PreselectedUser {
  userId?: string;
  userName?: string;
  userImage?: string;
}

interface ConversationsListProps {
  preselectedUser?: PreselectedUser | null;
}

export const ConversationsList = ({ preselectedUser }: ConversationsListProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { data: conversations, isLoading } = useConversations();

  // Extract userId from pathname like /messages/68d1a4a2e45b39fbbc7060f0
  const activeUserId = location.pathname.split('/messages/')[1] || null;

  // Subscribe to new messages for updating conversations list
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleReceiveMessage = () => {
      // Refresh conversations list when new message arrives
      queryClient.invalidateQueries({
        queryKey: messageKeys.conversations(),
      });
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [queryClient]);

  // Merge preselected user with existing conversations
  const displayConversations = useMemo(() => {
    const convList = conversations || [];
    
    // If there's a preselected user and they're not in the list, add them
    if (preselectedUser?.userId) {
      const userExists = convList.some(conv => conv._id === preselectedUser.userId);
      
      if (!userExists) {
        return [
          {
            _id: preselectedUser.userId,
            name: preselectedUser.userName || 'User',
            profileImage: preselectedUser.userImage || '',
            lastMessageSender: '',
            lastMessageDate: new Date().toISOString(),
            isPreselected: true, // Flag to identify this is a new conversation
          },
          ...convList,
        ];
      }
    }
    
    return convList;
  }, [conversations, preselectedUser]);

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
        {!displayConversations || displayConversations.length === 0 ? (
          <div className={styles.empty}>
            <p>Your messages</p>
            <span>Send private messages to a friend</span>
          </div>
        ) : (
          displayConversations.map((conv) => {
            const isActive = conv._id === activeUserId;
            const isOwnMessage = conv.lastMessageSender === user?.id;
            const messageSender = isOwnMessage ? 'You' : conv.name;
            const isPreselected = 'isPreselected' in conv && conv.isPreselected;
            
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
                  </div>
                  <p className={styles.lastMessage}>
                    {isPreselected 
                      ? 'Start a conversation' 
                      : `${messageSender} sent a message · ${formatTime(conv.lastMessageDate)}`
                    }
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
