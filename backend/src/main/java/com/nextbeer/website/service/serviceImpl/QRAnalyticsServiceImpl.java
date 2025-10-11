package com.nextbeer.website.service.serviceImpl;

import com.nextbeer.website.dto.request.AnalyticsRequestDto;
import com.nextbeer.website.dto.response.DailyChartData;
import com.nextbeer.website.dto.response.DashboardStats;
import com.nextbeer.website.dto.response.HourlyChartData;
import com.nextbeer.website.model.QRScan;
import com.nextbeer.website.repository.QRScanRepository;
import com.nextbeer.website.service.QRAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class QRAnalyticsServiceImpl implements QRAnalyticsService {

    private final QRScanRepository scanRepository;

    @Override
    public void logScan() {
        QRScan scan = new QRScan();
        scan.setScanTime(LocalDateTime.now());
        scanRepository.save(scan);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DailyChartData> getChartData(AnalyticsRequestDto request) {
        DateRange dateRange = calculateDateRange(request);
        return getDailyChartData(dateRange.startDate(), dateRange.endDate());
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStats getDashboardStats(AnalyticsRequestDto request) {
        DateRange dateRange = calculateDateRange(request);

        DashboardStats stats = new DashboardStats();
        stats.setTotalScans(scanRepository.countScansBetween(
                dateRange.startDate(),
                dateRange.endDate()
        ));
        stats.setStartDate(dateRange.startDate().toLocalDate());
        stats.setEndDate(dateRange.endDate().toLocalDate());
        stats.setRangeType(request.getRangeType().name());

        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public List<HourlyChartData> getTodayHourlyChart() {
        LocalDateTime todayStart = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
        LocalDateTime now = LocalDateTime.now();
        return getHourlyChartData(todayStart, now);
    }

    private DateRange calculateDateRange(AnalyticsRequestDto request) {
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate;

        switch (request.getRangeType()) {
            case CURRENT_WEEK:
                startDate = endDate.with(DayOfWeek.MONDAY).truncatedTo(ChronoUnit.DAYS);
                break;

            case LAST_WEEK:
                LocalDateTime lastWeekEnd = endDate.with(DayOfWeek.MONDAY)
                        .truncatedTo(ChronoUnit.DAYS)
                        .minusNanos(1);
                startDate = lastWeekEnd.minusDays(6).truncatedTo(ChronoUnit.DAYS);
                endDate = lastWeekEnd;
                break;

            case CURRENT_MONTH:
                startDate = endDate.withDayOfMonth(1).truncatedTo(ChronoUnit.DAYS);
                break;

            case LAST_MONTH:
                LocalDateTime lastMonthEnd = endDate.withDayOfMonth(1)
                        .truncatedTo(ChronoUnit.DAYS)
                        .minusNanos(1);
                startDate = lastMonthEnd.withDayOfMonth(1).truncatedTo(ChronoUnit.DAYS);
                endDate = lastMonthEnd;
                break;

            case CUSTOM:
                if (request.getStartDate() == null || request.getEndDate() == null) {
                    throw new IllegalArgumentException("Custom range requires startDate and endDate");
                }
                startDate = request.getStartDate().atStartOfDay();
                endDate = request.getEndDate().atTime(23, 59, 59);
                break;

            default:
                throw new IllegalArgumentException("Invalid range type: " + request.getRangeType());
        }

        return new DateRange(startDate, endDate);
    }
    @Transactional(readOnly = true)
    public List<DailyChartData> getDailyChartData(LocalDateTime startDate, LocalDateTime endDate) {
        List<Object[]> dbData = scanRepository.getDailyScans(startDate, endDate);

        Map<LocalDate, Long> dataMap = new HashMap<>();
        for (Object[] row : dbData) {
            LocalDate date = ((java.sql.Date) row[0]).toLocalDate();
            Long count = ((Number) row[1]).longValue();
            dataMap.put(date, count);
        }

        List<DailyChartData> chartData = new ArrayList<>();
        LocalDate current = startDate.toLocalDate();
        LocalDate end = endDate.toLocalDate();

        while (!current.isAfter(end)) {
            DailyChartData data = new DailyChartData();
            data.setDate(current);
            data.setScans(dataMap.getOrDefault(current, 0L).intValue());
            chartData.add(data);
            current = current.plusDays(1);
        }

        return chartData;
    }
    @Transactional(readOnly = true)
    public List<HourlyChartData> getHourlyChartData(LocalDateTime startDate, LocalDateTime endDate) {
        List<Object[]> dbData = scanRepository.getHourlyScans(startDate, endDate);

        Map<Integer, Long> dataMap = new HashMap<>();
        for (Object[] row : dbData) {
            Integer hour = ((Number) row[0]).intValue();
            Long count = ((Number) row[1]).longValue();
            dataMap.put(hour, count);
        }

        List<HourlyChartData> chartData = new ArrayList<>();
        for (int hour = 0; hour < 24; hour++) {
            HourlyChartData data = new HourlyChartData();
            data.setHour(hour);
            data.setScans(dataMap.getOrDefault(hour, 0L).intValue());
            chartData.add(data);
        }

        return chartData;
    }

    private record DateRange(LocalDateTime startDate, LocalDateTime endDate) {

    }
}
