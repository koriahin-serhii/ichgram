import { Routes, Route } from 'react-router-dom';
import { ConversationsList } from './ConversationsList/ConversationsList';
import { ChatView } from './ChatView/ChatView';
import styles from './Messages.module.css';

export default function Messages() {
  return (
    <div className={styles.container}>
      <div className={styles.conversationsPanel}>
        <ConversationsList />
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
