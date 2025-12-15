package com.Library.lmsproject.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.awt.print.Book;
import java.util.Set;

@Table(name = "categories")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity

public class Categories {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId;
    @Column(nullable = false, unique = true, length = 100)
    private String categoryName;
    private String categoryDescription;

    @OneToMany(mappedBy = "category")
    private Set<BookCategory> bookCategories;


}
