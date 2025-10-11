package com.nextbeer.website.service.serviceImpl;

import com.nextbeer.website.dto.request.ItemOrderRequestDto;
import com.nextbeer.website.dto.request.ItemRequestDto;
import com.nextbeer.website.dto.response.ItemResponseDto;
import com.nextbeer.website.enums.ImageDirectory;
import com.nextbeer.website.exception.ItemNotFoundException;
import com.nextbeer.website.mapper.ItemMapper;
import com.nextbeer.website.model.Category;
import com.nextbeer.website.model.Item;
import com.nextbeer.website.model.ItemTag;
import com.nextbeer.website.repository.ItemRepository;
import com.nextbeer.website.service.CategoryService;
import com.nextbeer.website.service.ItemService;
import com.nextbeer.website.service.ItemTagService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;
    private final FileStorageService fileStorageService;
    private final CategoryService categoryService;
    private final ItemTagService itemTagService;
    private final ItemMapper itemMapper;

    @Override
    @Transactional(readOnly = true)
    public ItemResponseDto getItemDetailById(Long id) {
        Item item = getItemById(id);
        return itemMapper.toResponse(item);
    }

    @Override
    @Transactional
    public ItemResponseDto saveItem(ItemRequestDto requestDto) {
        String imageUrl = null;
        if (requestDto.getItemImage() != null && !requestDto.getItemImage().isEmpty()) {
            imageUrl = fileStorageService.storeFile(requestDto.getItemImage(), ImageDirectory.ITEM_IMAGES.getDirectory());
        }
        Category category = categoryService.findCategoryById(requestDto.getCategoryId());
        List<ItemTag> itemTags = itemTagService.getAllTagsById(requestDto.getTagIds());
        Integer maxOrder = itemRepository.findMaxDisplayOrderByCategory(category.getCategoryId());

        Item item = itemMapper.toEntity(requestDto, category, itemTags, imageUrl);
        item.setDisplayOrder((maxOrder == null ? 0 : maxOrder) + 1);
        Item savedItem = itemRepository.save(item);
        log.info("new menu item added successfully to db with name : " + savedItem.getName());
        return itemMapper.toResponse(item);
    }

    @Override
    @Transactional
    public ItemResponseDto updateItem(Long id, ItemRequestDto requestDto) {
        Item item = getItemById(id);
        String imageUrl = item.getImageUrl();
        if (requestDto.getItemImage() != null && !requestDto.getItemImage().isEmpty()) {
            fileStorageService.deleteOldImage(imageUrl, ImageDirectory.ITEM_IMAGES.getDirectory());
            imageUrl = fileStorageService.storeFile(requestDto.getItemImage(), ImageDirectory.ITEM_IMAGES.getDirectory());
        } else if (requestDto.isRemoveImage()) {
            fileStorageService.deleteOldImage(imageUrl, ImageDirectory.ITEM_IMAGES.getDirectory());
            imageUrl = null;
        }
        Category category = categoryService.findCategoryById(requestDto.getCategoryId());
        List<ItemTag> itemTags = itemTagService.getAllTagsById(requestDto.getTagIds());
        Item updatedItem = itemRepository.save(itemMapper.toEntity(requestDto, category, itemTags, item, imageUrl));
        log.info("menu item updated successfully with name : " + updatedItem.getName());
        return itemMapper.toResponse(updatedItem);
    }

    @Override
    @Transactional
    public void markItemAsInactive(Long id) {
        Item item = getItemById(id);
        item.setActive(false);
        itemRepository.save(item);
        log.info("menu item removed successfully with name : " + item.getName());
    }

    @Override
    public Page<ItemResponseDto> getAllItemsByCategoryId(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("displayOrder").ascending());
        Page<Item> items = itemRepository.findAllByCategory_CategoryIdAndIsActiveTrue(categoryId,pageable);
        return items.map(itemMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Item getItemById(Long id) {
        return itemRepository.findByItemIdAndIsActiveIsTrue(id).orElseThrow(() -> new ItemNotFoundException("There is no item with id " + id));
    }

    @Override
    @Transactional
    public void updateItemOrder(List<ItemOrderRequestDto> updates) {
        List<Item> items = itemRepository.findAllByItemIdInAndIsActiveTrue(
                updates.stream().map(ItemOrderRequestDto::getItemId).toList()
        );
        Map<Long, Integer> orderMap = updates.stream()
                .collect(Collectors.toMap(ItemOrderRequestDto::getItemId, ItemOrderRequestDto::getDisplayOrder));
        items.forEach(item -> item.setDisplayOrder(orderMap.get(item.getItemId())));
        itemRepository.saveAll(items);
    }

}
