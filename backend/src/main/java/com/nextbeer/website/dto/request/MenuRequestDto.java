package com.nextbeer.website.dto.request;

import com.nextbeer.website.annotations.ValidImageFile;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuRequestDto {

    @NotEmpty(message = "This field cannot be empty")
    private String name;

    @ValidImageFile
    private MultipartFile menuImage;

    private boolean removeImage;
}
