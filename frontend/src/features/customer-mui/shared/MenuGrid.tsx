import React from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Skeleton,
} from '@mui/material';
import {
  UtensilsCrossed as RestaurantIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetMenusQuery } from '../../../api/customerApi';
import { getFullImageUrl } from '../../../utils/imageUtils';

const MenuGrid: React.FC = () => {
  const navigate = useNavigate();
  
  const { data: menusData, isLoading, error } = useGetMenusQuery({ page: 0, size: 20 });
  
  // Handle paginated response like original customer interface
  const menus = menusData?.content || [];

  const handleMenuClick = (menuId: number) => {
    navigate(`/menu/${menuId}`);
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
              <Card sx={{ bgcolor: '#1C1C1E', borderRadius: 3 }}>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error || menus.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Card
          sx={{
            bgcolor: '#1C1C1E',
            border: '1px solid #2C2C2E',
            borderRadius: 3,
            textAlign: 'center',
            py: 6,
          }}
        >
          <Box sx={{ fontSize: 64, color: '#8E8E93', mb: 2 }}>
          <RestaurantIcon size={64} color="#8E8E93" />
          </Box>
          <Typography variant="h5" sx={{ color: '#FFFFFF', mb: 1 }}>
            Menyu Yoxdur
          </Typography>
          <Typography variant="body1" sx={{ color: '#8E8E93' }}>
            Hazırda mövcud menyu yoxdur
          </Typography>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Grid container spacing={3}>
        {menus.map((menu) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={menu.menuId}>
            <Card
              onClick={() => handleMenuClick(menu.menuId)}
              sx={{
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #1C1C1E 0%, #000000 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 4,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, #0A84FF, #30D158, #FF9F0A)',
                },
                '&:hover': {
                  transform: 'translateY(-12px)',
                  boxShadow: '0 25px 60px rgba(10, 132, 255, 0.25)',
                  borderColor: 'rgba(10, 132, 255, 0.5)',
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
                  background: 'linear-gradient(135deg, rgba(10, 132, 255, 0.1) 0%, rgba(48, 209, 88, 0.1) 100%)',
                  opacity: 0,
                  transition: 'opacity 0.4s ease',
                  pointerEvents: 'none',
                },
              }}
            >
              {menu.imageUrl ? (
                <CardMedia
                  component="img"
                  height={220}
                  image={getFullImageUrl(menu.imageUrl) || ''}
                  alt={menu.name}
                  sx={{
                    objectFit: 'cover',
                    filter: 'brightness(0.9)',
                    transition: 'filter 0.4s ease',
                    '&:hover': {
                      filter: 'brightness(1.1)',
                    },
                  }}
                />
              ) : (
                <Box
                  sx={{
                    height: 220,
                    background: 'linear-gradient(135deg, #2C2C2E 0%, #1A1A1A 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0A84FF 0%, #30D158 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0.8,
                    }}
                  >
                    <Box sx={{ fontSize: 40, color: '#FFFFFF', mb: 2 }}>
                    <RestaurantIcon size={640} color="#FFFFFF" />
                    </Box>
                  </Box>
                </Box>
              )}
              
              <CardContent sx={{ p: 2.5, position: 'relative', zIndex: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#FFFFFF',
                    fontWeight: 700,
                    mb: 1.5,
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #0A84FF 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.3,
                  }}
                >
                  {menu.name}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontWeight: 500,
                    }}
                  >
                    Kəşf Et
                  </Typography>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0A84FF 0%, #30D158 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <Typography sx={{ color: '#FFFFFF', fontSize: '1.2rem' }}>→</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MenuGrid;
