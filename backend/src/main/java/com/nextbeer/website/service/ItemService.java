package com.nextbeer.website.service;

import com.nextbeer.website.dto.request.ItemOrderRequestDto;
import com.nextbeer.website.dto.request.ItemRequestDto;
import com.nextbeer.website.dto.response.ItemResponseDto;
import com.nextbeer.website.model.Item;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ItemService {
    ItemResponseDto getItemDetailById(Long id);

    ItemResponseDto saveItem(ItemRequestDto requestDto);

    ItemResponseDto updateItem(Long id, ItemRequestDto requestDto);

    void markItemAsInactive(Long id);

    Page<ItemResponseDto> getAllItemsByCategoryId(Long categoryId, int page, int size);

    Item getItemById(Long id);
    void updateItemOrder(List<ItemOrderRequestDto> updates);
}
