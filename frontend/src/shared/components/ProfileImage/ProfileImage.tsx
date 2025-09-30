import Image from '../Image/Image';
import { getProfileImageUrl } from '@shared/utils/images';
import ProfileIcon from '@assets/icons/profile.svg?react';
import styles from './ProfileImage.module.css';

interface ProfileImageProps {
  src?: string;
  alt?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function ProfileImage({
  src,
  alt = 'Profile',
  size = 'medium',
  className,
}: ProfileImageProps) {
  const sizeClass = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  }[size];

  if (!src) {
    return (
      <div className={`${styles.placeholder} ${sizeClass} ${className || ''}`}>
        <ProfileIcon className={styles.icon} />
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${sizeClass} ${className || ''}`}>
      <Image
        src={getProfileImageUrl(src)}
        alt={alt}
        className={styles.image}
        fallback={undefined} // Используем компонент с иконкой при ошибке
      />
    </div>
  );
}