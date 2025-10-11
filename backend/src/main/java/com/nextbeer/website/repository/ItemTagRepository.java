package com.nextbeer.website.repository;

import com.nextbeer.website.dto.response.ItemTagResponse;
import com.nextbeer.website.model.ItemTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ItemTagRepository extends JpaRepository<ItemTag, Long> {
    List<ItemTagResponse> findAllItemTagsByIdAndIsActiveTrue(Long id);

    List<ItemTag> findAllByIsActiveTrue();

    Optional<ItemTag> findByIdAndIsActiveTrue(Long id);

    List<ItemTag> findAllByIdInAndIsActiveTrue(List<Long> ids);

    @Query("SELECT t FROM Item i JOIN i.tags t WHERE i.itemId = :itemId AND t.isActive = true")
    List<ItemTag> findAllItemTagsByItemId(@Param("itemId") Long id);
}
