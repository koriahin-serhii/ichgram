import { useState, useRef, useEffect } from 'react';
import { getBotResponse, getInitialBotMessage } from '../../../shared/utils/aiBot';
import { useAIChatMutation } from '../../../shared/api/ai';
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
  const [useOpenAI, setUseOpenAI] = useState(false); // Toggle between OpenAI and local bot
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiChatMutation = useAIChatMutation();

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

  // Storage key with user ID to separate chats per user
  const storageKey = `bot-chat-messages-${currentUser?.id || 'guest'}`;

  // Load messages from sessionStorage on mount
  useEffect(() => {
    const savedMessages = sessionStorage.getItem(storageKey);
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
  }, [currentUser?.id, storageKey]);

  // Save messages to sessionStorage whenever they change
  useEffect(() => {
    if (botMessages.length > 0) {
      sessionStorage.setItem(storageKey, JSON.stringify(botMessages));
    }
  }, [botMessages, storageKey]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [botMessages, isBotTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
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
    const currentMessage = message;
    setMessage('');
    setIsBotTyping(true);

    // Choose between OpenAI or local bot
    if (useOpenAI) {
      try {
        // Prepare conversation history for OpenAI
        const conversationHistory = botMessages.map(msg => ({
          role: msg.sender._id === currentUser?.id ? 'user' as const : 'assistant' as const,
          content: msg.text,
        }));

        // Call OpenAI API
        const response = await aiChatMutation.mutateAsync({
          message: currentMessage,
          conversationHistory,
        });

        const botMessage: BotMessage = {
          _id: (Date.now() + 1).toString(),
          text: response.response,
          sender: {
            _id: 'ai-bot',
            name: 'SKYJECTIV AI Ассистент',
          },
          recipient: {
            _id: currentUser?.id || '',
            name: currentUser?.name || '',
          },
          createdAt: response.timestamp,
        };

        setBotMessages((prev) => [...prev, botMessage]);
        setIsBotTyping(false);
      } catch (error: unknown) {
        console.error('OpenAI error:', error);
        
        // Check if backend suggests to use local fallback
        const axiosError = error as { response?: { data?: { fallback?: string; useLocalFallback?: boolean } } };
        const errorData = axiosError?.response?.data;
        let errorMessage = 'Извините, произошла ошибка. Переключаюсь на локальный режим.';
        
        if (errorData?.fallback) {
          errorMessage = errorData.fallback;
        }
        
        // Auto-switch to local mode if quota exceeded
        if (errorData?.useLocalFallback) {
          setUseOpenAI(false);
        }
        
        // Show error message from bot
        const errorBotMessage: BotMessage = {
          _id: (Date.now() + 1).toString(),
          text: `⚠️ ${errorMessage}`,
          sender: {
            _id: 'ai-bot',
            name: 'SKYJECTIV AI Ассистент',
          },
          recipient: {
            _id: currentUser?.id || '',
            name: currentUser?.name || '',
          },
          createdAt: new Date().toISOString(),
        };
        
        setBotMessages((prev) => [...prev, errorBotMessage]);
        setIsBotTyping(false);
      }
    } else {
      // Use local bot (keyword-based)
      setTimeout(() => {
        const botResp = getBotResponse(currentMessage);
        const botMessage: BotMessage = {
          _id: (Date.now() + 1).toString(),
          text: botResp.text,
          sender: {
            _id: 'ai-bot',
            name: 'SKYJECTIV AI Ассистент',
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
    }
  };

  return (
    <div className={styles.container}>
      {/* Chat header */}
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <img src="/bot-avatar.jpg" alt="AI Bot" className={styles.avatar} />
          <div>
            <span className={styles.username}>SKYJECTIV AI Assistant</span>
            <p className={styles.userStatus}>
              {useOpenAI ? '🤖 OpenAI Mode' : '📝 Keyword Mode'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setUseOpenAI(!useOpenAI)}
          className={styles.deleteButton}
          title={useOpenAI ? 'Switch to Keyword Bot' : 'Switch to OpenAI'}
        >
          {useOpenAI ? '📝' : '🤖'}
        </button>
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
              {isOwn && (
                <div className={styles.messageAvatar}>
                  {currentUser?.profileImage ? (
                    <img src={currentUser.profileImage} alt={currentUser.name} />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {currentUser?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              )}
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
