package com.Library.lmsproject.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Table(name = "books")
@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = "categories")
@EqualsAndHashCode(exclude = "categories")

public class Books {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "book_id")
    private Long bookId;

    private String isbn;

    private String title;

    private String author;

    private String publisher;

    /* publication_year */
    @Column(name = "publication_year")
    private Integer yearPublished;

    private Integer pages;

    private String language;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(name = "cover_image")
    private String imageCover;

    @Column(name = "total_copies", nullable = false)
    private Integer copiesTotal = 1;

    @Column(name = "available_copies", nullable = false)
    private Integer copiesAvailable = 1;

    @Column(name = "is_Active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;



    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "book_category",
            joinColumns = @JoinColumn(name = "book_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )

    private Set<Categories> categories = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }




}
