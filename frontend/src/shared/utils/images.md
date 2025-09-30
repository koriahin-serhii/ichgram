# Работа с изображениями

## Важно: Преобразователь НЕ НУЖЕН! 🎉

Backend уже возвращает полные S3 URL'ы в формате:
```
https://bucket-name.s3.region.amazonaws.com/profile-images/userId-uuid.jpg
```

Эти URL'ы готовы к использованию в `<img>` тегах без дополнительных преобразований.

## Созданные утилиты

### 1. Утилиты (`@shared/utils/images`)

```typescript
import { 
  getImageUrl, 
  getProfileImageUrl, 
  getPostImageUrl,
  preloadImage 
} from '@shared/utils/images';

// Получить URL с fallback
const imageUrl = getImageUrl(user.profileImage);
const profileUrl = getProfileImageUrl(user.profileImage);
const postUrl = getPostImageUrl(post.imageUrl);

// Предзагрузить изображение
await preloadImage(imageUrl);
```

### 2. Компоненты изображений

#### Универсальный компонент Image

```typescript
import { Image } from '@shared/components';

<Image 
  src={post.imageUrl}
  alt="Post image"
  lazy={true}
  showPlaceholder={true}
  className="post-image"
/>
```

#### Компонент ProfileImage

```typescript
import { ProfileImage } from '@shared/components';

// С изображением
<ProfileImage 
  src={user.profileImage}
  size="large"
  alt={user.name}
/>

// Без изображения (показывает иконку)
<ProfileImage size="medium" alt="Default avatar" />
```

## Использование в компонентах

### Простое отображение

```typescript
function UserCard({ user }) {
  return (
    <div>
      <ProfileImage 
        src={user.profileImage}
        size="medium"
        alt={user.name}
      />
      <span>{user.name}</span>
    </div>
  );
}
```

### С обработкой ошибок

```typescript
function PostImage({ post }) {
  return (
    <Image
      src={post.imageUrl}
      alt={post.description}
      onError={() => console.log('Image failed to load')}
      className="w-full h-auto"
    />
  );
}
```

### Lazy loading для ленты

```typescript
function PostList({ posts }) {
  return (
    <div>
      {posts.map(post => (
        <Image
          key={post._id}
          src={post.imageUrl}
          alt={post.description}
          lazy={true}
          showPlaceholder={true}
        />
      ))}
    </div>
  );
}
```

## Преимущества созданной архитектуры

✅ **Готовые URL'ы** - backend возвращает полные S3 ссылки  
✅ **Fallback изображения** - автоматическая замена при ошибках  
✅ **Lazy loading** - оптимизация загрузки  
✅ **Placeholder'ы** - красивая загрузка  
✅ **TypeScript типы** - полная типизация  
✅ **Переиспользование** - готовые компоненты  

## Что происходит при загрузке

1. **Backend** загружает файл в S3
2. **Backend** возвращает полный URL: `https://bucket.s3.region.amazonaws.com/key`
3. **Frontend** использует URL напрямую в `<img src={url} />`
4. **Браузер** загружает изображение с S3

**Никаких преобразований не требуется!** 🚀