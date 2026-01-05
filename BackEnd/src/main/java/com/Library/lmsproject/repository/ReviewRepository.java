package com.Library.lmsproject.repository;

import com.Library.lmsproject.entity.Books;
import com.Library.lmsproject.entity.Review;
import com.Library.lmsproject.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByBookAndIsDeletedFalseOrderByCreatedAtDesc(Books book);

    boolean existsByUserAndBookAndIsDeletedFalse(
            Users user,
            Books book
    );
    List<Review> findByIsDeletedFalseOrderByCreatedAtDesc();
    Optional<Review> findByReviewIdAndIsDeletedFalse(Long reviewId);

}