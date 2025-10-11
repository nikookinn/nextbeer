package com.nextbeer.website.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "menus")
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long menuId;

    @Column(nullable = false)
    private String name;

    @OneToMany(mappedBy = "menu", cascade = CascadeType.ALL)
    private List<Category> categories = new ArrayList<>();

    private String imageUrl;

    @Column(nullable = false)
    private boolean isActive = true;
}
