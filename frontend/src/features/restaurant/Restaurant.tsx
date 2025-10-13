import React, { useEffect, useState } from 'react';
import { Box, Alert, Skeleton, Snackbar } from '@mui/material';
import { CheckCircle } from 'lucide-react';
import { useGetRestaurantQuery, useCreateRestaurantMutation, useUpdateRestaurantMutation } from '../../api/restaurantApi';
import { RestaurantFormData } from '../../types/restaurant.types';
import RestaurantForm from '../../components/restaurant/RestaurantForm';

const Restaurant: React.FC = () => {
  const { data: restaurant, isLoading, error, refetch } = useGetRestaurantQuery();
  const [createRestaurant, { isLoading: isCreating, error: createError }] = useCreateRestaurantMutation();
  const [updateRestaurant, { isLoading: isUpdating, error: updateError }] = useUpdateRestaurantMutation();
  
  // Debug: Check API response
  React.useEffect(() => {
    if (restaurant) {
      // console.log('Restaurant API Response:', restaurant);
      // console.log('ImageUrl:', restaurant.imageUrl);
    }
  }, [restaurant]);
  
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (submitError) {
      const timer = setTimeout(() => setSubmitError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitError]);

  const handleSubmit = async (formData: RestaurantFormData) => {
    try {
      setSubmitError(null);
      setSuccessMessage(null);

      // Create FormData for multipart request
      const submitFormData = new FormData();
      
      // Add restaurant data as JSON blob (Spring Boot @RequestPart expects this format)
      const restaurantData = {
        name: formData.name,
        about: formData.about,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        workingHours: formData.workingHours,
        email: formData.email,
        instagramUrl: formData.instagramUrl || '',
        facebookUrl: formData.facebookUrl || '',
        twitterUrl: formData.twitterUrl || '',
        latitude: formData.latitude,
        longitude: formData.longitude,
        removeImage: formData.removeImage || false,
      };

      // Spring Boot @RequestPart expects JSON as Blob with correct content type
      const restaurantBlob = new Blob([JSON.stringify(restaurantData)], {
        type: 'application/json'
      });
      
      submitFormData.append('restaurant', restaurantBlob);

      // Add image if selected
      if (formData.websiteImage) {
        submitFormData.append('restaurantImage', formData.websiteImage);
        // console.log('Image added to FormData:', formData.websiteImage.name, formData.websiteImage.size, 'bytes');
      } else {
        // console.log('No image selected');
      }

      // Determine if this is create or update
      const isNewRestaurant = !restaurant;

      if (isNewRestaurant) {
        await createRestaurant(submitFormData).unwrap();
        setSuccessMessage('Restoran uğurla yaradıldı!');
      } else {
        await updateRestaurant(submitFormData).unwrap();
        setSuccessMessage('Restoran məlumatları uğurla yeniləndi!');
      }

      // Refetch data to get updated information
      // console.log('Restaurant - Calling refetch to get updated data...');
      refetch();
    } catch (error: any) {
      setSubmitError(
        error?.data?.message || 
        error?.message || 
        'Restoran məlumatlarını saxlayarkən xəta baş verdi.'
      );
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width={300} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" width={500} height={20} sx={{ mb: 4 }} />
        <Skeleton variant="rectangular" width="100%" height={400} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" width="100%" height={300} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" width="100%" height={200} />
      </Box>
    );
  }

  // Error state
  if (error && 'status' in error && error.status !== 404) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Restoran məlumatlarını yükləmək alınmadı. Zəhmət olmasa daha sonra yenidən cəhd edin.
        </Alert>
      </Box>
    );
  }

  const currentError = submitError || 
    (createError && 'data' in createError ? (createError.data as any)?.message : null) ||
    (updateError && 'data' in updateError ? (updateError.data as any)?.message : null);

  return (
    <Box sx={{ p: 3 }}>
      <RestaurantForm
        initialData={restaurant || null}
        onSubmit={handleSubmit}
        loading={isCreating || isUpdating}
        error={currentError}
      />
      
      {/* Professional Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          zIndex: (theme) => theme.zIndex.snackbar + 100, // Much higher than AppBar
          mt: { xs: 7, sm: 8 }, // Margin-top equal to AppBar height
          '& .MuiSnackbarContent-root': {
            background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
            color: 'white',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            fontSize: '1rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            minWidth: 320,
            padding: '12px 24px',
          }
        }}
        message={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CheckCircle size={24} />
            <Box>
              <Box sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                ✅ Uğurlu!
              </Box>
              <Box sx={{ fontSize: '0.9rem', opacity: 0.9, mt: 0.5 }}>
                {successMessage}
              </Box>
            </Box>
          </Box>
        }
      />
    </Box>
  );
};

export default Restaurant;
