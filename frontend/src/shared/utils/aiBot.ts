// AI Bot utility for chat interactions
// This is a simple implementation that can be replaced with actual AI API

interface BotResponse {
  text: string;
  timestamp: Date;
}

// Detect language from user message
function detectLanguage(message: string): 'ru' | 'en' {
  const russianPattern = /[а-яё]/i;
  return russianPattern.test(message) ? 'ru' : 'en';
}

// Predefined responses for the bot - Russian
const botResponsesRU = {
  greetings: [
    "Привет! 👋 Я SKYJECTIV AI Ассистент. Чем могу помочь?",
    "Здравствуйте! 😊 Что вас интересует?",
    "Привет! Я здесь, чтобы помочь. О чём хотите узнать?",
  ],
  help: [
    "Я могу помочь с:\n• Функциями приложения\n• Советами по постам\n• Уведомлениями\n• Профилем\n\nО чём хотите узнать?",
    "Вот чем я могу помочь:\n✨ Создание интересных постов\n💬 Система сообщений\n🔔 Уведомления\n👥 Управление подписчиками\n\nЧто вас интересует?",
  ],
  posts: [
    "Как создать отличный пост:\n1. Выберите качественное фото\n2. Добавьте интересное описание\n3. Используйте хештеги\n4. Публикуйте в нужное время\n\nНужны ещё советы?",
    "Идеи для постов:\n📸 За кулисами\n💡 Советы и уроки\n🎉 Важные моменты\n❓ Вопросы подписчикам\n\nЕщё предложения?",
  ],
  profile: [
    "Оптимизация профиля:\n• Чёткое фото профиля\n• Интересное описание\n• Добавьте ссылки\n• Публикуйте регулярно\n\nЧто ещё интересует?",
    "Ваш профиль — ваша визитка! Обязательно:\n✓ Обновите аватар\n✓ Напишите крутое био\n✓ Покажите лучшие посты\n✓ Общайтесь с подписчиками\n\nНужна помощь?",
  ],
  messages: [
    "Система сообщений позволяет:\n• Отправлять личные сообщения\n• Делиться постами\n• Удалять диалоги\n• Видеть статус прочтения\n\nО чём ещё рассказать?",
    "Советы по общению:\n💬 Будьте вежливы\n⚡ Отвечайте быстро\n🎯 Пишите по делу\n😊 Используйте эмодзи\n\nЧем ещё помочь?",
  ],
  notifications: [
    "Уведомления сообщают о:\n• Новых подписчиках\n• Лайках на постах\n• Комментариях\n• Личных сообщениях\n\nНастройки в профиле!",
    "Будьте в курсе событий:\n🔔 Лайки и комментарии\n👥 Новые подписчики\n💬 Сообщения\n📸 Упоминания\n\nРассказать подробнее?",
  ],
  default: [
    "Не совсем понял. Спросите о:\n• Создании постов\n• Профиле\n• Сообщениях\n• Уведомлениях\n\nО чём хотите узнать?",
    "Интересный вопрос! Могу помочь с постами, сообщениями, профилем и уведомлениями. Что изучим?",
    "Я здесь, чтобы помочь! Попробуйте спросить:\n✨ Как создавать лучшие посты\n👤 Оптимизация профиля\n💬 Использование сообщений\n🔔 Уведомления\n\nЧто интересует?",
  ],
  thanks: [
    "Пожалуйста! 😊 Всегда рад помочь!",
    "Не за что! Обращайтесь! ✨",
    "Рад помочь! Спрашивайте ещё! 👍",
  ],
  bye: [
    "До свидания! Хорошего дня! 👋",
    "Увидимся! Пишите в любое время! 😊",
    "Всего доброго! Я всегда на связи! ✨",
  ],
};

// Predefined responses for the bot - English
const botResponsesEN = {
  greetings: [
    "Hello! 👋 I'm SKYJECTIV AI Assistant. How can I help you today?",
    "Hi there! 😊 What would you like to know?",
    "Hey! I'm here to help. What's on your mind?",
  ],
  help: [
    "I can help you with:\n• App features and navigation\n• Tips for better posts\n• Understanding notifications\n• Managing your profile\n\nWhat would you like to know?",
    "Here are some things I can assist with:\n✨ Creating engaging posts\n💬 Using the messaging system\n🔔 Understanding notifications\n👥 Managing followers\n\nWhat interests you?",
  ],
  posts: [
    "To create a great post:\n1. Choose a high-quality image\n2. Add an engaging caption\n3. Use relevant hashtags\n4. Post at the right time\n\nWould you like more tips?",
    "Here are some post ideas:\n📸 Behind-the-scenes content\n💡 Tips and tutorials\n🎉 Celebrating milestones\n❓ Questions to engage followers\n\nNeed more suggestions?",
  ],
  profile: [
    "To optimize your profile:\n• Use a clear profile picture\n• Write a compelling bio\n• Include relevant links\n• Keep your posts consistent\n\nWhat else would you like to know?",
    "Your profile is your digital identity! Make sure to:\n✓ Update your profile picture\n✓ Write a catchy bio\n✓ Showcase your best posts\n✓ Engage with your followers\n\nNeed help with anything specific?",
  ],
  messages: [
    "The messaging system allows you to:\n• Send direct messages to other users\n• Share posts in conversations\n• Delete conversations\n• See when messages are read\n\nWhat would you like to know more about?",
    "Tips for messaging:\n💬 Be friendly and respectful\n⚡ Respond promptly\n🎯 Be clear and concise\n😊 Use emojis appropriately\n\nAnything else I can help with?",
  ],
  notifications: [
    "Notifications keep you updated on:\n• New followers\n• Likes on your posts\n• Comments\n• Direct messages\n\nYou can manage notification settings in your profile!",
    "Stay connected with notifications for:\n🔔 New likes and comments\n👥 New followers\n💬 Direct messages\n📸 Post mentions\n\nWant to know more?",
  ],
  default: [
    "I'm not sure I understand. Could you ask about:\n• Creating posts\n• Profile management\n• Messaging features\n• Notifications\n\nWhat would you like to know?",
    "That's an interesting question! I can help with app features like posts, messages, profiles, and notifications. What would you like to explore?",
    "I'm here to help! Try asking about:\n✨ How to create better posts\n👤 Profile optimization\n💬 Using messages\n🔔 Notifications\n\nWhat interests you?",
  ],
  thanks: [
    "You're welcome! 😊 Happy to help anytime!",
    "My pleasure! Let me know if you need anything else! ✨",
    "Glad I could help! Feel free to ask anything else! 👍",
  ],
  bye: [
    "Goodbye! Have a great day! 👋",
    "See you later! Feel free to chat anytime! 😊",
    "Take care! I'll be here if you need me! ✨",
  ],
};

// Simple keyword-based response system with language detection
export function getBotResponse(userMessage: string): BotResponse {
  const message = userMessage.toLowerCase().trim();
  const lang = detectLanguage(message);
  const responses = lang === 'ru' ? botResponsesRU : botResponsesEN;

  // Greetings
  if (
    /^(hi|hello|hey|greetings|good morning|good afternoon|good evening|привет|здравствуй|добрый день|доброе утро|добрый вечер)/i.test(
      message
    )
  ) {
    return {
      text: getRandomResponse(responses.greetings),
      timestamp: new Date(),
    };
  }

  // Help
  if (/help|assist|support|guide|помощ|помог|справк|подсказ/i.test(message)) {
    return {
      text: getRandomResponse(responses.help),
      timestamp: new Date(),
    };
  }

  // Posts
  if (/post|photo|image|upload|share|content|пост|фото|изображен|публик|контент/i.test(message)) {
    return {
      text: getRandomResponse(responses.posts),
      timestamp: new Date(),
    };
  }

  // Profile
  if (/profile|bio|picture|avatar|account|профил|био|аватар|аккаунт|учетн/i.test(message)) {
    return {
      text: getRandomResponse(responses.profile),
      timestamp: new Date(),
    };
  }

  // Messages
  if (/message|chat|conversation|dm|direct|сообщен|чат|диалог|переписк/i.test(message)) {
    return {
      text: getRandomResponse(responses.messages),
      timestamp: new Date(),
    };
  }

  // Notifications
  if (/notification|alert|update|bell|уведомлен|оповещен|звонок/i.test(message)) {
    return {
      text: getRandomResponse(responses.notifications),
      timestamp: new Date(),
    };
  }

  // Thanks
  if (/thank|thanks|thx|appreciate|спасиб|благодар/i.test(message)) {
    return {
      text: getRandomResponse(responses.thanks),
      timestamp: new Date(),
    };
  }

  // Bye
  if (/bye|goodbye|see you|later|farewell|пока|до свидан|увидим/i.test(message)) {
    return {
      text: getRandomResponse(responses.bye),
      timestamp: new Date(),
    };
  }

  // Default response
  return {
    text: getRandomResponse(responses.default),
    timestamp: new Date(),
  };
}

function getRandomResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)];
}

// Get initial greeting message
export function getInitialBotMessage(): BotResponse {
  return {
    text: "Привет! 👋 Я SKYJECTIV AI Ассистент. Помогу вам разобраться в приложении. Спрашивайте о:\n\n• Создании и оптимизации постов\n• Управлении профилем\n• Функциях сообщений\n• Уведомлениях\n\nЧем могу помочь?",
    timestamp: new Date(),
  };
}
