package com.nextbeer.website.mapper;

import com.nextbeer.website.dto.request.CategoryRequestDto;
import com.nextbeer.website.dto.response.CategoryResponse;
import com.nextbeer.website.model.Category;
import com.nextbeer.website.model.Menu;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {
    public Category toEntity(CategoryRequestDto requestDto, Menu menu) {
        return Category.builder()
                .name(requestDto.getName())
                .menu(menu)
                .isActive(true)
                .build();
    }

    public CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder()
                .categoryId(category.getCategoryId())
                .name(category.getName())
                .menuId(category.getMenu().getMenuId())
                .build();
    }

    public Category toEntity(Category category, CategoryRequestDto requestDto, Menu menu) {
        category.setName(requestDto.getName());
        category.setMenu(menu);
        return category;
    }
}
