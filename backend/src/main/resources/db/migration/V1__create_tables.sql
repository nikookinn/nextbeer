-- Users and Roles
CREATE TABLE users
(
    id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50)  NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    enabled  BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE roles
(
    id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE user_roles
(
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
);

CREATE TABLE campaigns
(
    campaign_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(255),
    image_url     VARCHAR(255),
    is_active     BOOLEAN   DEFAULT TRUE,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menus
CREATE TABLE menus
(
    menu_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    name      VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE
);

-- Categories
CREATE TABLE categories
(
    category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    menu_id     BIGINT       NOT NULL,
    is_active   BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_category_menu FOREIGN KEY (menu_id) REFERENCES menus (menu_id)
);

-- Items
CREATE TABLE items
(
    item_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    price         DECIMAL(10, 2),
    description   TEXT,
    image_url     VARCHAR(255),
    category_id   BIGINT       NOT NULL,
    is_active     BOOLEAN DEFAULT TRUE,
    display_order INT     DEFAULT 0,
    CONSTRAINT fk_item_category FOREIGN KEY (category_id) REFERENCES categories (category_id)
);

-- Item Tags
CREATE TABLE item_tags
(
    id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    name      VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Item Variants
CREATE TABLE item_variants
(
    id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    name      VARCHAR(255),
    price     DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT TRUE,
    item_id   BIGINT NOT NULL,
    CONSTRAINT fk_variant_item FOREIGN KEY (item_id) REFERENCES items (item_id) ON DELETE CASCADE
);

-- Item <-> Tag Many-to-Many
CREATE TABLE item_tags_mapping
(
    item_id BIGINT NOT NULL,
    tag_id  BIGINT NOT NULL,
    PRIMARY KEY (item_id, tag_id),
    CONSTRAINT fk_item_tags_item FOREIGN KEY (item_id) REFERENCES items (item_id) ON DELETE CASCADE,
    CONSTRAINT fk_item_tags_tag FOREIGN KEY (tag_id) REFERENCES item_tags (id) ON DELETE CASCADE
);

-- Restaurant
CREATE TABLE restaurant
(
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    name              VARCHAR(255) NOT NULL,
    about             TEXT,
    phone_number      VARCHAR(50),
    address           VARCHAR(255),
    working_hours     VARCHAR(255),
    website_image_url VARCHAR(255),
    email             VARCHAR(255),
    instagram_url     VARCHAR(255),
    facebook_url      VARCHAR(255),
    twitter_url       VARCHAR(255),
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL
);
