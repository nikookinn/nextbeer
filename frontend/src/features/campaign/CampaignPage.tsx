import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Alert,
  Skeleton,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { Megaphone, AlertTriangle, CheckCircle } from 'lucide-react';
import { useGetCampaignsQuery, useCreateCampaignMutation, useUpdateCampaignMutation, useDeleteCampaignMutation } from '../../api/campaignApi';
import { CampaignFormData, CampaignResponse, PageResponse } from '../../types/campaign.types';
import CampaignCard from '../../components/campaign/CampaignCard';
import CampaignForm from '../../components/campaign/CampaignForm';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

type ViewMode = 'list' | 'form';

const CampaignPage: React.FC = () => {
  const theme = useTheme();
  
  // Infinite scroll state
  const [allCampaigns, setAllCampaigns] = useState<CampaignResponse[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const pageSize = 10; // 10 items per page
  
  // Get first page data
  const { data: firstPageData, isLoading, error, refetch } = useGetCampaignsQuery({ 
    page: 0, 
    size: pageSize 
  });
  
  const [createCampaign, { isLoading: isCreating }] = useCreateCampaignMutation();
  const [updateCampaign, { isLoading: isUpdating }] = useUpdateCampaignMutation();
  const [deleteCampaign, { isLoading: isDeleting }] = useDeleteCampaignMutation();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignResponse | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<CampaignResponse | null>(null);

  // Handle first page data
  React.useEffect(() => {
    if (firstPageData && !isLoading) {
      const pageData = firstPageData as PageResponse<CampaignResponse>;
      
      
      // Always update with fresh data
      setAllCampaigns(pageData.content);
      setHasNextPage(!pageData.last);
      
    }
  }, [firstPageData, isLoading]);

  // Simple approach: fetch next page manually
  const fetchNextPage = useCallback(async () => {
    if (hasNextPage) {
      const nextPageNumber = Math.floor(allCampaigns.length / pageSize);
      
      
      try {
        // Direct fetch to avoid RTK Query cache issues
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`/api/v1/campaigns?page=${nextPageNumber}&size=${pageSize}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const pageData: PageResponse<CampaignResponse> = await response.json();
          
          // Only add truly new campaigns
          setAllCampaigns(prev => {
            const existingIds = new Set(prev.map(campaign => campaign.campaignId));
            const newCampaigns = pageData.content.filter(campaign => !existingIds.has(campaign.campaignId));
            
            
            if (newCampaigns.length > 0) {
              return [...prev, ...newCampaigns];
            }
            return prev;
          });
          
          setHasNextPage(!pageData.last);
        } else {
          setHasNextPage(false);
        }
      } catch (error) {
        setHasNextPage(false);
      }
    }
  }, [allCampaigns.length, hasNextPage, pageSize]);

  // Infinite scroll hook
  const { lastElementRef, isFetching } = useInfiniteScroll(
    hasNextPage,
    fetchNextPage
  );

  // Handle refetch after create/update/delete
  const handleRefetch = useCallback(() => {
    // Scroll to top first
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Just refetch without clearing state - let the effect handle the update
    refetch().then(() => {
      // Reset pagination state after successful refetch
      setHasNextPage(true);
    });
  }, [refetch]);

  // Auto-clear submit error after 5 seconds
  React.useEffect(() => {
    if (submitError) {
      const timer = setTimeout(() => {
        setSubmitError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitError]);

  const handleAddCampaign = () => {
    // Scroll to top when opening form
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setSelectedCampaign(null);
    setViewMode('form');
  };

  const handleEditCampaign = (campaign: CampaignResponse) => {
    // Scroll to top when opening form
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setSelectedCampaign(campaign);
    setViewMode('form');
  };

  const handleDeleteCampaign = (campaign: CampaignResponse) => {
    setCampaignToDelete(campaign);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (campaignToDelete) {
      try {
        await deleteCampaign(campaignToDelete.campaignId).unwrap();
        setSuccessMessage(`"${campaignToDelete.name}" kampaniyası uğurla silindi!`);
        handleRefetch();
      } catch (error: any) {
        setSubmitError(error?.data?.message || 'Kampaniyanı silmək alınmadı');
      }
    }
    setDeleteDialogOpen(false);
    setCampaignToDelete(null);
  };

  const handleFormSubmit = async (formData: CampaignFormData) => {
    try {
      setSubmitError(null);
      setSuccessMessage(null);

      // Create FormData for multipart request
      const submitFormData = new FormData();
      
      // Add campaign data as JSON blob
      const campaignData = {
        name: formData.name,
        removeImage: formData.removeImage || false,
      };

      const campaignBlob = new Blob([JSON.stringify(campaignData)], {
        type: 'application/json'
      });
      
      submitFormData.append('campaign', campaignBlob);

      // Add image if selected
      if (formData.campaignImage) {
        submitFormData.append('campaignImage', formData.campaignImage);
      }

      // Determine if this is create or update
      const isNewCampaign = !selectedCampaign;

      if (isNewCampaign) {
        await createCampaign(submitFormData).unwrap();
        setSuccessMessage('Kampaniya uğurla yaradıldı!');
      } else {
        await updateCampaign({ 
          id: selectedCampaign.campaignId, 
          formData: submitFormData 
        }).unwrap();
        setSuccessMessage('Kampaniya uğurla yeniləndi!');
      }

      // Go back to list view and refetch data
      setViewMode('list');
      setSelectedCampaign(null);
      handleRefetch();
    } catch (error: any) {
      setSubmitError(
        error?.data?.message || 
        error?.message || 
        'Kampaniya məlumatlarını saxlayarkən xəta baş verdi.'
      );
    }
  };

  const handleFormCancel = () => {
    setSelectedCampaign(null);
    setViewMode('list');
  };

  // Show form view
  if (viewMode === 'form') {
    return (
      <CampaignForm
        initialData={selectedCampaign}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        loading={isCreating || isUpdating}
        error={submitError}
      />
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <Box className="page-container" sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Megaphone size={32} />
          Kampaniyalar
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600 }}>
          Restoranınız üçün promosyon kampaniyaları yaradın və idarə edin. Müştərilərinizi cəlb etmək və satışları artırmaq üçün cəlbedici təkliflər, elanlar və xüsusi endirimlər əlavə edin.
        </Typography>
        <Box className="campaign-cards-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width={300}
              height={320}
              sx={{
                borderRadius: 3,
                bgcolor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.06)',
              }}
            />
          ))}
        </Box>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box className="page-container" sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Megaphone size={32} />
          Kampaniyalar
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600 }}>
          Restoranınız üçün promosyon kampaniyaları yaradın və idarə edin. Müştərilərinizi cəlb etmək və satışları artırmaq üçün cəlbedici təkliflər, elanlar və xüsusi endirimlər əlavə edin.
        </Typography>
        <Alert severity="error">
          Kampaniyaları yükləmək alınmadı. Zəhmət olmasa daha sonra yenidən cəhd edin.
        </Alert>
      </Box>
    );
  }

  const hasCampaigns = allCampaigns.length > 0;

  return (
    <Box className="page-container" sx={{ 
      p: { xs: 2, sm: 3 },
      // Mobile scroll optimization with proper bottom padding
      '@media (max-width: 600px)': {
        touchAction: 'pan-y',
        overflowX: 'hidden',
        paddingBottom: '80px !important', // Extra bottom padding for mobile
      }
    }}>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Megaphone size={32} />
        Kampaniyalar
      </Typography>
      
      {/* Description */}
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600 }}>
        Restoranınız üçün promosyon kampaniyaları yaradın və idarə edin. Müştərilərinizi cəlb etmək və satışları artırmaq üçün cəlbedici təkliflər, elanlar və xüsusi endirimlər əlavə edin.
      </Typography>

      {!hasCampaigns && !isLoading ? (
        /* Empty State */
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          textAlign: 'center',
          background: theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F7 100%)'
            : 'linear-gradient(135deg, #1C1C1E 0%, #000000 100%)',
          borderRadius: 3,
          border: theme.palette.mode === 'light'
            ? '1px solid #E5E5E7'
            : '1px solid #2C2C2E',
          boxShadow: theme.palette.mode === 'light'
            ? '0 2px 8px rgba(0, 0, 0, 0.1)'
            : '0 2px 8px rgba(0, 0, 0, 0.3)',
        }}>
          <Box sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: theme.palette.mode === 'light'
              ? 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
              : 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            boxShadow: theme.palette.mode === 'light'
              ? '0 4px 16px rgba(255, 107, 53, 0.3)'
              : '0 4px 16px rgba(255, 107, 53, 0.4)',
          }}>
            <Megaphone size={36} color="white" />
          </Box>
          <Typography variant="h5" fontWeight={600} sx={{ 
            mb: 2, 
            color: theme.palette.mode === 'light' ? '#1D1D1F' : '#FFFFFF'
          }}>
            Hələ Kampaniya Yoxdur
          </Typography>
          <Typography variant="body1" sx={{ 
            mb: 4, 
            maxWidth: 400,
            color: theme.palette.mode === 'light' ? '#86868B' : '#8E8E93',
            fontSize: '1rem',
            lineHeight: 1.5,
          }}>
            İlk kampaniyanızı yaratmaqla restoranınızı tanıtmağa başlayın. Müştərilərinizi cəlb etmək üçün cəlbedici təkliflər və elanlar əlavə edin.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<Megaphone size={20} />}
            onClick={handleAddCampaign}
            sx={{
              background: theme.palette.mode === 'light' ? '#007AFF' : '#0A84FF',
              '&:hover': {
                background: theme.palette.mode === 'light' ? '#0056CC' : '#0066CC',
                transform: 'translateY(-1px)',
                boxShadow: theme.palette.mode === 'light'
                  ? '0 4px 16px rgba(0, 122, 255, 0.3)'
                  : '0 4px 16px rgba(10, 132, 255, 0.4)',
              },
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              transition: 'all 0.2s ease',
              boxShadow: theme.palette.mode === 'light'
                ? '0 2px 8px rgba(0, 122, 255, 0.2)'
                : '0 2px 8px rgba(10, 132, 255, 0.3)',
            }}
          >
            İlk Kampaniyanızı Yaradın
          </Button>
        </Box>
      ) : (
        /* Campaign Grid */
        <Box className="campaign-cards-grid">
          {/* Add New Campaign Card - First Position */}
          <CampaignCard
            isAddCard
            onAdd={handleAddCampaign}
          />
          {allCampaigns.map((campaign: CampaignResponse, index: number) => (
            <Box
              key={campaign.campaignId}
              ref={index === allCampaigns.length - 1 ? lastElementRef : null}
            >
              <CampaignCard
                campaign={campaign}
                onEdit={handleEditCampaign}
                onDelete={handleDeleteCampaign}
              />
            </Box>
          ))}
        </Box>
      )}

      {/* Loading indicator for infinite scroll */}
      {isFetching && hasNextPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4, width: '100%' }}>
          <CircularProgress size={40} />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 2, alignSelf: 'center' }}>
            Daha çox kampaniya yüklənir...
          </Typography>
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AlertTriangle size={24} color={theme.palette.error.main} />
          Kampaniyanı Sil
        </DialogTitle>
        <DialogContent>
          <Typography>
            "{campaignToDelete?.name}" kampaniyasını silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Ləğv Et
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? 'Silinir...' : 'Sil'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          zIndex: (theme) => theme.zIndex.snackbar + 100,
          mt: { xs: 7, sm: 8 },
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
          },
        }}
        message={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle size={20} />
            {successMessage}
          </Box>
        }
      />

      {/* Error Snackbar */}
      <Snackbar
        open={!!submitError}
        autoHideDuration={6000}
        onClose={() => setSubmitError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          zIndex: (theme) => theme.zIndex.snackbar + 100,
          mt: { xs: 7, sm: 8 },
          '& .MuiSnackbarContent-root': {
            background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
            color: 'white',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(244, 67, 54, 0.3)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            fontSize: '1rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            minWidth: 320,
          },
        }}
        message={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AlertTriangle size={20} />
            {submitError}
          </Box>
        }
      />
    </Box>
  );
};

export default CampaignPage;
