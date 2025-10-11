package com.nextbeer.website.controller;

import com.nextbeer.website.dto.request.CategoryRequestDto;
import com.nextbeer.website.dto.response.CategoryResponse;
import com.nextbeer.website.dto.response.CategorySimpleResponse;
import com.nextbeer.website.dto.response.PageResponse;
import com.nextbeer.website.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/categories")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<PageResponse<CategoryResponse>> getAllCategories(@RequestParam(defaultValue = "0") int page,
                                                                   @RequestParam(defaultValue = "10") int size) {
        Page<CategoryResponse> categoryPage = categoryService.getAllActiveCategories(page, size);
        PageResponse<CategoryResponse> response = new PageResponse<>(
                categoryPage.getContent(),
                categoryPage.getNumber(),
                categoryPage.getSize(),
                categoryPage.getTotalElements(),
                categoryPage.getTotalPages(),
                categoryPage.isFirst(),
                categoryPage.isLast()
        );
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(categoryService.getCategoryById(id));
    }

    @GetMapping("/menu/{menuId}")
    public ResponseEntity<List<CategorySimpleResponse>> getAllCategoriesByMenu(@PathVariable Long menuId) {
        return ResponseEntity.status(HttpStatus.OK).body(categoryService.getAllCategoriesByMenuId(menuId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<CategoryResponse> saveCategory(@Valid @RequestBody CategoryRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.saveCategory(requestDto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<CategoryResponse> updateCategory(@PathVariable Long id,
                                                           @Valid @RequestBody CategoryRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.OK).body(categoryService.updateCategory(id, requestDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Void> deleteCategory(@PathVariable("id") Long id) {
        categoryService.markCategoryAsInactive(id);
        return ResponseEntity.noContent().build();
    }
}
