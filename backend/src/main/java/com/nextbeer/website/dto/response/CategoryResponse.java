package com.nextbeer.website.dto.response;

import com.nextbeer.website.model.Menu;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CategoryResponse {
    private Long categoryId;

    private String name;

    private Long menuId;
}
