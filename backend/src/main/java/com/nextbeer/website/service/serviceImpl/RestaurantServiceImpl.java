package com.nextbeer.website.service.serviceImpl;

import com.nextbeer.website.dto.response.RestaurantResponseDto;
import com.nextbeer.website.enums.ImageDirectory;
import com.nextbeer.website.dto.request.RestaurantRequestDto;
import com.nextbeer.website.exception.RestaurantAlreadyExistsException;
import com.nextbeer.website.exception.RestaurantNotFoundException;
import com.nextbeer.website.mapper.RestaurantMapper;
import com.nextbeer.website.model.Restaurant;
import com.nextbeer.website.repository.RestaurantRepository;
import com.nextbeer.website.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class RestaurantServiceImpl implements RestaurantService {
    private final RestaurantMapper mapper;
    private final RestaurantRepository restaurantRepository;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional(readOnly = true)
    public RestaurantResponseDto getRestaurant() {
        Restaurant restaurant = restaurantRepository.findFirstRecord();
        return mapper.toDto(restaurant);
    }

    @Override
    @Transactional
    public RestaurantResponseDto createRestaurant(RestaurantRequestDto requestDto) {
        if (restaurantExists()) {
            throw new RestaurantAlreadyExistsException("There is already a restaurant in the system.");
        }
        Restaurant restaurant = mapper.toEntity(requestDto);
        String imageUrl = null;
        if (requestDto.getWebsiteImage() != null && !requestDto.getWebsiteImage().isEmpty()) {
            imageUrl = fileStorageService.storeFile(requestDto.getWebsiteImage(), ImageDirectory.APP_IMAGES.getDirectory());
        }
        restaurant.setWebsiteImageUrl(imageUrl);
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        log.info("restaurant details added successfully to db with name : " + savedRestaurant.getName());
        return mapper.toDto(savedRestaurant);
    }

    @Override
    @Transactional
    public RestaurantResponseDto updateRestaurant(RestaurantRequestDto requestDto) {
        List<Restaurant> restaurants = restaurantRepository.findAll();
        if (restaurants.isEmpty()) {
            throw new RestaurantNotFoundException("There is no restaurant with name " + requestDto.getName());
        }
        Restaurant restaurant = restaurants.get(0);
        String imageUrl = restaurant.getWebsiteImageUrl();
        if (requestDto.getWebsiteImage() != null && !requestDto.getWebsiteImage().isEmpty()) {
            fileStorageService.deleteOldImage(imageUrl, ImageDirectory.APP_IMAGES.getDirectory());
            imageUrl = fileStorageService.storeFile(requestDto.getWebsiteImage(), ImageDirectory.APP_IMAGES.getDirectory());
        } else if (requestDto.isRemoveImage()) {
            fileStorageService.deleteOldImage(imageUrl, ImageDirectory.APP_IMAGES.getDirectory());
            imageUrl = null;
        }
        restaurant.setWebsiteImageUrl(imageUrl);
        Restaurant updatedRestaurant = restaurantRepository.save(mapper.updateEntity(restaurant, requestDto));
        log.info("restaurant details successfully updated: " + updatedRestaurant.getName());
        return mapper.toDto(updatedRestaurant);
    }

    @Override
    public boolean restaurantExists() {
        return restaurantRepository.count() > 0;
    }
}
