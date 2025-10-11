import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  IconButton,
  Alert,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { Upload, X, Menu, ArrowLeft } from 'lucide-react';
import { MenuFormData, MenuResponseDto } from '../../types/menu.types';
import { getFullImageUrl } from '../../utils/imageUtils';

interface MenuFormProps {
  initialData?: MenuResponseDto | null;
  onSubmit: (data: MenuFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}

const MenuForm: React.FC<MenuFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  error = null,
}) => {
  const theme = useTheme();
  const [formData, setFormData] = useState<MenuFormData>({
    name: '',
    removeImage: false,
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // Initialize form with existing data
  useEffect(() => {
    // console.log('🔄 MenuForm useEffect triggered with initialData:', initialData);
    
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        removeImage: false,
      });

      // Set menu image preview
      if (initialData.imageUrl) {
        const fullImageUrl = getFullImageUrl(initialData.imageUrl);
        
        // console.log('📱 MenuForm Debug - Original imageUrl:', initialData.imageUrl);
        // console.log('📱 MenuForm Debug - Full imageUrl:', fullImageUrl);
        // console.log('📱 MenuForm Debug - Setting imagePreview to:', fullImageUrl);
        
        setImagePreview(fullImageUrl);
        setSelectedImage(null);
      } else {
        // console.log('⚠️ MenuForm Debug - No imageUrl in initialData');
        setImagePreview(null);
        setSelectedImage(null);
      }
    } else {
      // console.log('⚠️ MenuForm Debug - No initialData provided');
      setImagePreview(null);
      setSelectedImage(null);
    }
  }, [initialData]);

  const handleInputChange = (field: keyof MenuFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setImageError('Yalnız PNG, JPG və JPEG formatları dəstəklənir.');
        setSelectedImage(null);
        setImagePreview(null);
        // Clear the input
        event.target.value = '';
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setImageError('Fayl ölçüsü 5MB-dan az olmalıdır.');
        setSelectedImage(null);
        setImagePreview(null);
        // Clear the input
        event.target.value = '';
        return;
      }

      // Clear any previous errors
      setImageError(null);
      setSelectedImage(file);
      setFormData(prev => ({ ...prev, removeImage: false }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setImageError(null); // Clear any image errors
    setFormData(prev => ({ ...prev, removeImage: true }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    const submitData: MenuFormData = {
      ...formData,
      menuImage: selectedImage || undefined,
    };

    onSubmit(submitData);
  };

  const isNewMenu = !initialData;

  return (
    <Box sx={{ 
      minHeight: '100vh',
      pb: { xs: 15, sm: 4 },
      position: 'relative',
      // Mobile scroll optimization
      '@media (max-width: 600px)': {
        touchAction: 'pan-y',
        overflowX: 'hidden',
      }
    }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton
          onClick={onCancel}
          sx={{
            bgcolor: (theme) => theme.palette.action.hover,
            '&:hover': {
              bgcolor: (theme) => theme.palette.action.selected,
            },
          }}
        >
          <ArrowLeft size={20} />
        </IconButton>
        <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Menu size={28} />
          {isNewMenu ? 'Yeni Menyu Yarat' : 'Menyunu Redaktə Et'}
        </Typography>
      </Box>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {isNewMenu 
          ? 'Restoranınız üçün yeni menyu yaradın. Ad və istəyə bağlı şəkil əlavə edin.'
          : 'Menyu məlumatlarınızı və parametrlərini yeniləyin.'
        }
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        {/* Basic Information */}
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
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{
                width: 3,
                height: 20,
                backgroundColor: theme.palette.mode === 'light' ? '#007AFF' : '#0A84FF',
                borderRadius: 1.5
              }} />
              <Typography variant="h6" fontWeight={600} color="text.primary">
                📋 Menyu Məlumatları
              </Typography>
            </Box>
            
            <TextField
              fullWidth
              label="Menyu Adı"
              value={formData.name}
              onChange={handleInputChange('name')}
              required
              InputProps={{
                startAdornment: <Menu size={20} style={{ marginRight: 8, color: '#666' }} />,
              }}
            />
          </CardContent>
        </Card>

        {/* Menu Image */}
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
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{
                width: 3,
                height: 20,
                backgroundColor: theme.palette.mode === 'light' ? '#FF9500' : '#FF9F0A',
                borderRadius: 1.5
              }} />
              <Typography variant="h6" fontWeight={600} color="text.primary">
                📸 Menyu Şəkli (İstəyə bağlı)
              </Typography>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'center', sm: 'flex-start' },
              gap: 3, 
              mb: 2 
            }}>
              {/* Image Preview */}
              <Box sx={{
                width: { xs: 150, sm: 120 },
                height: { xs: 150, sm: 120 },
                borderRadius: 2,
                overflow: 'hidden',
                border: '2px dashed',
                borderColor: imagePreview ? 'primary.main' : 'grey.300',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: imagePreview ? 'transparent' : 'grey.50',
                position: 'relative',
                flexShrink: 0,
                mx: { xs: 'auto', sm: 0 }
              }}>
                {imagePreview ? (
                  <>
                    <Box
                      component="img"
                      src={imagePreview}
                      alt="Menu preview"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                      onError={() => {
                        // console.error('❌ MenuForm - Image failed to load:', imagePreview);
                        setImagePreview(null);
                      }}
                      onLoad={() => {
                        // console.log('✅ MenuForm - Image loaded successfully:', imagePreview);
                      }}
                    />
                    <IconButton
                      onClick={handleRemoveImage}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        bgcolor: 'error.main',
                        color: 'white',
                        width: 24,
                        height: 24,
                        '&:hover': {
                          bgcolor: 'error.dark',
                        }
                      }}
                      size="small"
                    >
                      <X size={12} />
                    </IconButton>
                  </>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Menu size={32} color="#999" />
                    <Typography variant="caption" color="text.secondary">
                      Şəkil Yoxdur
                    </Typography>
                  </Box>
                )}
              </Box>
              
              {/* Upload Button */}
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'center', sm: 'flex-start' },
                textAlign: { xs: 'center', sm: 'left' },
                flex: 1,
                minHeight: 120, // Prevent layout shift when error appears
              }}>
                <input
                  accept="image/jpeg,image/jpg,image/png"
                  style={{ display: 'none' }}
                  id="menu-image-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="menu-image-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<Upload size={18} />}
                    sx={{ 
                      mb: 1,
                      background: theme.palette.mode === 'light' ? '#007AFF' : '#0A84FF',
                      '&:hover': {
                        background: theme.palette.mode === 'light' ? '#0056CC' : '#0A84FF',
                      },
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Şəkil Seç
                  </Button>
                </label>
                <Typography variant="body2" color="text.secondary">
                  Yalnız JPG, PNG, JPEG (Maksimum 5MB)
                </Typography>
                
                {imageError && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mt: 1, 
                      width: '100%',
                      maxWidth: 350,
                      fontSize: '0.875rem',
                      '& .MuiAlert-message': {
                        padding: '4px 0',
                      }
                    }}
                  >
                    {imageError}
                  </Alert>
                )}
                
                {imagePreview && !imageError && (
                  <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                    ✓ Şəkil uğurla yükləndi
                  </Typography>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          justifyContent: 'flex-end',
          mt: 4,
          position: { xs: 'fixed', sm: 'relative' }, // Fixed on mobile
          bottom: { xs: 0, sm: 'auto' },
          left: { xs: 0, sm: 'auto' },
          right: { xs: 0, sm: 'auto' },
          p: { xs: 2, sm: 0 },
          bgcolor: { xs: 'background.paper', sm: 'transparent' },
          borderTop: { xs: '1px solid', sm: 'none' },
          borderColor: { xs: 'divider', sm: 'transparent' },
          zIndex: { xs: 1000, sm: 'auto' },
          boxShadow: { xs: '0 -2px 8px rgba(0,0,0,0.1)', sm: 'none' },
        }}>
          <Button
            variant="outlined"
            size="large"
            onClick={onCancel}
            disabled={loading}
            sx={{
              minWidth: 120,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              flex: { xs: 1, sm: 'none' }, // Full width on mobile
            }}
          >
            Ləğv Et
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading || !formData.name.trim()}
            startIcon={loading ? <CircularProgress size={16} /> : undefined}
            sx={{ 
              minWidth: 200,
              background: theme.palette.mode === 'light' ? '#34C759' : '#30D158',
              '&:hover': {
                background: theme.palette.mode === 'light' ? '#28A745' : '#30D158',
              },
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              py: 1.5,
              flex: { xs: 2, sm: 'none' }, // Larger on mobile
            }}
          >
            {loading 
              ? 'Saxlanılır...' 
              : isNewMenu 
                ? 'Menyu Yarat' 
                : 'Menyunu Yenilə'
            }
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MenuForm;
