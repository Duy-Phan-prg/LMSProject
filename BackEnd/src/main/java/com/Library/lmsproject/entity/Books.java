package com.library.lmsproject.entity;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

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

    @Column(nullable = false, columnDefinition = "NVARCHAR(200)")
    private String title;
    @Column(nullable = false, columnDefinition = "NVARCHAR(200)")
    private String author;
    @Column(nullable = false, columnDefinition = "NVARCHAR(200)")
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
    private Integer copiesTotal = 1; //số sách còn trong kho để mượn, 200


    @Column(name = "available_copies", nullable = false)
    private Integer copiesAvailable = 1; // số sách hiện có sẵn để mượn ,  199

    @Column(name = "is_Active", nullable = false)
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;


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
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }




}
