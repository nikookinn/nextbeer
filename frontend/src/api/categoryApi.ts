import { baseApi } from './baseApi';
import { CategoryRequestDto, CategoryResponse, CategorySimpleResponse, PageResponse } from '../types/category';

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all categories with pagination
    getCategories: builder.query<CategoryResponse[] | PageResponse<CategoryResponse>, { page?: number; size?: number } | void>({
      query: (params) => {
        if (params?.page !== undefined && params?.size !== undefined) {
          return {
            url: '/categories',
            params: { page: params.page, size: params.size },
          };
        }
        return '/categories';
      },
      providesTags: ['Category'],
      // Ensure each page has its own cache entry
      serializeQueryArgs: ({ queryArgs }) => {
        if (queryArgs && 'page' in queryArgs && 'size' in queryArgs) {
          return `categories-page-${queryArgs.page}-size-${queryArgs.size}`;
        }
        return 'categories-all';
      },
    }),
    
    // Get category by ID
    getCategoryById: builder.query<CategoryResponse, number>({
      query: (id) => `/categories/${id}`,
      providesTags: (_, __, id) => [{ type: 'Category', id }],
    }),
    
    // Get categories by menu ID
    getCategoriesByMenuId: builder.query<CategorySimpleResponse[], number>({
      query: (menuId) => `/categories/menu/${menuId}`,
      providesTags: (_, __, menuId) => [{ type: 'Category', id: `menu-${menuId}` }],
    }),
    
    // Create new category
    createCategory: builder.mutation<CategoryResponse, CategoryRequestDto>({
      query: (category) => ({
        url: '/categories',
        method: 'POST',
        body: category,
      }),
      invalidatesTags: ['Category'],
    }),
    
    // Update category
    updateCategory: builder.mutation<CategoryResponse, { id: number; category: CategoryRequestDto }>({
      query: ({ id, category }) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        body: category,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Category', id }, 'Category'],
    }),
    
    // Delete category
    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [{ type: 'Category', id }, 'Category'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetCategoriesByMenuIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
