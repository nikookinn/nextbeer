package com.nextbeer.website.controller;

import com.nextbeer.website.dto.request.AnalyticsRequestDto;
import com.nextbeer.website.dto.response.DailyChartData;
import com.nextbeer.website.dto.response.DashboardStats;
import com.nextbeer.website.dto.response.HourlyChartData;
import com.nextbeer.website.service.QRAnalyticsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@RequestMapping("/api/v1/dashboard")
public class AnalyticsController {

    private final QRAnalyticsService analyticsService;

    @PostMapping("/stats")
    public ResponseEntity<DashboardStats> getDashboardStats(@Valid @RequestBody AnalyticsRequestDto request) {
        return ResponseEntity.ok(analyticsService.getDashboardStats(request));
    }

    @PostMapping("/chart")
    public ResponseEntity<List<DailyChartData>> getChart(@RequestBody AnalyticsRequestDto request) {
        return ResponseEntity.ok(analyticsService.getChartData(request));
    }

    @GetMapping("/chart/hourly-today")
    public ResponseEntity<List<HourlyChartData>> getTodayHourlyChart() {
        return ResponseEntity.ok(analyticsService.getTodayHourlyChart());
    }
}
