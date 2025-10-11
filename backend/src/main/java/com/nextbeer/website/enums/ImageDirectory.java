package com.nextbeer.website.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ImageDirectory {
    APP_IMAGES("app_images"),

    MENU_IMAGES("menu_images"),

    CATEGORY_IMAGES("category_images"),

    ITEM_IMAGES("item_images"),

    CAMPAIGN_IMAGES("campaign_images"),

    APP_ICON("app_icon");

    private final String directory;


}
