package com.Library.lmsproject.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.Set;

@Data
public class UpdateBookRequestDTO {
    @NotBlank
    private String title;
    @NotBlank(message = "ISBN không được để trống")
    @Pattern(
            regexp = "^(\\d{10}|\\d{13})$",
            message = "ISBN phải gồm 10 hoặc 13 chữ số"
    )
    private String isbn;
    @NotBlank
    private String author;
    private String publisher;
    private Integer yearPublished;
    private Integer pages;
    private String language;
    private String description;
    private String imageCover;
    @NotNull
    private Integer copiesTotal; // phai duoc update category

    private Set<Long> categoryIds;
}
