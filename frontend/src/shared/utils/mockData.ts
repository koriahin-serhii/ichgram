import type { UserProfile } from '../api/users';

export const mockUser: UserProfile = {
  _id: 'user_123',
  name: 'itcareerhub',
  email: 'user@example.com',
  fullName: 'IT Career Hub',
  profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  bio: '🎓 Гарантия трудоустройства в вакансии IT\n💼 Выпускники зарабатывают от 150к евро\n✨ БЕСПЛАТНО! подробности',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  stats: {
    postsCount: 129,
    followersCount: 9993,
    followingCount: 59,
  },
  isFollowing: false,
};

export const mockPosts = [
  {
    _id: 'post_1',
    imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=400&fit=crop',
    description: 'Проект с участием выпускников IT Career Hub',
    likesCount: 245,
    commentsCount: 12,
  },
  {
    _id: 'post_2',
    imageUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400&h=400&fit=crop',
    description: 'Получите инструкцию к поиску работы в Германии',
    likesCount: 189,
    commentsCount: 8,
  },
  {
    _id: 'post_3',
    imageUrl: 'https://images.unsplash.com/photo-1522252234503-e356532cafd5?w=400&h=400&fit=crop',
    description: 'Хотите в IT, но думаете, что это скучно и сложно?',
    likesCount: 302,
    commentsCount: 25,
  },
  {
    _id: 'post_4',
    imageUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=400&fit=crop',
    description: 'Какие бонусы получают наши студенты!',
    likesCount: 156,
    commentsCount: 7,
  },
  {
    _id: 'post_5',
    imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=400&h=400&fit=crop',
    description: 'Студентка с тренд летним и большой мечтой!',
    likesCount: 278,
    commentsCount: 19,
  },
  {
    _id: 'post_6',
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop',
    description: 'Новые возможности в IT карьере',
    likesCount: 423,
    commentsCount: 31,
  },
];

export const generateMockPosts = (count: number = 6) => {
  const images = [
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1522252234503-e356532cafd5?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop',
  ];

  return Array.from({ length: count }, (_, index) => ({
    _id: `post_${index + 1}`,
    imageUrl: images[index % images.length],
    description: `Test post ${index + 1}`,
    likesCount: Math.floor(Math.random() * 500) + 50,
    commentsCount: Math.floor(Math.random() * 50) + 1,
  }));
};