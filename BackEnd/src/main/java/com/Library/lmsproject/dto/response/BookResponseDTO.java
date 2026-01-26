package com.library.lmsproject.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookResponseDTO {
    private Long bookId;

    private String isbn;
    private String title;
    private String author;
    private String publisher;
    private Integer yearPublished;
    private Integer pages;
    private String language;
    private String description;
    private String imageCover;

    private Integer copiesTotal;
    private Integer copiesAvailable;

    private boolean isActive;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Set<String> categories;
}
