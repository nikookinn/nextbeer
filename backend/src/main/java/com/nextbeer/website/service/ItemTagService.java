package com.nextbeer.website.service;

import com.nextbeer.website.dto.request.ItemTagRequestDto;
import com.nextbeer.website.dto.response.ItemTagResponse;
import com.nextbeer.website.model.ItemTag;

import java.util.List;

public interface ItemTagService {
    List<ItemTagResponse> getItemTagsById(Long id);

    ItemTagResponse saveItemTag(ItemTagRequestDto requestDto);

    List<ItemTagResponse> getAllItemTagsByItemId(Long id);

    ItemTagResponse getItemTagById(Long id);

    void markItemTagAsInactive(Long id);

    List<ItemTagResponse> getAllItemTags();

    List<ItemTag> getAllTagsById(List<Long> tagIds);

    ItemTagResponse updateItemTag(Long id, ItemTagRequestDto requestDto);
}
