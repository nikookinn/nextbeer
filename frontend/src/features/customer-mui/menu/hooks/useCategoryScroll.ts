import { useState, useEffect, useRef } from 'react';
import { Category } from '../../../../api/customerApi';

export const useCategoryScroll = (categories: Category[], isMobile: boolean) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  const scrollToCategory = (categoryId: number) => {
    const element = document.getElementById(`category-${categoryId}`);
    if (!element) return;

    setIsUserScrolling(true);
    setSelectedCategoryId(categoryId);

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    const offset = isMobile ? 160 : 180;
    const elementTop = element.offsetTop;
    const targetPosition = elementTop - offset;

    window.scrollTo({
      top: Math.max(0, targetPosition),
      behavior: 'smooth'
    });

    // Reset user scrolling state after animation
    scrollTimeoutRef.current = window.setTimeout(() => {
      setIsUserScrolling(false);
    }, 800);
  };

  // Set first category as selected on load
  useEffect(() => {
    if (categories?.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].categoryId);
    }
  }, [categories, selectedCategoryId]);

  // Simple and reliable scroll detection
  useEffect(() => {
    if (!categories?.length) return;

    let ticking = false;

    const handleScroll = () => {
      if (isUserScrolling || ticking) return;

      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const viewportOffset = isMobile ? 200 : 220;
        const checkPosition = scrollY + viewportOffset;

        let activeCategory: Category | null = null;

        // Find which category section we're currently viewing
        for (let i = 0; i < categories.length; i++) {
          const category = categories[i];
          const element = document.getElementById(`category-${category.categoryId}`);
          
          if (!element) continue;

          const elementTop = element.offsetTop;
          const elementHeight = element.offsetHeight;
          const elementBottom = elementTop + elementHeight;

          // Check if we're in this category's area
          if (checkPosition >= elementTop && checkPosition < elementBottom) {
            activeCategory = category;
            break;
          }

          // Special case: if we're past the last category, select it
          if (i === categories.length - 1 && checkPosition >= elementTop) {
            activeCategory = category;
          }
        }

        // Update selected category if it changed
        if (activeCategory && activeCategory.categoryId !== selectedCategoryId) {
          setSelectedCategoryId(activeCategory.categoryId);
        }

        ticking = false;
      });
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [categories, selectedCategoryId, isUserScrolling, isMobile]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    selectedCategoryId,
    setSelectedCategoryId,
    scrollToCategory,
    isUserScrolling,
    setIsUserScrolling,
  };
};