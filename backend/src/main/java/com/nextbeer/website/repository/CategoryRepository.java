package com.nextbeer.website.repository;

import com.nextbeer.website.dto.response.CategorySimpleResponse;
import com.nextbeer.website.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Page<Category> findAllByIsActiveIsTrue(Pageable pageable);

    Optional<Category> findByCategoryIdAndIsActiveIsTrue(Long id);

    @Query("SELECT new com.nextbeer.website.dto.response.CategorySimpleResponse(c.categoryId, c.name) FROM Category c WHERE c.menu.menuId = :menuId AND c.isActive = true")
    List<CategorySimpleResponse> findCategoriesByMenuIdAndIsActiveTrue(@Param("menuId") Long menuId);
}
