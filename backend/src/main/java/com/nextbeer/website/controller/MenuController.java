package com.nextbeer.website.controller;

import com.nextbeer.website.dto.request.MenuRequestDto;
import com.nextbeer.website.dto.response.ItemResponseDto;
import com.nextbeer.website.dto.response.MenuResponse;
import com.nextbeer.website.dto.response.PageResponse;
import com.nextbeer.website.service.MenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/menus")
public class MenuController {

    private final MenuService menuService;

    @GetMapping("/{id}")
    public ResponseEntity<MenuResponse> getMenuById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(menuService.getMenuById(id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuResponse> saveMenu(@RequestPart("menu") @Valid MenuRequestDto requestDto,
                                                 @RequestPart(value = "menuImage", required = false) MultipartFile menuImage) {
        requestDto.setMenuImage(menuImage);
        return ResponseEntity.status(HttpStatus.CREATED).body(menuService.saveMenu(requestDto));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuResponse> updateMenu(@PathVariable("id") Long id,
                                                   @RequestPart("menu") @Valid MenuRequestDto requestDto,
                                                   @RequestPart(value = "menuImage", required = false) MultipartFile menuImage) {
        requestDto.setMenuImage(menuImage);
        return ResponseEntity.ok(menuService.updateMenu(id, requestDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Void> deleteMenu(@PathVariable("id") Long id) {
        menuService.markMenuAsInactive(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<?> getMenus(@RequestParam(required = false) Integer page,
                                      @RequestParam(required = false) Integer size) {
        if (page != null && size != null) {
            Page<MenuResponse> menuPage = menuService.getAllMenus(page, size);
            PageResponse<MenuResponse> pageResponse = new PageResponse<>(
                    menuPage.getContent(),
                    menuPage.getNumber(),
                    menuPage.getSize(),
                    menuPage.getTotalElements(),
                    menuPage.getTotalPages(),
                    menuPage.isFirst(),
                    menuPage.isLast()
            );
            return ResponseEntity.ok(pageResponse);
        } else {
            return ResponseEntity.ok(menuService.getMenus());
        }
    }
}
