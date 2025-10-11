package com.nextbeer.website.dto.request;

import com.nextbeer.website.model.Menu;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CategoryRequestDto {

    @NotEmpty(message = "This field cannot be empty")
    private String name;

    @NotNull(message = "Menu ID cannot be null")
    private Long menuId;
}
