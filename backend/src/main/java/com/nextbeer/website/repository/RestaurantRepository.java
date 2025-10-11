package com.nextbeer.website.repository;

import com.nextbeer.website.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    @Query(value = "SELECT c FROM Restaurant c")
    Restaurant findFirstRecord();
}
