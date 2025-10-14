import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number; // Distance from bottom to trigger load (in pixels)
  rootMargin?: string; // Intersection observer root margin
}

interface UseInfiniteScrollReturn {
  isFetching: boolean;
  setIsFetching: (fetching: boolean) => void;
  lastElementRef: (node: HTMLElement | null) => void;
}

export const useInfiniteScroll = (
  hasNextPage: boolean,
  fetchNextPage: () => void,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn => {
  const { rootMargin = '50px' } = options; // Slightly increased for better UX
  const [isFetching, setIsFetching] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastTriggerTime = useRef<number>(0);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isFetching) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          const now = Date.now();
          const entry = entries[0];
          // Prevent rapid firing - minimum 300ms between triggers
          if (entry.isIntersecting && hasNextPage && !isFetching && (now - lastTriggerTime.current > 300)) {
            console.log('🔄 Infinite Scroll - Loading next page...', {
              hasNextPage,
              isFetching,
              timeSinceLastTrigger: now - lastTriggerTime.current
            });
            lastTriggerTime.current = now;
            setIsFetching(true);
            // Small delay for smooth UX
            setTimeout(() => {
              fetchNextPage();
            }, 150);
          } else if (entry.isIntersecting) {
            console.log('🚫 Infinite Scroll - Skipped trigger', {
              hasNextPage,
              isFetching,
              timeSinceLastTrigger: now - lastTriggerTime.current
            });
          }
        },
        {
          rootMargin,
          threshold: 0.1,
        }
      );

      if (node) observer.current.observe(node);
    },
    [isFetching, hasNextPage, fetchNextPage, rootMargin]
  );

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return { isFetching, setIsFetching, lastElementRef };
};
