package com.nextbeer.website.repository;

import com.nextbeer.website.model.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ItemRepository extends JpaRepository<Item, Long> {
    Page<Item> findAllByCategory_CategoryIdAndIsActiveTrue(Long categoryId, Pageable pageable);

    Optional<Item> findByItemIdAndIsActiveIsTrue(Long id);
    boolean existsByItemIdAndIsActiveIsTrue(Long itemId);

    List<Item> findAllByItemIdInAndIsActiveTrue(List<Long> ids);

    @Query("SELECT MAX(i.displayOrder) FROM Item i WHERE i.category.categoryId = :categoryId")
    Integer findMaxDisplayOrderByCategory(@Param("categoryId") Long categoryId);
}
