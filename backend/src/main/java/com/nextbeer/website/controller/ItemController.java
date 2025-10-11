package com.nextbeer.website.controller;

import com.nextbeer.website.dto.request.ItemOrderRequestDto;
import com.nextbeer.website.dto.request.ItemRequestDto;
import com.nextbeer.website.dto.response.ItemResponseDto;
import com.nextbeer.website.dto.response.PageResponse;
import com.nextbeer.website.service.ItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/items")
public class ItemController {

    private final ItemService itemService;

    @GetMapping("/{id}")
    public ResponseEntity<ItemResponseDto> getItemDetailById(@PathVariable Long id) {
        return ResponseEntity.ok(itemService.getItemDetailById(id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<ItemResponseDto> saveItem(@RequestPart("item") @Valid ItemRequestDto requestDto,
                                                    @RequestPart(value = "itemImage", required = false) MultipartFile itemImage) {
        requestDto.setItemImage(itemImage);
        return ResponseEntity.status(HttpStatus.CREATED).body(itemService.saveItem(requestDto));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<ItemResponseDto> updateItem(@PathVariable Long id,
                                                      @RequestPart("item") @Valid ItemRequestDto requestDto,
                                                      @RequestPart(value = "itemImage", required = false) MultipartFile itemImage) {
        requestDto.setItemImage(itemImage);
        return ResponseEntity.ok(itemService.updateItem(id, requestDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Void> deleteItem(@PathVariable("id") Long id) {
        itemService.markItemAsInactive(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<PageResponse<ItemResponseDto>> getAllItemsByCategoryId(@PathVariable Long categoryId,
                                                                         @RequestParam(defaultValue = "0") int page,
                                                                         @RequestParam(defaultValue = "10") int size) {
        Page<ItemResponseDto> itemPage = itemService.getAllItemsByCategoryId(categoryId, page, size);
        PageResponse<ItemResponseDto> pageResponse = new PageResponse<>(
                itemPage.getContent(),
                itemPage.getNumber(),
                itemPage.getSize(),
                itemPage.getTotalElements(),
                itemPage.getTotalPages(),
                itemPage.isFirst(),
                itemPage.isLast()
        );
        return ResponseEntity.ok(pageResponse);
    }
    @PostMapping("/update-order")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Void> updateItemOrder(@RequestBody List<ItemOrderRequestDto> updates) {
        itemService.updateItemOrder(updates);
        return ResponseEntity.ok().build();
    }
}
