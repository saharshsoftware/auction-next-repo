import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface UseScrollToTopOptions {
  /**
   * Whether to scroll to top on route change
   * @default true
   */
  scrollOnRouteChange?: boolean;
  
  /**
   * Whether to scroll to top on search params change
   * @default true
   */
  scrollOnSearchChange?: boolean;
  
  /**
   * Whether to preserve scroll position when going back
   * @default true
   */
  preserveOnBack?: boolean;
  
  /**
   * Scroll behavior
   * @default 'smooth'
   */
  behavior?: ScrollBehavior;
}

export const useScrollToTop = (options: UseScrollToTopOptions = {}) => {
  const {
    scrollOnRouteChange = true,
    scrollOnSearchChange = true,
    preserveOnBack = true,
    behavior = 'smooth'
  } = options;

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPathRef = useRef<string>('');
  const previousSearchRef = useRef<string>('');
  const isBackNavigationRef = useRef(false);

  useEffect(() => {
    // Check if this is a back navigation
    const currentPath = pathname + searchParams.toString();
    const isBackNavigation = currentPath === previousPathRef.current;
    isBackNavigationRef.current = isBackNavigation;

    // Update previous path for next comparison
    previousPathRef.current = currentPath;
    previousSearchRef.current = searchParams.toString();
  }, [pathname, searchParams]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Don't scroll if this is a back navigation and we want to preserve position
    if (isBackNavigationRef.current && preserveOnBack) {
      return;
    }

    // Scroll to top on route change
    if (scrollOnRouteChange) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior
      });
    }
  }, [pathname, scrollOnRouteChange, preserveOnBack, behavior]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Don't scroll if this is a back navigation and we want to preserve position
    if (isBackNavigationRef.current && preserveOnBack) {
      return;
    }

    // Scroll to top on search params change (like pagination)
    if (scrollOnSearchChange) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior
      });
    }
  }, [searchParams, scrollOnSearchChange, preserveOnBack, behavior]);

  // Function to manually scroll to top
  const scrollToTop = (customBehavior?: ScrollBehavior) => {
    if (typeof window === 'undefined') return;
    
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: customBehavior || behavior
    });
  };

  return { scrollToTop };
};
