/**
 * Утилиты для работы с изображениями
 * Backend возвращает полные S3 URL'ы, поэтому преобразование не требуется
 */

export interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

/**
 * Получить URL изображения
 * В текущей реализации просто возвращает оригинальный URL,
 * но в будущем можно добавить преобразования через options
 */
export function getImageUrl(url: string | undefined): string {
  if (!url) {
    return getDefaultImage();
  }

  // Backend уже возвращает полные S3 URL'ы
  // В будущем здесь можно добавить логику для ресайзинга через CDN
  return url;
}

/**
 * Получить URL профильного изображения с fallback
 */
export function getProfileImageUrl(profileImage?: string): string {
  return getImageUrl(profileImage) || getDefaultProfileImage();
}

/**
 * Получить URL изображения поста с fallback
 */
export function getPostImageUrl(imageUrl?: string): string {
  return getImageUrl(imageUrl) || getDefaultPostImage();
}

/**
 * Дефолтное изображение профиля
 */
export function getDefaultProfileImage(): string {
  return '/default-avatar.png'; // Можно разместить в public/
}

/**
 * Дефолтное изображение поста
 */
export function getDefaultPostImage(): string {
  return '/default-post.png'; // Можно разместить в public/
}

/**
 * Дефолтное изображение
 */
export function getDefaultImage(): string {
  return '/placeholder.png'; // Можно разместить в public/
}

/**
 * Проверить, является ли URL изображением
 */
export function isImageUrl(url: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const lowercaseUrl = url.toLowerCase();
  return imageExtensions.some(ext => lowercaseUrl.includes(ext));
}

/**
 * Получить размеры изображения для разных устройств
 */
export function getResponsiveImageSizes(baseUrl: string): {
  mobile: string;
  tablet: string;
  desktop: string;
} {
  // В будущем можно реализовать генерацию разных размеров
  return {
    mobile: baseUrl,
    tablet: baseUrl,
    desktop: baseUrl,
  };
}

/**
 * Предзагрузить изображение
 */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Создать blur placeholder для lazy loading
 */
export function createBlurPlaceholder(width: number = 400, height: number = 400): string {
  // Простой SVG placeholder с blur эффектом
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="blur">
          <feGaussianBlur stdDeviation="10"/>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="#f0f0f0" filter="url(#blur)"/>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}