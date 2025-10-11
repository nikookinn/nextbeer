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
  Avatar,
  InputAdornment,
  Chip,
  Autocomplete,
} from '@mui/material';
import { ArrowLeft, Save, Package, ChevronRight, Upload, X, Plus, Trash2 } from 'lucide-react';
import { ItemFormData, ItemResponseDto, ItemVariantFormData } from '../../types/item';
import {
  useCreateItemMutation,
  useUpdateItemMutation,
} from '../../api/itemApi';
import { useGetAllItemTagsQuery } from '../../api/itemTagApi';
import { getFullImageUrl } from '../../utils/imageUtils';

interface ItemFormProps {
  item?: ItemResponseDto;
  categoryId: number;
  categoryName?: string;
  menuName?: string;
  onBack: () => void;
  onSuccess: () => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ 
  item, 
  categoryId, 
  categoryName, 
  menuName, 
  onBack, 
  onSuccess 
}) => {
  const theme = useTheme();
  const [formData, setFormData] = useState<ItemFormData>({
    name: '',
    price: '',
    description: '',
    categoryId: categoryId,
    variants: [],
    tagIds: [],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [createItem, { isLoading: isCreating }] = useCreateItemMutation();
  const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation();
  
  // Get all item tags for selection
  const { data: itemTags = [] } = useGetAllItemTagsQuery();

  const isEditing = !!item;
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        price: item.price.toString(),
        description: item.description,
        categoryId: categoryId,
        variants: item.itemVariantResponses?.map(variant => ({
          id: variant.id,
          name: variant.name,
          price: variant.price.toString(),
        })) || [],
        tagIds: item.itemTagResponses?.map(tag => tag.id) || [],
      });
      
      // Set existing image preview
      if (item.imageUrl) {
        setImagePreview(getFullImageUrl(item.imageUrl));
      }
    }
  }, [item, categoryId]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Məhsul adı tələb olunur';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Məhsul adı ən azı 2 simvol olmalıdır';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Məhsul adı 100 simvoldan az olmalıdır';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Qiymət tələb olunur';
    } else {
      const priceNum = parseFloat(formData.price);
      const hasVariants = formData.variants && formData.variants.length > 0;
      
      if (isNaN(priceNum)) {
        newErrors.price = 'Qiymət düzgün ədəd olmalıdır';
      } else if (!hasVariants && priceNum <= 0) {
        newErrors.price = 'Qiymət müsbət olmalıdır (və ya variantlar əlavə edin)';
      } else if (hasVariants && priceNum < 0) {
        newErrors.price = 'Qiymət mənfi ola bilməz';
      } else if (priceNum > 999999) {
        newErrors.price = 'Qiymət 1,000,000-dan az olmalıdır';
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Təsvir tələb olunur';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Təsvir ən azı 10 simvol olmalıdır';
    } else if (formData.description.trim().length > 500) {
      newErrors.description = 'Təsvir 500 simvoldan az olmalıdır';
    }

    // Variant validation
    if (formData.variants && formData.variants.length > 0) {
      formData.variants.forEach((variant, index) => {
        if (!variant.name.trim()) {
          newErrors[`variant_${index}_name`] = 'Variant adı tələb olunur';
        }
        if (!variant.price.trim()) {
          newErrors[`variant_${index}_price`] = 'Variant qiyməti tələb olunur';
        } else {
          const variantPrice = parseFloat(variant.price);
          if (isNaN(variantPrice) || variantPrice <= 0) {
            newErrors[`variant_${index}_price`] = 'Variant qiyməti müsbət olmalıdır';
          }
        }
      });
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
      // Create FormData for multipart request
      const submitFormData = new FormData();
      
      // Create item data object without the file
      const itemData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        categoryId: formData.categoryId,
        removeImage: formData.removeImage || false,
        variants: formData.variants?.map(variant => ({
          id: variant.id,
          name: variant.name.trim(),
          price: parseFloat(variant.price),
        })) || [],
        tagIds: formData.tagIds || [],
      };

      // Add item data as JSON blob
      const itemBlob = new Blob([JSON.stringify(itemData)], {
        type: 'application/json'
      });
      
      submitFormData.append('item', itemBlob);

      // Add image if selected
      if (selectedImage) {
        submitFormData.append('itemImage', selectedImage);
        console.log('📷 Item Image added to FormData:', selectedImage.name, selectedImage.size, 'bytes');
      }

      if (isEditing && item) {
        await updateItem({
          id: item.itemId,
          formData: submitFormData,
        }).unwrap();
      } else {
        await createItem(submitFormData).unwrap();
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleInputChange = (field: keyof ItemFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: '' }));
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type - only allow PNG, JPG, JPEG
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, image: 'Yalnız PNG, JPG və JPEG formatları dəstəklənir.' }));
        // Clear the input
        event.target.value = '';
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Fayl ölçüsü 5MB-dan az olmalıdır.' }));
        // Clear the input
        event.target.value = '';
        return;
      }

      setSelectedImage(file);
      setFormData(prev => ({ ...prev, removeImage: false }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear any previous image errors
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }));
      }
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, removeImage: true }));
  };

  // Variant management functions
  const addVariant = () => {
    const newVariant: ItemVariantFormData = {
      name: '',
      price: '',
    };
    setFormData(prev => ({
      ...prev,
      variants: [...(prev.variants || []), newVariant],
    }));
  };

  const updateVariant = (index: number, field: keyof ItemVariantFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants?.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      ) || [],
    }));
  };

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants?.filter((_, i) => i !== index) || [],
    }));
  };

  // Tag management
  const handleTagChange = (_: any, newValue: number[]) => {
    setFormData(prev => ({ ...prev, tagIds: newValue }));
  };

  return (
    <Box sx={{ 
      position: 'relative',
    }}>
      {/* Header with Back Button */}
      <Box sx={{ mb: 3 }}>
        {/* Back Button and Breadcrumb on same line */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
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
              {categoryName || 'Kateqoriya'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isEditing ? 'Məhsulu Redaktə Et' : 'Yeni Məhsul Yarat'}
            </Typography>
          </Breadcrumbs>
        </Box>
        
        {/* Main Title with Icon below breadcrumb */}
        <Typography 
          variant="h4" 
          fontWeight="bold" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            lineHeight: 1.2,
            ml: 0, // Start from the left edge, aligned with back button
          }}
        >
          <Package size={28} />
          {isEditing ? 'Məhsulu Redaktə Et' : 'Yeni Məhsul Yarat'}
        </Typography>
      </Box>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {isEditing 
          ? 'Məhsul məlumatlarını, qiyməti və şəkli yeniləyin.'
          : 'Detallar, qiymət və şəkillə yeni menyu məhsulu yaradın.'
        }
      </Typography>

      {Object.keys(errors).length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Zəhmət olmasa göndərmədən əvvəl yuxarıdakı xətaları düzəldin.
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
                backgroundColor: theme.palette.mode === 'light' ? '#FF9500' : '#FF9500',
                borderRadius: 1.5
              }} />
              <Typography variant="h6" fontWeight={600} color="text.primary">
                📦 Məhsul Məlumatları
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label="Məhsul Adı"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name || 'Bu məhsul üçün təsviri bir ad daxil edin'}
                required
                placeholder="məs., Marqarita Pizza, Sezar Salatı və s."
                InputProps={{
                  startAdornment: <Package size={20} style={{ marginRight: 8, color: '#666' }} />,
                }}
              />

              <TextField
                fullWidth
                label="Qiymət"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                error={!!errors.price}
                helperText={errors.price || (formData.variants && formData.variants.length > 0 
                  ? 'Esas qiymət (variantların ayrıca qiyməti varsa 0 ola bilər)'
                  : 'Qiyməti daxil edin (₼)')}
                required
                placeholder="0.00"
                type="number"
                inputProps={{
                  step: '0.01',
                  min: formData.variants && formData.variants.length > 0 ? '0' : '0.01',
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ color: '#666', fontSize: '20px', fontWeight: 'bold' }}>
                        ₼
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Təsvir"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                error={!!errors.description}
                helperText={errors.description || 'Məhsul haqqında ətraflı təsvir verin'}
                required
                multiline
                rows={4}
                placeholder="Məhsulu, tərkibini, hazırlanma üsulunu və s. təsvir edin"
              />
            </Box>
          </CardContent>
        </Card>

        {/* Image Upload */}
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
                backgroundColor: theme.palette.mode === 'light' ? '#3B82F6' : '#3B82F6',
                borderRadius: 1.5
              }} />
              <Typography variant="h6" fontWeight={600} color="text.primary">
                📷 Məhsul Şəkli
              </Typography>
            </Box>

            {/* Fixed layout with stable positioning */}
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '200px 1fr' },
              gap: 3,
              alignItems: 'start', // Align to top to prevent shifting
            }}>
              {/* Left side: Image Preview and Upload - Fixed width */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: 2,
                width: { xs: '100%', md: '200px' }, // Fixed width on desktop
                mx: { xs: 'auto', md: 0 }, // Center on mobile
              }}>
                {/* Image Preview - Smaller size */}
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={imagePreview || undefined}
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      border: `2px dashed ${theme.palette.divider}`,
                      bgcolor: theme.palette.mode === 'light' ? '#F8FAFC' : '#1E293B',
                    }}
                  >
                    {!imagePreview && <Package size={24} color={theme.palette.text.secondary} />}
                  </Avatar>
                  
                  {imagePreview && (
                    <IconButton
                      onClick={handleRemoveImage}
                      sx={{
                        position: 'absolute',
                        top: -6,
                        right: -6,
                        bgcolor: theme.palette.error.main,
                        color: 'white',
                        width: 20,
                        height: 20,
                        '&:hover': {
                          bgcolor: theme.palette.error.dark,
                        },
                      }}
                    >
                      <X size={12} />
                    </IconButton>
                  )}
                </Box>

                {/* Upload Button - Compact */}
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<Upload size={16} />}
                  size="small"
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2,
                    py: 1,
                    fontSize: '0.875rem',
                    width: 'fit-content',
                  }}
                >
                  Şəkil Seç
                  <input
                    type="file"
                    hidden
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleImageChange}
                  />
                </Button>

                {/* Error message - Fixed positioning */}
                <Box sx={{ 
                  width: '100%', 
                  minHeight: 60, // Reserve space for error message
                  display: 'flex',
                  alignItems: 'flex-start',
                }}>
                  {errors.image && (
                    <Alert 
                      severity="error" 
                      sx={{ 
                        width: '100%',
                        fontSize: '0.875rem',
                        '& .MuiAlert-message': {
                          padding: '4px 0',
                        }
                      }}
                    >
                      {errors.image}
                    </Alert>
                  )}
                </Box>
              </Box>

              {/* Right side: Image Guidelines - Fixed positioning */}
              <Box sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: theme.palette.mode === 'light' ? '#EBF8FF' : '#1E3A8A20',
                border: `1px solid ${theme.palette.mode === 'light' ? '#3B82F6' : '#3B82F6'}`,
                width: '100%',
                alignSelf: 'start', // Stay at top regardless of left side height
                position: 'sticky',
                top: 0,
              }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                  📋 Şəkil Qaydaları:
                </Typography>
                <Typography variant="body2" color="text.secondary" component="ul" sx={{ pl: 2, m: 0, fontSize: '0.8rem' }}>
                  <li>Ölçü: 800x800px və üzəri tövsiyə olunur</li>
                  <li>Format: Yalnız JPG, PNG, JPEG</li>
                  <li>Maksimum ölçü: 5MB</li>
                  <li>Yüksək keyfiyyətli, yaxşı işıqlı fotolar</li>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Item Tags */}
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
                backgroundColor: theme.palette.mode === 'light' ? '#10B981' : '#10B981',
                borderRadius: 1.5
              }} />
              <Typography variant="h6" fontWeight={600} color="text.primary">
                🏷️ Məhsul Etiketləri
              </Typography>
            </Box>

            <Autocomplete
              multiple
              options={itemTags.map(tag => tag.id)}
              getOptionLabel={(option) => itemTags.find(tag => tag.id === option)?.name || ''}
              value={formData.tagIds || []}
              onChange={handleTagChange}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const tag = itemTags.find(t => t.id === option);
                  return (
                    <Chip
                      variant="filled"
                      label={tag?.name || ''}
                      {...getTagProps({ index })}
                      key={option}
                      sx={{
                        bgcolor: '#10B981',
                        color: 'white',
                        '& .MuiChip-deleteIcon': {
                          color: 'white',
                        },
                      }}
                    />
                  );
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Etiket Seçin"
                  placeholder="Bu məhsul üçün etiketləri seçin"
                  helperText="Bu məhsulu qruplaşdırmaq üçün uyğun etiketləri seçin"
                />
              )}
              sx={{ width: '100%' }}
            />

            {/* Tag Guidelines */}
            <Box sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: theme.palette.mode === 'light' ? '#ECFDF5' : '#064E3B20',
              border: `1px solid ${theme.palette.mode === 'light' ? '#10B981' : '#10B981'}`,
              width: '100%',
              mt: 2,
            }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                🏷️ <strong>Etiket Qaydaları:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" component="ul" sx={{ pl: 2, m: 0 }}>
                <li>Etiketlər müştərilərin məhsulları asan tapmasına kömək edir</li>
                <li>"Acılı", "Vegetarian", "Populyar" kimi təsviri etiketlərdən istifadə edin</li>
                <li>Hər məhsul üçün bir neçə etiket seçə bilərsiniz</li>
                <li>Etiketlər bütün məhsullar arasında paylaşılır</li>
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Item Variants */}
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  width: 3,
                  height: 20,
                  backgroundColor: theme.palette.mode === 'light' ? '#8B5CF6' : '#8B5CF6',
                  borderRadius: 1.5
                }} />
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  🔄 Məhsul Variantları
                </Typography>
              </Box>
              
              <Button
                variant="outlined"
                startIcon={<Plus size={16} />}
                onClick={addVariant}
                sx={{
                  borderColor: '#8B5CF6',
                  color: '#8B5CF6',
                  '&:hover': {
                    borderColor: '#7C3AED',
                    bgcolor: '#8B5CF610',
                  },
                }}
              >
                Variant Əlavə Et
              </Button>
            </Box>

            {formData.variants && formData.variants.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {formData.variants.map((variant, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 2,
                      bgcolor: theme.palette.mode === 'light' ? '#FAFAFA' : '#1A1A1A',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Variant #{index + 1}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => removeVariant(index)}
                        sx={{
                          color: 'error.main',
                          ml: 'auto',
                        }}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                      <TextField
                        fullWidth
                        label="Variant Adı"
                        value={variant.name}
                        onChange={(e) => updateVariant(index, 'name', e.target.value)}
                        placeholder="məs., Kiçik, Orta, Böyük"
                        error={!!errors[`variant_${index}_name`]}
                        helperText={errors[`variant_${index}_name`]}
                        sx={{ flex: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="Qiymət"
                        value={variant.price}
                        onChange={(e) => updateVariant(index, 'price', e.target.value)}
                        placeholder="0.00"
                        type="number"
                        error={!!errors[`variant_${index}_price`]}
                        helperText={errors[`variant_${index}_price`] || '0-dan böyük olmalıdır'}
                        inputProps={{
                          step: '0.01',
                          min: '0.01',
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Typography sx={{ color: '#666', fontSize: '20px', fontWeight: 'bold' }}>
                                ₼
                              </Typography>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ flex: 1 }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{
                p: 3,
                textAlign: 'center',
                border: `2px dashed ${theme.palette.divider}`,
                borderRadius: 2,
                bgcolor: theme.palette.mode === 'light' ? '#FAFAFA' : '#1A1A1A',
              }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Hələ variant əlavə edilməyib
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Plus size={16} />}
                  onClick={addVariant}
                  sx={{
                    borderColor: '#8B5CF6',
                    color: '#8B5CF6',
                    '&:hover': {
                      borderColor: '#7C3AED',
                      bgcolor: '#8B5CF610',
                    },
                  }}
                >
                  İlk Variantı Əlavə Et
                </Button>
              </Box>
            )}

            {/* Variant Guidelines */}
            <Box sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: theme.palette.mode === 'light' ? '#F3E8FF' : '#581C8720',
              border: `1px solid ${theme.palette.mode === 'light' ? '#8B5CF6' : '#8B5CF6'}`,
              width: '100%',
              mt: 2,
            }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                🔄 <strong>Variant Qaydaları:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" component="ul" sx={{ pl: 2, m: 0 }}>
                <li>Variantlar eyni məhsul üçün fərqli ölçü və seçimlərə imkan verir</li>
                <li>Hər variantın öz qiyməti ola bilər</li>
                <li>Nümunələr: Kiçik/Orta/Böyük, Normal/Acılı</li>
                <li>Variantlar isteğe bağlıdır - ehtiyac yoxdursa boş buraxa bilərsiniz</li>
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <Box
          sx={{
            position: { xs: 'fixed', sm: 'static' },
            bottom: { xs: 0, sm: 'auto' },
            left: { xs: 0, sm: 'auto' },
            right: { xs: 0, sm: 'auto' },
            p: { xs: 3, sm: 0 },
            backgroundColor: { xs: 'background.paper', sm: 'transparent' },
            borderTop: { xs: 1, sm: 0 },
            borderColor: { xs: 'divider', sm: 'transparent' },
            zIndex: { xs: 1000, sm: 'auto' },
            display: 'flex',
            gap: 2,
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
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Save size={20} />
              )
            }
            sx={{ 
              flex: { xs: 1, sm: 'none' },
              minWidth: { xs: 'auto', sm: 120 },
              background: theme.palette.mode === 'light' ? '#FF9500' : '#FF9500',
              '&:hover': {
                background: theme.palette.mode === 'light' ? '#FF6B00' : '#FF6B00',
              },
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            {isLoading
              ? isEditing
                ? 'Yenilənir...'
                : 'Yaradılır...'
              : isEditing
              ? 'Məhsulu Yenilə'
              : 'Məhsul Yarat'}
          </Button>
        </Box>
      </Box>

      {/* Mobile padding for fixed buttons */}
      <Box sx={{ height: { xs: 80, sm: 0 } }} />
    </Box>
  );
};

export default ItemForm;
