import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  useTheme,
  Breadcrumbs,
} from '@mui/material';
import { ArrowLeft, Save, FolderOpen, ChevronRight } from 'lucide-react';
import { CategoryFormData, CategoryResponse } from '../../types/category';
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from '../../api/categoryApi';

interface CategoryFormProps {
  category?: CategoryResponse;
  menuId: number;
  menuName?: string;
  onBack: () => void;
  onSuccess: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, menuId, menuName, onBack, onSuccess }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    menuId: menuId,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

  const isEditing = !!category;
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        menuId: category.menuId,
      });
    }
  }, [category]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Kateqoriya adı tələb olunur';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Kateqoriya adı ən azı 2 simvol olmalıdır';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Kateqoriya adı 100 simvoldan az olmalıdır';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const requestData = {
        name: formData.name.trim(),
        menuId: formData.menuId,
      };

      if (isEditing && category) {
        await updateCategory({
          id: category.categoryId,
          category: requestData,
        }).unwrap();
      } else {
        await createCategory(requestData).unwrap();
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleInputChange = (field: keyof CategoryFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: '' }));
    }
  };

  return (
    <Box sx={{ 
      position: 'relative',
    }}>
      {/* Header with Back Button - Consistent with CategoryPage */}
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <IconButton
          onClick={onBack}
          sx={{
            bgcolor: (theme) => theme.palette.action.hover,
            '&:hover': {
              bgcolor: (theme) => theme.palette.action.selected,
            },
          }}
        >
          <ArrowLeft size={20} />
        </IconButton>
        
        {/* Breadcrumb Navigation */}
        <Breadcrumbs separator={<ChevronRight size={16} />} sx={{ flex: 1 }}>
          <Typography variant="body2" color="text.primary" fontWeight={600}>
            {menuName || 'Menyu'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Kateqoriyalar
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isEditing ? 'Kateqoriyanı Redaktə Et' : 'Yeni Kateqoriya Yarat'}
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Main Header - Exact match with CategoryPage */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            component={FolderOpen}
            sx={{
              width: { xs: '24px', sm: '28px' },
              height: { xs: '24px', sm: '28px' },
            }}
          />
          <Typography 
            variant="h4" 
            fontWeight="bold"
            sx={{
              fontSize: { xs: '1.5rem', sm: '2.125rem' }
            }}
          >
            {isEditing ? 'Kateqoriyanı Redaktə Et' : 'Yeni Kateqoriya Yarat'}
          </Typography>
        </Box>
        
        {/* Invisible spacer to match CategoryPage button height */}
        <Box sx={{ 
          height: { xs: '36px', sm: '42px' }, // Match button height
          width: 0,
        }} />
      </Box>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {isEditing 
          ? 'Kateqoriya məlumatlarını və parametrlərini yeniləyin.'
          : 'Menyunuz üçün yeni kateqoriya yaradın. Kateqoriyalar menyu elementlərinizi təşkil etməyə kömək edir.'
        }
      </Typography>

      {Object.keys(errors).length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Zəhmət olmasa göndərmədən əvvəl yuxarıdakı xətaları düzəldin.
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        {/* Basic Information - Consistent with CategoryCard dimensions */}
        <Card sx={{
          background: theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F7 100%)'
            : 'linear-gradient(135deg, #1C1C1E 0%, #000000 100%)',
          border: theme.palette.mode === 'light'
            ? '1px solid #E5E5E7'
            : '1px solid #2C2C2E',
          boxShadow: theme.palette.mode === 'light'
            ? '0 2px 8px rgba(0, 0, 0, 0.1)'
            : '0 2px 8px rgba(0, 0, 0, 0.3)',
          borderRadius: 3,
          mb: 3,
        }}>
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
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
              <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ fontSize: '1.1rem' }}>
                Kateqoriya Məlumatları
              </Typography>
            </Box>
            
            <TextField
              fullWidth
              label="Kateqoriya Adı"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name || 'Bu kateqoriya üçün təsviri bir ad daxil edin (məs., Qəlyanaltılar, Əsas Yeməklər, Şirniyyatlar)'}
              required
              placeholder="məs., Qəlyanaltılar, Əsas Yeməklər, Şirniyyatlar və s."
              InputProps={{
                startAdornment: <FolderOpen size={20} style={{ marginRight: 8, color: '#666' }} />,
              }}
              sx={{
                '& .MuiInputBase-root': {
                  fontSize: '1rem',
                  minHeight: '56px',
                },
                '& .MuiInputLabel-root': {
                  fontSize: '1rem',
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Submit Buttons - Improved Mobile Sizing */}
        <Box
          sx={{
            position: { xs: 'fixed', sm: 'static' },
            bottom: { xs: 0, sm: 'auto' },
            left: { xs: 0, sm: 'auto' },
            right: { xs: 0, sm: 'auto' },
            p: { xs: 2, sm: 0 },
            backgroundColor: { xs: 'background.paper', sm: 'transparent' },
            borderTop: { xs: 1, sm: 0 },
            borderColor: { xs: 'divider', sm: 'transparent' },
            zIndex: { xs: 1000, sm: 'auto' },
            display: 'flex',
            gap: { xs: 1.5, sm: 2 },
            justifyContent: { xs: 'stretch', sm: 'flex-start' },
          }}
        >
          <Button
            variant="outlined"
            onClick={onBack}
            disabled={isLoading}
            sx={{ 
              flex: { xs: 1, sm: 'none' },
              minWidth: { xs: 'auto', sm: 120 },
              height: { xs: 44, sm: 'auto' },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Ləğv Et
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={
              isLoading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <Save size={18} />
              )
            }
            sx={{ 
              flex: { xs: 1, sm: 'none' },
              minWidth: { xs: 'auto', sm: 150 },
              height: { xs: 44, sm: 'auto' },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              background: theme.palette.mode === 'light' ? '#FF9500' : '#FF9500',
              '&:hover': {
                background: theme.palette.mode === 'light' ? '#FF6B00' : '#FF6B00',
              },
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            {isLoading
              ? isEditing
                ? 'Yenilənir...'
                : 'Yaradılır...'
              : isEditing
              ? 'Kateqoriyanı Yenilə'
              : 'Kateqoriya Yarat'}
          </Button>
        </Box>
      </Box>

      {/* Mobile padding for fixed buttons - Reduced */}
      <Box sx={{ height: { xs: 60, sm: 0 } }} />
    </Box>
  );
};

export default CategoryForm;
