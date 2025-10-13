import React, { useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Fade,
  useTheme,
  useMediaQuery,
} from '@mui/material';
// React Icons - Premium icons
// Lucide React Icons - Food & Drink
import { 
  Martini, 
  Beer, 
  ChefHat, 
  CupSoda, 
  Citrus,
  MoveDown
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Navigation from '../shared/Navigation';
import CampaignCarousel from '../shared/CampaignCarousel';
import MenuGrid from '../shared/MenuGrid';
import Footer from '../shared/Footer';

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  
  const heroRef = useRef<HTMLElement>(null);
  const campaignsRef = useRef<HTMLElement>(null);
  const menusRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);

  // Handle scroll to section when coming from other pages
  useEffect(() => {
    if (location.state?.scrollTo) {
      const targetSection = location.state.scrollTo;
      setTimeout(() => {
        scrollToSection(targetSection, true); // true = instant scroll
      }, 50); // Smaller delay for instant effect
    }
  }, [location.state]);

  const scrollToSection = (sectionId: string, instant: boolean = false) => {
    const refs = {
      hero: heroRef,
      campaigns: campaignsRef,
      menus: menusRef,
      about: aboutRef,
      location: aboutRef, // Location scrolls to footer
    };
    if (isMobile) {
      if (sectionId === 'location') {
        const mapTitleElement = document.getElementById('map-title');
        if (mapTitleElement) {
          const offset = 80;
          const elementPosition = mapTitleElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: instant ? 'auto' : 'smooth'
          });
          return;
        }
      } else if (sectionId === 'about') {
        const mapTitleElement = document.getElementById('map-title');
        if (mapTitleElement) {
          const offset = 80;
          const elementPosition = mapTitleElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: instant ? 'auto' : 'smooth'
          });
          return;
        }
      }
    }

    const targetRef = refs[sectionId as keyof typeof refs];
    if (targetRef?.current) {
      const offset = 80; // Account for fixed navbar
      const elementPosition = targetRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: instant ? 'auto' : 'smooth'
      });
    }
  };

  const scrollToMenus = () => {
    scrollToSection('menus');
  };

  return (
    <Box sx={{ 
      bgcolor: '#000000', 
      minHeight: '100vh',
      overflowX: 'hidden',
      width: '100%'
    }}>
      <Navigation onNavigate={scrollToSection} />
      
      {/* Hero Section*/}
      <Box
        ref={heroRef}
        id="hero"
        sx={{
          minHeight: { xs: '75vh', md: '80vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #000000 0%, #0A0A0A 100%)',
          position: 'relative',
          overflow: 'hidden',
          pt: { xs: 8, md: 10 },
        }}
      >
        {/* Subtle Background Grid */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.03,
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        
        {/* BOTTOM LAYER - Premium Geometric Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}
        >
          {/* Martini Icon - Top Right */}
          <Box
            sx={{
              position: 'absolute',
              top: '15%',
              right: '15%',
              animation: 'martiniSpin 8s linear infinite',
              '@keyframes martiniSpin': {
                '0%': { transform: 'rotate(0deg) scale(1)' },
                '50%': { transform: 'rotate(180deg) scale(1.1)' },
                '100%': { transform: 'rotate(360deg) scale(1)' },
              },
            }}
          >
            <Martini size={80} color="#FF0040" strokeWidth={2} absoluteStrokeWidth />
          </Box>
          
          {/* Beer Icon - Bottom Left */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '25%',
              left: '5%',
              animation: 'beerBounce 6s ease-in-out infinite',
              '@keyframes beerBounce': {
                '0%, 100%': { transform: 'translateY(0px) rotate(0deg) scale(1)' },
                '25%': { transform: 'translateY(-15px) rotate(90deg) scale(1.05)' },
                '50%': { transform: 'translateY(0px) rotate(180deg) scale(1.1)' },
                '75%': { transform: 'translateY(-10px) rotate(270deg) scale(1.05)' },
              },
            }}
          >
            <Beer size={80} color="#FFD700" strokeWidth={2} absoluteStrokeWidth />
          </Box>
          
          {/* UtensilsCrossed Icon - Top Left */}
          <Box
            sx={{
              position: 'absolute',
              top: '15%',
              left: '8%',
              animation: 'utensilsWobble 10s ease-in-out infinite',
              '@keyframes utensilsWobble': {
                '0%, 100%': { transform: 'rotate(0deg) scale(1)' },
                '25%': { transform: 'rotate(15deg) scale(1.08)' },
                '50%': { transform: 'rotate(0deg) scale(1.15)' },
                '75%': { transform: 'rotate(-15deg) scale(1.08)' },
              },
            }}
          >
            <ChefHat size={80} color="#00ffe0" strokeWidth={2} absoluteStrokeWidth />
          </Box>
          
          {/* CupSoda Icon - Bottom Right */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '10%',
              right: '5%',
              animation: 'cupSodaPulse 7s ease-in-out infinite',
              '@keyframes cupSodaPulse': {
                '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
                '33%': { transform: 'scale(1.12) rotate(120deg)' },
                '66%': { transform: 'scale(0.95) rotate(240deg)' },
              },
            }}
          >
            <CupSoda size={80} color="#00BFFF" strokeWidth={2} absoluteStrokeWidth />
          </Box>
          
          {/* Citrus Icon - Center */}
          <Box
            sx={{
              position: 'absolute',
              top: '40%',
              left: '50%',
              animation: 'citrusFloat 9s ease-in-out infinite',
              '@keyframes citrusFloat': {
                '0%, 100%': { transform: 'translateX(-50%) translateY(0px) rotate(0deg)' },
                '50%': { transform: 'translateX(-50%) translateY(-25px) rotate(180deg)' },
              },
            }}
          >
            <Citrus size={80} color="#32CD32" strokeWidth={2} absoluteStrokeWidth />
          </Box>
          

        </Box>
        
        {/* TOP LAYER - Navigation Style Glass Effect */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(5px) saturate(180%)',
            WebkitBackdropFilter: 'blur(5px) saturate(180%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            zIndex: 2,
          }}
        />
        
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 3 }}>
          <Fade in timeout={1200}>
            <Box sx={{ textAlign: 'center', py: { xs: 3, md: 4 } }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5rem' },
                  fontWeight: 700,
                  lineHeight: { xs: 1.1, md: 1.05 },
                  letterSpacing: '-0.025em',
                  color: '#FFFFFF',
                  mb: 4,
                  maxWidth: 800,
                  mx: 'auto',
                  '& .highlight': {
                    background: 'linear-gradient(135deg, #0A84FF 0%, #30D158 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  },
                }}
              >
                NextBeer-ə{' '}
                <Box component="span" className="highlight">
                  Xoş Gəlmisiniz
                </Box>
              </Typography>
              
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1.125rem', md: '1.5rem' },
                  fontWeight: 400,
                  lineHeight: 1.6,
                  color: 'rgba(255, 255, 255, 0.7)',
                  mb: 6,
                  maxWidth: 600,
                  mx: 'auto',
                }}
              >
                Möhtəşəm menyumuz və xüsusi kampanyalarımızı kəşf edin
              </Typography>
              
              <Button
                variant="contained"
                size="large"
                onClick={scrollToMenus}
                endIcon={<MoveDown />}
                sx={{
                  background: 'linear-gradient(135deg, #FF9F0A 0%, #FFD700 50%, #FF6B35 100%)',
                  color: '#000000',
                  px: { xs: 4, md: 6 },
                  py: { xs: 1.5, md: 2 },
                  borderRadius: { xs: 3, md: 4 },
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 8px 32px rgba(255, 159, 10, 0.4), 0 4px 16px rgba(255, 215, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%, rgba(255, 255, 255, 0.1) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  },
                  '&:hover': {
                    background: 'linear-gradient(135deg, #FFB84D 0%, #FFE55C 50%, #FF8C69 100%)',
                    transform: 'translateY(-3px) scale(1.02)',
                    boxShadow: '0 12px 48px rgba(255, 159, 10, 0.6), 0 8px 24px rgba(255, 215, 0, 0.4)',
                    '&::before': {
                      opacity: 1,
                    },
                  },
                  '&:active': {
                    transform: 'translateY(-1px) scale(1.01)',
                  },
                }}
              >
                Menyuya Bax
              </Button>
              
              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '0.875rem',
                  }}
                >
                  və ya aşağı sürüşdürün
                </Typography>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Campaigns Section*/}
      <Box
        ref={campaignsRef}
        id="campaigns"
        sx={{
          py: { xs: 2, md: 3 },
          background: 'linear-gradient(180deg, #000000 0%, #0A0A0A 50%, #1A1A1A 100%)',
          position: 'relative',
        }}
      >
        {/* Section Background Decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
            backgroundImage: 'radial-gradient(circle at 30% 70%, #FF9F0A 0%, transparent 50%)',
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 2.5 } }}>
            <Typography
              variant="caption"
              sx={{
                color: '#FF9F0A',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                mb: 2,
                display: 'block',
              }}
            >
              Eksklüziv Təkliflər
            </Typography>
            <Typography
              variant={isMobile ? 'h4' : 'h3'}
              sx={{
                fontWeight: 800,
                mb: 3,
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FF9F0A 50%, #FFD700 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
              }}
            >
              Xüsusi Kampanyalar
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.7,
              }}
            >
              Mövsümi təkliflərimiz və eksklüziv endirimlər
            </Typography>
          </Box>
          <CampaignCarousel />
        </Container>
      </Box>

      {/* Menus Section*/}
      <Box
        ref={menusRef}
        id="menus"
        sx={{
          py: { xs: 4, md: 6 },
          background: 'linear-gradient(180deg, #1A1A1A 0%, #000000 50%, #0A0A0A 100%)',
          position: 'relative',
        }}
      >
        {/* Section Background Decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
            backgroundImage: 'radial-gradient(circle at 70% 30%, #30D158 0%, transparent 50%)',
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="caption"
              sx={{
                color: '#30D158',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                mb: 2,
                display: 'block',
              }}
            >
              Dadlı Seçimlər
            </Typography>
            <Typography
              variant={isMobile ? 'h4' : 'h3'}
              sx={{
                fontWeight: 800,
                mb: 3,
                background: 'linear-gradient(135deg, #FFFFFF 0%, #30D158 50%, #00FF7F 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
              }}
            >
              Menyularımız
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.7,
              }}
            >
              Ən yaxşı yeməklərimizi və içkilərimizi kəşf edin
            </Typography>
          </Box>
          <MenuGrid />
        </Container>
      </Box>

      {/* Footer Section */}
      <Box ref={aboutRef}>
        <Footer />
      </Box>
    </Box>
  );
};

export default LandingPage;
