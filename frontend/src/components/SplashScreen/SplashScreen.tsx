import { useEffect, useState } from 'react';
import styles from './SplashScreen.module.css';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number; // in milliseconds
}

export default function SplashScreen({ onComplete, duration = 2000 }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Start fade out animation before hiding
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, duration - 500); // Start fading 500ms before duration ends

    // Hide splash screen and call onComplete
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, duration);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`${styles.container} ${isFadingOut ? styles.fadeOut : ''}`}>
      <div className={styles.content}>
        {/* Logo image */}
        <div className={styles.logoContainer}>
          <div className={styles.iconWrapper}>
            {/* Camera icon with gradient circles */}
            <svg width="120" height="120" viewBox="0 0 120 120" className={styles.icon}>
              <defs>
                <linearGradient id="iconGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF1493" />
                  <stop offset="50%" stopColor="#9D4EDD" />
                  <stop offset="100%" stopColor="#00D4FF" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {/* Outer rounded square */}
              <rect 
                x="10" y="10" 
                width="100" height="100" 
                rx="25" 
                fill="none" 
                stroke="url(#iconGradient1)" 
                strokeWidth="4"
                filter="url(#glow)"
              />
              {/* Inner circles */}
              <circle cx="60" cy="60" r="30" fill="none" stroke="url(#iconGradient1)" strokeWidth="4" filter="url(#glow)" />
              <circle cx="60" cy="60" r="18" fill="none" stroke="url(#iconGradient1)" strokeWidth="3" filter="url(#glow)" />
              <circle cx="60" cy="60" r="8" fill="url(#iconGradient1)" filter="url(#glow)" />
            </svg>
          </div>
          
          {/* SKYJECTIV text with gradient */}
          <svg 
            width="400" 
            height="100" 
            viewBox="0 0 400 100" 
            className={styles.logoText}
          >
            <defs>
              <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF1493" />
                <stop offset="25%" stopColor="#E91E8C" />
                <stop offset="50%" stopColor="#9D4EDD" />
                <stop offset="75%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#00D4FF" />
              </linearGradient>
              <filter id="textGlow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <text
              x="200"
              y="60"
              fontFamily="'Segoe UI', 'Roboto', 'Arial', sans-serif"
              fontSize="48"
              fontWeight="700"
              fill="url(#textGradient)"
              textAnchor="middle"
              letterSpacing="2"
              filter="url(#textGlow)"
            >
              SKYJECTIV
            </text>
          </svg>
        </div>
        
        {/* Loading spinner */}
        <div className={styles.spinner}></div>
      </div>
    </div>
  );
}
