import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Grid, Card, CardContent, Skeleton, useTheme, useMediaQuery } from '@mui/material';
import { UtensilsCrossed as RestaurantIcon } from 'lucide-react';
import { Category, Item, useGetItemsQuery } from '../../../../api/customerApi';
import ItemCard from './ItemCard';

interface CategorySectionProps {
  category: Category;
  searchTerm: string;
  onItemClick: (itemId: number) => void;
  formatPrice: (price: number) => string;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  searchTerm,
  onItemClick,
  formatPrice,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { data: itemsData, isLoading: itemsLoading } = useGetItemsQuery({
    categoryId: category.categoryId,
    page: 0,
    size: 50
  });

  // Handle items data EXACTLY like original customer interface
  const items = Array.isArray(itemsData) ? itemsData : (itemsData?.content || []);

  // Filter items based on search term
  const filteredItems = items.filter((item: Item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.itemTagResponses && item.itemTagResponses.some((tagResponse: any) => 
      tagResponse.name.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  const itemsToShow = searchTerm ? filteredItems : items;
  
  // In search mode, don't render category if no items match
  if (searchTerm && filteredItems.length === 0) {
    return null;
  }

  return (
    <motion.div
      id={`category-${category.categoryId}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1 }}
    >
      <Box sx={{ mb: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Box
            sx={{
              mb: isMobile ? 3 : 4,
              py: isMobile ? 2 : 2.5,
              textAlign: 'center',
            }}
          >
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              sx={{
                color: '#FFFFFF',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                fontSize: isMobile ? '1.5rem' : '2rem',
                lineHeight: 1.2,
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 40,
                  height: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 1,
                },
              }}
            >
              {category.name}
            </Typography>
          </Box>
        </motion.div>

        {/*Items Grid */}
        {itemsLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Grid container spacing={2}>
              {Array.from({ length: 8 }).map((_, index) => (
                <Grid item xs={6} sm={6} md={4} lg={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.3,
                      delay: index * 0.02,
                      type: 'spring',
                      damping: 25,
                      stiffness: 120
                    }}
                  >
                    <Card sx={{ 
                      height: isMobile ? 240 : 320,
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      overflow: 'hidden',
                      background: 'linear-gradient(135deg, rgba(28, 28, 30, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 3,
                    }}>
                      {/* Image Area Skeleton - matches ItemCard image area */}
                      <Box sx={{ 
                        position: 'relative',
                        width: '100%',
                        height: isMobile ? '75%' : '80%',
                        flex: 'none',
                      }}>
                        <Skeleton 
                          variant="rectangular" 
                          width="100%"
                          height="100%"
                          sx={{ 
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: 0
                          }}
                        />
                        
                        {/* Price Badge Skeleton - matches ItemCard price position */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            zIndex: 2,
                          }}
                        >
                          <Skeleton 
                            variant="rectangular" 
                            width={isMobile ? 60 : 70}
                            height={isMobile ? 24 : 28}
                            sx={{ 
                              bgcolor: 'rgba(48, 209, 88, 0.3)',
                              borderRadius: 2
                            }}
                          />
                        </Box>

                        {/* Tags Area Skeleton - matches ItemCard tags position */}
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 8,
                            left: 8,
                            right: 8,
                            display: 'flex',
                            gap: 0.5,
                            zIndex: 1,
                          }}
                        >
                          <Skeleton 
                            variant="rectangular" 
                            width={40}
                            height={20}
                            sx={{ 
                              bgcolor: 'rgba(255, 255, 255, 0.2)',
                              borderRadius: 1
                            }}
                          />
                          <Skeleton 
                            variant="rectangular" 
                            width={50}
                            height={20}
                            sx={{ 
                              bgcolor: 'rgba(255, 255, 255, 0.2)',
                              borderRadius: 1
                            }}
                          />
                        </Box>
                      </Box>
                      
                      {/* Content Area Skeleton - matches ItemCard content area */}
                      <CardContent sx={{ 
                        p: isMobile ? 1.5 : 2, 
                        position: 'relative', 
                        zIndex: 1,
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        height: isMobile ? '25%' : '20%',
                      }}>
                        <Box sx={{ 
                          flex: 1, 
                          display: 'flex', 
                          flexDirection: 'column', 
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}>
                          <Skeleton 
                            variant="text" 
                            width="85%" 
                            height={isMobile ? 20 : 24}
                            sx={{ 
                              bgcolor: 'rgba(255, 255, 255, 0.1)',
                              mb: 0.5
                            }} 
                          />
                          <Skeleton 
                            variant="text" 
                            width="65%" 
                            height={isMobile ? 16 : 20}
                            sx={{ 
                              bgcolor: 'rgba(255, 255, 255, 0.08)'
                            }} 
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Grid container spacing={2}>
              {(searchTerm ? filteredItems : items).map((item: Item, index: number) => (
                <Grid 
                  item 
                  xs={6} 
                  sm={6} 
                  md={4} 
                  lg={3} 
                  key={item.itemId}
                >
                  <ItemCard
                    item={item}
                    index={index}
                    searchTerm={searchTerm}
                    onItemClick={onItemClick}
                    formatPrice={formatPrice}
                  />
                </Grid>
              ))}
              {itemsToShow.length === 0 && !searchTerm && (
                <Grid item xs={12}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box sx={{ 
                      textAlign: 'center',
                      py: 6,
                    }}>
                      <RestaurantIcon size={48} color="rgba(255, 255, 255, 0.3)" style={{ marginBottom: '16px' }} />
                      <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1, fontWeight: 500, fontSize: '1.1rem' }}>
                        Məhsul yoxdur
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.9rem' }}>
                        Bu kateqoriyada məhsul əlavə edilməyib
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              )}
            </Grid>
          </motion.div>
        )}
      </Box>
    </motion.div>
  );
};

export default CategorySection;