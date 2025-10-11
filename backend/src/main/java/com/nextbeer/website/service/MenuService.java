package com.nextbeer.website.service;

import com.nextbeer.website.dto.request.MenuRequestDto;
import com.nextbeer.website.dto.response.MenuResponse;
import com.nextbeer.website.model.Menu;
import org.springframework.data.domain.Page;

import java.util.List;

public interface MenuService {
    MenuResponse getMenuById(Long id);

    MenuResponse saveMenu(MenuRequestDto requestDto);

    MenuResponse updateMenu(Long id, MenuRequestDto requestDto);

    void markMenuAsInactive(Long id);

    List<MenuResponse> getMenus();

    Page<MenuResponse> getAllMenus(int page, int size);

    Menu findMenuById(Long id);

    Boolean existById(Long id);


}
