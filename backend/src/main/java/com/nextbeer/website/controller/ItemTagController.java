package com.nextbeer.website.controller;

import com.nextbeer.website.service.ItemTagService;
import com.nextbeer.website.dto.request.ItemTagRequestDto;
import com.nextbeer.website.dto.response.ItemTagResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/itemTags")
public class ItemTagController {

    private final ItemTagService itemTagService;

    @GetMapping("/{id}")
    public ResponseEntity<ItemTagResponse> getItemTagById(@PathVariable Long id) {
        return ResponseEntity.ok(itemTagService.getItemTagById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<ItemTagResponse> saveItemTag(@Valid @RequestBody ItemTagRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(itemTagService.saveItemTag(requestDto));
    }
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<ItemTagResponse> updateItemTag(@PathVariable Long id,
                                                         @Valid @RequestBody ItemTagRequestDto requestDto) {
        return ResponseEntity.ok(itemTagService.updateItemTag(id, requestDto));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Void> markItemTagAsInactive(@PathVariable Long id) {
        itemTagService.markItemTagAsInactive(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<ItemTagResponse>> getAllItemTagsByItemId(@PathVariable Long itemId) {
        return ResponseEntity.ok(itemTagService.getAllItemTagsByItemId(itemId));
    }

    @GetMapping
    public ResponseEntity<List<ItemTagResponse>> getAllItemTags() {
        return ResponseEntity.ok(itemTagService.getAllItemTags());
    }
}
