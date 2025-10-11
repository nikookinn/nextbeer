import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Public API for customer-facing application (no authentication required)
const customerBaseQuery = fetchBaseQuery({
  baseUrl: '/api/v1',
  // No authentication headers for public endpoints
  prepareHeaders: (headers) => {
    return headers;
  },
});

// Customer API types
export interface Campaign {
  campaignId: number;
  name: string;
  imageUrl: string;
  description?: string;
}

export interface Menu {
  menuId: number;
  name: string;
  imageUrl: string;
  description?: string;
}

export interface Category {
  categoryId: number;
  name: string;
  imageUrl: string;
  menuId: number;
}

export interface Item {
  itemId: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  tags: string[];
  variants: ItemVariant[];
  categoryId: number;
  itemTagResponses?: Array<{
    name: string;
    color?: string;
  }>;
  itemVariantResponses?: Array<{
    variantId: number;
    name: string;
    price: number;
  }>;
}

export interface ItemVariant {
  variantId: number;
  name: string;
  price: number;
}

export interface Restaurant {
  id: number;
  name: string;
  about: string;
  phoneNumber: string;
  address: string;
  workingHours: string;
  imageUrl: string;
  logoUrl: string;
  email: string;
  instagramUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  latitude: number;
  longitude: number;
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export const customerApi = createApi({
  reducerPath: 'customerApi',
  baseQuery: customerBaseQuery,
  tagTypes: ['Campaign', 'Menu', 'Category', 'Item', 'Restaurant'],
  endpoints: (builder) => ({
    // Get all campaigns for carousel
    getCampaigns: builder.query<PageResponse<Campaign>, { page?: number; size?: number }>({
      query: ({ page = 0, size = 10 } = {}) => ({
        url: '/campaigns',
        params: { page, size },
      }),
      providesTags: ['Campaign'],
    }),

    // Get all menus for homepage grid
    getMenus: builder.query<PageResponse<Menu>, { page?: number; size?: number }>({
      query: ({ page = 0, size = 20 } = {}) => ({
        url: '/menus',
        params: { page, size },
      }),
      providesTags: ['Menu'],
    }),

    // Get categories for a specific menu
    getCategories: builder.query<PageResponse<Category>, { menuId: number; page?: number; size?: number }>({
      query: ({ menuId, page = 0, size = 20 }) => ({
        url: `/categories/menu/${menuId}`,
        params: { page, size },
      }),
      providesTags: ['Category'],
    }),

    // Get items for a specific category
    getItems: builder.query<PageResponse<Item>, { categoryId: number; page?: number; size?: number }>({
      query: ({ categoryId, page = 0, size = 20 }) => ({
        url: `/items/category/${categoryId}`,
        params: { page, size },
      }),
      providesTags: ['Item'],
    }),

    // Get individual item by ID
    getItemById: builder.query<Item, number>({
      query: (itemId) => `/items/${itemId}`,
      providesTags: ['Item'],
    }),

    // Get restaurant information
    getRestaurant: builder.query<Restaurant, void>({
      query: () => '/restaurant',
      providesTags: ['Restaurant'],
    }),
  }),
});

export const {
  useGetCampaignsQuery,
  useGetMenusQuery,
  useGetCategoriesQuery,
  useGetItemsQuery,
  useGetItemByIdQuery,
  useGetRestaurantQuery,
} = customerApi;