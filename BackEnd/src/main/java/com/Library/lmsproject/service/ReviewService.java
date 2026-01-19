package com.Library.lmsproject.service;

import com.Library.lmsproject.dto.request.CreateReviewRequestDTO;
import com.Library.lmsproject.dto.request.ReportReviewRequestDTO;
import com.Library.lmsproject.dto.request.UpdateReviewRequestDTO;
import com.Library.lmsproject.dto.response.ReportedReviewResponseDTO;
import com.Library.lmsproject.dto.response.ReviewResponseDTO;
import com.Library.lmsproject.entity.Users;

import java.util.List;

public interface ReviewService {

    ReviewResponseDTO createReview(CreateReviewRequestDTO request, Long userId);

    List<ReviewResponseDTO> getReviewsByBook(Long bookId);

    void deleteReview(Long reviewId, Long userId);

    List<ReviewResponseDTO> getAllReviews();

    ReviewResponseDTO updateReview(Long reviewId, UpdateReviewRequestDTO request, Long userId);

}
