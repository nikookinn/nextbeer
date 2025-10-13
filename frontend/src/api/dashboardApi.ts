import { baseApi } from './baseApi';
import { 
  DashboardStatsRequest, 
  DashboardStatsResponse, 
  HourlyChartData, 
  DailyChartData,
  ChartRequest 
} from '../types/dashboard.types';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Spring Backend: GET /dashboard/stats with @RequestBody
    getDashboardStats: builder.mutation<DashboardStatsResponse, DashboardStatsRequest>({
      query: (body) => ({
        url: '/dashboard/stats',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Dashboard'],
    }),
    // Spring Backend: GET /dashboard/chart/hourly-today
    getHourlyChartData: builder.query<HourlyChartData[], void>({
      query: () => '/dashboard/chart/hourly-today',
      providesTags: ['Dashboard'],
    }),
    // Spring Backend: GET /dashboard/chart with @RequestBody
    getChartData: builder.mutation<DailyChartData[], ChartRequest>({
      query: (body) => ({
        url: '/dashboard/chart',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Dashboard'],
    }),
  }),
});

export const {
  useGetDashboardStatsMutation,
  useGetHourlyChartDataQuery,
  useGetChartDataMutation,
} = dashboardApi;

export const useGetDashboardStatsQuery = useGetDashboardStatsMutation;
export const useGetChartDataQuery = useGetChartDataMutation;
