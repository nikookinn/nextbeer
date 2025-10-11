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
    // Spring Backend: GET /dashboard/stats with @RequestBody (POST gibi kullanım)
    getDashboardStats: builder.mutation<DashboardStatsResponse, DashboardStatsRequest>({
      query: (body) => ({
        url: '/dashboard/stats',
        method: 'POST', // GET + @RequestBody yerine POST kullan
        body,
      }),
      invalidatesTags: ['Dashboard'],
    }),
    // Spring Backend: GET /dashboard/chart/hourly-today (body yok)
    getHourlyChartData: builder.query<HourlyChartData[], void>({
      query: () => '/dashboard/chart/hourly-today',
      providesTags: ['Dashboard'],
    }),
    // Spring Backend: GET /dashboard/chart with @RequestBody
    getChartData: builder.mutation<DailyChartData[], ChartRequest>({
      query: (body) => ({
        url: '/dashboard/chart',
        method: 'POST', // GET + @RequestBody yerine POST kullan
        body,
      }),
      invalidatesTags: ['Dashboard'],
    }),
  }),
});

export const {
  useGetDashboardStatsMutation, // mutation oldu
  useGetHourlyChartDataQuery,   // query kaldı
  useGetChartDataMutation,      // mutation oldu
} = dashboardApi;

// Backward compatibility için alias'lar
export const useGetDashboardStatsQuery = useGetDashboardStatsMutation;
export const useGetChartDataQuery = useGetChartDataMutation;
