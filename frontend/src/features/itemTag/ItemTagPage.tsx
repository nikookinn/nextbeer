import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Skeleton,
  useTheme,
} from '@mui/material';
import { Tag, AlertTriangle, CheckCircle } from 'lucide-react';
import {
  useGetAllItemTagsQuery,
  useDeleteItemTagMutation,
} from '../../api/itemTagApi';
import { ItemTagResponse } from '../../types/itemTag';
import ItemTagCard from '../../components/itemTag/ItemTagCard';
import ItemTagForm from '../../components/itemTag/ItemTagForm';

type ViewMode = 'list' | 'form';

const ItemTagPage: React.FC = () => {
  const theme = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedItemTag, setSelectedItemTag] = useState<ItemTagResponse | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemTagToDelete, setItemTagToDelete] = useState<ItemTagResponse | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data: itemTags, isLoading, error, refetch } = useGetAllItemTagsQuery();
  const [deleteItemTag, { isLoading: isDeleting }] = useDeleteItemTagMutation();

  const handleAddNew = () => {
    setSelectedItemTag(null);
    setViewMode('form');
  };

  const handleEdit = (itemTag: ItemTagResponse) => {
    setSelectedItemTag(itemTag);
    setViewMode('form');
  };

  const handleDelete = (itemTag: ItemTagResponse) => {
    setItemTagToDelete(itemTag);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemTagToDelete) return;

    try {
      await deleteItemTag(itemTagToDelete.id).unwrap();
      setSuccessMessage('Məhsul etiketi uğurla silindi!');
      setDeleteDialogOpen(false);
      setItemTagToDelete(null);
      refetch();
    } catch (error) {
      console.error('Error deleting item tag:', error);
    }
  };

  const handleFormSuccess = () => {
    const message = selectedItemTag ? 'Məhsul etiketi uğurla yeniləndi!' : 'Məhsul etiketi uğurla yaradıldı!';
    setSuccessMessage(message);
    setViewMode('list');
    setSelectedItemTag(null);
    refetch();
  };

  const handleFormCancel = () => {
    // Scroll to top when going back to list
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setViewMode('list');
    setSelectedItemTag(null);
  };

  // Show form view
  if (viewMode === 'form') {
    return (
      <Box sx={{ p: 3 }}>
        <ItemTagForm
          itemTag={selectedItemTag || undefined}
          onBack={handleFormCancel}
          onSuccess={handleFormSuccess}
        />
      </Box>
    );
  }

  // Loading state with skeleton cards
  if (isLoading) {
    return (
      <Box 
        className="page-container"
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          pb: { xs: 12, sm: 3 },
          minHeight: '100vh',
          // Mobile scroll optimization
          '@media (max-width: 600px)': {
            touchAction: 'pan-y',
            overflowX: 'hidden',
          }
        }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tag size={28} />
          Məhsul Etiket İdarəçiliyi
        </Typography>
        <Box className="item-tag-cards-vertical">
          {[...Array(5)].map((_, index) => (
            <Skeleton 
              key={index}
              variant="rectangular" 
              sx={{ 
                width: '100%',
                height: 80,
                borderRadius: 2,
              }} 
            />
          ))}
        </Box>
      </Box>
    );
  }

  // Error state
  if (error && 'status' in error && error.status !== 404) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Məhsul etiketlərini yükləmək alınmadı. Zəhmət olmasa daha sonra yenidən cəhd edin.
        </Alert>
      </Box>
    );
  }

  const hasItemTags = itemTags && itemTags.length > 0;

  return (
    <Box 
      className="page-container"
      sx={{ 
        p: { xs: 2, sm: 3 }, 
        pb: { xs: 12, sm: 3 },
        minHeight: '100vh',
        // Mobile scroll optimization
        '@media (max-width: 600px)': {
          touchAction: 'pan-y',
          overflowX: 'hidden',
        }
      }}>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <Tag size={28} />
          <Typography variant="h4" fontWeight="bold">
            Məhsul Etiket İdarəçiliyi
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<Tag size={20} />}
          onClick={handleAddNew}
          sx={{
            background: theme.palette.mode === 'light' ? '#007AFF' : '#0A84FF',
            '&:hover': {
              background: theme.palette.mode === 'light' ? '#0056CC' : '#0A84FF',
            },
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1.5,
          }}
        >
          Yeni Etiket Əlavə Et
        </Button>
      </Box>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Məhsul etiketlərinizi idarə edin. Menyu məhsullarınız üçün "Vegetarian", "Acılı" və ya "Populyar" kimi etiketlər yaradın, redaktə edin və təşkil edin.
      </Typography>

      {/* Empty State */}
      {!hasItemTags && !isLoading ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 400,
            textAlign: 'center',
            border: `2px dashed ${theme.palette.divider}`,
            borderRadius: 3,
            p: 4,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <Tag size={40} color="white" />
          </Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Hələ Məhsul Etiketi Yoxdur
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
            Hələ heç bir məhsul etiketi yaratmamısınız. Menyu məhsullarınızı etiketlərlə təşkil etmək üçün ilk etiketinizi yaratmaqla başlayın.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleAddNew}
            sx={{
              background: theme.palette.mode === 'light' ? '#007AFF' : '#0A84FF',
              '&:hover': {
                background: theme.palette.mode === 'light' ? '#0056CC' : '#0A84FF',
              },
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.5,
            }}
          >
            İlk Etiketinizi Yaradın
          </Button>
        </Box>
      ) : (
        /* Item Tag Vertical List */
        <Box className="item-tag-cards-vertical">
          {itemTags?.map((itemTag: ItemTagResponse) => (
            <ItemTagCard
              key={itemTag.id}
              itemTag={itemTag}
              onEdit={handleEdit}
              onDelete={() => handleDelete(itemTag)}
            />
          ))}
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
          Məhsul Etiketini Sil
        </DialogTitle>
        <DialogContent>
          <Typography>
            "{itemTagToDelete?.name}" etiketini silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz.
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

export default ItemTagPage;
