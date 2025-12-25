package com.Library.lmsproject.dto.request;


import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.Set;

@Data
public class CreateBookRequestDTO {
    @NotBlank(message = "ISBN không được để trống")
    @Pattern(
            regexp = "^(\\d{10}|\\d{13})$",
            message = "ISBN phải gồm 10 hoặc 13 chữ số"
    )
    private String isbn;

    @NotBlank
    private String title;

    @NotBlank
    private String author;

    private String publisher;

    @Min(0)
    private Integer yearPublished;

    @Min(1)
    private Integer pages;

    private String language;

    private String description;

    private String imageCover;

    @Min(1)
    private Integer copiesTotal;

    private Set<Long> categoryIds;

}
