package com.nextbeer.website.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId;

    @Column(nullable = false)
    private String name;

    @ManyToOne()
    @JoinColumn(name = "menuId", nullable = false)
    private Menu menu;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Item> menuItems = new ArrayList<>();

    @Column(nullable = false)
    private boolean isActive = true;
}
