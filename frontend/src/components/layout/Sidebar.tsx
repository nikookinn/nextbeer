import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
  alpha,
  Avatar,
} from '@mui/material';
// Premium Lucide Icons
import {
  BarChart3,
  BookOpen,
  Store,
  Tag,
  Megaphone,
} from 'lucide-react';
import { getRestaurantLogoUrl } from '../../utils/imageUtils';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  width: number;
  closedWidth?: number;
  isMobile?: boolean;
}


// Icon component'ları fonksiyon olarak tanımlayalım ki renk verebilmek
const getNavItems = (theme: any, isActive: boolean) => [
  {
    title: 'İdarə Paneli',
    path: '/admin/dashboard',
    icon: <BarChart3 
      size={20} 
      color={isActive ? theme.palette.primary.main : (theme.palette.mode === 'light' ? '#1D1D1F' : '#FFFFFF')}
    />,
  },
  {
    title: 'Restoran',
    path: '/admin/restaurant',
    icon: <Store 
      size={20} 
      color={isActive ? theme.palette.primary.main : (theme.palette.mode === 'light' ? '#1D1D1F' : '#FFFFFF')}
    />,
  },
  {
    title: 'Menyu',
    path: '/admin/menu',
    icon: <BookOpen 
      size={20} 
      color={isActive ? theme.palette.primary.main : (theme.palette.mode === 'light' ? '#1D1D1F' : '#FFFFFF')}
    />,
  },
  {
    title: 'Kampaniya',
    path: '/admin/campaign',
    icon: <Megaphone 
      size={20} 
      color={isActive ? theme.palette.primary.main : (theme.palette.mode === 'light' ? '#1D1D1F' : '#FFFFFF')}
    />,
  },
  {
    title: 'Məhsul Etiketi',
    path: '/admin/item-tag',
    icon: <Tag 
      size={20} 
      color={isActive ? theme.palette.primary.main : (theme.palette.mode === 'light' ? '#1D1D1F' : '#FFFFFF')}
    />,
  },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, width, closedWidth = 64, isMobile: isMobileProp }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = isMobileProp ?? useMediaQuery(theme.breakpoints.down('md'));

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header - Logo ve Title */}
      <Box
        sx={{
          p: open ? 2 : 1, // Açık/kapalıya göre padding
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'flex-start' : 'center', // Ortalama
          gap: open ? 1.5 : 0,
          minHeight: 64, // Sabit yükseklik
        }}
      >
        <Avatar
          src={getRestaurantLogoUrl()}
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            flexShrink: 0, // Küçülmesin
          }}
        >
          🍺
        </Avatar>
        {open && ( // Sadece açıkken göster
          <Box sx={{ 
            overflow: 'hidden',
            opacity: open ? 1 : 0,
            transition: theme.transitions.create(['opacity'], {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.shorter,
              delay: open ? theme.transitions.duration.shorter : 0,
            }),
          }}>
            <Typography 
              variant="h6" 
              fontWeight={700} 
              noWrap
              sx={{ color: theme.palette.mode === 'light' ? '#1D1D1F' : '#FFFFFF' }}
            >
              NextBeer
            </Typography>
            <Typography 
              variant="caption" 
              noWrap
              sx={{ color: theme.palette.mode === 'light' ? '#86868B' : '#8E8E93' }}
            >
              QR Menyu Platforması
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ 
        borderColor: theme.palette.mode === 'light' ? '#E5E5E7' : '#2C2C2E' 
      }} />

      <List sx={{ px: open ? 1.5 : 0.5, py: 1, flexGrow: 1 }}>
        {getNavItems(theme, false).map((item) => {
          const isActive = location.pathname === item.path;
          const navItems = getNavItems(theme, isActive);
          const currentItem = navItems.find(navItem => navItem.path === item.path);
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  justifyContent: open ? 'flex-start' : 'center', // Ortalama
                  px: open ? 2 : 1,
                  minHeight: 48,
                  '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.16),
                    },
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'light'
                      ? alpha(theme.palette.action.hover, 0.04)
                      : alpha(theme.palette.action.hover, 0.08),
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: open ? 40 : 'auto', // Açık/kapalıya göre
                    justifyContent: 'center',
                  }}
                >
                  {currentItem?.icon || item.icon}
                </ListItemIcon>
                {open && ( // Sadece açıkken text göster
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 500,
                      color: theme.palette.mode === 'light' ? '#1D1D1F' : '#FFFFFF',
                    }}
                    sx={{
                      opacity: open ? 1 : 0,
                      transition: theme.transitions.create(['opacity'], {
                        easing: theme.transitions.easing.easeInOut,
                        duration: theme.transitions.duration.shorter,
                        delay: open ? theme.transitions.duration.shorter : 0,
                      }),
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ 
        borderColor: theme.palette.mode === 'light' ? '#E5E5E7' : '#2C2C2E' 
      }} />
      
      {/* Footer - Sadece açıkken göster */}
      {open && (
        <Box sx={{ 
          p: 2,
          opacity: open ? 1 : 0,
          transition: theme.transitions.create(['opacity'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
            delay: open ? theme.transitions.duration.shorter : 0,
          }),
        }}>
          <Typography 
            variant="caption" 
            display="block" 
            textAlign="center"
            sx={{ color: theme.palette.mode === 'light' ? '#86868B' : '#8E8E93' }}
          >
            © 2024 NextBeer İdarəçi
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={isMobile ? open : true} // Desktop'ta her zaman açık (mini veya full)
      onClose={onClose}
      // Smooth transition için MUI'nin kendi transition'ını kullan
      sx={{
        width: isMobile ? (open ? width : 0) : (open ? width : closedWidth), // Desktop'ta mini drawer
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isMobile ? width : (open ? width : closedWidth), // Desktop'ta mini drawer
          boxSizing: 'border-box',
          borderRight: theme.palette.mode === 'light'
            ? '1px solid #E5E5E7'
            : '1px solid #2C2C2E',
          background: theme.palette.mode === 'light' 
            ? 'linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 100%)'
            : 'linear-gradient(180deg, #1C1C1E 0%, #000000 100%)',
          boxShadow: theme.palette.mode === 'light'
            ? '2px 0 8px rgba(0, 0, 0, 0.1)'
            : '2px 0 8px rgba(0, 0, 0, 0.3)',
          pt: { xs: 7, sm: 8 }, // Responsive AppBar height padding
          zIndex: theme.zIndex.drawer - 1, // AppBar'dan daha da düşük
          position: 'fixed', // Fixed position
          height: '100vh', // Full height
          top: 0,
          left: 0,
          transition: theme.transitions.create(['width'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard,
          }),
          overflowX: 'hidden', // Yatay overflow gizle
          // Mobile'da slide, desktop'ta width değişimi
          ...(isMobile && {
            transform: open ? 'translateX(0)' : `translateX(-${width}px)`,
            transition: theme.transitions.create(['transform'], {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.standard,
            }),
          }),
          // Desktop'ta width değişimi için ek smooth transition
          ...(!isMobile && {
            transition: theme.transitions.create(['width'], {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.standard,
            }),
          }),
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
