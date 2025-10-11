package com.nextbeer.website.service.serviceImpl;

import com.nextbeer.website.dto.request.MenuRequestDto;
import com.nextbeer.website.dto.response.MenuResponse;
import com.nextbeer.website.enums.ImageDirectory;
import com.nextbeer.website.mapper.MenuMapper;
import com.nextbeer.website.model.Menu;
import com.nextbeer.website.repository.MenuRepository;
import com.nextbeer.website.service.MenuService;
import com.nextbeer.website.exception.MenuNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class MenuServiceImpl implements MenuService {

    private final MenuRepository menuRepository;
    private final MenuMapper menuMapper;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional(readOnly = true)
    public MenuResponse getMenuById(Long id) {
        Menu menu = findMenuById(id);
        return menuMapper.toResponse(menu);
    }

    @Override
    @Transactional
    public MenuResponse saveMenu(MenuRequestDto requestDto) {
        String imageUrl = null;
        if (requestDto.getMenuImage() != null && !requestDto.getMenuImage().isEmpty()) {
            imageUrl = fileStorageService.storeFile(requestDto.getMenuImage(), ImageDirectory.MENU_IMAGES.getDirectory());
        }
        Menu menu = menuMapper.toEntity(requestDto, imageUrl);
        Menu savedMenu = menuRepository.save(menu);
        log.info("new main menu added successfully to db with name : " + savedMenu.getName());
        return menuMapper.toResponse(savedMenu);
    }

    @Override
    @Transactional
    public MenuResponse updateMenu(Long id, MenuRequestDto requestDto) {
        Menu menu = findMenuById(id);
        String imageUrl = menu.getImageUrl();
        if (requestDto.getMenuImage() != null && !requestDto.getMenuImage().isEmpty()) {
            fileStorageService.deleteOldImage(imageUrl, ImageDirectory.MENU_IMAGES.getDirectory());
            imageUrl = fileStorageService.storeFile(requestDto.getMenuImage(), ImageDirectory.MENU_IMAGES.getDirectory());
        } else if (requestDto.isRemoveImage()) {
            fileStorageService.deleteOldImage(imageUrl, ImageDirectory.MENU_IMAGES.getDirectory());
            imageUrl = null;
        }
        Menu updatedMenu = menuRepository.save(menuMapper.toEntity(requestDto, menu, imageUrl));
        log.info("main menu updated successfully with name : " + updatedMenu.getName());
        return menuMapper.toResponse(updatedMenu);
    }

    @Override
    @Transactional
    public void markMenuAsInactive(Long id) {
        Menu existingMenu = findMenuById(id);
        existingMenu.setActive(false);
        menuRepository.save(existingMenu);
        log.info("main menu item removed successfully with name : " + existingMenu.getName());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuResponse> getMenus() {
        List<Menu> menuList = menuRepository.findByIsActiveIsTrue();
        return menuList.stream().map(menuMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MenuResponse> getAllMenus(int page, int size) {
        Page<Menu> allActiveMenus = menuRepository.findAllByIsActiveIsTrue(PageRequest.of(page, size));
        return allActiveMenus.map(menuMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Menu findMenuById(Long id) {
        return menuRepository.findByMenuIdAndIsActiveIsTrue(id)
                .orElseThrow(() -> new MenuNotFoundException("Menu with ID " + id + " not found"));
    }

    @Override
    public Boolean existById(Long id) {
        return menuRepository.existsByMenuIdAndIsActiveIsTrue(id);
    }
}
