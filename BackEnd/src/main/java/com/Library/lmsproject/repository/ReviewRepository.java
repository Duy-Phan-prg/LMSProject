package com.library.lmsproject.repository;

import com.library.lmsproject.entity.Books;
import com.library.lmsproject.entity.Review;
import com.library.lmsproject.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {


    @Query("""
SELECT r FROM Review r
WHERE r.book.bookId = :bookId
AND r.isDeleted = false
AND (
      r.hidden = false
   OR (
        r.hidden = true
        AND r.user.id = :currentUserId
        AND EXISTS (
            SELECT rr FROM ReviewReport rr
            WHERE rr.review.reviewId = r.reviewId
            AND rr.status = 'VIOLATED'
        )
   )
)
""")
    List<Review> findVisibleReviewsByBook(
            @Param("bookId") Long bookId,
            @Param("currentUserId") Long currentUserId
    );

    List<Review> findByBook_BookIdAndUser_IdAndIsDeletedFalse(
            Long bookId,
            Long userId
    );
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