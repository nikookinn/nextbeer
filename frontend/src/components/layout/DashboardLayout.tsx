import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import CustomAppBar from './CustomAppBar';
import Sidebar from './Sidebar';

const DRAWER_WIDTH = 240; // Açık sidebar genişliği
const DRAWER_WIDTH_CLOSED = 64; // Kapalı sidebar genişliği (sadece ikonlar)
const DRAWER_WIDTH_MOBILE = 280; // Mobile'da biraz daha geniş

const DashboardLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  // Desktop'ta mini drawer logic'i
  const getEffectiveDrawerWidth = () => {
    if (isMobile) {
      return sidebarOpen ? DRAWER_WIDTH_MOBILE : 0; // Mobile: tam açık veya tamamen kapalı
    }
    return sidebarOpen ? DRAWER_WIDTH : DRAWER_WIDTH_CLOSED; // Desktop: tam açık veya mini
  };

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* AppBar - Fixed top */}
      <CustomAppBar onMenuClick={handleDrawerToggle} />
      
      {/* Sidebar - Fixed left */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        width={isMobile ? DRAWER_WIDTH_MOBILE : DRAWER_WIDTH}
        closedWidth={DRAWER_WIDTH_CLOSED}
        isMobile={isMobile}
      />
      
      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          position: 'fixed',
          top: { xs: 56, sm: 64 }, // Responsive AppBar height
          left: {
            xs: 0, // Mobile: full width
            md: getEffectiveDrawerWidth() // Desktop: dynamic width
          },
          right: 0,
          bottom: 0,
          width: {
            xs: '100vw', // Mobile: full viewport width
            md: `calc(100vw - ${getEffectiveDrawerWidth()}px)` // Desktop: dynamic width
          },
          height: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' }, // Responsive height
          overflow: 'auto',
          backgroundColor: theme.palette.background.default,
          transition: theme.transitions.create(['left', 'width'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard,
          }),
        }}
      >
        <Box sx={{ 
          width: '100%', 
          minHeight: '100%', // height yerine minHeight
          p: 0, // Hiç padding yok, Dashboard kendi padding'ini yönetecek
          overflow: 'visible', // İçerik taşmasına izin ver
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
