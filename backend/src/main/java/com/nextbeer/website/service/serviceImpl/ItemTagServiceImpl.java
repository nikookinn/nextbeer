package com.nextbeer.website.service.serviceImpl;

import com.nextbeer.website.exception.ItemNotFoundException;
import com.nextbeer.website.exception.ItemTagNotFoundException;
import com.nextbeer.website.repository.ItemRepository;
import com.nextbeer.website.repository.ItemTagRepository;
import com.nextbeer.website.dto.request.ItemTagRequestDto;
import com.nextbeer.website.dto.response.ItemTagResponse;
import com.nextbeer.website.model.ItemTag;
import com.nextbeer.website.service.ItemTagService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemTagServiceImpl implements ItemTagService {
    private final ItemTagRepository itemTagRepository;
    private final ItemRepository itemRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ItemTagResponse> getItemTagsById(Long id) {
        return itemTagRepository.findAllItemTagsByIdAndIsActiveTrue(id);
    }

    @Override
    @Transactional
    public ItemTagResponse saveItemTag(ItemTagRequestDto requestDto) {
        ItemTag savedItemTag = itemTagRepository.save(ItemTag.builder()
                .name(requestDto.getName())
                .isActive(true)
                .build());
        return ItemTagResponse.builder()
                .id(savedItemTag.getId())
                .name(savedItemTag.getName())
                .build();
    }

    @Override
    @Transactional
    public ItemTagResponse updateItemTag(Long id, ItemTagRequestDto requestDto) {
        ItemTag itemtag = findItemTagById(id);
        itemtag.setName(requestDto.getName());
        return ItemTagResponse.builder().name(itemtag.getName()).build();
    }

    @Override
    @Transactional
    public void markItemTagAsInactive(Long id) {
        ItemTag itemTag = findItemTagById(id);
        itemTag.setActive(false);
        itemTagRepository.save(itemTag);
    }

    @Override
    @Transactional(readOnly = true)
    public ItemTagResponse getItemTagById(Long id) {
        ItemTag itemTag = findItemTagById(id);
        return ItemTagResponse.builder()
                .id(itemTag.getId())
                .name(itemTag.getName())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItemTagResponse> getAllItemTagsByItemId(Long id) {
        if (!itemRepository.existsByItemIdAndIsActiveIsTrue(id)) {
            throw new ItemNotFoundException("Item with ID " + id + " not found");
        }
        List<ItemTag> tags = itemTagRepository.findAllItemTagsByItemId(id);
        return tags.stream().map(t -> ItemTagResponse.builder()
                        .id(t.getId())
                        .name(t.getName())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItemTagResponse> getAllItemTags() {
        List<ItemTag> itemTags = itemTagRepository.findAllByIsActiveTrue();
        return itemTags.stream().map(t -> ItemTagResponse
                        .builder()
                        .id(t.getId())
                        .name(t.getName())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItemTag> getAllTagsById(List<Long> tagIds) {
        return itemTagRepository.findAllByIdInAndIsActiveTrue(tagIds);
    }
    @Transactional(readOnly = true)
    public ItemTag findItemTagById(Long id) {
        return itemTagRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ItemTagNotFoundException("item tag not found by id " + id));
    }
}
