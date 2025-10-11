import { AppBar, Toolbar, IconButton, Typography, Avatar, Menu, MenuItem, Tooltip, Divider, ListItemIcon, ListItemText, useTheme, useMediaQuery, Box } from '@mui/material';
import { Menu as MenuIcon, Moon, Sun, Settings, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { toggleTheme } from '../../features/theme/themeSlice';
import { logout } from '../../features/auth/authSlice';
import { useLogoutMutation } from '../../api/authApi';

interface CustomAppBarProps {
  onMenuClick: () => void;
}

const CustomAppBar: React.FC<CustomAppBarProps> = ({ onMenuClick }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [logoutApi] = useLogoutMutation();
  
  const themeMode = useAppSelector((state) => state.theme.mode);
  const user = useAppSelector((state) => state.auth.user);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      dispatch(logout());
      navigate('/admin/login');
    }
    handleProfileMenuClose();
  };

  const handleRestaurantSettings = () => {
    handleProfileMenuClose();
    navigate('/admin/restaurant');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        width: '100%',
        height: { xs: 56, sm: 64 },
        background: theme.palette.mode === 'light' 
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.95) 100%) !important'
          : 'linear-gradient(135deg, rgba(28, 28, 30, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%) !important',
        backdropFilter: 'blur(20px) saturate(180%) !important',
        borderBottom: theme.palette.mode === 'light'
          ? '1px solid #D2D2D7 !important'
          : '1px solid #38383A !important',
        boxShadow: theme.palette.mode === 'light'
          ? '0 1px 3px rgba(0, 0, 0, 0.1) !important'
          : '0 1px 3px rgba(0, 0, 0, 0.3) !important',
        color: theme.palette.mode === 'light'
          ? '#1F2937 !important'
          : '#FFFFFF !important',
        '& .MuiIconButton-root': {
          color: theme.palette.mode === 'light' ? '#1F2937 !important' : '#FFFFFF !important',
        },
        '& .MuiTypography-root': {
          color: theme.palette.mode === 'light' ? '#1F2937 !important' : '#FFFFFF !important',
        }
      }}
    >
      <Toolbar sx={{ pl: { xs: 1, sm: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 2 }}>
          {!isMobile && (
            <Typography 
              variant="h6"
              noWrap 
              component="div" 
              sx={{ 
                fontWeight: 600,
              }}
            >
              İdarəçi Paneli
            </Typography>
          )}
          <IconButton
            aria-label="open drawer"
            onClick={onMenuClick}
            sx={{ 
              minWidth: { xs: 40, sm: 48 },
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
              color: theme.palette.mode === 'light' ? '#1F2937 !important' : '#FFFFFF !important',
            }}
          >
            <MenuIcon 
              size={isMobile ? 20 : 22} 
              color={theme.palette.mode === 'light' ? '#1F2937' : '#FFFFFF'}
            />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={`${themeMode === 'light' ? 'Qaranlıq' : 'İşıqlı'} rejimə keç`}>
            <IconButton
              onClick={() => dispatch(toggleTheme())}
              sx={{
                color: theme.palette.mode === 'light' ? '#1F2937 !important' : '#FFFFFF !important',
                '&:hover': {
                  transform: 'rotate(180deg)',
                },
              }}
            >
              {themeMode === 'light' ? 
                <Moon 
                  size={isMobile ? 18 : 20} 
                  color={theme.palette.mode === 'light' ? '#1F2937' : '#FFFFFF'}
                /> : 
                <Sun 
                  size={isMobile ? 18 : 20} 
                  color={theme.palette.mode === 'light' ? '#1F2937' : '#FFFFFF'}
                />
              }
            </IconButton>
          </Tooltip>

          <Tooltip title="Hesab ayarları">
            <IconButton
              onClick={handleProfileMenuOpen}
              size="small"
              sx={{ 
                ml: 1,
              }}
              aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
            >
              <Avatar sx={{ 
                width: 32, 
                height: 32, 
                bgcolor: 'secondary.main',
                border: '2px solid rgba(255, 255, 255, 0.2)'
              }}>
                <User size={16} />
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          onClick={handleProfileMenuClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              {user?.username}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleRestaurantSettings}>
            <ListItemIcon>
              <Settings size={16} />
            </ListItemIcon>
            <ListItemText>Restoran Ayarları</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogOut size={16} />
            </ListItemIcon>
            <ListItemText>Çıxış</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
