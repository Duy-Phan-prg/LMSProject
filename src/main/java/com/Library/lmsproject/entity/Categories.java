package com.Library.lmsproject.entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "books")
@EqualsAndHashCode(exclude = "books")

public class Categories {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId;

    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String categoryName;

    @Column(name = "description")
    private String categoryDescription;

    @Column(nullable = false)
    private boolean isActive = true;

    @ManyToMany(mappedBy = "categories", fetch = FetchType.LAZY)
    private Set<Books> books = new HashSet<>();


}
