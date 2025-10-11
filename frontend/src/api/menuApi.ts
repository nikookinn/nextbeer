import { baseApi } from './baseApi';
import { MenuResponseDto, PageResponse } from '../types/menu.types';

export const menuApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all menus (with optional pagination)
    getMenus: builder.query<MenuResponseDto[] | PageResponse<MenuResponseDto>, { page?: number; size?: number } | void>({
      query: (params) => {
        if (params?.page !== undefined && params?.size !== undefined) {
          return {
            url: '/menus',
            params: { page: params.page, size: params.size },
            prepareHeaders: (headers: Headers) => {
              headers.set('Content-Type', 'application/json');
              return headers;
            },
          };
        }
        return {
          url: '/menus',
          prepareHeaders: (headers: Headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
          },
        };
      },
      providesTags: ['Menu'],
      // Ensure each page has its own cache entry
      serializeQueryArgs: ({ queryArgs }) => {
        if (queryArgs && 'page' in queryArgs && 'size' in queryArgs) {
          return `menus-page-${queryArgs.page}-size-${queryArgs.size}`;
        }
        return 'menus-all';
      },
      // Keep data for a short time to avoid refetching
      keepUnusedDataFor: 60, // 60 seconds
    }),

    // Get menu by ID
    getMenuById: builder.query<MenuResponseDto, number>({
      query: (id) => ({
        url: `/menus/${id}`,
        prepareHeaders: (headers: Headers) => {
          headers.set('Content-Type', 'application/json');
          return headers;
        },
      }),
      providesTags: (_, __, id) => [{ type: 'Menu', id }],
    }),

    // Create new menu
    createMenu: builder.mutation<MenuResponseDto, FormData>({
      query: (formData) => ({
        url: '/menus',
        method: 'POST',
        body: formData,
        // Explicitly don't set Content-Type for FormData - let browser handle it
        prepareHeaders: (headers: Headers) => {
          // Remove any Content-Type that might be set
          headers.delete('Content-Type');
          return headers;
        },
      }),
      invalidatesTags: ['Menu'],
    }),

    // Update menu
    updateMenu: builder.mutation<MenuResponseDto, { id: number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/menus/${id}`,
        method: 'PUT',
        body: formData,
        // Explicitly don't set Content-Type for FormData - let browser handle it
        prepareHeaders: (headers: Headers) => {
          // Remove any Content-Type that might be set
          headers.delete('Content-Type');
          return headers;
        },
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Menu', id }, 'Menu'],
    }),

    // Delete menu
    deleteMenu: builder.mutation<void, number>({
      query: (id) => ({
        url: `/menus/${id}`,
        method: 'DELETE',
        prepareHeaders: (headers: Headers) => {
          headers.set('Content-Type', 'application/json');
          return headers;
        },
      }),
      invalidatesTags: ['Menu'],
    }),
  }),
});

export const {
  useGetMenusQuery,
  useGetMenuByIdQuery,
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
} = menuApi;
