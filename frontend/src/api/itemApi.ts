import { baseApi } from './baseApi';
import { ItemResponseDto, ItemOrderRequestDto } from '../types/item';
import { PageResponse } from '../types/menu.types';

export const itemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get items by category ID with pagination
    getItemsByCategoryId: builder.query<PageResponse<ItemResponseDto>, { categoryId: number; page?: number; size?: number }>({
      query: ({ categoryId, page = 0, size = 10 }) => ({
        url: `/items/category/${categoryId}`,
        params: { page, size },
      }),
      providesTags: (_result, _error, { categoryId }) => [
        { type: 'Item', id: `CATEGORY_${categoryId}` },
        ...(_result?.content || []).map(({ itemId }) => ({ type: 'Item' as const, id: itemId })),
      ],
    }),

    // Get item by ID
    getItemById: builder.query<ItemResponseDto, number>({
      query: (id) => `/items/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Item', id }],
    }),

    // Create new item
    createItem: builder.mutation<ItemResponseDto, FormData>({
      query: (formData) => ({
        url: '/items',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Item'], // Invalidate all items to refresh the list
    }),

    // Update item
    updateItem: builder.mutation<ItemResponseDto, { id: number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/items/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Item', id },
        'Item', // Invalidate all items to refresh the list
      ],
    }),

    // Delete item (soft delete)
    deleteItem: builder.mutation<void, number>({
      query: (id) => ({
        url: `/items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Item', id },
        'Item', // Invalidate all items to refresh the list
      ],
    }),

    // Update item order (drag & drop)
    updateItemOrder: builder.mutation<void, ItemOrderRequestDto[]>({
      query: (updates) => ({
        url: '/items/update-order',
        method: 'POST',
        body: updates,
      }),
      invalidatesTags: ['Item'], // Invalidate all items to refresh order
    }),
  }),
});

export const {
  useGetItemsByCategoryIdQuery,
  useGetItemByIdQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
  useUpdateItemOrderMutation,
} = itemApi;
