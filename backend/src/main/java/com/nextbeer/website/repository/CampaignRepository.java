package com.nextbeer.website.repository;

import com.nextbeer.website.model.Campaign;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    Optional<Campaign> findCampaignByCampaignIdAndIsActiveIsTrue(Long id);

    Page<Campaign> findAllByIsActiveIsTrue(Pageable pageable);

    @Query("SELECT c FROM Campaign c WHERE c.isActive = true ORDER BY c.creationDate DESC")
    List<Campaign> findAllByIsActiveIsTrue();
}
