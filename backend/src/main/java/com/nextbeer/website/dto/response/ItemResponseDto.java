package com.nextbeer.website.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemResponseDto {
    private Long itemId;

    private String name;

    private BigDecimal price;

    private String description;

    private String imageUrl;

    private Integer displayOrder;

    private List<ItemTagResponse> itemTagResponses;

    private List<ItemVariantResponse> itemVariantResponses;
}
