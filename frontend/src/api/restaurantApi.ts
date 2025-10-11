import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RestaurantResponseDto } from '../types/restaurant.types';
import { RootState } from '../store';

export const restaurantApi = createApi({
  reducerPath: 'restaurantApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/restaurant',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Restaurant'],
  endpoints: (builder) => ({
    getRestaurant: builder.query<RestaurantResponseDto, void>({
      query: () => '',
      providesTags: ['Restaurant'],
    }),
    createRestaurant: builder.mutation<RestaurantResponseDto, FormData>({
      query: (formData) => ({
        url: '',
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, let browser set it automatically for FormData
        formData: true,
      }),
      invalidatesTags: ['Restaurant'],
    }),
    updateRestaurant: builder.mutation<RestaurantResponseDto, FormData>({
      query: (formData) => ({
        url: '',
        method: 'PUT',
        body: formData,
        // Don't set Content-Type header, let browser set it automatically for FormData
        formData: true,
      }),
      invalidatesTags: ['Restaurant'],
    }),
  }),
});

export const {
  useGetRestaurantQuery,
  useCreateRestaurantMutation,
  useUpdateRestaurantMutation,
} = restaurantApi;
