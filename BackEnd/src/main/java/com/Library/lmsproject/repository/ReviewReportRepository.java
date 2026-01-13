package com.Library.lmsproject.repository;


import com.Library.lmsproject.entity.Review;
import com.Library.lmsproject.entity.ReviewReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewReportRepository extends JpaRepository<ReviewReport, Long> {

    boolean existsByReview(Review review);
}