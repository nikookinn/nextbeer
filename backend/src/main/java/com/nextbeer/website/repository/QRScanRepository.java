package com.nextbeer.website.repository;

import com.nextbeer.website.model.QRScan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface QRScanRepository extends JpaRepository<QRScan, Long> {
    @Query("SELECT COUNT(q) FROM QRScan q WHERE q.scanTime BETWEEN :start AND :end")
    Long countScansBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT DATE(q.scanTime), COUNT(q) FROM QRScan q WHERE q.scanTime BETWEEN :start AND :end GROUP BY DATE(q.scanTime) ORDER BY DATE(q.scanTime)")
    List<Object[]> getDailyScans(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT HOUR(q.scanTime), COUNT(q) FROM QRScan q WHERE q.scanTime BETWEEN :start AND :end GROUP BY HOUR(q.scanTime) ORDER BY HOUR(q.scanTime)")
    List<Object[]> getHourlyScans(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
