package com.nextbeer.website.service;

import com.nextbeer.website.dto.request.CategoryRequestDto;
import com.nextbeer.website.dto.response.CategoryResponse;
import com.nextbeer.website.dto.response.CategorySimpleResponse;
import com.nextbeer.website.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CategoryService {
    Page<CategoryResponse> getAllActiveCategories(int page, int size);

    CategoryResponse saveCategory(CategoryRequestDto requestDto);

    CategoryResponse updateCategory(Long id, CategoryRequestDto requestDto);

    void markCategoryAsInactive(Long id);

    CategoryResponse getCategoryById(Long id);

    Category findCategoryById(Long id);

    List<CategorySimpleResponse> getAllCategoriesByMenuId(Long id);
}
