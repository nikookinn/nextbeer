import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Skeleton,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Tag as OfferIcon,
} from 'lucide-react';
// React Icons - Premium navigation
import { 
  ChevronLeft as HiOutlineChevronLeft,
  ChevronRight as HiOutlineChevronRight
} from 'lucide-react';
import { useGetCampaignsQuery, Campaign } from '../../../api/customerApi';
import { getFullImageUrl } from '../../../utils/imageUtils';

const CampaignCarousel: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const { data: campaignsData, isLoading, error } = useGetCampaignsQuery({ page: 0, size: 100 });
  
  // Handle paginated response like original customer interface
  const campaigns = campaignsData?.content || [];

  // Auto-slide functionality - Slower timing
  useEffect(() => {
    if (campaigns.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % campaigns.length);
    }, 10000); // Increased to 10 seconds for smooth transitions

    return () => clearInterval(interval);
  }, [campaigns.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + campaigns.length) % campaigns.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % campaigns.length);
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
          {[1, 2, 3].map((item) => (
            <Card key={item} sx={{ minWidth: 300, bgcolor: '#1C1C1E' }}>
              <Skeleton variant="rectangular" height={200} />
              <CardContent>
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="60%" />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    );
  }

  if (error || campaigns.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Card
          sx={{
            bgcolor: '#1C1C1E',
            border: '1px solid #2C2C2E',
            borderRadius: 3,
            textAlign: 'center',
            py: 4,
          }}
        >
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <OfferIcon size={48} color="#8E8E93" />
          </Box>
          <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 1 }}>
            Kampanya Yoxdur
          </Typography>
          <Typography variant="body2" sx={{ color: '#8E8E93' }}>
            Hazırda aktiv kampanya mövcud deyil
          </Typography>
        </Card>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '1400px', 
      margin: '0 auto', 
      padding: { xs: '0.5rem 0.5rem', md: '1rem 1rem' },
      position: 'relative'
    }}>
      {/* Carousel Container */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '1200px',
          height: { xs: '500px', md: '550px' },
          margin: '0 auto',
          padding: { xs: '15px 30px', md: '20px 80px' },
          overflow: 'visible',
          position: 'relative',
          perspective: isMobile ? '1200px' : '800px',
          perspectiveOrigin: 'center center',
        }}
      >
        {/* Cards Container */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: isMobile ? 'visible' : 'hidden',
          }}
        >
          {(isMobile ? campaigns : [...campaigns, ...campaigns, ...campaigns]).map((campaign: Campaign, index: number) => {
            let actualIndex, offset, isActive;
            
            if (isMobile) {
              actualIndex = index;
              isActive = index === currentIndex;
              offset = index - currentIndex;
            } else {
              actualIndex = index % campaigns.length;
              const centerStart = campaigns.length;
              const relativeIndex = index - centerStart;
              isActive = actualIndex === currentIndex;
              offset = relativeIndex;
              
              if (Math.abs(relativeIndex - currentIndex) > 2) {
                return null;
              }
              
              offset = relativeIndex - currentIndex;
            }
            
            const isVisible = Math.abs(offset) <= (isMobile ? 1 : 2);
            
            if (!isVisible) return null;
            
            const getCardTransform = () => {
              if (isMobile) {
                const baseDistance = 260;
                const rotationAngle = 8;
                let zDepth = isActive ? 0 : -150;
                const scaleValue = isActive ? 1 : 0.75;
                const xPosition = offset * baseDistance;
                const yRotation = offset * rotationAngle;
                
                return `
                  translateX(${xPosition}px)
                  translateZ(${zDepth}px)
                  rotateY(${yRotation}deg)
                  scale(${scaleValue})
                `;
              } else {
                const baseDistance = 380;
                const scaleValue = isActive ? 1.1 : 0.8;
                const xPosition = offset * baseDistance;
                
                return `
                  translateX(${xPosition}px)
                  scale(${scaleValue})
                `;
              }
            };
            
            const getZIndex = () => {
              if (isActive) return 100;
              return 50 - Math.abs(offset) * 10;
            };
            
            const getHoverTransform = () => {
              if (isMobile) {
                const baseDistance = 260;
                const rotationAngle = 8;
                const zDepth = isActive ? 20 : -130;
                const scaleValue = isActive ? 1.05 : 0.8;
                const xPosition = offset * baseDistance;
                const yRotation = offset * rotationAngle;
                
                return `
                  translateX(${xPosition}px)
                  translateZ(${zDepth}px)
                  rotateY(${yRotation}deg)
                  scale(${scaleValue})
                `;
              } else {
                const baseDistance = 380;
                const scaleValue = isActive ? 1.15 : 0.85;
                const xPosition = offset * baseDistance;
                
                return `
                  translateX(${xPosition}px)
                  scale(${scaleValue})
                `;
              }
            };
            
            return (
              <Card
                key={isMobile ? campaign.campaignId : `${campaign.campaignId}-${index}`}
                sx={{
                  position: 'absolute',
                  width: { xs: '320px', md: '320px', lg: '350px' },
                  height: { xs: '420px', md: '450px', lg: '500px' },
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: 0,
                  margin: 0,
                  boxShadow: isActive 
                    ? '0 25px 50px rgba(0, 0, 0, 0.4), 0 20px 40px rgba(0, 0, 0, 0.3)'
                    : '0 15px 30px rgba(0, 0, 0, 0.2), 0 10px 20px rgba(0, 0, 0, 0.15)',
                  transition: isMobile 
                    ? 'all 1s cubic-bezier(0.23, 1, 0.32, 1)'
                    : 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  transformStyle: 'preserve-3d',
                  cursor: 'pointer',
                  // Smooth positioning
                  transform: getCardTransform(),
                  zIndex: getZIndex(),
                  opacity: isActive ? 1 : (isMobile ? 0.85 : 0.6),
                  '&:hover': {
                    transform: getHoverTransform(),
                    opacity: isActive ? 1 : 0.95,
                  },
                }}
                onClick={() => setCurrentIndex(index)}
              >
                {/* Image Container */}
                <Box
                  sx={{
                    position: 'relative',
                    height: { xs: '100%', md: '80%' },
                    overflow: 'hidden',
                    margin: 0,
                    padding: 0,
                  }}
                >
                  {campaign.imageUrl && (
                    <CardMedia
                      component="img"
                      height="100%"
                      image={getFullImageUrl(campaign.imageUrl) || ''}
                      alt={campaign.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center center',
                        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'block',
                        margin: 0,
                        padding: 0,
                        border: 'none',
                        outline: 'none',
                        verticalAlign: 'top',
                        lineHeight: 0,
                        fontSize: 0,
                      }}
                    />
                  )}
                  
                  {/* Gradient Overlay - Only mobile */}
                  {isMobile && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '60%',
                        background: 'linear-gradient(transparent 0%, rgba(0, 0, 0, 0.3) 30%, rgba(0, 0, 0, 0.7) 70%, rgba(0, 0, 0, 0.9) 100%)',
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                  
                  {/* Mobile Content Overlay */}
                  {isMobile && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '1rem',
                        color: 'white',
                        zIndex: 10,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          marginBottom: '0.5rem',
                          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 20%, #e2e8f0 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          lineHeight: 1.2,
                          textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                        }}
                      >
                        {campaign.name}
                      </Typography>
                      {campaign.description && (
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: '0.875rem',
                            lineHeight: 1.5,
                            color: 'rgba(255, 255, 255, 0.9)',
                            margin: 0,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
                          }}
                        >
                          {campaign.description}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
                
                {!isMobile && (
                  <Box
                    sx={{
                      height: '20%',
                      padding: '1rem 1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      bgcolor: 'rgba(0, 0, 0, 0.05)',
                      backdropFilter: 'blur(10px)',
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        color: '#FFFFFF',
                        lineHeight: 1.3,
                        textAlign: 'center',
                        margin: 0,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {campaign.name}
                    </Typography>
                  </Box>
                )}
              </Card>
            );
          })}
        </Box>

        {/* Navigation Arrows - Fixed positioning */}
        {campaigns.length > 1 && (
          <>
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handlePrevious();
              }}
              sx={{
                position: 'absolute',
                left: { xs: -20, md: -60 },
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(15px)',
                color: '#FFFFFF',
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                '&:hover': {
                  bgcolor: 'rgba(10, 132, 255, 0.9)',
                  borderColor: 'rgba(10, 132, 255, 0.6)',
                  transform: 'translateY(-50%) scale(1.1)',
                },
                '&:active': {
                  transform: 'translateY(-50%) scale(0.95)',
                },
                zIndex: 200,
                transition: 'all 0.2s ease',
              }}
            >
              <HiOutlineChevronLeft size={isMobile ? 18 : 22} />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleNext();
              }}
              sx={{
                position: 'absolute',
                right: { xs: -20, md: -60 },
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(15px)',
                color: '#FFFFFF',
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                '&:hover': {
                  bgcolor: 'rgba(10, 132, 255, 0.9)',
                  borderColor: 'rgba(10, 132, 255, 0.6)',
                  transform: 'translateY(-50%) scale(1.1)',
                },
                '&:active': {
                  transform: 'translateY(-50%) scale(0.95)',
                },
                zIndex: 200,
                transition: 'all 0.2s ease',
              }}
            >
              <HiOutlineChevronRight size={isMobile ? 18 : 22} />
            </IconButton>
          </>
        )}

        {/* Dots Indicator */}
        {campaigns.length > 1 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 1,
              mt: 1.5,
            }}
          >
            {campaigns.map((_: Campaign, index: number) => (
              <Box
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                sx={{
                  width: index === currentIndex ? 24 : 8,
                  height: 8,
                  borderRadius: 2,
                  bgcolor: index === currentIndex ? '#0A84FF' : 'rgba(255, 255, 255, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    bgcolor: index === currentIndex ? '#0A84FF' : 'rgba(255, 255, 255, 0.5)',
                  },
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CampaignCarousel;
