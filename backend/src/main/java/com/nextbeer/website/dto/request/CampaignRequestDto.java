package com.nextbeer.website.dto.request;

import com.nextbeer.website.annotations.ValidImageFile;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CampaignRequestDto {

    @NotEmpty(message = "This field cannot be empty")
    private String name;

    @ValidImageFile
    private MultipartFile campaignImage;

    private boolean removeImage;
}
