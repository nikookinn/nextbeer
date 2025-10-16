import React, { useState, useEffect } from 'react';
import { Fab, useTheme, useMediaQuery, Zoom } from '@mui/material';
import { ChevronUp } from 'lucide-react';

interface ScrollToTopButtonProps {
  /** Threshold in pixels to show the button */
  showThreshold?: number;
  /** Smooth scroll duration in milliseconds */
  scrollDuration?: number;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  showThreshold = 300,
  scrollDuration = 800,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Show/hide button based on scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > showThreshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Throttle scroll events for better performance
    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(toggleVisibility, 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Check initial scroll position
    toggleVisibility();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [showThreshold]);

  const scrollToTop = () => {
    if (isScrolling) return; // Prevent multiple clicks during scroll

    setIsScrolling(true);
    
    const startPosition = window.pageYOffset;
    const startTime = performance.now();

    // Smooth easing function (ease-out cubic)
    const easeOutCubic = (t: number): number => {
      return 1 - Math.pow(1 - t, 3);
    };

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / scrollDuration, 1);
      const easedProgress = easeOutCubic(progress);
      
      const currentPosition = startPosition * (1 - easedProgress);
      window.scrollTo(0, currentPosition);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        setIsScrolling(false);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  return (
    <Zoom in={isVisible} timeout={300}>
      <Fab
        onClick={scrollToTop}
        disabled={isScrolling}
        sx={{
          position: 'fixed',
          bottom: isMobile ? 24 : 32,
          right: isMobile ? 20 : 32,
          zIndex: 1100,
          width: isMobile ? 48 : 56,
          height: isMobile ? 48 : 56,
          
          // Apple-style premium design
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.3),
            0 2px 8px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          
          // Smooth transitions
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.15)',
            transform: 'translateY(-2px)',
            boxShadow: `
              0 12px 40px rgba(0, 0, 0, 0.4),
              0 4px 12px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.15)
            `,
          },
          
          '&:active': {
            transform: 'translateY(0px) scale(0.95)',
            transition: 'all 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
          },
          
          '&:disabled': {
            background: 'rgba(255, 255, 255, 0.05)',
            opacity: 0.6,
            transform: 'none',
          },
          
          // Mobile-specific adjustments
          ...(isMobile && {
            '&:hover': {
              // Reduce hover effects on mobile for better touch experience
              transform: 'none',
              background: 'rgba(255, 255, 255, 0.12)',
            },
          }),
        }}
        aria-label="Scroll to top"
      >
        <ChevronUp 
          size={isMobile ? 20 : 24} 
          color="#FFFFFF"
          style={{
            transition: 'transform 0.2s ease',
            transform: isScrolling ? 'scale(0.8)' : 'scale(1)',
          }}
        />
      </Fab>
    </Zoom>
  );
};

export default ScrollToTopButton;
