import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { UtensilsCrossed as RestaurantIcon } from 'lucide-react';
import { Category, useGetItemsQuery } from '../../../../api/customerApi';
import CategorySection from './CategorySection';

interface SearchResultsProps {
  categories: Category[];
  searchTerm: string;
  onItemClick: (itemId: number) => void;
  formatPrice: (price: number) => string;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  categories,
  searchTerm,
  onItemClick,
  formatPrice,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Get items for all categories to check for search results
  const categoryQueries = categories.map(category => {
    const { data: itemsData, isLoading } = useGetItemsQuery({
      categoryId: category.categoryId,
      page: 0,
      size: 50
    });
    
    const items = Array.isArray(itemsData) ? itemsData : (itemsData?.content || []);
    
    return {
      category,
      items,
      isLoading
    };
  });
  
  // Check if any category has matching items when searching
  const hasSearchResults = useMemo(() => {
    if (!searchTerm) return true; // Always show content when not searching
    
    return categoryQueries.some(({ items, isLoading }) => {
      if (isLoading) return false; // Don't count loading categories
      
      return items.some((item: any) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.itemTagResponses && item.itemTagResponses.some((tagResponse: any) => 
          tagResponse.name.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    });
  }, [searchTerm, categoryQueries]);
  
  // Check if all categories are loaded
  const allCategoriesLoaded = categoryQueries.every(({ isLoading }) => !isLoading);

  // If no search term, show all categories normally
  if (!searchTerm) {
    return (
      <>
        {categories.map((category: Category) => (
          <CategorySection
            key={category.categoryId}
            category={category}
            searchTerm={searchTerm}
            onItemClick={onItemClick}
            formatPrice={formatPrice}
          />
        ))}
      </>
    );
  }


  // When searching, render all categories (they will return null if no matches)
  const categoryComponents = categories.map((category) => (
    <CategorySection
      key={category.categoryId}
      category={category}
      searchTerm={searchTerm}
      onItemClick={onItemClick}
      formatPrice={formatPrice}
    />
  ));

  // If searching and all categories loaded but no results found, show message
  if (searchTerm && allCategoriesLoaded && !hasSearchResults) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Box sx={{ 
          textAlign: 'center', 
          py: isMobile ? 6 : 8,
          px: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '40vh'
        }}>
          {/* Professional Icon with Gradient Background */}
          <Box
            sx={{
              width: isMobile ? 80 : 96,
              height: isMobile ? 80 : 96,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <RestaurantIcon 
              size={isMobile ? 40 : 48} 
              color="rgba(255, 255, 255, 0.4)" 
            />
          </Box>

          {/* Main Message */}
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#FFFFFF', 
              mb: 1.5,
              fontWeight: 700,
              fontSize: isMobile ? '1.4rem' : '1.6rem',
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}
          >
            Məhsul tapılmadı
          </Typography>

          {/* Search Term Display */}
          <Box
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              px: 2,
              py: 0.8,
              borderRadius: 2,
              mb: 2,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: isMobile ? '0.85rem' : '0.9rem',
                fontWeight: 500,
                fontFamily: 'monospace'
              }}
            >
              "{searchTerm}"
            </Typography>
          </Box>

          {/* Descriptive Text */}
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: isMobile ? '0.9rem' : '1rem',
              maxWidth: 420,
              mx: 'auto',
              lineHeight: 1.5,
              textAlign: 'center'
            }}
          >
            Axtardığınız məhsul mövcud deyil. Başqa açar sözlər istifadə edərək yenidən cəhd edin.
          </Typography>

          {/* Suggestion Text */}
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.4)',
              fontSize: isMobile ? '0.8rem' : '0.85rem',
              mt: 2,
              fontStyle: 'italic'
            }}
          >
            Bütün kateqoriyalarda axtarış aparıldı
          </Typography>
        </Box>
      </motion.div>
    );
  }

  return <>{categoryComponents}</>;
};

export default SearchResults;