import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
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
  CircularProgress,
} from '@mui/material';
import { Package, AlertTriangle, CheckCircle, ChevronRight, ArrowLeft, Plus } from 'lucide-react';
import { Reorder, useDragControls } from 'framer-motion';
import {
  useGetItemsByCategoryIdQuery,
  useDeleteItemMutation,
  useUpdateItemOrderMutation,
  itemApi,
} from '../../api/itemApi';
import { useGetCategoryByIdQuery } from '../../api/categoryApi';
import { useGetMenuByIdQuery } from '../../api/menuApi';
import { ItemResponseDto, ItemOrderRequestDto } from '../../types/item';
import ItemCard from '../../components/item/ItemCard';
import ItemForm from '../../components/item/ItemForm';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

type ViewMode = 'list' | 'form';

// Wrapper component to handle drag controls properly
interface DraggableItemCardProps {
  item: ItemResponseDto;
  onEdit: (item: ItemResponseDto) => void;
  onDelete: (item: ItemResponseDto) => void;
}

const DraggableItemCard: React.FC<DraggableItemCardProps> = ({ item, onEdit, onDelete }) => {
  const dragControls = useDragControls();
  
  return (
    <Reorder.Item
      key={item.itemId}
      value={item}
      dragListener={false}
      dragControls={dragControls}
      style={{ 
        marginBottom: '8px',
        listStyle: 'none'
      }}
      whileDrag={{ 
        scale: 1.0, 
        rotate: 0,
        zIndex: 1000,
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}
      dragTransition={{ 
        bounceStiffness: 600, 
        bounceDamping: 30 
      }}
    >
      <ItemCard
        item={item}
        onEdit={onEdit}
        onDelete={onDelete}
        dragControls={dragControls}
      />
    </Reorder.Item>
  );
};

const ItemPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { categoryId } = useParams<{ categoryId: string }>();
  
  // Convert categoryId to number
  const categoryIdNumber = categoryId ? parseInt(categoryId, 10) : null;
  
  // Early return if no valid categoryId
  if (!categoryIdNumber) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Yanlış Kateqoriya ID
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Məhsulları görmək üçün düzgün kateqoriya seçin.
        </Typography>
      </Box>
    );
  }
  
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedItem, setSelectedItem] = useState<ItemResponseDto | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ItemResponseDto | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Infinite scroll state
  const [allItems, setAllItems] = useState<ItemResponseDto[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  
  // Drag controls will be handled by individual DraggableItemCard components

  // Get category and menu info for breadcrumb
  const { data: categoryData } = useGetCategoryByIdQuery(categoryIdNumber);
  const { data: menuData } = useGetMenuByIdQuery(categoryData?.menuId || 0, {
    skip: !categoryData?.menuId,
  });
  
  // Get first page of items
  const { 
    data: firstPageData, 
    isLoading, 
    error, 
    refetch 
  } = useGetItemsByCategoryIdQuery(
    { categoryId: categoryIdNumber, page: 0, size: 10 },
    { skip: !categoryIdNumber }
  );

  const [deleteItem, { isLoading: isDeleting }] = useDeleteItemMutation();
  const [updateItemOrder] = useUpdateItemOrderMutation();

  // Initialize items from first page
  useEffect(() => {
    console.log('🔄 useEffect triggered - firstPageData:', firstPageData, 'isLoading:', isLoading);
    if (firstPageData) {
      console.log('✅ Setting items:', firstPageData.content.length, 'items');
      // Always replace with fresh data to prevent duplicates
      setAllItems(firstPageData.content);
      setHasNextPage(!firstPageData.last);
      setCurrentPage(0);
      setHasInitiallyLoaded(true);
    }
  }, [firstPageData, isLoading]);

  // Load more items function
  const loadMoreItems = useCallback(async () => {
    if (!hasNextPage || isLoading) return;

    try {
      const nextPage = currentPage + 1;
      console.log('🔄 Loading more items - nextPage:', nextPage, 'categoryId:', categoryIdNumber);
      
      // Use dispatch to make a new query with the correct page number
      const response = await dispatch(
        itemApi.endpoints.getItemsByCategoryId.initiate({
          categoryId: categoryIdNumber,
          page: nextPage,
          size: 10
        })
      ).unwrap();
      
      if (response && response.content) {
        console.log('✅ Loaded', response.content.length, 'new items for page', nextPage);
        
        // Filter out duplicates (safety check)
        const newItems = response.content.filter(
          (newItem: ItemResponseDto) => !allItems.some(existingItem => existingItem.itemId === newItem.itemId)
        );
        
        setAllItems(prev => [...prev, ...newItems]);
        setCurrentPage(nextPage);
        setHasNextPage(!response.last);
      }
    } catch (error) {
      console.error('Error loading more items:', error);
    }
  }, [hasNextPage, isLoading, currentPage, allItems, categoryIdNumber, dispatch]);

  // Infinite scroll hook
  const { isFetching, setIsFetching, lastElementRef } = useInfiniteScroll(
    hasNextPage,
    loadMoreItems
  );

  // Reset isFetching when there are no more pages to prevent stuck loading state
  useEffect(() => {
    if (!hasNextPage && isFetching) {
      setIsFetching(false);
    }
  }, [hasNextPage, isFetching, setIsFetching]);

  const handleAddNew = () => {
    setSelectedItem(null);
    setViewMode('form');
  };

  const handleEdit = (item: ItemResponseDto) => {
    setSelectedItem(item);
    setViewMode('form');
  };

  const handleDelete = (item: ItemResponseDto) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteItem(itemToDelete.itemId).unwrap();
      setSuccessMessage('Item deleted successfully!');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      
      // Remove from local state
      setAllItems(prev => prev.filter(item => item.itemId !== itemToDelete.itemId));
    } catch (error) {
      // console.error('Error deleting item:', error);
    }
  };

  const handleFormSuccess = async () => {
    console.log('🎉 handleFormSuccess called - selectedItem:', selectedItem);
    const message = selectedItem ? 'Item updated successfully!' : 'Item created successfully!';
    setSuccessMessage(message);
    setViewMode('list');
    setSelectedItem(null);
    
    console.log('Resetting state for fresh data load');
    // Reset infinity scroll state completely
    setAllItems([]);
    setCurrentPage(0);
    setHasNextPage(true);
    setHasInitiallyLoaded(false);
    setIsFetching(false); // Reset fetching state
    
    // Force manual refetch of first page after a small delay to ensure cache is invalidated
    setTimeout(async () => {
      console.log('Manual refetch triggered for first page');
      try {
        const response = await dispatch(
          itemApi.endpoints.getItemsByCategoryId.initiate({
            categoryId: categoryIdNumber,
            page: 0,
            size: 10
          }, { forceRefetch: true }) // Force fresh data
        ).unwrap();
        
        console.log('Fresh data loaded:', response);
        
        if (response && response.content) {
          console.log('🔧 Manually setting fresh items after form success');
          setAllItems(response.content);
          setHasNextPage(!response.last);
          setCurrentPage(0);
          setHasInitiallyLoaded(true);
        }
      } catch (error) {
        console.error('Manual refetch failed:', error);
        // Fallback to original refetch if dispatch fails
        try {
          const fallbackResponse = await refetch();
          if (fallbackResponse.data) {
            setAllItems(fallbackResponse.data.content);
            setHasNextPage(!fallbackResponse.data.last);
            setCurrentPage(0);
            setHasInitiallyLoaded(true);
          }
        } catch (fallbackError) {
          console.error('Fallback refetch also failed:', fallbackError);
        }
      }
    }, 100);
  };

  const handleFormCancel = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setViewMode('list');
    setSelectedItem(null);
  };

  const handleBackToCategories = () => {
    navigate(`/admin/category/${categoryData?.menuId}`);
  };

  // Framer Motion Reorder handler
  const handleReorder = async (newItems: ItemResponseDto[]) => {
    // Update local state immediately for smooth UX
    setAllItems(newItems);

    // Prepare order updates
    const orderUpdates: ItemOrderRequestDto[] = newItems.map((item, index) => ({
      itemId: item.itemId,
      displayOrder: index + 1,
    }));

    try {
      await updateItemOrder(orderUpdates).unwrap();
      // console.log('Item order updated successfully');
    } catch (error) {
      // console.error('Failed to update item order:', error);
      // Revert on error - reload from server
      refetch();
    }
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
          '@media (max-width: 600px)': {
            touchAction: 'pan-y',
            overflowX: 'hidden',
          }
        }}
      >
        <ItemForm
          item={selectedItem || undefined}
          categoryId={categoryIdNumber}
          categoryName={categoryData?.name}
          menuName={menuData?.name}
          onBack={handleFormCancel}
          onSuccess={handleFormSuccess}
        />
      </Box>
    );
  }

  // Loading state with skeleton cards
  console.log('Loading check - isLoading:', isLoading, 'hasInitiallyLoaded:', hasInitiallyLoaded, 'allItems.length:', allItems.length);
  if (isLoading && !hasInitiallyLoaded) {
    console.log('Showing skeleton loading...');
    return (
      <Box 
        className="page-container"
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          pb: { xs: 12, sm: 3 },
          minHeight: '100vh',
          '@media (max-width: 600px)': {
            touchAction: 'pan-y',
            overflowX: 'hidden',
          }
        }}>
        {/* Header with Back Button */}
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <IconButton
            onClick={handleBackToCategories}
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
              Məhsullar
            </Typography>
          </Breadcrumbs>
        </Box>

        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Package size={28} />
          Məhsullar
        </Typography>
        <Box className="item-tag-cards-vertical">
          {[...Array(5)].map((_, index) => (
            <Skeleton 
              key={index}
              variant="rectangular" 
              sx={{ 
                width: '100%',
                height: 120,
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
          Məhsulları yükləmək alınmadı. Zəhmət olmasa daha sonra yenidən cəhd edin.
        </Alert>
      </Box>
    );
  }

  const hasItems = allItems && allItems.length > 0;
  
  // More robust empty state logic - only show when we've definitely loaded and have no items
  const showEmptyState = !hasItems && 
                        !isLoading && 
                        hasInitiallyLoaded &&
                        firstPageData && 
                        firstPageData.content && 
                        firstPageData.content.length === 0;
  
  // Show loading when we haven't initially loaded yet or when actively loading
  const showLoading = !hasInitiallyLoaded || (isLoading && allItems.length === 0);

  return (
    <Box 
      className="page-container"
      sx={{ 
        p: { xs: 2, sm: 3 }, 
        pb: { xs: 12, sm: 3 },
        minHeight: '100vh',
        '@media (max-width: 600px)': {
          touchAction: 'pan-y',
          overflowX: 'hidden',
        }
      }}>
      
      {/* Header with Back Button */}
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <IconButton
          onClick={handleBackToCategories}
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
          <Typography variant="body2" color="text.secondary">
            {menuData ? menuData.name : 'Menyu'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {categoryData ? categoryData.name : 'Kateqoriya'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Məhsullar
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Main Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <Package size={28} />
          <Typography variant="h4" fontWeight="bold">
            Məhsullar
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={handleAddNew}
          sx={{
            background: theme.palette.mode === 'light' ? '#FF9500' : '#FF9500',
            '&:hover': {
              background: theme.palette.mode === 'light' ? '#FF6B00' : '#FF6B00',
            },
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1.5,
          }}
        >
          Yeni Məhsul Əlavə Et
        </Button>
      </Box>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        "{categoryData?.name}" kateqoriyası üçün məhsulları idarə edin. Sıralamaq üçün sürükləyib buraxın.
      </Typography>

      {/* Loading Skeletons */}
      {showLoading ? (
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
              background: `linear-gradient(135deg, #FF9500, #FF6B00)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <Package size={40} color="white" />
          </Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Hələ Məhsul Yoxdur
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
            Bu kateqoriya üçün hələ heç bir məhsul yaratmamısınız. İlk məhsulunuzu yaratmaqla başlayın.
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
              px: 4,
              py: 1.5,
            }}
          >
            İlk Məhsulunuzu Yaradın
          </Button>
        </Box>
      ) : (
        /* Items List with Framer Motion Drag & Drop */
        <Reorder.Group
          axis="y"
          values={allItems}
          onReorder={handleReorder}
          className="item-tag-cards-vertical"
          style={{ listStyle: 'none', padding: 0, margin: 0 }}
        >
          {allItems.map((item: ItemResponseDto) => (
            <DraggableItemCard
              key={item.itemId}
              item={item}
              onEdit={handleEdit}
              onDelete={() => handleDelete(item)}
            />
          ))}
          
          {/* Loading more indicator */}
          {isFetching && hasNextPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress size={24} />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                Daha çox məhsul yüklənir...
              </Typography>
            </Box>
          )}
          
          {/* Infinite scroll target */}
          <div ref={lastElementRef} style={{ height: 1 }} />
        </Reorder.Group>
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
          Məhsulu Sil
        </DialogTitle>
        <DialogContent>
          <Typography>
            "{itemToDelete?.name}" adlı məhsulu silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz.
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

export default ItemPage;
