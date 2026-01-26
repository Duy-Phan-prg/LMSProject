package com.library.lmsproject.service;

import com.library.lmsproject.dto.request.CreateReviewRequestDTO;
import com.library.lmsproject.dto.request.UpdateReviewRequestDTO;
import com.library.lmsproject.dto.response.ReviewResponseDTO;

import java.util.List;

public interface ReviewService {

    ReviewResponseDTO createReview(CreateReviewRequestDTO request, Long userId);

    List<ReviewResponseDTO> getReviewsByBook(Long bookId);

    void deleteReview(Long reviewId, Long userId);

    List<ReviewResponseDTO> getAllReviews();

    ReviewResponseDTO updateReview(Long reviewId, UpdateReviewRequestDTO request, Long userId);

}
