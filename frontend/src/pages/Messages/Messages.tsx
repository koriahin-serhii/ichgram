import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ConversationsList } from './ConversationsList/ConversationsList';
import { ChatView } from './ChatView/ChatView';
import styles from './Messages.module.css';

interface LocationState {
  userId?: string;
  userName?: string;
  userImage?: string;
}

export default function Messages() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const [preselectedUser, setPreselectedUser] = useState<LocationState | null>(null);

  // Auto-select user when navigating from profile
  useEffect(() => {
    if (state?.userId) {
      // Save user data for ConversationsList
      setPreselectedUser({
        userId: state.userId,
        userName: state.userName,
        userImage: state.userImage,
      });
      // Navigate to the chat with this user
      navigate(`/messages/${state.userId}`, { replace: true });
    }
  }, [state?.userId, state?.userName, state?.userImage, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.conversationsPanel}>
        <ConversationsList preselectedUser={preselectedUser} />
      </div>
      <div className={styles.chatPanel}>
        <Routes>
          <Route
            path="/"
            element={
              <div className={styles.emptyChatState}>
                <h2>Your messages</h2>
                <p>Send private messages to a friend.</p>
              </div>
            }
          />
          <Route path="/:userId" element={<ChatView />} />
        </Routes>
      </div>
    </div>
  );
}
