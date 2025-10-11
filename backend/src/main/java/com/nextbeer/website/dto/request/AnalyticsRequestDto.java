package com.nextbeer.website.dto.request;

import com.nextbeer.website.enums.DateRangeType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AnalyticsRequestDto {
    private DateRangeType rangeType;

    private LocalDate startDate;

    private LocalDate endDate;
}
