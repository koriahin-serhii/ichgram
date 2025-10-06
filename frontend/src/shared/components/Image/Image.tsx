import { useState } from 'react';
import type { ImgHTMLAttributes } from 'react';
import { getImageUrl, getDefaultImage, createBlurPlaceholder } from '@shared/utils/images';
import styles from './Image.module.css';

interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string;
  fallback?: string;
  showPlaceholder?: boolean;
  lazy?: boolean;
}

export default function Image({
  src,
  fallback,
  showPlaceholder = true,
  lazy = true,
  className,
  alt = '',
  ...props
}: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const imageUrl = getImageUrl(src);
  const finalUrl = hasError ? (fallback || getDefaultImage()) : imageUrl;

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      {isLoading && showPlaceholder && (
        <img
          src={createBlurPlaceholder()}
          alt="Loading..."
          className={styles.placeholder}
        />
      )}
      
      <img
        src={finalUrl}
        alt={alt}
        loading={lazy ? 'lazy' : 'eager'}
        onLoad={handleLoad}
        onError={handleError}
        className={`${styles.image} ${isLoading ? styles.loading : styles.loaded}`}
        {...props}
      />
    </div>
  );
}