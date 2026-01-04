package com.Library.lmsproject.dto.request;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateReviewRequestDTO {
    private Long bookId;
    private Integer rating;
    private String comment;
}
