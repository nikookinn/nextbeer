import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardMedia, CardContent, Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { UtensilsCrossed as RestaurantIcon, Tag as LocalOfferIcon } from 'lucide-react';
import { Item } from '../../../../api/customerApi';
import { getFullImageUrl } from '../../../../utils/imageUtils';

interface ItemCardProps {
  item: Item;
  index: number;
  searchTerm: string;
  onItemClick: (itemId: number) => void;
  formatPrice: (price: number) => string;
}

// Helper function to get same icon for all tags
const getTagIcon = () => {
  return <LocalOfferIcon size={12} color="#000000" />;
};

const ItemCard: React.FC<ItemCardProps> = ({ item, index, searchTerm, onItemClick, formatPrice }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3,
        delay: searchTerm ? 0 : index * 0.02,
        type: 'spring',
        damping: 25,
        stiffness: 120
      }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2, type: 'spring', damping: 15 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        onClick={() => onItemClick(item.itemId)}
        sx={{
          height: isMobile ? 240 : 320,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, rgba(28, 28, 30, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 20px 40px rgba(255, 255, 255, 0.15)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            '&::after': {
              opacity: 1,
            },
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.1) 100%)',
            opacity: 0,
            transition: 'opacity 0.4s ease',
            pointerEvents: 'none',
          },
        }}
      >
        <Box sx={{ 
          position: 'relative',
          width: '100%',
          height: isMobile ? '75%' : '80%',
          flex: 'none',
        }}>
          {item.imageUrl ? (
            <CardMedia
              component="img"
              height="100%"
              image={getFullImageUrl(item.imageUrl) || ''}
              alt={item.name}
              sx={{
                objectFit: 'cover',
                filter: 'brightness(0.9)',
                transition: 'filter 0.4s ease',
              }}
            />
          ) : (
            <Box
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, rgba(44, 44, 46, 0.8) 0%, rgba(26, 26, 26, 0.8) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #30D158 0%, #0A84FF 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.8,
                }}
              >
                <RestaurantIcon size={24} color="#FFFFFF" />
              </Box>
            </Box>
          )}
          
          {/* Price on top-right corner */}
          {item.price > 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(48, 209, 88, 0.95)',
                color: '#FFFFFF',
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                fontSize: isMobile ? '0.8rem' : '0.9rem',
                fontWeight: 700,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                zIndex: 2,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              }}
            >
              {formatPrice(item.price)}
            </Box>
          )}
          
          {/* Elegant variant indicator when no price */}
          {item.price === 0 && item.itemVariantResponses && item.itemVariantResponses.length > 0 && (
            <Box
              onClick={(e) => {
                e.stopPropagation();
                // Handle variant selection
              }}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(0, 0, 0, 0.8)',
                color: '#FFFFFF',
                px: 1.5,
                py: 0.6,
                borderRadius: 2,
                fontSize: isMobile ? '0.7rem' : '0.75rem',
                fontWeight: 600,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                zIndex: 3,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.9)',
                  transform: 'scale(1.05)',
                },
              }}
            >
              {item.itemVariantResponses.length} variant
            </Box>
          )}
          
          {/* Tags at bottom of image with individual icons */}
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
              {item.itemTagResponses.slice(0, 3).map((tag: any, tagIndex: number) => (
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
        
        <CardContent sx={{ 
          p: isMobile ? 1.5 : 2, 
          position: 'relative', 
          zIndex: 1,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: isMobile ? '25%' : '20%',
        }}>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography
              variant={isMobile ? 'body1' : 'h6'}
              sx={{
                color: '#FFFFFF',
                fontWeight: 700,
                lineHeight: 1.2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textAlign: 'center',
                fontSize: isMobile ? '0.9rem' : '1rem',
              }}
            >
              {item.name}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ItemCard;