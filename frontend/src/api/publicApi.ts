import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { 
  DashboardStatsRequest, 
  DashboardStatsResponse, 
  HourlyChartData, 
  DailyChartData,
  ChartRequest 
} from '../types/dashboard.types';

// Public API for dashboard data (no authentication required)
export const publicApi = createApi({
  reducerPath: 'publicApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/v1',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['PublicDashboard'],
  endpoints: (builder) => ({
    getPublicDashboardStats: builder.query<DashboardStatsResponse, DashboardStatsRequest>({
      query: (params) => ({
        url: '/public/dashboard/stats', // Public endpoint
        params,
      }),
      providesTags: ['PublicDashboard'],
    }),
    getPublicHourlyChartData: builder.query<HourlyChartData[], void>({
      query: () => '/public/dashboard/chart/hourly-today', // Public endpoint
      providesTags: ['PublicDashboard'],
    }),
    getPublicChartData: builder.query<DailyChartData[], ChartRequest>({
      query: (params) => ({
        url: '/public/dashboard/chart', // Public endpoint
        params,
      }),
      providesTags: ['PublicDashboard'],
    }),
  }),
});

export const {
  useGetPublicDashboardStatsQuery,
  useGetPublicHourlyChartDataQuery,
  useGetPublicChartDataQuery,
} = publicApi;
