import React, { useRef, useEffect } from 'react';
import { Box, Typography, Skeleton, useTheme, useMediaQuery } from '@mui/material';
import { Category } from '../../../../api/customerApi';

interface CategoryPillsProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onCategoryClick: (categoryId: number) => void;
  loading?: boolean;
  error?: any;
}

const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  selectedCategoryId,
  onCategoryClick,
  loading = false,
  error = null,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll selected category into view
  useEffect(() => {
    if (selectedCategoryId && containerRef.current) {
      const selectedButton = containerRef.current.querySelector(`[data-category-id="${selectedCategoryId}"]`) as HTMLElement;
      if (selectedButton) {
        selectedButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [selectedCategoryId]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        gap: 1, 
        overflowX: 'auto', 
        pb: 1,
        mx: isMobile ? -2 : 0,
        px: isMobile ? 2 : 0,
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
      }}>
        {[1, 2, 3, 4].map((item) => (
          <Skeleton 
            key={item} 
            variant="rectangular" 
            width={100} 
            height={36} 
            sx={{ 
              borderRadius: 2.5, 
              flexShrink: 0,
              bgcolor: 'rgba(255, 255, 255, 0.08)'
            }} 
          />
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center', py: 2, fontSize: '0.9rem' }}>
        Kateqoriyalar yüklənə bilmədi
      </Typography>
    );
  }

  return (
    <Box 
      ref={containerRef}
      sx={{ 
        display: 'flex',
        gap: 1,
        overflowX: 'auto',
        pb: 1,
        mx: isMobile ? -2 : 0,
        px: isMobile ? 2 : 0,
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
      }}>
      {categories.map((category: Category) => (
        <Box
          key={category.categoryId}
          data-category-id={category.categoryId}
          onClick={() => onCategoryClick(category.categoryId)}
          sx={{
            bgcolor: selectedCategoryId === category.categoryId 
              ? 'rgba(255, 255, 255, 0.2)' 
              : 'rgba(255, 255, 255, 0.08)',
            color: selectedCategoryId === category.categoryId 
              ? '#FFFFFF' 
              : 'rgba(255, 255, 255, 0.7)',
            border: selectedCategoryId === category.categoryId 
              ? '1px solid rgba(255, 255, 255, 0.3)' 
              : '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 2.5,
            px: isMobile ? 2 : 2.5,
            py: isMobile ? 1 : 1.2,
            minWidth: 'auto',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            fontSize: isMobile ? '0.85rem' : '0.9rem',
            fontWeight: selectedCategoryId === category.categoryId ? 600 : 500,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              bgcolor: selectedCategoryId === category.categoryId 
                ? 'rgba(255, 255, 255, 0.25)' 
                : 'rgba(255, 255, 255, 0.12)',
              borderColor: selectedCategoryId === category.categoryId 
                ? 'rgba(255, 255, 255, 0.4)' 
                : 'rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              transform: 'scale(1.02)',
            },
            '&:active': {
              transform: 'scale(0.98)',
            },
          }}
        >
          {category.name}
        </Box>
      ))}
    </Box>
  );
};

export default CategoryPills;