package com.nextbeer.website.dto.request;

import lombok.Data;

@Data
public class ItemOrderRequestDto {
    private Long itemId;
    private Integer displayOrder;
}
