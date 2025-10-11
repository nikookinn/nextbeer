package com.nextbeer.website.service.serviceImpl;

import com.nextbeer.website.dto.request.CategoryRequestDto;
import com.nextbeer.website.dto.response.CategoryResponse;
import com.nextbeer.website.dto.response.CategorySimpleResponse;
import com.nextbeer.website.dto.response.MenuResponse;
import com.nextbeer.website.exception.CategoryNotFoundException;
import com.nextbeer.website.exception.MenuNotFoundException;
import com.nextbeer.website.mapper.CategoryMapper;
import com.nextbeer.website.model.Category;
import com.nextbeer.website.model.Menu;
import com.nextbeer.website.repository.CategoryRepository;
import com.nextbeer.website.service.CategoryService;
import com.nextbeer.website.service.MenuService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final MenuService menuService;

    @Override
    @Transactional(readOnly = true)
    public Page<CategoryResponse> getAllActiveCategories(int page, int size) {
        Page<Category> categories = categoryRepository.findAllByIsActiveIsTrue(PageRequest.of(page, size));
        return categories.map(categoryMapper::toResponse);
    }

    @Override
    @Transactional
    public CategoryResponse saveCategory(CategoryRequestDto requestDto) {
        Menu menu = menuService.findMenuById(requestDto.getMenuId());
        Category category = categoryMapper.toEntity(requestDto,menu);
        Category savedCategory = categoryRepository.save(category);
        log.info("new category successfully added to db with name : " + savedCategory.getName());
        return categoryMapper.toResponse(savedCategory);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequestDto requestDto) {
        Menu menu = menuService.findMenuById(requestDto.getMenuId());
        Category category = findCategoryById(id);
        category = categoryMapper.toEntity(category, requestDto, menu);
        Category updatedCategory = categoryRepository.save(category);
        log.info("category successfully updated with name : " + updatedCategory.getName());
        return categoryMapper.toResponse(updatedCategory);
    }

    @Override
    @Transactional
    public void markCategoryAsInactive(Long id) {
        Category category = findCategoryById(id);
        category.setActive(false);
        categoryRepository.save(category);
        log.info("category successfully removed from db with name : " + category.getName());
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        return categoryMapper.toResponse(findCategoryById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategorySimpleResponse> getAllCategoriesByMenuId(Long menuId) {
        if (!menuService.existById(menuId)){
            throw  new MenuNotFoundException("Menu with ID " + menuId + " not found");
        }
        return categoryRepository.findCategoriesByMenuIdAndIsActiveTrue(menuId);
    }

    @Override
    @Transactional(readOnly = true)
    public Category findCategoryById(Long id) {
        return categoryRepository.findByCategoryIdAndIsActiveIsTrue(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category with ID " + id + " not found"));

    }


}
