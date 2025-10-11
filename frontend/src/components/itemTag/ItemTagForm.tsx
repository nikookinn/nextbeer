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
} from '@mui/material';
import { ArrowLeft, Save, Tag } from 'lucide-react';
import { ItemTagFormData, ItemTagResponse } from '../../types/itemTag';
import {
  useCreateItemTagMutation,
  useUpdateItemTagMutation,
} from '../../api/itemTagApi';

interface ItemTagFormProps {
  itemTag?: ItemTagResponse;
  onBack: () => void;
  onSuccess: () => void;
}

const ItemTagForm: React.FC<ItemTagFormProps> = ({ itemTag, onBack, onSuccess }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState<ItemTagFormData>({
    name: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [createItemTag, { isLoading: isCreating }] = useCreateItemTagMutation();
  const [updateItemTag, { isLoading: isUpdating }] = useUpdateItemTagMutation();

  const isEditing = !!itemTag;
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (itemTag) {
      setFormData({
        name: itemTag.name,
      });
    }
  }, [itemTag]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Etiket adı tələb olunur';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Etiket adı ən azı 2 simvol olmalıdır';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Etiket adı 50 simvoldan az olmalıdır';
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
      };

      if (isEditing && itemTag) {
        await updateItemTag({
          id: itemTag.id,
          itemTag: requestData,
        }).unwrap();
      } else {
        await createItemTag(requestData).unwrap();
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving item tag:', error);
    }
  };

  const handleInputChange = (field: keyof ItemTagFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

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
        <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tag size={28} />
          {isEditing ? 'Məhsul Etiketini Redaktə Et' : 'Yeni Məhsul Etiketi Yarat'}
        </Typography>
      </Box>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {isEditing 
          ? 'Məhsul etiketi məlumatlarınızı və ayarlarınızı yeniləyin.'
          : 'Menyu məhsullarınız üçün yeni etiket yaradın. "Vegetarian", "Acılı" və ya "Populyar" kimi etiketlər əlavə edin.'
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
                backgroundColor: theme.palette.mode === 'light' ? '#007AFF' : '#0A84FF',
                borderRadius: 1.5
              }} />
              <Typography variant="h6" fontWeight={600} color="text.primary">
                🏷️ Etiket Məlumatları
              </Typography>
            </Box>
            
            <TextField
              fullWidth
              label="Etiket Adı"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name || 'Bu etiket üçün təsviri ad daxil edin (məs., Vegetarian, Acılı, Populyar)'}
              required
              placeholder="məs., Vegetarian, Acılı, Populyar və s."
              InputProps={{
                startAdornment: <Tag size={20} style={{ marginRight: 8, color: '#666' }} />,
              }}
            />
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
              background: theme.palette.mode === 'light' ? '#007AFF' : '#0A84FF',
              '&:hover': {
                background: theme.palette.mode === 'light' ? '#0056CC' : '#0A84FF',
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
              ? 'Etiketi Yenilə'
              : 'Etiket Yarat'}
          </Button>
        </Box>
      </Box>

      {/* Mobile padding for fixed buttons */}
      <Box sx={{ height: { xs: 80, sm: 0 } }} />
    </Box>
  );
};

export default ItemTagForm;
