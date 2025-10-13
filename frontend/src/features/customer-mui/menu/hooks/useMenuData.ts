import { useGetCategoriesQuery, useGetMenusQuery, Category } from '../../../../api/customerApi';

export const useMenuData = (menuId: string | undefined) => {
  // Get menu data to show menu name
  const { data: menuData } = useGetMenusQuery({ page: 0, size: 100 });
  const currentMenu = menuData?.content?.find(menu => menu.menuId === parseInt(menuId || '0'));

  // Get categories for this menu - EXACT same API call as original
  const { 
    data: categoriesData, 
    isLoading: categoriesLoading, 
    error: categoriesError 
  } = useGetCategoriesQuery({
    menuId: parseInt(menuId || '0'),
    page: 0,
    size: 50
  });

  // Handle categories data EXACTLY like original customer interface
  const categories: Category[] = Array.isArray(categoriesData) 
    ? categoriesData 
    : (categoriesData?.content || []);

  return {
    currentMenu,
    categories,
    categoriesLoading,
    categoriesError,
  };
};