package com.Library.lmsproject.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateBookRequestDTO {
    @NotBlank
    private String title;

    @NotBlank
    private String author;

    private String publisher;
    private Integer yearPublished;
    private Integer pages;
    private String language;
    private String description;
    private String imageCover;

    @NotNull
    private Integer copiesTotal;

}
