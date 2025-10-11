package com.nextbeer.website.dto.request;

import com.nextbeer.website.annotations.ValidImageFile;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemRequestDto {

    @NotEmpty(message = "field cannot be empty")
    private String name;

    @NotNull(message = "field cannot be empty")
    private BigDecimal price;

    @NotEmpty(message = "field cannot be empty")
    private String description;

    @NotNull(message = "field cannot be empty")
    private Long categoryId;

    @ValidImageFile
    private MultipartFile itemImage;

    private List<ItemVariantRequestDto> variants;

    private List<Long> tagIds;

    private boolean removeImage;
}
