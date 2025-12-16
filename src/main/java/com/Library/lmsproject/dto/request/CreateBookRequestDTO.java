package com.Library.lmsproject.dto.request;


import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateBookRequestDTO {
    @NotBlank
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



}
