import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Breadcrumbs,
  IconButton,
} from '@mui/material';
import { FolderOpen, AlertTriangle, CheckCircle, ChevronRight, ArrowLeft, Plus } from 'lucide-react';
import {
  useGetCategoriesByMenuIdQuery,
  useDeleteCategoryMutation,
} from '../../api/categoryApi';
import { useGetMenuByIdQuery } from '../../api/menuApi';
import { CategoryResponse, CategorySimpleResponse } from '../../types/category';
import CategoryCard from '../../components/category/CategoryCard';
import CategoryForm from '../../components/category/CategoryForm';

type ViewMode = 'list' | 'form';

const CategoryPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { menuId } = useParams<{ menuId: string }>();
  
  // Convert menuId to number
  const menuIdNumber = menuId ? parseInt(menuId, 10) : null;
  
  // Early return if no valid menuId
  if (!menuIdNumber) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Yanlış Menyu ID
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Kateqoriyaları görmək üçün düzgün menyu seçin.
        </Typography>
      </Box>
    );
  }
  
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedCategory, setSelectedCategory] = useState<CategoryResponse | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryResponse | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Get menu info for breadcrumb
  const { data: menuData } = useGetMenuByIdQuery(menuIdNumber);
  
  // Get categories for this menu
  const { data: categories, isLoading, error, refetch } = useGetCategoriesByMenuIdQuery(menuIdNumber);
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const handleAddNew = () => {
    setSelectedCategory(null);
    setViewMode('form');
  };

  const handleEdit = (category: CategoryResponse | CategorySimpleResponse) => {
    // Convert CategorySimpleResponse to CategoryResponse if needed
    const fullCategory: CategoryResponse = 'menuId' in category 
      ? category 
      : { ...category, menuId: menuIdNumber };
    setSelectedCategory(fullCategory);
    setViewMode('form');
  };

  const handleDelete = (category: CategoryResponse | CategorySimpleResponse) => {
    // Convert CategorySimpleResponse to CategoryResponse if needed
    const fullCategory: CategoryResponse = 'menuId' in category 
      ? category 
      : { ...category, menuId: menuIdNumber };
    setCategoryToDelete(fullCategory);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete.categoryId).unwrap();
      setSuccessMessage('Kateqoriya uğurla silindi!');
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      refetch();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleFormSuccess = () => {
    const message = selectedCategory ? 'Kateqoriya uğurla yeniləndi!' : 'Kateqoriya uğurla yaradıldı!';
    setSuccessMessage(message);
    setViewMode('list');
    setSelectedCategory(null);
    refetch();
  };

  const handleFormCancel = () => {
    // Scroll to top when going back to list
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setViewMode('list');
    setSelectedCategory(null);
  };

  const handleBackToMenus = () => {
    navigate('/admin/menu');
  };

  // Show form view
  if (viewMode === 'form') {
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
        }}
      >
        <CategoryForm
          category={selectedCategory || undefined}
          menuId={menuIdNumber}
          menuName={menuData?.name}
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
        {/* Header with Back Button */}
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <IconButton
            onClick={handleBackToMenus}
            sx={{
              bgcolor: (theme) => theme.palette.action.hover,
              '&:hover': {
                bgcolor: (theme) => theme.palette.action.selected,
              },
            }}
          >
            <ArrowLeft size={20} />
          </IconButton>
          
          {/* Breadcrumb */}
          <Breadcrumbs separator={<ChevronRight size={16} />} sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.primary" fontWeight={600}>
              Loading...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Kateqoriyalar
            </Typography>
          </Breadcrumbs>
        </Box>

        <Typography 
          variant="h4" 
          fontWeight="bold" 
          gutterBottom 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            fontSize: { xs: '1.5rem', sm: '2.125rem' }
          }}
        >
          <Box
            component={FolderOpen}
            sx={{
              width: { xs: '24px', sm: '28px' },
              height: { xs: '24px', sm: '28px' },
            }}
          />
          Kateqoriyalar
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
          Kateqoriyaları yükləmək alınmadı. Zəhmət olmasa daha sonra yenidən cəhd edin.
        </Alert>
      </Box>
    );
  }

  const hasCategories = categories && categories.length > 0;
  const showEmptyState = !hasCategories && !isLoading && categories !== undefined;

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
      
      {/* Header with Back Button */}
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <IconButton
          onClick={handleBackToMenus}
          sx={{
            bgcolor: (theme) => theme.palette.action.hover,
            '&:hover': {
              bgcolor: (theme) => theme.palette.action.selected,
            },
          }}
        >
          <ArrowLeft size={20} />
        </IconButton>
        
        {/* Breadcrumb */}
        <Breadcrumbs separator={<ChevronRight size={16} />} sx={{ flex: 1 }}>
          <Typography variant="body2" color="text.primary" fontWeight={600}>
            {menuData ? menuData.name : 'Menu'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Kateqoriyalar
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Main Header */}
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
            Kateqoriyalar
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={
            <Box
              component={Plus}
              sx={{
                width: { xs: '18px', sm: '20px' },
                height: { xs: '18px', sm: '20px' },
              }}
            />
          }
          onClick={handleAddNew}
          sx={{
            background: theme.palette.mode === 'light' ? '#FF9500' : '#FF9500',
            '&:hover': {
              background: theme.palette.mode === 'light' ? '#FF6B00' : '#FF6B00',
            },
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: { xs: 2, sm: 3 },
            py: { xs: 1, sm: 1.5 },
            fontSize: { xs: '0.875rem', sm: '1rem' },
          }}
        >
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            Kateqoriya Əlavə Et
          </Box>
          <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
            Kateqoriya Əlavə Et
          </Box>
        </Button>
      </Box>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Bu menyu üçün kateqoriyaları idarə edin. Kateqoriyalar menyu elementlərinizi məntiqi qruplara təşkil etməyə kömək edir.
      </Typography>

      {/* Loading Skeletons */}
      {isLoading ? (
        <Box className="item-tag-cards-vertical">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              height={100}
              sx={{
                borderRadius: 3,
                mb: 1,
                bgcolor: theme.palette.mode === 'light' ? '#F8FAFC' : '#1E293B',
              }}
            />
          ))}
        </Box>
      ) : showEmptyState ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: { xs: 300, sm: 400 },
            textAlign: 'center',
            border: `2px dashed ${theme.palette.divider}`,
            borderRadius: 3,
            p: { xs: 3, sm: 4 },
          }}
        >
          <Box
            sx={{
              width: { xs: 60, sm: 80 },
              height: { xs: 60, sm: 80 },
              borderRadius: '50%',
              background: `linear-gradient(135deg, #FF9500, #FF6B00)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: { xs: 2, sm: 3 },
            }}
          >
            <Box
              sx={{
                fontSize: { xs: '30px', sm: '40px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FolderOpen color="white" />
            </Box>
          </Box>
          <Typography 
            variant="h5" 
            fontWeight={600} 
            gutterBottom
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }}
          >
            Hələ Kateqoriya Yoxdur
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              mb: { xs: 2, sm: 3 }, 
              maxWidth: 400,
              fontSize: { xs: '0.875rem', sm: '1rem' },
              px: { xs: 1, sm: 0 }
            }}
          >
            Bu menyu üçün hələ heç bir kateqoriya yaratmamısınız. Menyu elementlərinizi təşkil etmək üçün ilk kateqoriyanızı yaratmaqla başlayın.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleAddNew}
            sx={{
              background: theme.palette.mode === 'light' ? '#FF9500' : '#FF9500',
              '&:hover': {
                background: theme.palette.mode === 'light' ? '#FF6B00' : '#FF6B00',
              },
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: { xs: 3, sm: 4 },
              py: { xs: 1.25, sm: 1.5 },
              fontSize: { xs: '0.875rem', sm: '1rem' },
            }}
          >
            İlk Kateqoriyanızı Yaradın
          </Button>
        </Box>
      ) : (
        /* Category Vertical List */
        <Box className="item-tag-cards-vertical">
          {categories && categories.length > 0 ? (
            categories.map((category: CategorySimpleResponse) => (
              <CategoryCard
                key={category.categoryId}
                category={category}
                onEdit={handleEdit}
                onDelete={() => handleDelete(category)}
              />
            ))
          ) : null}
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
          Kateqoriyanı Sil
        </DialogTitle>
        <DialogContent>
          <Typography>
            "{categoryToDelete?.name}" kateqoriyasını silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz.
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

export default CategoryPage;
