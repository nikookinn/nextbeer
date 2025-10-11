package com.nextbeer.website.controller;

import com.nextbeer.website.dto.request.RestaurantRequestDto;
import com.nextbeer.website.dto.response.RestaurantResponseDto;
import com.nextbeer.website.service.RestaurantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/restaurant")
public class RestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping
    public ResponseEntity<RestaurantResponseDto> getRestaurant() {
        return ResponseEntity.ok(restaurantService.getRestaurant());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<RestaurantResponseDto> createRestaurant(@RequestPart("restaurant") @Valid RestaurantRequestDto requestDto,
                                                                  @RequestPart(value = "restaurantImage", required = false) MultipartFile restaurantImage) {
        requestDto.setWebsiteImage(restaurantImage);
        return ResponseEntity.status(HttpStatus.CREATED).body(restaurantService.createRestaurant(requestDto));
    }

    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<RestaurantResponseDto> updateRestaurant(@RequestPart("restaurant") @Valid RestaurantRequestDto requestDto,
                                                                  @RequestPart(value = "restaurantImage", required = false) MultipartFile restaurantImage) {
        requestDto.setWebsiteImage(restaurantImage);
        return ResponseEntity.ok(restaurantService.updateRestaurant(requestDto));
    }
}
