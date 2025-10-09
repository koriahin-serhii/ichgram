import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMessages, useSendMessage, useDeleteConversation, type Message } from '../../../shared/api/messages';
import { useUserProfile } from '../../../shared/api/users';
import useAuth from '../../../app/providers/useAuth';
import { ChatUserInfo } from './ChatUserInfo';
import { getSocket } from '../../../shared/utils/socket';
import { useQueryClient } from '@tanstack/react-query';
import { messageKeys } from '../../../shared/api/messages';
import styles from './ChatView.module.css';

export const ChatView = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: messages, isLoading: messagesLoading } = useMessages(userId!);
  const { data: userProfile, isLoading: userLoading } = useUserProfile(userId!);
  const sendMessageMutation = useSendMessage();
  const deleteConversationMutation = useDeleteConversation();

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Subscribe to new messages via socket
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !userId) return;

    const handleReceiveMessage = (newMessage: Message) => {
      // Update messages only if it's from the current chat user
      if (newMessage.sender._id === userId || newMessage.recipient._id === userId) {
        queryClient.invalidateQueries({
          queryKey: messageKeys.conversation(userId),
        });
        queryClient.invalidateQueries({
          queryKey: messageKeys.conversations(),
        });
      }
    };

    const handleConversationDeleted = (data: { deletedBy: string; userId: string }) => {
      // If conversation with current user is deleted, redirect to messages
      if (data.userId === userId) {
        queryClient.invalidateQueries({
          queryKey: messageKeys.conversations(),
        });
        navigate('/messages');
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('conversationDeleted', handleConversationDeleted);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('conversationDeleted', handleConversationDeleted);
    };
  }, [userId, queryClient, navigate]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !userId) return;

    sendMessageMutation.mutate(
      {
        recipientId: userId,
        text: message,
      },
      {
        onSuccess: () => {
          setMessage('');
        },
      }
    );
  };

  const handleDeleteConversation = () => {
    if (!userId) return;
    
    const confirmed = window.confirm('Are you sure you want to delete this conversation? All messages will be permanently deleted.');
    
    if (confirmed) {
      deleteConversationMutation.mutate(userId, {
        onSuccess: () => {
          // Navigate back to messages list after deletion
          navigate('/messages');
        },
      });
    }
  };

  if (!userId) {
    return (
      <div className={styles.emptyState}>
        <h2>Select a conversation</h2>
        <p>Choose a conversation from the list to start messaging</p>
      </div>
    );
  }

  if (messagesLoading || userLoading) {
    return (
      <div className={styles.loading}>
        <p>Loading messages...</p>
      </div>
    );
  }

  // Get the other user's info from userProfile or the first message
  const otherUser = userProfile || (messages && messages.length > 0
    ? (messages[0].sender._id === currentUser?.id ? messages[0].recipient : messages[0].sender)
    : null);

  return (
    <div className={styles.container}>
      {/* Chat header */}
      <div className={styles.header}>
        <div className={styles.userInfo}>
          {otherUser?.profileImage ? (
            <img src={otherUser.profileImage} alt={otherUser.name} className={styles.avatar} />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {otherUser?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <span className={styles.username}>{otherUser?.name}</span>
        </div>
        <button 
          className={styles.deleteButton}
          onClick={handleDeleteConversation}
          title="Delete conversation"
          aria-label="Delete conversation"
        >
          ✕
        </button>
      </div>

      {/* Messages area */}
      <div className={styles.messagesArea}>
        {/* User info card */}
        {otherUser && (
          <ChatUserInfo
            userId={otherUser._id}
            name={otherUser.name}
            fullName={otherUser.fullName}
            profileImage={otherUser.profileImage}
            createdAt={messages && messages.length > 0 ? messages[0].createdAt : undefined}
          />
        )}

        {messages?.map((msg) => {
          const isOwn = msg.sender._id === currentUser?.id;
          const sender = isOwn ? currentUser : otherUser;
          
          return (
            <div
              key={msg._id}
              className={`${styles.messageWrapper} ${isOwn ? styles.own : styles.other}`}
            >
              {!isOwn && (
                <div className={styles.messageAvatar}>
                  {sender?.profileImage ? (
                    <img src={sender.profileImage} alt={sender.name} />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {sender?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              )}
              <div className={styles.message}>
                <p>{msg.text}</p>
              </div>
              {isOwn && (
                <div className={styles.messageAvatar}>
                  {sender?.profileImage ? (
                    <img src={sender.profileImage} alt={sender.name} />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {sender?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSendMessage} className={styles.inputArea}>
        <input
          type="text"
          placeholder="Write message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={styles.input}
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className={styles.sendButton}
        >
          Send
        </button>
      </form>
    </div>
  );
};
