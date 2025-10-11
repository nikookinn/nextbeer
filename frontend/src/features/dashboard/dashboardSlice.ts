import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DateRangeType, DashboardStatsResponse, HourlyChartData, DailyChartData } from '../../types/dashboard.types';

interface DashboardState {
  stats: {
    currentWeek: DashboardStatsResponse | null;
    lastWeek: DashboardStatsResponse | null;
    currentMonth: DashboardStatsResponse | null;
    lastMonth: DashboardStatsResponse | null;
    custom: DashboardStatsResponse | null;
  };
  chartData: (HourlyChartData | DailyChartData)[];
  selectedRange: DateRangeType | 'HOURLY';
  customDates: {
    startDate: string | null;
    endDate: string | null;
  };
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: {
    currentWeek: null,
    lastWeek: null,
    currentMonth: null,
    lastMonth: null,
    custom: null,
  },
  chartData: [],
  selectedRange: 'HOURLY',
  customDates: {
    startDate: null,
    endDate: null,
  },
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setStats: (state, action: PayloadAction<{ type: keyof DashboardState['stats']; data: DashboardStatsResponse }>) => {
      state.stats[action.payload.type] = action.payload.data;
    },
    setChartData: (state, action: PayloadAction<(HourlyChartData | DailyChartData)[]>) => {
      state.chartData = action.payload;
    },
    setSelectedRange: (state, action: PayloadAction<DateRangeType | 'HOURLY'>) => {
      state.selectedRange = action.payload;
    },
    setCustomDates: (state, action: PayloadAction<{ startDate: string | null; endDate: string | null }>) => {
      state.customDates = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetDashboard: () => initialState,
  },
});

export const {
  setStats,
  setChartData,
  setSelectedRange,
  setCustomDates,
  setLoading,
  setError,
  resetDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
