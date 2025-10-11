package com.nextbeer.website.service;

import com.nextbeer.website.dto.request.RestaurantRequestDto;
import com.nextbeer.website.dto.response.RestaurantResponseDto;

public interface RestaurantService {
    RestaurantResponseDto getRestaurant();

    RestaurantResponseDto createRestaurant(RestaurantRequestDto requestDto);

    RestaurantResponseDto updateRestaurant(RestaurantRequestDto requestDto);

    boolean restaurantExists();
}
