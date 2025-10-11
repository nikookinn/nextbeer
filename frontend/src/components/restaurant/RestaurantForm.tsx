import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
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
import { Upload, X, Store, Phone, Mail, Clock, MapPin, Instagram, Facebook } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
import { RestaurantFormData, RestaurantResponseDto, LocationCoordinates } from '../../types/restaurant.types';
import LocationPicker from './LocationPicker';
import { getFullImageUrl } from '../../utils/imageUtils';

interface RestaurantFormProps {
  initialData?: RestaurantResponseDto | null;
  onSubmit: (data: RestaurantFormData) => void;
  loading?: boolean;
  error?: string | null;
}

const RestaurantForm: React.FC<RestaurantFormProps> = ({
  initialData,
  onSubmit,
  loading = false,
  error = null,
}) => {
  const theme = useTheme();
  const [formData, setFormData] = useState<RestaurantFormData>({
    name: '',
    about: '',
    phoneNumber: '',
    address: '',
    workingHours: '',
    email: '',
    instagramUrl: '',
    facebookUrl: '',
    twitterUrl: '',
    latitude: undefined,
    longitude: undefined,
    removeImage: false,
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Initialize form with existing data
  useEffect(() => {
    // console.log('🔄 RestaurantForm useEffect triggered with initialData:', initialData);
    
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        about: initialData.about || '',
        phoneNumber: initialData.phoneNumber || '',
        address: initialData.address || '',
        workingHours: initialData.workingHours || '',
        email: initialData.email || '',
        instagramUrl: initialData.instagramUrl || '',
        facebookUrl: initialData.facebookUrl || '',
        twitterUrl: initialData.twitterUrl || '',
        latitude: initialData.latitude,
        longitude: initialData.longitude,
        removeImage: false,
      });

      // Set restaurant image preview
      if (initialData.imageUrl) {
        const fullImageUrl = getFullImageUrl(initialData.imageUrl);
        
        // console.log('📱 RestaurantForm Debug - Original imageUrl:', initialData.imageUrl);
        // console.log('📱 RestaurantForm Debug - Full imageUrl:', fullImageUrl);
        // console.log('📱 RestaurantForm Debug - Current hostname:', window.location.hostname);
        // console.log('📱 RestaurantForm Debug - Setting imagePreview to:', fullImageUrl);
        
        setImagePreview(fullImageUrl);
        // Clear selected image since we're showing existing image
        setSelectedImage(null);
      } else {
        // console.log('⚠️ RestaurantForm Debug - No imageUrl in initialData');
        setImagePreview(null);
        setSelectedImage(null);
      }
    } else {
      // console.log('⚠️ RestaurantForm Debug - No initialData provided');
      setImagePreview(null);
      setSelectedImage(null);
    }
  }, [initialData]);

  const handleInputChange = (field: keyof RestaurantFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleLocationChange = (location: LocationCoordinates | null) => {
    setFormData(prev => ({
      ...prev,
      latitude: location?.latitude,
      longitude: location?.longitude,
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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
    setFormData(prev => ({ ...prev, removeImage: true }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    const submitData: RestaurantFormData = {
      ...formData,
      websiteImage: selectedImage || undefined,
    };

    onSubmit(submitData);
  };

  const isNewRestaurant = !initialData;

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      sx={{ 
        minHeight: '100vh',
        pb: { xs: 15, sm: 4 },
        position: 'relative',
        // Mobile scroll optimization
        '@media (max-width: 600px)': {
          touchAction: 'pan-y',
          overflowX: 'hidden',
        }
      }}
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Store size={28} />
        {isNewRestaurant ? 'Restoran Yarat' : 'Restoran Parametrləri'}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {isNewRestaurant 
          ? 'Restoran məlumatlarınızı qurun. Bu məlumatlar müştərilərinizə göstəriləcək.'
          : 'Restoran məlumatlarınızı və parametrlərinizi yeniləyin.'
        }
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12}>
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
                  📋 Əsas Məlumatlar
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Restoran Adı"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    required
                    InputProps={{
                      startAdornment: <Store size={20} style={{ marginRight: 8, color: '#666' }} />,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Telefon Nömrəsi"
                    value={formData.phoneNumber}
                    onChange={handleInputChange('phoneNumber')}
                    required
                    InputProps={{
                      startAdornment: <Phone size={20} style={{ marginRight: 8, color: '#666' }} />,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Restoran Haqqında"
                    value={formData.about}
                    onChange={handleInputChange('about')}
                    multiline
                    rows={4}
                    required
                    helperText="Restoranınızı, mətbəxinizi, atmosferinizi və s. təsvir edin."
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="E-poçt"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    required
                    InputProps={{
                      startAdornment: <Mail size={20} style={{ marginRight: 8, color: '#666' }} />,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="İş Saatları"
                    value={formData.workingHours}
                    onChange={handleInputChange('workingHours')}
                    required
                    placeholder="məs., B.e-B: 10:00-22:00"
                    InputProps={{
                      startAdornment: <Clock size={20} style={{ marginRight: 8, color: '#666' }} />,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Ünvan"
                    value={formData.address}
                    onChange={handleInputChange('address')}
                    required
                    multiline
                    rows={2}
                    InputProps={{
                      startAdornment: <MapPin size={20} style={{ marginRight: 8, color: '#666' }} />,
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Social Media */}
        <Grid item xs={12}>
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
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{
                  width: 3,
                  height: 20,
                  backgroundColor: theme.palette.mode === 'light' ? '#34C759' : '#30D158',
                  borderRadius: 1.5
                }} />
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  🌐 Sosial Media (İstəyə bağlı)
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Instagram URL"
                    value={formData.instagramUrl}
                    onChange={handleInputChange('instagramUrl')}
                    placeholder="https://instagram.com/restoraniniz"
                    InputProps={{
                      startAdornment: <Instagram size={20} style={{ marginRight: 8, color: '#666' }} />,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Facebook URL"
                    value={formData.facebookUrl}
                    onChange={handleInputChange('facebookUrl')}
                    placeholder="https://facebook.com/restoraniniz"
                    InputProps={{
                      startAdornment: <Facebook size={20} style={{ marginRight: 8, color: '#666' }} />,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="TikTok URL"
                    value={formData.twitterUrl}
                    onChange={handleInputChange('twitterUrl')}
                    placeholder="https://tiktok.com/@restoraniniz"
                    InputProps={{
                      startAdornment: <FaTiktok size={20} style={{ marginRight: 8, color: '#666' }} />,
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Location */}
        <Grid item xs={12}>
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
          }}>
            <CardContent>
              <LocationPicker
                value={formData.latitude && formData.longitude ? {
                  latitude: formData.latitude,
                  longitude: formData.longitude
                } : null}
                onChange={handleLocationChange}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Restaurant Image */}
        <Grid item xs={12}>
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
                  📸 Restoran Şəkli
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
                        alt="Restoran önizləməsi"
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                        onError={() => {
                          // console.error('❌ RestaurantForm - Image failed to load:', imagePreview);
                          // console.error('❌ RestaurantForm - Current hostname:', window.location.hostname);
                          // console.error('❌ RestaurantForm - Trying to load from backend...');
                          // Reset to no image state instead of showing X
                          setImagePreview(null);
                        }}
                        onLoad={() => {
                          // console.log('✅ RestaurantForm - Image loaded successfully:', imagePreview);
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
                      <Store size={32} color="#999" />
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
                  flex: 1
                }}>
                  <input
                    accept="image/jpeg,image/jpg,image/png"
                    style={{ display: 'none' }}
                    id="restaurant-image-upload"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="restaurant-image-upload">
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
                    JPG və ya PNG (Maksimum 5MB)
                  </Typography>
                  
                  {imagePreview && (
                    <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                      ✓ Şəkil uğurla yükləndi
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: 2,
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
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
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
                flex: { xs: 1, sm: 'none' }, // Full width on mobile
              }}
            >
              {loading 
                ? 'Saxlanılır...' 
                : isNewRestaurant 
                  ? 'Restoran Yarat' 
                  : 'Restoranı Yenilə'
              }
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RestaurantForm;
