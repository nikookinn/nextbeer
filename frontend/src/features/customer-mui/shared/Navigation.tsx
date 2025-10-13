import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  UtensilsCrossed as RestaurantIcon,
  Megaphone as CampaignIcon,
  Info as InfoIcon,
} from 'lucide-react';

interface NavigationProps {
  onNavigate: (sectionId: string) => void;
}

const PremiumNavigation: React.FC<NavigationProps> = ({ onNavigate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Desktop navigation items - Lucide Icons
  const navigationItems = [
    { id: 'hero', label: 'Ana Səhifə', icon: HomeIcon, color: '#0A84FF' },
    { id: 'campaigns', label: 'Kampanyalar', icon: CampaignIcon, color: '#FF9F0A' },
    { id: 'menus', label: 'Menyu', icon: RestaurantIcon, color: '#30D158' },
    { id: 'about', label: 'Haqqımızda', icon: InfoIcon, color: '#8E8E93' },
  ];

  // Mobile navigation items - Lucide Icons
  const mobileNavigationItems = [
    { id: 'hero', label: 'Ana Səhifə', icon: HomeIcon, color: '#0A84FF' },
    { id: 'campaigns', label: 'Kampanyalar', icon: CampaignIcon, color: '#FF9F0A' },
    { id: 'menus', label: 'Menyu', icon: RestaurantIcon, color: '#30D158' },
    { id: 'about', label: 'Haqqımızda', icon: InfoIcon, color: '#8E8E93' },
  ];

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          // Apple/Canva Style - Clean and Minimal
          background: isScrolled 
            ? 'rgba(0, 0, 0, 0.8) !important'
            : 'rgba(0, 0, 0, 0.1) !important',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
          boxShadow: 'none !important',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 1500,
          // Override all MUI AppBar default styles
          '&.MuiAppBar-root': {
            backgroundColor: 'transparent !important',
            color: '#FFFFFF !important',
          },
          '&.MuiAppBar-colorPrimary': {
            backgroundColor: 'transparent !important',
          },
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 }, minHeight: '70px' }}>
          {/* Logo Section - Premium Glassmorphism */}
          <Box 
            onClick={() => onNavigate('hero')}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 1, sm: 1.5 },
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-1px)',
              },
            }}
          >
            <Box
              component="img"
              src="/images/logo.png"
              alt="NextBeer"
              sx={{
                width: { xs: 32, sm: 36 },
                height: { xs: 32, sm: 36 },
                borderRadius: 2,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                },
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                letterSpacing: '-0.02em',
                fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                display: 'block',
                transition: 'all 0.2s ease',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  color: 'rgba(255, 255, 255, 0.95)',
                },
              }}
            >
              NextBeer
            </Typography>
          </Box>

          {/* Desktop Navigation - Apple-style Pill Buttons */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navigationItems.map((item) => (
                <Box
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2.5,
                    py: 1.25,
                    borderRadius: 2, // Full pill shape
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    
                    // Apple-style subtle gradient overlay
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(135deg, ${item.color}20 0%, ${item.color}10 50%, transparent 100%)`,
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      borderRadius: 'inherit',
                    },
                    
                    // Hover effects
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.15)',
                      borderColor: `${item.color}40`,
                      transform: 'translateY(-1px)',
                      boxShadow: `0 4px 16px ${item.color}20, 0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
                      
                      '&::before': {
                        opacity: 1,
                      },
                      
                      // Text color change on hover
                      '& .nav-text': {
                        color: '#FFFFFF',
                      },
                      
                      // Icon color change on hover
                      '& .nav-icon': {
                        color: item.color,
                        transform: 'scale(1.1)',
                      },
                    },
                    
                    // Active/pressed state
                    '&:active': {
                      transform: 'translateY(0px)',
                      background: 'rgba(255, 255, 255, 0.2)',
                    },
                  }}
                >
                  <item.icon 
                    className="nav-icon"
                    style={{
                      fontSize: '18px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    }}
                  />
                  <Typography
                    className="nav-text"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.85)',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      letterSpacing: '-0.01em',
                      fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                      transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      whiteSpace: 'nowrap',
                      userSelect: 'none',
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* Mobile Menu Button - Premium */}
          {isMobile && (
            <IconButton
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              sx={{
                width: 46,
                height: 46,
                color: 'rgba(255, 255, 255, 0.95)',
                background: 'linear-gradient(135deg, rgba(10, 132, 255, 0.12) 0%, rgba(48, 209, 88, 0.08) 50%, rgba(255, 255, 255, 0.04) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(10, 132, 255, 0.25)',
                borderRadius: 2.5,
                position: 'relative',
                zIndex: 1500,
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(10, 132, 255, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(10, 132, 255, 0.15) 0%, rgba(48, 209, 88, 0.12) 50%, rgba(0, 122, 255, 0.08) 100%)',
                  borderRadius: 'inherit',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                },
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(10, 132, 255, 0.2) 0%, rgba(48, 209, 88, 0.15) 50%, rgba(255, 255, 255, 0.08) 100%)',
                  borderColor: 'rgba(10, 132, 255, 0.4)',
                  color: '#FFFFFF',
                  transform: 'translateY(-1px) scale(1.02)',
                  boxShadow: '0 8px 24px rgba(10, 132, 255, 0.3), 0 4px 12px rgba(48, 209, 88, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                  '&::before': {
                    opacity: 1,
                  },
                },
                '&:active': {
                  transform: 'translateY(0px)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                },
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <MenuIcon 
                size={22}
                style={{ 
                  position: 'relative',
                  zIndex: 1,
                  filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))',
                }} 
              />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer - Ultra Glass */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        transitionDuration={400}
        sx={{
          zIndex: 1400,
          '& .MuiDrawer-root': {
            position: 'fixed',
          },
          '& .MuiDrawer-paper': {
            borderRadius: '0 !important',
            width: 300,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 50%, rgba(0, 0, 0, 0.05) 100%)',
            backdropFilter: 'blur(32px) saturate(220%)',
            WebkitBackdropFilter: 'blur(32px) saturate(220%)',
            border: 'none',
            top: '55px !important',
            right: '0 !important',
            left: 'auto !important',
            height: 'calc(100vh - 55px) !important',
            zIndex: 1300,
            position: 'fixed',
            overflow: 'hidden',
            boxShadow: '-12px 0 48px rgba(0, 0, 0, 0.2), -6px 0 24px rgba(0, 0, 0, 0.1), inset 1px 0 0 rgba(255, 255, 255, 0.12)',
          },
        }}
      >
        <Box sx={{ p: 3, pt: 10 }}>
          {/* Mobile Navigation Items */}
          <List sx={{ p: 0 }}>
            {mobileNavigationItems.map((item, index) => (
              <ListItem key={`${item.id}-${index}`} sx={{ p: 0, mb: 1 }}>
                <ListItemButton
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  sx={{
                    borderRadius: 2,
                    py: 2.5,
                    px: 3,
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)',
                    backdropFilter: 'blur(20px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(200%)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    mb: 1.5,
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(135deg, ${item.color}15 0%, ${item.color}08 100%)`,
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    },
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%)',
                      borderColor: `${item.color}30`,
                      transform: 'translateX(8px) translateY(-2px)',
                      boxShadow: `0 8px 24px ${item.color}15, 0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)`,
                      '&::before': {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: item.color,
                      minWidth: 40,
                    }}
                  >
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: '#FFFFFF',
                        fontWeight: 500,
                        fontSize: '1rem',
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default PremiumNavigation;
