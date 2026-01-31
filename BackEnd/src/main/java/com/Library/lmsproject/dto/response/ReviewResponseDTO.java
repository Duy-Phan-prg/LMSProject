package com.library.lmsproject.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponseDTO {
    private Long reviewId;
    private Long userId;
    private String userName;
    private Integer rating;
    private String comment;
    private boolean hidden;
    private LocalDateTime createdAt;
}
