import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import { MoreVertical, Edit, Trash2, GripVertical, Package } from 'lucide-react';
import { ItemResponseDto } from '../../types/item';
import { getFullImageUrl } from '../../utils/imageUtils';

interface ItemCardProps {
  item: ItemResponseDto;
  onEdit: (item: ItemResponseDto) => void;
  onDelete: (item: ItemResponseDto) => void;
  isDragging?: boolean;
  dragControls?: any;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onEdit, onDelete, isDragging = false, dragControls }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleDragStart = (event: React.PointerEvent) => {
    if (dragControls) {
      dragControls.start(event);
    }
  };


  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCardClick = (event: React.MouseEvent) => {
    // Don't trigger if clicking on menu button or drag handle
    if ((event.target as HTMLElement).closest('[data-menu-button]') || 
        (event.target as HTMLElement).closest('.drag-handle')) {
      return;
    }
    
    // Add small delay to distinguish between click and drag
    setTimeout(() => {
      onEdit(item);
    }, 50);
  };

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleMenuClose();
    onEdit(item);
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleMenuClose();
    onDelete(item);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('az-AZ', {
      style: 'currency',
      currency: 'AZN',
      minimumFractionDigits: 2,
    }).format(price).replace('AZN', '₼');
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        cursor: 'pointer',
        userSelect: 'none', // Prevent text selection during drag
        transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        background: theme.palette.mode === 'light'
          ? 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F7 100%)'
          : 'linear-gradient(135deg, #1C1C1E 0%, #000000 100%)',
        border: theme.palette.mode === 'light'
          ? '1px solid #E5E5E7'
          : '1px solid #2C2C2E',
        borderRadius: 3,
        boxShadow: theme.palette.mode === 'light'
          ? '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)'
          : '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
        // Fixed width to prevent expansion
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        '&:hover': !isDragging ? {
          transform: 'translateY(-2px)',
          boxShadow: theme.palette.mode === 'light'
            ? '0 8px 32px rgba(0, 0, 0, 0.12)'
            : '0 8px 32px rgba(0, 0, 0, 0.4)',
          border: theme.palette.mode === 'light'
            ? '1px solid #007AFF'
            : '1px solid #0A84FF',
        } : {},
        // Drag styles - minimal changes
        ...(isDragging && {
          opacity: 0.5,
          pointerEvents: 'none',
          transform: 'none !important', // Override any transform
        }),
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {/* Responsive Layout: Horizontal on Desktop, Vertical on Mobile */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          gap: { xs: 1.5, md: 2 },
          minHeight: { xs: 'auto', md: 80 },
        }}>
          
          {/* Mobile: Top Row - Drag Handle, Image, Name & Price */}
          <Box sx={{ 
            display: { xs: 'flex', md: 'contents' },
            alignItems: 'center',
            gap: 2,
          }}>
            {/* Drag Handle */}
            <Box
              className="drag-handle"
              onPointerDown={handleDragStart}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: { xs: 32, md: 40 },
                height: { xs: 32, md: 40 },
                borderRadius: 2,
                cursor: 'grab',
                color: theme.palette.text.secondary,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                transition: 'all 0.2s ease',
                flexShrink: 0,
                touchAction: 'none', // Prevent scrolling when dragging
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                  color: theme.palette.primary.main,
                  transform: 'scale(1.05)',
                },
                '&:active': {
                  cursor: 'grabbing',
                  transform: 'scale(0.95)',
                },
              }}
            >
              <GripVertical size={18} />
            </Box>

            {/* Item Image */}
            <Box sx={{ flexShrink: 0 }}>
              <Avatar
                src={item.imageUrl ? getFullImageUrl(item.imageUrl) || undefined : undefined}
                sx={{
                  width: { xs: 50, md: 60 },
                  height: { xs: 50, md: 60 },
                  borderRadius: 2,
                  bgcolor: theme.palette.mode === 'light' ? '#F8FAFC' : '#1E293B',
                  border: `1px solid ${theme.palette.divider}`,
                  '& img': {
                    objectFit: 'cover',
                  },
                }}
              >
                {!item.imageUrl && (
                  <Package size={24} color={theme.palette.text.secondary} />
                )}
              </Avatar>
            </Box>

            {/* Item Name & Price */}
            <Box sx={{ 
              flex: 1, 
              minWidth: 0,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'column' },
              alignItems: { xs: 'flex-start', md: 'flex-start' },
              gap: { xs: 1, md: 0 },
            }}>
              {/* Item Name - Full width on mobile */}
              <Box sx={{ width: '100%', minWidth: 0 }}>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{
                    fontSize: { xs: '0.95rem', md: '1rem' },
                    lineHeight: 1.3,
                    color: theme.palette.text.primary,
                    // Mobile: Allow 2-3 lines for full name visibility
                    overflow: 'hidden',
                    display: { xs: '-webkit-box', md: 'block' },
                    WebkitLineClamp: { xs: 3, md: 1 },
                    WebkitBoxOrient: 'vertical',
                    wordBreak: 'break-word',
                    // Desktop: single line with ellipsis
                    ...(theme.breakpoints.up('md') && {
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }),
                    mb: { xs: 0, md: 0.5 },
                  }}
                >
                  {item.name}
                </Typography>
              </Box>
              
              {/* Price (Mobile: Below name, Desktop: Separate column) */}
              <Box sx={{ 
                display: { xs: 'block', md: 'none' },
                alignSelf: 'flex-start',
              }}>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    color: theme.palette.mode === 'light' ? '#059669' : '#10B981',
                    fontSize: '1rem',
                    py: 0.3,
                    px: 0.8,
                    bgcolor: alpha('#10B981', 0.1),
                    borderRadius: 1.5,
                    border: `1px solid ${alpha('#10B981', 0.2)}`,
                    minWidth: 'fit-content',
                  }}
                >
                  {formatPrice(item.price)}
                </Typography>
              </Box>
            </Box>

            {/* Three-dot Menu (Mobile: Top right) */}
            <Box sx={{ 
              display: { xs: 'block', md: 'none' },
              flexShrink: 0 
            }}>
              <IconButton
                onClick={handleMenuClick}
                data-menu-button="true"
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: alpha(theme.palette.grey[500], 0.1),
                  border: `1px solid ${alpha(theme.palette.grey[500], 0.2)}`,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.grey[500], 0.15),
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <MoreVertical size={14} />
              </IconButton>
            </Box>
          </Box>

          {/* Mobile: Description Row - Removed for more space */}

          {/* Mobile: Tags and Variants Row */}
          <Box sx={{ 
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}>
            {/* Tags */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {item.itemTagResponses && item.itemTagResponses.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {item.itemTagResponses.slice(0, 3).map((tag) => (
                    <Chip
                      key={tag.id}
                      label={tag.name}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.65rem',
                        bgcolor: '#10B981',
                        color: 'white',
                        fontWeight: 500,
                        '& .MuiChip-label': {
                          px: 0.6,
                        },
                      }}
                    />
                  ))}
                  {item.itemTagResponses.length > 3 && (
                    <Chip
                      label={`+${item.itemTagResponses.length - 3}`}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.65rem',
                        bgcolor: alpha(theme.palette.text.secondary, 0.2),
                        color: theme.palette.text.secondary,
                        fontWeight: 500,
                        '& .MuiChip-label': {
                          px: 0.6,
                        },
                      }}
                    />
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="text.disabled" sx={{ fontSize: '0.75rem' }}>
                  Etiket yoxdur
                </Typography>
              )}
            </Box>

            {/* Variants */}
            <Box sx={{ flexShrink: 0 }}>
              {item.itemVariantResponses && item.itemVariantResponses.length > 0 ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Package size={12} color={theme.palette.text.secondary} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 500,
                    }}
                  >
                    {item.itemVariantResponses.length} variant
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.disabled" sx={{ fontSize: '0.75rem' }}>
                  Variant yoxdur
                </Typography>
              )}
            </Box>
          </Box>

          {/* Desktop Layout - Hidden on Mobile */}
          <>
            {/* Desktop: Item Name & Description */}
            <Box sx={{ 
              display: { xs: 'none', md: 'block' },
              flex: 1, 
              minWidth: 0 
            }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: '0.85rem',
                  lineHeight: 1.4,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {item.description}
              </Typography>
            </Box>

            {/* Desktop: Tags */}
            <Box sx={{ 
              display: { xs: 'none', md: 'block' },
              flexShrink: 0, 
              minWidth: 120 
            }}>
              {item.itemTagResponses && item.itemTagResponses.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'flex-end' }}>
                  {item.itemTagResponses.slice(0, 2).map((tag) => (
                    <Chip
                      key={tag.id}
                      label={tag.name}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        bgcolor: '#10B981',
                        color: 'white',
                        fontWeight: 500,
                        '& .MuiChip-label': {
                          px: 0.8,
                        },
                      }}
                    />
                  ))}
                  {item.itemTagResponses.length > 2 && (
                    <Chip
                      label={`+${item.itemTagResponses.length - 2}`}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        bgcolor: alpha(theme.palette.text.secondary, 0.2),
                        color: theme.palette.text.secondary,
                        fontWeight: 500,
                        '& .MuiChip-label': {
                          px: 0.8,
                        },
                      }}
                    />
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'right', fontSize: '0.8rem' }}>
                  Etiket yoxdur
                </Typography>
              )}
            </Box>

            {/* Desktop: Variants Info */}
            <Box sx={{ 
              display: { xs: 'none', md: 'block' },
              flexShrink: 0, 
              minWidth: 80, 
              textAlign: 'center' 
            }}>
              {item.itemVariantResponses && item.itemVariantResponses.length > 0 ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  <Package size={14} color={theme.palette.text.secondary} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: '0.8rem',
                      fontWeight: 500,
                    }}
                  >
                    {item.itemVariantResponses.length}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.disabled" sx={{ fontSize: '0.8rem' }}>
                  -
                </Typography>
              )}
            </Box>

            {/* Desktop: Price */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' },
              flexShrink: 0, 
              minWidth: 100,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  color: theme.palette.mode === 'light' ? '#059669' : '#10B981',
                  fontSize: '1.1rem',
                  textAlign: 'center',
                  py: 0.5,
                  px: 1,
                  bgcolor: alpha('#10B981', 0.1),
                  borderRadius: 1.5,
                  border: `1px solid ${alpha('#10B981', 0.2)}`,
                  minWidth: 'fit-content',
                }}
              >
                {formatPrice(item.price)}
              </Typography>
            </Box>

            {/* Desktop: Three-dot Menu */}
            <Box sx={{ 
              display: { xs: 'none', md: 'block' },
              flexShrink: 0 
            }}>
              <IconButton
                onClick={handleMenuClick}
                data-menu-button="true"
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: alpha(theme.palette.grey[500], 0.1),
                  border: `1px solid ${alpha(theme.palette.grey[500], 0.2)}`,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.grey[500], 0.15),
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <MoreVertical size={16} />
              </IconButton>
            </Box>
          </>
        </Box>
      </CardContent>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            boxShadow: theme.palette.mode === 'light'
              ? '0 4px 20px rgba(0, 0, 0, 0.1)'
              : '0 4px 20px rgba(0, 0, 0, 0.3)',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            minWidth: 160,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleEdit} sx={{ gap: 1.5, py: 1 }}>
          <Edit size={16} />
          Məhsulu Redaktə Et
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ 
          gap: 1.5, 
          py: 1, 
          color: 'error.main',
          '&:hover': {
            bgcolor: alpha(theme.palette.error.main, 0.1),
          },
        }}>
          <Trash2 size={16} />
          Məhsulu Sil
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default ItemCard;
