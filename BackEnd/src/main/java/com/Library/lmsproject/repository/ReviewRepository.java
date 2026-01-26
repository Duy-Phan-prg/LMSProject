package com.library.lmsproject.repository;

import com.library.lmsproject.entity.Books;
import com.library.lmsproject.entity.Review;
import com.library.lmsproject.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByBookAndIsDeletedFalseOrderByCreatedAtDesc(Books book);

    // Check user đã review book này chưa
    boolean existsByUserAndBookAndIsDeletedFalse(
            Users user,
            Books book
    );

    // Admin/Librarian xem tất cả review chưa bị ẩn
    List<Review> findByIsDeletedFalseOrderByCreatedAtDesc();

    // Lấy review hợp lệ theo reviewId
    Optional<Review> findByReviewIdAndIsDeletedFalse(Long reviewId);
}