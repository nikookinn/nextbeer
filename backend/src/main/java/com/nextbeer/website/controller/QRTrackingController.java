package com.nextbeer.website.controller;

import com.nextbeer.website.service.QRAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class QRTrackingController {
    private final QRAnalyticsService analyticsService;

    @PostMapping("/qr-track")
    public ResponseEntity<Void> trackQRScan() {
        analyticsService.logScan();
        return ResponseEntity.ok().build();
    }
}
