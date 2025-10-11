package com.nextbeer.website.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class CategorySimpleResponse {
    private Long categoryId;

    private String name;
}
