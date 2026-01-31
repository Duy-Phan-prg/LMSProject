package com.library.lmsproject.repository;


import com.library.lmsproject.entity.ReportStatus;
import com.library.lmsproject.entity.Review;
import com.library.lmsproject.entity.ReviewReport;
import com.library.lmsproject.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewReportRepository extends JpaRepository<ReviewReport, Long> {

    boolean existsByReviewAndReportedBy(Review review, Users user);


    List<ReviewReport> findByStatus(ReportStatus status);


}