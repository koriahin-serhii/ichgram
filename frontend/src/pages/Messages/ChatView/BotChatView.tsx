import { useState, useRef, useEffect } from 'react';
import { getBotResponse, getInitialBotMessage } from '../../../shared/utils/aiBot.ts';
import useAuth from '../../../app/providers/useAuth';
import styles from './ChatView.module.css';

interface BotMessage {
  _id: string;
  text: string;
  sender: {
    _id: string;
    name: string;
  };
  recipient: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

export const BotChatView = () => {
  const { user: currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const [botMessages, setBotMessages] = useState<BotMessage[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize bot conversation
  const initializeBotChat = () => {
    const initialMsg = getInitialBotMessage();
    setBotMessages([
      {
        _id: '1',
        text: initialMsg.text,
        sender: {
          _id: 'ai-bot',
          name: 'SKYJECTIV AI Ассистент',
        },
        recipient: {
          _id: currentUser?.id || '',
          name: currentUser?.name || '',
        },
        createdAt: initialMsg.timestamp.toISOString(),
      },
    ]);
  };

  // Load messages from sessionStorage on mount
  useEffect(() => {
    const savedMessages = sessionStorage.getItem('bot-chat-messages');
    if (savedMessages && savedMessages !== '[]') {
      try {
        const parsed = JSON.parse(savedMessages);
        setBotMessages(parsed);
      } catch (error) {
        console.error('Failed to load bot messages:', error);
        initializeBotChat();
      }
    } else {
      initializeBotChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save messages to sessionStorage whenever they change
  useEffect(() => {
    if (botMessages.length > 0) {
      sessionStorage.setItem('bot-chat-messages', JSON.stringify(botMessages));
    }
  }, [botMessages]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [botMessages, isBotTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    const userMessage: BotMessage = {
      _id: Date.now().toString(),
      text: message,
      sender: {
        _id: currentUser?.id || '',
        name: currentUser?.name || '',
      },
      recipient: {
        _id: 'ai-bot',
        name: 'SKYJECTIV AI Assistant',
      },
      createdAt: new Date().toISOString(),
    };

    setBotMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setIsBotTyping(true);

    // Simulate bot typing and response
    setTimeout(() => {
      const botResp = getBotResponse(userMessage.text);
      const botMessage: BotMessage = {
        _id: (Date.now() + 1).toString(),
        text: botResp.text,
        sender: {
          _id: 'ai-bot',
          name: 'SKYJECTIV AI Assistant',
        },
        recipient: {
          _id: currentUser?.id || '',
          name: currentUser?.name || '',
        },
        createdAt: botResp.timestamp.toISOString(),
      };

      setBotMessages((prev) => [...prev, botMessage]);
      setIsBotTyping(false);
    }, 800 + Math.random() * 1200);
  };

  return (
    <div className={styles.container}>
      {/* Chat header */}
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <img src="/bot-avatar.jpg" alt="AI Bot" className={styles.avatar} />
          <div>
            <span className={styles.username}>SKYJECTIV AI Assistant</span>
            <p className={styles.userStatus}>Always active</p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className={styles.messagesArea}>
        {botMessages.map((msg) => {
          const isOwn = msg.sender._id === currentUser?.id;

          return (
            <div
              key={msg._id}
              className={`${styles.messageWrapper} ${isOwn ? styles.own : styles.other}`}
            >
              {!isOwn && (
                <div className={styles.messageAvatar}>
                  <img src="/bot-avatar.jpg" alt="AI Bot" />
                </div>
              )}
              <div className={styles.message}>
                <p>{msg.text}</p>
              </div>
            </div>
          );
        })}

        {/* Bot typing indicator */}
        {isBotTyping && (
          <div className={`${styles.messageWrapper} ${styles.other}`}>
            <div className={styles.messageAvatar}>
              <img src="/bot-avatar.jpg" alt="AI Bot" />
            </div>
            <div className={`${styles.message} ${styles.typing}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSendMessage} className={styles.inputArea}>
        <input
          type="text"
          placeholder="Message AI Assistant..."
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
