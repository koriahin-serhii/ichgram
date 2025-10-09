import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Store scroll positions for each path
const scrollPositions = new Map<string, number>();

export function useScrollRestoration() {
  const location = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Restore scroll position for this path
    const savedPosition = scrollPositions.get(location.pathname);
    if (savedPosition !== undefined) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        container.scrollTop = savedPosition;
      }, 0);
    } else {
      // New page, scroll to top
      container.scrollTop = 0;
    }

    // Save scroll position when scrolling
    const handleScroll = () => {
      scrollPositions.set(location.pathname, container.scrollTop);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  return scrollContainerRef;
}
