package com.nextbeer.website.dto.response;

import com.nextbeer.website.annotations.ValidImageFile;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantResponseDto {
    private Long id;

    private String name;

    private String about;

    private String phoneNumber;

    private String address;

    private String workingHours;

    private String imageUrl;

    private String email;

    private String instagramUrl;

    private String facebookUrl;

    private String twitterUrl;

    private Double latitude;

    private Double longitude;

}
