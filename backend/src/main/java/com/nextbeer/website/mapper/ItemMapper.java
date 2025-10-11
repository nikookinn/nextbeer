package com.nextbeer.website.mapper;

import com.nextbeer.website.dto.request.ItemRequestDto;
import com.nextbeer.website.dto.request.ItemVariantRequestDto;
import com.nextbeer.website.dto.response.ItemResponseDto;
import com.nextbeer.website.dto.response.ItemTagResponse;
import com.nextbeer.website.dto.response.ItemVariantResponse;
import com.nextbeer.website.model.Category;
import com.nextbeer.website.model.Item;
import com.nextbeer.website.model.ItemTag;
import com.nextbeer.website.model.ItemVariant;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class ItemMapper {

    public Item toEntity(ItemRequestDto requestDto, Category category, List<ItemTag> itemTags, String imageUrl) {
        Item item = Item.builder()
                .name(requestDto.getName())
                .description(requestDto.getDescription())
                .price(requestDto.getPrice())
                .category(category)
                .isActive(true)
                .imageUrl(imageUrl)
                .tags(itemTags)
                .build();
        if (requestDto.getVariants() != null) {
            List<ItemVariant> variants = requestDto.getVariants()
                    .stream()
                    .map(v -> toItemVariant(v, item))
                    .toList();
            item.setVariants(variants);
        }
        return item;
    }

    public Item toEntity(ItemRequestDto requestDto, Category category, List<ItemTag> itemTags, Item item, String imageUrl) {
        item.setName(requestDto.getName());
        item.setPrice(requestDto.getPrice());
        item.setDescription(requestDto.getDescription());
        item.setCategory(category);
        item.setTags(itemTags);

        if (requestDto.getItemImage() != null && !requestDto.getItemImage().isEmpty()) {
            item.setImageUrl(imageUrl);
        } else if (requestDto.isRemoveImage()) {
            item.setImageUrl(imageUrl);
        }

        Map<Long, ItemVariant> existingMap = item.getVariants().stream()
                .collect(Collectors.toMap(ItemVariant::getId, v -> v));

        List<ItemVariant> updatedVariants = new ArrayList<>();

        if (requestDto.getVariants() !=null) {
            for (ItemVariantRequestDto dto : requestDto.getVariants()) {
                if (dto.getId() != null && existingMap.containsKey(dto.getId())) {
                    ItemVariant variant = existingMap.get(dto.getId());
                    variant.setName(dto.getName());
                    variant.setPrice(dto.getPrice());
                    updatedVariants.add(variant);
                } else {
                    updatedVariants.add(toItemVariant(dto, item));
                }
            }
        }

        item.getVariants().clear();
        item.getVariants().addAll(updatedVariants);

        return item;
    }

    public ItemResponseDto toResponse(Item item) {
        return ItemResponseDto.builder()
                .itemId(item.getItemId())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .imageUrl(item.getImageUrl())
                .displayOrder(item.getDisplayOrder())
                .itemTagResponses(item.getTags().stream().map(this::toItemTagResponse).collect(Collectors.toList()))
                .itemVariantResponses((item.getVariants() != null ? item.getVariants() : List.<ItemVariant>of())
                        .stream()
                        .map(this::toItemVariantResponse)
                        .collect(Collectors.toList()))
                .build();
    }

    public ItemTagResponse toItemTagResponse(ItemTag itemTag) {
        return ItemTagResponse.builder()
                .id(itemTag.getId())
                .name(itemTag.getName())
                .build();
    }

    public ItemVariantResponse toItemVariantResponse(ItemVariant itemVariant) {
        return ItemVariantResponse.builder()
                .id(itemVariant.getId())
                .name(itemVariant.getName())
                .price(itemVariant.getPrice())
                .build();
    }

    public ItemVariant toItemVariant(ItemVariantRequestDto requestDto, Item item) {
        return ItemVariant.builder()
                .name(requestDto.getName())
                .price(requestDto.getPrice())
                .isActive(true)
                .item(item)
                .build();
    }
}
