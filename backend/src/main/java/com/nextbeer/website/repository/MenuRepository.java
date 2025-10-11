package com.nextbeer.website.repository;

import com.nextbeer.website.model.Menu;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {
    boolean existsByMenuIdAndIsActiveIsTrue(Long menuId);

    List<Menu> findByIsActiveIsTrue();

    Page<Menu> findAllByIsActiveIsTrue(Pageable pageable);

    Optional<Menu> findByMenuIdAndIsActiveIsTrue(Long id);
}
