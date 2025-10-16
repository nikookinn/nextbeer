import React, { useState, useEffect, Suspense, lazy } from 'react';
import {
  Box,
  Container,
  Typography,
  Skeleton,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import { UtensilsCrossed as RestaurantIcon } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

// Lazy load heavy components
const Footer = lazy(() => import('../shared/Footer'));

// Custom Hooks
import { useMenuData } from './hooks/useMenuData';
import { useCategoryScroll } from './hooks/useCategoryScroll';

// Lazy load components to reduce initial bundle
const MenuHeader = lazy(() => import('./components/MenuHeader'));
const SearchBar = lazy(() => import('./components/SearchBar'));
const CategoryPills = lazy(() => import('./components/CategoryPills'));
const SearchResults = lazy(() => import('./components/SearchResults'));
const ScrollToTopButton = lazy(() => import('./components/ScrollToTopButton'));

const FixedMenuDetailPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { menuId } = useParams<{ menuId: string }>();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');

  // Custom hooks for data and scroll management
  const { currentMenu, categories, categoriesLoading, categoriesError } = useMenuData(menuId);
  const { selectedCategoryId, scrollToCategory } = useCategoryScroll(categories, isMobile);

  const handleBackClick = () => {
    navigate('/', { state: { scrollTo: 'menus' } });
  };

  const handleItemClick = (itemId: number) => {
    // Save current scroll position before navigating
    sessionStorage.setItem('menuDetailScrollPosition', window.scrollY.toString());
    navigate(`/item/${itemId}`);
  };

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} ₼`;
  };

  // Handle scroll restoration when coming back from item detail
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('menuDetailScrollPosition');
    if (savedScrollPosition) {
      // Restore scroll position after a short delay to ensure content is loaded
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollPosition));
        // Clear the saved position
        sessionStorage.removeItem('menuDetailScrollPosition');
      }, 100);
    } else {
      // Only scroll to top if no saved position (fresh page load)
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <Box sx={{ bgcolor: '#000000', minHeight: '100vh' }}>
      {/* Header */}
      <Suspense fallback={
        <Box sx={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress size={24} />
        </Box>
      }>
        <MenuHeader currentMenu={currentMenu} onBackClick={handleBackClick} />
      </Suspense>

      {/* Sticky Search & Categories */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          bgcolor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 1px 0 rgba(255, 255, 255, 0.05), 0 8px 32px rgba(0, 0, 0, 0.3)',
          // Prevent layout shifts on mobile
          minHeight: 'fit-content',
          WebkitTransform: 'translateZ(0)', // Force hardware acceleration
          transform: 'translateZ(0)',
        }}
      >
        <Container 
          maxWidth="lg" 
          disableGutters={isMobile}
          sx={{
            px: isMobile ? 2 : 3,
          }}
        >
          <Box sx={{ 
            py: isMobile ? 2 : 2.5,
          }}>
            <Suspense fallback={<Skeleton variant="rectangular" height={48} sx={{ mb: 2 }} />}>
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
            </Suspense>
            <Suspense fallback={<Skeleton variant="rectangular" height={40} />}>
              <CategoryPills
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onCategoryClick={scrollToCategory}
                loading={categoriesLoading}
                error={categoriesError}
              />
            </Suspense>
          </Box>
        </Container>
      </Box>

      {/* Categories Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {categoriesLoading ? (
          <Box>
            <Typography sx={{ color: '#FFFFFF', mb: 2 }}>Loading categories...</Typography>
            {[1, 2, 3].map((item) => (
              <Box key={item} sx={{ mb: 4 }}>
                <Skeleton variant="text" width="30%" height={40} sx={{ mb: 2 }} />
                {/* Loading skeletons handled inside CategorySection */}
              </Box>
            ))}
          </Box>
        ) : categoriesError ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography sx={{ color: '#FF453A', mb: 2, fontSize: '1.2rem' }}>
              ❌ Categories Error
            </Typography>
            <Typography sx={{ color: '#8E8E93', mb: 2 }}>
              {JSON.stringify(categoriesError)}
            </Typography>
            <Typography sx={{ color: '#8E8E93' }}>
              Zəhmət olmasa daha sonra yenidən cəhd edin
            </Typography>
          </Box>
        ) : categories.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <RestaurantIcon size={64} color="#8E8E93" style={{ marginBottom: '16px' }} />
            <Typography sx={{ color: '#FFFFFF', mb: 1, fontSize: '1.5rem' }}>
              No Categories Found
            </Typography>
            <Typography sx={{ color: '#8E8E93' }}>
              Menu ID: {menuId} - No categories available for this menu
            </Typography>
          </Box>
        ) : (
          <Suspense fallback={
            <Box sx={{ py: 4 }}>
              {[1, 2, 3].map((item) => (
                <Box key={item} sx={{ mb: 6 }}>
                  {/* Category Header Skeleton */}
                  <Box sx={{ mb: isMobile ? 3 : 4, py: isMobile ? 2 : 2.5, textAlign: 'center' }}>
                    <Skeleton 
                      variant="text" 
                      width="30%" 
                      height={isMobile ? 36 : 48} 
                      sx={{ 
                        mb: 2, 
                        mx: 'auto',
                        bgcolor: 'rgba(255, 255, 255, 0.1)' 
                      }} 
                    />
                  </Box>
                  
                  {/* Items Grid Skeleton */}
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: {
                      xs: 'repeat(2, 1fr)',
                      sm: 'repeat(2, 1fr)', 
                      md: 'repeat(3, 1fr)',
                      lg: 'repeat(4, 1fr)'
                    }, 
                    gap: 2 
                  }}>
                    {[1, 2, 3, 4].map((card) => (
                      <Skeleton 
                        key={card} 
                        variant="rectangular" 
                        height={isMobile ? 240 : 320} 
                        sx={{ 
                          borderRadius: 3,
                          bgcolor: 'rgba(255, 255, 255, 0.1)' 
                        }} 
                      />
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          }>
            <SearchResults
              categories={categories}
              searchTerm={searchTerm}
              onItemClick={handleItemClick}
              formatPrice={formatPrice}
            />
          </Suspense>
        )}
      </Container>

      {/* Footer Component */}
      <Suspense fallback={
        <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress size={24} />
        </Box>
      }>
        <Footer />
      </Suspense>

      {/* Scroll to Top Button */}
      <Suspense fallback={null}>
        <ScrollToTopButton showThreshold={400} scrollDuration={600} />
      </Suspense>
    </Box>
  );
};

export default FixedMenuDetailPage;