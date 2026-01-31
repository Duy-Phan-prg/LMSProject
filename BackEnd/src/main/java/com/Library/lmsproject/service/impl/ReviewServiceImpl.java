package com.library.lmsproject.service.impl;

import com.library.lmsproject.dto.request.CreateReviewRequestDTO;
import com.library.lmsproject.dto.request.UpdateReviewRequestDTO;
import com.library.lmsproject.dto.response.ReviewResponseDTO;
import com.library.lmsproject.entity.*;
import com.library.lmsproject.mapper.ReviewMapper;
import com.library.lmsproject.repository.BookRepository;
import com.library.lmsproject.repository.BorrowingRepository;
import com.library.lmsproject.repository.ReviewRepository;
import com.library.lmsproject.repository.UsersRepository;
import com.library.lmsproject.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookRepository bookRepository;
    private final UsersRepository usersRepository;
    private final ReviewMapper reviewMapper;
    private final BorrowingRepository borrowingRepository;

    @Override
    public ReviewResponseDTO updateReview(
            Long reviewId,
            UpdateReviewRequestDTO request,
            Long userId
    ) {

        Review review = reviewRepository.findByReviewIdAndIsDeletedFalse(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        // Chỉ chủ review được sửa
        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("You are not allowed to edit this review");
        }

        // Validate rating
        if (request.getRating() != null &&
                (request.getRating() < 1 || request.getRating() > 5)) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        if (request.getRating() != null) {
            review.setRating(request.getRating());
        }

        if (request.getComment() != null) {
            review.setComment(request.getComment());
        }

        reviewRepository.save(review);
        return reviewMapper.toResponseDTO(review);
    }

    @Override
    public List<ReviewResponseDTO> getAllReviews() {

        return reviewRepository
                .findByIsDeletedFalseOrderByCreatedAtDesc()
                .stream()
                .map(reviewMapper::toResponseDTO)
                .toList();
    }

    @Override
    public ReviewResponseDTO createReview(CreateReviewRequestDTO request, Long userId) {

        Books book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Check đã borrow chưa
        boolean hasBorrowed = borrowingRepository
                .existsByUserAndBookAndStatus(user, book, BorrowStatus.RETURNED);

        if (!hasBorrowed) {
            throw new RuntimeException("You must borrow this book before reviewing");
        }

        // 2. Check đã review chưa
        boolean alreadyReviewed = reviewRepository
                .existsByUserAndBookAndIsDeletedFalse(user, book);

        if (alreadyReviewed) {
            throw new RuntimeException("You can only review this book once");
        }

        // 3. Check rating
        if (request.getRating() != null &&
                (request.getRating() < 1 || request.getRating() > 5)) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        Review review = reviewMapper.toEntity(request, user, book);
        reviewRepository.save(review);

        return reviewMapper.toResponseDTO(review);
    }

    @Override
    public void deleteReview(Long reviewId, Long userId) {

        Review review = reviewRepository.findByReviewIdAndIsDeletedFalse(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        // Chỉ cho chủ review xóa
        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("You are not allowed to delete this review");
        }

        review.setDeleted(true);
        reviewRepository.save(review);
    }


    @Override
    public List<ReviewResponseDTO> getReviewsByBook(Long bookId) {

        Books book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        return reviewRepository
                .findByBookAndIsDeletedFalseOrderByCreatedAtDesc(book)
                .stream()
                .map(reviewMapper::toResponseDTO)
                .toList();
    }
}