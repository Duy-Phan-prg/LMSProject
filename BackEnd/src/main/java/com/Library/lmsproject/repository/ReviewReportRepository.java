package com.library.lmsproject.repository;


import com.library.lmsproject.entity.Review;
import com.library.lmsproject.entity.ReviewReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewReportRepository extends JpaRepository<ReviewReport, Long> {

    boolean existsByReview(Review review);
}