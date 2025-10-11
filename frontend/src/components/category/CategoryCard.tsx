import React from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Edit, Trash2, FolderOpen, Package } from 'lucide-react';
import { CategoryResponse, CategorySimpleResponse } from '../../types/category';

interface CategoryCardProps {
  category: CategoryResponse | CategorySimpleResponse;
  onEdit: (category: CategoryResponse | CategorySimpleResponse) => void;
  onDelete: (id: number) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  category, 
  onEdit, 
  onDelete
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Navigate to items page for this category
    navigate(`/admin/item/${category.categoryId}`);
  };

  return (
    <Tooltip title="Bu kateqoriyadakı məhsullara baxmaq üçün klikləyin" arrow placement="top">
      <Card
        onClick={handleCardClick}
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
                  background: 'linear-gradient(135deg, #FF9500 0%, #FF6B00 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  flexShrink: 0,
                }}
              >
                <FolderOpen size={24} />
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
                  {category.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.875rem' }}
                >
                  Kateqoriya ID: #{category.categoryId}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" gap={0.5} flexShrink={0}>
              <Tooltip title="Məhsullara Bax">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/admin/item/${category.categoryId}`);
                  }}
                  size="small"
                  sx={{
                    color: '#FF9500',
                    '&:hover': {
                      backgroundColor: alpha('#FF9500', 0.1),
                    },
                  }}
                >
                  <Package size={18} />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Kateqoriyanı Redaktə Et">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(category);
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
              
              <Tooltip title="Kateqoriyanı Sil">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(category.categoryId);
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

export default CategoryCard;
