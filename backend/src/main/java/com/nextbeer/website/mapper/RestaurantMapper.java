package com.nextbeer.website.mapper;

import com.nextbeer.website.dto.request.RestaurantRequestDto;
import com.nextbeer.website.model.Restaurant;
import com.nextbeer.website.dto.response.RestaurantResponseDto;
import org.springframework.stereotype.Component;

@Component
public class RestaurantMapper {

    public Restaurant toEntity(RestaurantRequestDto dto) {
        if (dto == null) {
            return null;
        }

        return Restaurant.builder()
                .name(dto.getName())
                .about(dto.getAbout())
                .phoneNumber(dto.getPhoneNumber())
                .address(dto.getAddress())
                .workingHours(dto.getWorkingHours())
                .email(dto.getEmail())
                .instagramUrl(dto.getInstagramUrl())
                .facebookUrl(dto.getFacebookUrl())
                .twitterUrl(dto.getTwitterUrl())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .build();
    }

    public RestaurantResponseDto toDto(Restaurant entity) {
        if (entity == null) {
            return null;
        }

        return RestaurantResponseDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .about(entity.getAbout())
                .phoneNumber(entity.getPhoneNumber())
                .address(entity.getAddress())
                .workingHours(entity.getWorkingHours())
                .imageUrl(entity.getWebsiteImageUrl())
                .email(entity.getEmail())
                .instagramUrl(entity.getInstagramUrl())
                .facebookUrl(entity.getFacebookUrl())
                .twitterUrl(entity.getTwitterUrl())
                .latitude(entity.getLatitude())
                .longitude(entity.getLongitude())
                .build();
    }

    public Restaurant updateEntity(Restaurant entity, RestaurantRequestDto dto) {
        if (entity == null || dto == null) {
            return null;
        }

        entity.setName(dto.getName());
        entity.setAbout(dto.getAbout());
        entity.setPhoneNumber(dto.getPhoneNumber());
        entity.setAddress(dto.getAddress());
        entity.setWorkingHours(dto.getWorkingHours());
        entity.setEmail(dto.getEmail());
        entity.setInstagramUrl(dto.getInstagramUrl());
        entity.setFacebookUrl(dto.getFacebookUrl());
        entity.setTwitterUrl(dto.getTwitterUrl());
        entity.setLatitude(dto.getLatitude());
        entity.setLongitude(dto.getLongitude());
        return entity;
    }
}
