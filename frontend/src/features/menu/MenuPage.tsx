import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { BookOpen, AlertTriangle, CheckCircle } from 'lucide-react';
import { useGetMenusQuery, useCreateMenuMutation, useUpdateMenuMutation, useDeleteMenuMutation } from '../../api/menuApi';
import { MenuFormData, MenuResponseDto, PageResponse } from '../../types/menu.types';
import MenuCard from '../../components/menu/MenuCard';
import MenuForm from '../../components/menu/MenuForm';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

type ViewMode = 'list' | 'form';

const MenuPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Infinite scroll state
  const [allMenus, setAllMenus] = useState<MenuResponseDto[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const pageSize = 10; // 10 items per page
  
  // Get first page data
  const { data: firstPageData, isLoading, error, refetch } = useGetMenusQuery({ 
    page: 0, 
    size: pageSize 
  });
  
  const [createMenu, { isLoading: isCreating, error: createError }] = useCreateMenuMutation();
  const [updateMenu, { isLoading: isUpdating, error: updateError }] = useUpdateMenuMutation();
  const [deleteMenu, { isLoading: isDeleting }] = useDeleteMenuMutation();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedMenu, setSelectedMenu] = useState<MenuResponseDto | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<MenuResponseDto | null>(null);

  // Handle first page data
  React.useEffect(() => {
    if (firstPageData && !isLoading) {
      const pageData = firstPageData as PageResponse<MenuResponseDto>;
      
      
      // Always update with fresh data
      setAllMenus(pageData.content);
      setHasNextPage(!pageData.last);
      
    }
  }, [firstPageData, isLoading]);

  // Simple approach: fetch next page manually
  const fetchNextPage = useCallback(async () => {
    if (hasNextPage) {
      const nextPageNumber = Math.floor(allMenus.length / pageSize);
      
      
      try {
        // Direct fetch to avoid RTK Query cache issues
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`/api/v1/menus?page=${nextPageNumber}&size=${pageSize}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const pageData: PageResponse<MenuResponseDto> = await response.json();
          
          // Only add truly new menus
          setAllMenus(prev => {
            const existingIds = new Set(prev.map(menu => menu.menuId));
            const newMenus = pageData.content.filter(menu => !existingIds.has(menu.menuId));
            
            
            if (newMenus.length > 0) {
              return [...prev, ...newMenus];
            }
            return prev;
          });
          
          setHasNextPage(!pageData.last);
          
        } else {
        }
      } catch (error) {
      }
    }
  }, [hasNextPage, allMenus.length, pageSize]);

  // Infinite scroll hook
  const { isFetching, setIsFetching, lastElementRef } = useInfiniteScroll(
    hasNextPage,
    fetchNextPage
  );

  // Reset fetching state when new data arrives
  React.useEffect(() => {
    if (firstPageData && isFetching) {
      setIsFetching(false);
    }
  }, [firstPageData, isFetching, setIsFetching]);

  // Reset pagination when refetching (after create/update/delete)
  const handleRefetch = useCallback(() => {
    // Scroll to top first
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Just refetch without clearing state - let the effect handle the update
    refetch().then(() => {
      // Reset pagination state after successful refetch
      setHasNextPage(true);
    });
  }, [refetch]);

  // Clear messages after 5 seconds
  React.useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  React.useEffect(() => {
    if (submitError) {
      const timer = setTimeout(() => setSubmitError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitError]);

  const handleAddMenu = () => {
    // Scroll to top when opening form
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setSelectedMenu(null);
    setViewMode('form');
  };

  const handleEditMenu = (menu: MenuResponseDto) => {
    // Scroll to top when opening form
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setSelectedMenu(menu);
    setViewMode('form');
  };

  const handleViewCategories = (menu: MenuResponseDto) => {
    navigate(`/admin/category/${menu.menuId}`);
  };

  const handleDeleteMenu = (menu: MenuResponseDto) => {
    setMenuToDelete(menu);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (menuToDelete) {
      try {
        await deleteMenu(menuToDelete.menuId).unwrap();
        setSuccessMessage(`"${menuToDelete.name}" menyusu uğurla silindi!`);
        handleRefetch();
      } catch (error: any) {
        setSubmitError(error?.data?.message || 'Failed to delete menu');
      }
    }
    setDeleteDialogOpen(false);
    setMenuToDelete(null);
  };

  const handleFormSubmit = async (formData: MenuFormData) => {
    try {
      setSubmitError(null);
      setSuccessMessage(null);

      // Create FormData for multipart request
      const submitFormData = new FormData();
      
      // Add menu data as JSON blob
      const menuData = {
        name: formData.name,
        removeImage: formData.removeImage || false,
      };

      const menuBlob = new Blob([JSON.stringify(menuData)], {
        type: 'application/json'
      });
      
      submitFormData.append('menu', menuBlob);

      // Add image if selected
      if (formData.menuImage) {
        submitFormData.append('menuImage', formData.menuImage);
      }

      // Debug logging
      console.log('🍽️ Menu FormData Debug:', {
        menuData: menuData,
        hasImage: !!formData.menuImage,
        formDataKeys: Array.from(submitFormData.keys()),
        formDataEntries: Array.from(submitFormData.entries())
      });

      // Determine if this is create or update
      const isNewMenu = !selectedMenu;

      if (isNewMenu) {
        await createMenu(submitFormData).unwrap();
        setSuccessMessage('Menyu uğurla yaradıldı!');
      } else {
        await updateMenu({ 
          id: selectedMenu.menuId, 
          formData: submitFormData 
        }).unwrap();
        setSuccessMessage('Menyu uğurla yeniləndi!');
      }

      // Go back to list view and refetch data
      setViewMode('list');
      setSelectedMenu(null);
      handleRefetch();
    } catch (error: any) {
      setSubmitError(
        error?.data?.message || 
        error?.message || 
        'Menyu məlumatlarını saxlayarkən xəta baş verdi.'
      );
    }
  };

  const handleFormCancel = () => {
    // Scroll to top when going back to list
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setViewMode('list');
    setSelectedMenu(null);
  };

  // Show form view
  if (viewMode === 'form') {
    return (
      <Box sx={{ p: 3 }}>
        <MenuForm
          initialData={selectedMenu}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={isCreating || isUpdating}
          error={submitError || 
            (createError && 'data' in createError ? (createError.data as any)?.message : null) ||
            (updateError && 'data' in updateError ? (updateError.data as any)?.message : null)
          }
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
          <BookOpen size={28} />
          Menyu İdarəetməsi
        </Typography>
        <Box className="menu-cards-grid">
          {/* Add New Menu Skeleton */}
          <Skeleton 
            variant="rectangular" 
            sx={{ 
              width: 300,
              height: 320,
              borderRadius: 2,
              background: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%)',
            }} 
          />
          {/* Menu Card Skeletons */}
          {[...Array(9)].map((_, index) => (
            <Skeleton 
              key={index}
              variant="rectangular" 
              sx={{ 
                width: 300,
                height: 320,
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
          Menyuları yükləmək alınmadı. Zəhmət olmasa daha sonra yenidən cəhd edin.
        </Alert>
      </Box>
    );
  }

  // Use accumulated menus from infinite scroll
  const hasMenus = allMenus.length > 0;

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
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <BookOpen size={28} />
        Menu Management
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Restoran menyularınızı idarə edin. Menyu kolleksiyanızı yaradın, redaktə edin və təşkil edin.
      </Typography>

      {/* Empty State */}
      {!hasMenus && !isLoading ? (
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
            <BookOpen size={40} color="white" />
          </Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Hələ Menyu Yoxdur
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
            Hələ heç bir menyu yaratmamısınız. Restoranınızın təkliflərini təşkil etmək üçün ilk menyunuzu yaratmaqla başlayın.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleAddMenu}
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
            İlk Menyunuzu Yaradın
          </Button>
        </Box>
      ) : (
        /* Menu Grid */
        <Box className="menu-cards-grid">
          {/* Add New Menu Card - First Position */}
          <MenuCard
            isAddCard
            onAdd={handleAddMenu}
          />
          {allMenus.map((menu: MenuResponseDto, index: number) => (
            <Box
              key={menu.menuId}
              ref={index === allMenus.length - 1 ? lastElementRef : null}
            >
              <MenuCard
                menu={menu}
                onEdit={handleEditMenu}
                onDelete={handleDeleteMenu}
                onViewCategories={handleViewCategories}
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
            Daha çox menyu yüklənir...
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
          Menyunu Sil
        </DialogTitle>
        <DialogContent>
          <Typography>
            "{menuToDelete?.name}" menyusunu silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz.
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

export default MenuPage;
