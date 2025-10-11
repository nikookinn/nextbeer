package com.nextbeer.website.service;

import com.nextbeer.website.dto.request.AnalyticsRequestDto;
import com.nextbeer.website.dto.response.DailyChartData;
import com.nextbeer.website.dto.response.DashboardStats;
import com.nextbeer.website.dto.response.HourlyChartData;

import java.util.List;

public interface QRAnalyticsService {
    void logScan();
    List<DailyChartData> getChartData(AnalyticsRequestDto request);
    DashboardStats getDashboardStats(AnalyticsRequestDto request);
    List<HourlyChartData> getTodayHourlyChart();

}
