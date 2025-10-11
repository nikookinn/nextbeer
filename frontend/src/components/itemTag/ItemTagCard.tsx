import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Tooltip,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Edit, Trash2, Tag } from 'lucide-react';
import { ItemTagResponse } from '../../types/itemTag';

interface ItemTagCardProps {
  itemTag: ItemTagResponse;
  onEdit: (itemTag: ItemTagResponse) => void;
  onDelete: (id: number) => void;
}

const ItemTagCard: React.FC<ItemTagCardProps> = ({ 
  itemTag, 
  onEdit, 
  onDelete
}) => {
  const theme = useTheme();

  return (
    <Tooltip title="Etiketi redaktə etmək üçün klikləyin" arrow placement="top">
      <Card
        onClick={() => itemTag && onEdit && onEdit(itemTag)}
        sx={{
          width: '100%',
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
            transform: 'translateY(-2px)',
            boxShadow: theme.palette.mode === 'light'
              ? '0 8px 32px rgba(0, 0, 0, 0.12)'
              : '0 8px 32px rgba(0, 0, 0, 0.4)',
            border: theme.palette.mode === 'light'
              ? '1px solid #007AFF'
              : '1px solid #0A84FF',
          },
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2} flex={1}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #007AFF 0%, #0056CC 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  flexShrink: 0,
                }}
              >
                <Tag size={24} />
              </Box>
              
              <Box flex={1} minWidth={0}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.mode === 'light' ? '#1D1D1F' : '#FFFFFF',
                    fontSize: '1.1rem',
                    mb: 0.25,
                  }}
                >
                  {itemTag.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.875rem' }}
                >
                  Etiket ID: #{itemTag.id}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" gap={0.5} flexShrink={0}>
              <Tooltip title="Etiketi Redaktə Et">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(itemTag);
                  }}
                  size="small"
                  sx={{
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <Edit size={18} />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Etiketi Sil">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(itemTag.id);
                  }}
                  size="small"
                  sx={{
                    color: 'error.main',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.error.main, 0.1),
                    },
                  }}
                >
                  <Trash2 size={18} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Tooltip>
  );
};

export default ItemTagCard;
