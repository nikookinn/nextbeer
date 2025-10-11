import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  Tooltip,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { MoreVertical, Edit, Trash2, Plus, ChefHat } from 'lucide-react';
import { MenuResponseDto } from '../../types/menu.types';
import { getFullImageUrl } from '../../utils/imageUtils';

interface MenuCardProps {
  menu?: MenuResponseDto;
  isAddCard?: boolean;
  onEdit?: (menu: MenuResponseDto) => void;
  onDelete?: (menu: MenuResponseDto) => void;
  onAdd?: () => void;
  onViewCategories?: (menu: MenuResponseDto) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({
  menu,
  isAddCard = false,
  onEdit,
  onDelete,
  onAdd,
  onViewCategories,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    if (menu && onEdit) {
      onEdit(menu);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (menu && onDelete) {
      onDelete(menu);
    }
    handleMenuClose();
  };

  // Add new menu card
  if (isAddCard) {
    return (
      <Card
        sx={{
          width: 300,
          height: 320,
          cursor: 'pointer',
          border: `2px dashed ${theme.palette.primary.main}`,
          background: alpha(theme.palette.primary.main, 0.05),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.2)}`,
            background: alpha(theme.palette.primary.main, 0.1),
          },
        }}
        onClick={onAdd}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plus size={32} color="white" />
          </Box>
          <Typography
            variant="h6"
            fontWeight={600}
            color="primary.main"
            textAlign="center"
          >
            Yeni Menyu Əlavə Et
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ px: 2 }}
          >
            Restoranınız üçün yeni menyu yaradın
          </Typography>
        </Box>
      </Card>
    );
  }

  // Regular menu card
  if (!menu) return null;

  const imageUrl = menu.imageUrl ? getFullImageUrl(menu.imageUrl) : null;

  return (
    <Tooltip title="Kateqoriyalara baxmaq üçün klikləyin" arrow placement="top">
      <Card
        onClick={() => menu && onViewCategories && onViewCategories(menu)}
        sx={{
        width: 300,
        height: 320,
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        background: theme.palette.mode === 'light'
          ? 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F7 100%)'
          : 'linear-gradient(135deg, #1C1C1E 0%, #000000 100%)',
        border: theme.palette.mode === 'light'
          ? '1px solid #E5E5E7'
          : '1px solid #2C2C2E',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.palette.mode === 'light'
            ? '0 8px 32px rgba(0, 0, 0, 0.12)'
            : '0 8px 32px rgba(0, 0, 0, 0.4)',
          border: theme.palette.mode === 'light'
            ? '1px solid #007AFF'
            : '1px solid #0A84FF',
        },
      }}
    >
      {/* Menu Options */}
      <IconButton
        onClick={(e) => {
          e.stopPropagation(); // Prevent card click
          handleMenuOpen(e);
        }}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 2,
          bgcolor: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(10px)',
          '&:hover': {
            bgcolor: alpha(theme.palette.background.paper, 1),
          },
        }}
        size="small"
      >
        <MoreVertical size={16} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()} // Prevent card click
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={(e) => {
          e.stopPropagation(); // Prevent card click
          handleEdit();
        }}>
          <ListItemIcon>
            <Edit size={16} />
          </ListItemIcon>
          <ListItemText>Menyunu Redaktə Et</ListItemText>
        </MenuItem>
        <MenuItem onClick={(e) => {
          e.stopPropagation(); // Prevent card click
          handleDelete();
        }} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Trash2 size={16} color={theme.palette.error.main} />
          </ListItemIcon>
          <ListItemText>Menyunu Sil</ListItemText>
        </MenuItem>
      </Menu>

      {/* Menu Image */}
      {imageUrl ? (
        <CardMedia
          component="img"
          height="200"
          image={imageUrl}
          alt={menu.name}
          sx={{
            objectFit: 'cover',
          }}
          onError={(e) => {
            // Fallback to icon if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `
                <div style="
                  height: 200px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: linear-gradient(135deg, #007AFF 0%, #0056CC 100%);
                  color: white;
                ">
                  <div style="text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 8px;">🍽️</div>
                    <div style="font-size: 14px; font-weight: 600;">Menu</div>
                  </div>
                </div>
              `;
            }
          }}
        />
      ) : (
        <Box
          sx={{
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #007AFF 0%, #0056CC 100%)',
            color: 'white',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <ChefHat size={48} style={{ marginBottom: 8 }} />
            <Typography variant="body2" fontWeight={600}>
              Menyu
            </Typography>
          </Box>
        </Box>
      )}

      {/* Menu Info */}
      <CardContent sx={{ p: 2 }}>
        <Typography
          variant="h6"
          fontWeight={600}
          noWrap
          sx={{
            color: theme.palette.mode === 'light' ? '#1D1D1F' : '#FFFFFF',
            mb: 1,
          }}
        >
          {menu.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: '0.875rem' }}
        >
          Menyu ID: #{menu.menuId}
        </Typography>
      </CardContent>
    </Card>
    </Tooltip>
  );
};

export default MenuCard;
