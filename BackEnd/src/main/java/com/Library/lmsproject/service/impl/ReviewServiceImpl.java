package com.Library.lmsproject.service.impl;

import com.Library.lmsproject.dto.request.CreateReviewRequestDTO;
import com.Library.lmsproject.dto.response.ReviewResponseDTO;
import com.Library.lmsproject.entity.*;
import com.Library.lmsproject.mapper.ReviewMapper;
import com.Library.lmsproject.repository.BookRepository;
import com.Library.lmsproject.repository.BorrowingRepository;
import com.Library.lmsproject.repository.ReviewRepository;
import com.Library.lmsproject.repository.UsersRepository;
import com.Library.lmsproject.service.ReviewService;
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

    @Override
    public ReviewResponseDTO createReview(CreateReviewRequestDTO request, Long userId) {

        Books book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getRating() != null &&
                (request.getRating() < 1 || request.getRating() > 5)) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        Review review = reviewMapper.toEntity(request, user, book);
        reviewRepository.save(review);

        return reviewMapper.toResponseDTO(review);
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