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
import { MoreVertical, Edit, Trash2, Plus, Megaphone } from 'lucide-react';
import { CampaignResponse } from '../../types/campaign.types';
import { getFullImageUrl } from '../../utils/imageUtils';

interface CampaignCardProps {
  campaign?: CampaignResponse;
  isAddCard?: boolean;
  onEdit?: (campaign: CampaignResponse) => void;
  onDelete?: (campaign: CampaignResponse) => void;
  onAdd?: () => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  isAddCard = false,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  // Mobile touch handling for scroll compatibility
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    if (campaign && onEdit) {
      onEdit(campaign);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (campaign && onDelete) {
      onDelete(campaign);
    }
    handleMenuClose();
  };

  // Touch event handlers for mobile scroll compatibility
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setTouchEnd(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchEnd({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const deltaX = Math.abs(touchEnd.x - touchStart.x);
    const deltaY = Math.abs(touchEnd.y - touchStart.y);
    
    // If it's a scroll gesture (vertical movement > 10px), don't trigger click
    if (deltaY > 10 && deltaY > deltaX) {
      return;
    }
    
    // If it's a tap (minimal movement), trigger the action
    if (deltaX < 10 && deltaY < 10) {
      if (isAddCard && onAdd) {
        onAdd();
      } else if (campaign && onEdit) {
        onEdit(campaign);
      }
    }
  };

  // Add new campaign card
  if (isAddCard) {
    return (
      <Card
        sx={{
          width: 300,
          height: 320,
          cursor: 'pointer',
          border: `2px dashed ${theme.palette.primary.main}`,
          background: theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F7 100%)'
            : 'linear-gradient(135deg, #1C1C1E 0%, #000000 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.palette.mode === 'light'
              ? '0 8px 32px rgba(0, 0, 0, 0.12)'
              : '0 8px 32px rgba(0, 0, 0, 0.4)',
            border: theme.palette.mode === 'light'
              ? '1px solid #007AFF'
              : '1px solid #0A84FF',
          },
          // Mobile touch optimization
          '@media (max-width: 768px)': {
            touchAction: 'pan-y', // Allow vertical scrolling
          },
        }}
        onClick={onAdd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
            Yeni Kampaniya Əlavə Et
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ px: 2 }}
          >
            Təkliflərinizi tanıtmaq üçün yeni kampaniya yaradın
          </Typography>
        </Box>
      </Card>
    );
  }

  // Regular campaign card
  if (!campaign) return null;

  const imageUrl = campaign.imageUrl ? getFullImageUrl(campaign.imageUrl) : null;

  return (
    <Tooltip title="Kampaniyanı redaktə etmək üçün klikləyin" arrow placement="top">
      <Card
        onClick={() => campaign && onEdit && onEdit(campaign)}
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
        // Mobile touch optimization
        '@media (max-width: 768px)': {
          touchAction: 'pan-y', // Allow vertical scrolling
        },
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Campaign Options */}
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
          <ListItemText>Kampaniyanı Redaktə Et</ListItemText>
        </MenuItem>
        <MenuItem onClick={(e) => {
          e.stopPropagation(); // Prevent card click
          handleDelete();
        }} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Trash2 size={16} color={theme.palette.error.main} />
          </ListItemIcon>
          <ListItemText>Kampaniyanı Sil</ListItemText>
        </MenuItem>
      </Menu>

      {/* Campaign Image */}
      {imageUrl ? (
        <CardMedia
          component="img"
          height="200"
          image={imageUrl}
          alt={campaign.name}
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
                  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
                  color: white;
                ">
                  <div style="text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 8px;">📢</div>
                    <div style="font-size: 14px; font-weight: 600;">Kampaniya</div>
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
            background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
            color: 'white',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Megaphone size={48} style={{ marginBottom: 8 }} />
            <Typography variant="body2" fontWeight={600}>
              Kampaniya
            </Typography>
          </Box>
        </Box>
      )}

      {/* Campaign Info */}
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
          {campaign.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: '0.875rem' }}
        >
          Kampaniya ID: #{campaign.campaignId}
        </Typography>
      </CardContent>
    </Card>
    </Tooltip>
  );
};

export default CampaignCard;
