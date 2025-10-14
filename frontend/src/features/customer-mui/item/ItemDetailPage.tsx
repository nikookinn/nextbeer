import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  IconButton,
  Skeleton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ArrowLeft as ArrowBackIcon,
  UtensilsCrossed as RestaurantIcon,
  Tag as LocalOfferIcon,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetItemByIdQuery } from '../../../api/customerApi';
import { getFullImageUrl } from '../../../utils/imageUtils';
import Footer from '../shared/Footer';

const ItemDetailPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  
  // Safely parse itemId
  const parsedItemId = itemId ? parseInt(itemId, 10) : null;
  const { data: item, isLoading, error } = useGetItemByIdQuery(parsedItemId!, {
    skip: !parsedItemId || isNaN(parsedItemId)
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBackClick = () => {
    // Go back to previous page safely
    navigate(-1);
  };

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} ₼`;
  };

  // Helper function to get same icon for all tags (same as menu detail)
  const getTagIcon = () => {
    return <LocalOfferIcon size="1em" color="#000000" />;
  };

  if (isLoading) {
    return (
      <Box sx={{ bgcolor: '#000000', minHeight: '100vh' }}>
        {/* Header Skeleton */}
        <Box
          sx={{
            bgcolor: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            py: isMobile ? 2.5 : 3.5,
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
              <Skeleton variant="text" width={200} height={40} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
            </Box>
          </Container>
        </Box>
        
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Skeleton variant="rectangular" height={isMobile ? 300 : 500} sx={{ borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.1)', mb: 3 }} />
          <Skeleton variant="text" width="60%" height={32} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', mb: 2 }} />
          <Skeleton variant="text" width="40%" height={24} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
        </Container>
      </Box>
    );
  }

  if (error || !item || !parsedItemId || isNaN(parsedItemId)) {
    return (
      <Box sx={{ bgcolor: '#000000', minHeight: '100vh' }}>
        {/* Header */}
        <Box
          sx={{
            bgcolor: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            py: isMobile ? 2.5 : 3.5,
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                onClick={handleBackClick}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                }}
              >
                <ArrowBackIcon size={20} />
              </IconButton>
              <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                Məhsul Tapılmadı
              </Typography>
            </Box>
          </Container>
        </Box>
        
        <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
          <RestaurantIcon size={80} color="#8E8E93" style={{ marginBottom: '16px' }} />
          <Typography variant="h5" sx={{ color: '#FFFFFF', mb: 1 }}>
            Məhsul Tapılmadı
          </Typography>
          <Typography variant="body1" sx={{ color: '#8E8E93' }}>
            Axtardığınız məhsul mövcud deyil
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#000000', minHeight: '100vh' }}>
      {/* Apple-Style Premium Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Box
          sx={{
            bgcolor: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            py: isMobile ? 2.5 : 3.5,
            position: 'relative',
            boxShadow: '0 1px 0 rgba(255, 255, 255, 0.05), 0 4px 20px rgba(0, 0, 0, 0.3)',
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 1.5 : 2 }}>
              <IconButton
                onClick={handleBackClick}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    transform: 'scale(1.02)',
                  },
                  '&:active': {
                    transform: 'scale(0.98)',
                  },
                }}
              >
                <ArrowBackIcon size={20} />
              </IconButton>
              <Box>
                <Typography
                  variant={isMobile ? 'h5' : 'h4'}
                  sx={{
                    color: '#FFFFFF',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    fontSize: isMobile ? '1.5rem' : '2rem',
                    lineHeight: 1.2,
                  }}
                >
                  {item.name}
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      </motion.div>

      {/* Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card
            sx={{
              bgcolor: 'rgba(28, 28, 30, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 12px 24px rgba(0, 0, 0, 0.15)',
            }}
          >
            {isMobile ? (
              // Mobile Layout
              <Box>
                {/* Mobile Image */}
                <Box sx={{ position: 'relative' }}>
                  {item.imageUrl ? (
                    <CardMedia
                      component="img"
                      height={300}
                      image={getFullImageUrl(item.imageUrl) || ''}
                      alt={item.name}
                      sx={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(44, 44, 46, 0.5)' }}>
                      <RestaurantIcon size={80} color="#8E8E93" />
                    </Box>
                  )}
                  
                  {/* Mobile Tags at bottom - Same as menu detail */}
                  {item.itemTagResponses && item.itemTagResponses.length > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        left: 8,
                        right: 8,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 0.5,
                        zIndex: 1,
                      }}
                    >
                      {item.itemTagResponses.slice(0, 3).map((tag, tagIndex) => (
                        <Box
                          key={tagIndex}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.3,
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            color: '#000000',
                            px: 0.6,
                            py: 0.3,
                            borderRadius: 1,
                            fontSize: '0.55rem',
                            fontWeight: 600,
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
                          }}
                        >
                          <Box sx={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center' }}>
                            {getTagIcon()}
                          </Box>
                          <Typography sx={{ fontSize: '0.55rem', fontWeight: 600 }}>
                            {tag.name}
                          </Typography>
                        </Box>
                      ))}
                      {item.itemTagResponses.length > 3 && (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            color: '#000000',
                            px: 0.6,
                            py: 0.3,
                            borderRadius: 1,
                            fontSize: '0.55rem',
                            fontWeight: 600,
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                          }}
                        >
                          +{item.itemTagResponses.length - 3}
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>

                {/* Mobile Info */}
                <Box sx={{ p: 3 }}>
                  {/* Price or Variants */}
                  {item.price > 0 ? (
                    <Box sx={{ mb: 3 }}>
                      <Typography sx={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 500, mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Qiymət
                      </Typography>
                      <Typography sx={{ fontSize: '2.5rem', fontWeight: 700, color: '#30D158', fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                        {formatPrice(item.price)}
                      </Typography>
                    </Box>
                  ) : item.itemVariantResponses && item.itemVariantResponses.length > 0 ? (
                    <Box sx={{ mb: 3 }}>
                      <Typography sx={{ fontSize: '1.1rem', color: '#FFFFFF', fontWeight: 600, mb: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Mövcud Seçimlər
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {item.itemVariantResponses.map((variant) => (
                          <Box
                            key={variant.variantId}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              p: 2.5,
                              bgcolor: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: 3,
                              backdropFilter: 'blur(10px)',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.08)',
                                borderColor: 'rgba(255, 255, 255, 0.15)',
                              },
                            }}
                          >
                            <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: '#FFFFFF' }}>
                              {variant.name}
                            </Typography>
                            <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: variant.price === 0 ? '#FF9F0A' : '#30D158' }}>
                              {variant.price === 0 ? 'n/a' : formatPrice(variant.price)}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ) : null}

                  {/* Description */}
                  {item.description && (
                    <Box>
                      <Typography sx={{ fontSize: '1.1rem', color: '#FFFFFF', fontWeight: 600, mb: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Təsvir
                      </Typography>
                      <Typography sx={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6 }}>
                        {item.description}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            ) : (
              // Desktop Layout
              <Box sx={{ display: 'flex', minHeight: 600 }}>
                {/* Left - Image */}
                <Box sx={{ flex: 1.2, position: 'relative' }}>
                  {item.imageUrl ? (
                    <CardMedia
                      component="img"
                      height="100%"
                      image={getFullImageUrl(item.imageUrl) || ''}
                      alt={item.name}
                      sx={{ objectFit: 'cover', minHeight: 600, width: '100%' }}
                    />
                  ) : (
                    <Box sx={{ height: '100%', minHeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(44, 44, 46, 0.5)' }}>
                      <RestaurantIcon size={120} color="#8E8E93" />
                    </Box>
                  )}
                  
                  {/* Desktop Tags at bottom - Same as menu detail */}
                  {item.itemTagResponses && item.itemTagResponses.length > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 12,
                        left: 12,
                        right: 12,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 0.8,
                        zIndex: 1,
                      }}
                    >
                      {item.itemTagResponses.slice(0, 4).map((tag, tagIndex) => (
                        <Box
                          key={tagIndex}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            color: '#000000',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1.5,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                          }}
                        >
                          <Box sx={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>
                            {getTagIcon()}
                          </Box>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
                            {tag.name}
                          </Typography>
                        </Box>
                      ))}
                      {item.itemTagResponses.length > 4 && (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            color: '#000000',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1.5,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                          }}
                        >
                          +{item.itemTagResponses.length - 4}
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>

                {/* Right - Info */}
                <Box sx={{ flex: 1, p: 6, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}>
                  {/* Price or Variants */}
                  {item.price > 0 ? (
                    <Box>
                      <Typography sx={{ fontSize: '1.2rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 500, mb: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Qiymət
                      </Typography>
                      <Typography sx={{ fontSize: '4rem', fontWeight: 700, color: '#30D158', fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif', lineHeight: 1 }}>
                        {formatPrice(item.price)}
                      </Typography>
                    </Box>
                  ) : item.itemVariantResponses && item.itemVariantResponses.length > 0 ? (
                    <Box>
                      <Typography sx={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 600, mb: 3, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Mövcud Seçimlər
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {item.itemVariantResponses.map((variant) => (
                          <Box
                            key={variant.variantId}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              p: 3,
                              bgcolor: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: 3,
                              backdropFilter: 'blur(10px)',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.08)',
                                borderColor: 'rgba(255, 255, 255, 0.15)',
                                transform: 'translateX(5px)',
                              },
                            }}
                          >
                            <Typography sx={{ fontSize: '1.2rem', fontWeight: 500, color: '#FFFFFF' }}>
                              {variant.name}
                            </Typography>
                            <Typography sx={{ fontSize: '1.4rem', fontWeight: 700, color: variant.price === 0 ? '#FF9F0A' : '#30D158' }}>
                              {variant.price === 0 ? 'N/A' : formatPrice(variant.price)}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ) : null}

                  {/* Description */}
                  {item.description && (
                    <Box>
                      <Typography sx={{ fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 600, mb: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Təsvir
                      </Typography>
                      <Typography sx={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.7, fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                        {item.description}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </Card>
        </motion.div>
      </Container>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default ItemDetailPage;
