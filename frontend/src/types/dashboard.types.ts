export type DateRangeType = 
  | 'CURRENT_WEEK' 
  | 'LAST_WEEK' 
  | 'CURRENT_MONTH' 
  | 'LAST_MONTH' 
  | 'HOURLY'
  | 'CUSTOM';

export interface DashboardStatsRequest {
  rangeType: DateRangeType;
  startDate?: string;
  endDate?: string;
}

export interface DashboardStatsResponse {
  totalScans: number;
  startDate: string;
  endDate: string;
  rangeType: string;
}

export interface HourlyChartData {
  hour: number;
  scans: number;
}

export interface DailyChartData {
  date: string;
  scans: number;
}

export interface ChartRequest {
  rangeType: DateRangeType;
  startDate?: string;
  endDate?: string;
}
