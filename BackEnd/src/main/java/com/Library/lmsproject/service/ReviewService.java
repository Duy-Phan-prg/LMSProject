package com.Library.lmsproject.service;

import com.Library.lmsproject.dto.request.CreateReviewRequestDTO;
import com.Library.lmsproject.dto.response.ReviewResponseDTO;

import java.util.List;

public interface ReviewService {

    ReviewResponseDTO createReview(CreateReviewRequestDTO request, Long userId);

    List<ReviewResponseDTO> getReviewsByBook(Long bookId);
}
