package com.nextbeer.website.mapper;

import com.nextbeer.website.dto.request.MenuRequestDto;
import com.nextbeer.website.dto.response.MenuResponse;
import com.nextbeer.website.model.Menu;
import org.springframework.stereotype.Component;

@Component
public class MenuMapper {

    public Menu toEntity(MenuRequestDto menuDto, String imageUrl) {
        Menu entity = new Menu();
        entity.setName(menuDto.getName());
        if (menuDto.getMenuImage() != null && !menuDto.getMenuImage().isEmpty()) {
            entity.setImageUrl(imageUrl);
        } else {
            entity.setImageUrl(entity.getImageUrl());
        }
        return entity;
    }

    public Menu toEntity(MenuRequestDto requestDto, Menu entity, String imageUrl) {
        entity.setName(requestDto.getName());
        if (requestDto.getMenuImage() != null && !requestDto.getMenuImage().isEmpty()) {
            entity.setImageUrl(imageUrl);
        } else if (requestDto.isRemoveImage()) {
            entity.setImageUrl(null);
        } else {
            entity.setImageUrl(entity.getImageUrl());
        }
        return entity;
    }


    public MenuResponse toResponse(Menu menu) {
        return MenuResponse.builder()
                .menuId(menu.getMenuId())
                .name(menu.getName())
                .imageUrl(menu.getImageUrl())
                .build();
    }
}
