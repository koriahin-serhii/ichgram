import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMessages, useSendMessage } from '../../../shared/api/messages';
import useAuth from '../../../app/providers/useAuth';
import { ChatUserInfo } from './ChatUserInfo';
import styles from './ChatView.module.css';

export const ChatView = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading } = useMessages(userId!);
  const sendMessageMutation = useSendMessage();

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  if (!userId) {
    return (
      <div className={styles.emptyState}>
        <h2>Select a conversation</h2>
        <p>Choose a conversation from the list to start messaging</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <p>Loading messages...</p>
      </div>
    );
  }

  // Get the other user's info from the first message
  const otherUser = messages && messages.length > 0
    ? (messages[0].sender._id === currentUser?.id ? messages[0].recipient : messages[0].sender)
    : null;

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
      </div>

      {/* Messages area */}
      <div className={styles.messagesArea}>
        {/* User info card */}
        {otherUser && messages && messages.length > 0 && (
          <ChatUserInfo
            userId={otherUser._id}
            name={otherUser.name}
            fullName={otherUser.fullName}
            profileImage={otherUser.profileImage}
            createdAt={messages[0].createdAt}
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
