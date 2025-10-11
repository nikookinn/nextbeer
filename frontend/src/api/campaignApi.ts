import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CampaignResponse, PageResponse } from '../types/campaign.types';

export const campaignApi = createApi({
  reducerPath: 'campaignApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/campaigns',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      // Don't set Content-Type for FormData requests
      // Let the browser set multipart/form-data automatically
      return headers;
    },
  }),
  tagTypes: ['Campaign'],
  endpoints: (builder) => ({
    // Get campaigns with pagination
    getCampaigns: builder.query<PageResponse<CampaignResponse>, { page: number; size: number }>({
      query: ({ page, size }) => `?page=${page}&size=${size}`,
      providesTags: ['Campaign'],
    }),

    // Get all campaigns (no pagination)
    getAllCampaigns: builder.query<CampaignResponse[], void>({
      query: () => '',
      providesTags: ['Campaign'],
    }),

    // Get campaign by ID
    getCampaignById: builder.query<CampaignResponse, number>({
      query: (id) => `/${id}`,
      providesTags: (_, __, id) => [{ type: 'Campaign', id }],
    }),

    // Create campaign
    createCampaign: builder.mutation<CampaignResponse, FormData>({
      query: (formData) => ({
        url: '',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Campaign'],
    }),

    // Update campaign
    updateCampaign: builder.mutation<CampaignResponse, { id: number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Campaign'],
    }),

    // Delete campaign
    deleteCampaign: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Campaign'],
    }),
  }),
});

export const {
  useGetCampaignsQuery,
  useGetAllCampaignsQuery,
  useGetCampaignByIdQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
} = campaignApi;
